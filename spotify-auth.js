// Spotify Authentication Module - Using Backend for Token Exchange
// This version connects to a serverless function for the token exchange

// Spotify credentials
const CLIENT_ID = 'cc355c7f55514ef49516b4cc469844ae';
const REDIRECT_URI = 'https://ariel-j.github.io/independentDayApp/callback.html';
const PLAYLIST_ID = '4EgZlZ9ZccgdLyE33GNOCw';

// Backend function URL for token exchange (replace with your own function URL)
const TOKEN_EXCHANGE_URL = 'https://your-function-url.netlify.app/.netlify/functions/spotify-token';

// Scopes define what your application can access
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative'
];

// Generate a random string for the state parameter
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Redirect to Spotify authorization page
function redirectToSpotifyAuthorization() {
  const state = generateRandomString(16);
  localStorage.setItem('spotify_auth_state', state);
  
  console.log("Using Client ID:", CLIENT_ID);
  console.log("Using Redirect URI:", REDIRECT_URI);
  
  // Using response_type=code for Authorization Code Flow
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', CLIENT_ID);
  authUrl.searchParams.append('scope', SCOPES.join(' '));
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('state', state);
  
  console.log("Redirecting to:", authUrl.toString());
  window.location.href = authUrl.toString();
}

// Exchange authorization code for access token using our backend
async function exchangeCodeForToken(code) {
  try {
    console.log("Exchanging code for token...");
    const response = await fetch(TOKEN_EXCHANGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });
    
    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Token error: ${data.error}`);
    }
    
    return data;
  } catch (error) {
    console.error('Failed to exchange code for token:', error);
    return null;
  }
}

// Get authorization code from URL after redirect from Spotify
function getAuthCodeFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const storedState = localStorage.getItem('spotify_auth_state');
  
  if (state === null || state !== storedState) {
    console.error('State mismatch!');
    return null;
  }
  
  localStorage.removeItem('spotify_auth_state');
  return code;
}

// Check if user is already authenticated
function isAuthenticated() {
  return !!localStorage.getItem('spotify_token');
}

// Store the access token and related data
function storeTokenData(tokenData) {
  localStorage.setItem('spotify_token', tokenData.access_token);
  localStorage.setItem('spotify_token_type', tokenData.token_type);
  localStorage.setItem('spotify_token_expires', Date.now() + (tokenData.expires_in * 1000));
  
  if (tokenData.refresh_token) {
    localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
  }
}

// Get the stored access token
function getStoredAccessToken() {
  return localStorage.getItem('spotify_token');
}

// Fetch a playlist from Spotify
async function fetchPlaylist(playlistId) {
  try {
    const token = getStoredAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }
    
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching playlist: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch playlist:', error);
    return null;
  }
}

// Convert Spotify playlist to our game format
function convertPlaylistToGameFormat(playlistData) {
  if (!playlistData || !playlistData.tracks || !playlistData.tracks.items) {
    return [];
  }
  
  return playlistData.tracks.items
    .filter(item => item.track && item.track.preview_url) // Only include tracks with preview URLs
    .map(item => ({
      title: item.track.name,
      artist: item.track.artists.map(artist => artist.name).join(', '),
      path: item.track.preview_url, // Spotify provides 30-second previews
      played: false,
      albumCover: item.track.album.images[0]?.url || null
    }));
}

// Initialize the connection to Spotify
async function initializeSpotify(playlistId = PLAYLIST_ID) {
  // If we're on the callback page with an authorization code
  if (window.location.search.includes('code=')) {
    const code = getAuthCodeFromUrl();
    if (code) {
      // Exchange the code for an access token using our backend
      const tokenData = await exchangeCodeForToken(code);
      if (tokenData) {
        storeTokenData(tokenData);
        
        // Remove the query parameters from the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Now fetch the playlist
        const playlistData = await fetchPlaylist(playlistId);
        if (playlistData) {
          return convertPlaylistToGameFormat(playlistData);
        }
      }
    }
  } 
  // If we already have a token
  else if (isAuthenticated()) {
    // Check if token is expired
    const expiresTime = parseInt(localStorage.getItem('spotify_token_expires') || '0');
    if (expiresTime > Date.now()) {
      // Token is still valid, fetch playlist
      const playlistData = await fetchPlaylist(playlistId);
      if (playlistData) {
        return convertPlaylistToGameFormat(playlistData);
      }
    } else {
      // Token is expired, need to get a new one
      // This would require implementing refresh token logic
      // For simplicity, we'll just redirect to login again
      redirectToSpotifyAuthorization();
      return null;
    }
  }
  // We need authentication
  else {
    redirectToSpotifyAuthorization();
    return null;
  }
  
  // If we reached here, something went wrong
  console.error('Failed to initialize Spotify');
  return [];
}

// Export the functions
export {
  initializeSpotify,
  isAuthenticated,
  redirectToSpotifyAuthorization,
  fetchPlaylist
};