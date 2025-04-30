// Spotify Authentication Module
// Handles the connection to Spotify Web API and fetching songs from a playlist

// Hard-coded credentials for direct testing (matches your Spotify Dashboard)
const CLIENT_ID = 'cc355c7f55514ef49516b4cc469844ae';
const REDIRECT_URI = 'https://ariel-j.github.io/independentDayApp/callback.html';
const PLAYLIST_ID = '4EgZlZ9ZccgdLyE33GNOCw';

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
  
  // Log the current values to help with debugging
  console.log("Using Client ID:", CLIENT_ID);
  console.log("Using Redirect URI:", REDIRECT_URI);
  
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('response_type', 'token');
  authUrl.searchParams.append('client_id', CLIENT_ID);
  authUrl.searchParams.append('scope', SCOPES.join(' '));
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('state', state);
  
  console.log("Redirecting to:", authUrl.toString());
  window.location.href = authUrl.toString();
}

// Get access token from URL after redirect from Spotify
function getAccessTokenFromUrl() {
  const hashParams = {};
  let e;
  const r = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);
  
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  
  // Verify state matches what we set earlier
  const storedState = localStorage.getItem('spotify_auth_state');
  const receivedState = hashParams.state;
  
  if (receivedState && (receivedState !== storedState)) {
    console.error('State mismatch!');
    return null;
  }
  
  localStorage.removeItem('spotify_auth_state');
  return hashParams.access_token;
}

// Fetch a specific playlist from Spotify
async function fetchPlaylist(accessToken, playlistId) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
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

// Check if user is already authenticated
function isAuthenticated() {
  return !!localStorage.getItem('spotify_token');
}

// Store the access token
function storeAccessToken(token) {
  localStorage.setItem('spotify_token', token);
}

// Get the stored access token
function getStoredAccessToken() {
  return localStorage.getItem('spotify_token');
}

// Initialize the connection to Spotify
async function initializeSpotify(playlistId = PLAYLIST_ID) {
  // If we're on the callback page after Spotify auth
  if (window.location.hash.includes('access_token')) {
    const token = getAccessTokenFromUrl();
    if (token) {
      storeAccessToken(token);
      // Remove the hash from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Now fetch the playlist
      if (playlistId) {
        const playlist = await fetchPlaylist(token, playlistId);
        return convertPlaylistToGameFormat(playlist);
      }
    }
  } 
  // If we already have a token
  else if (isAuthenticated()) {
    const token = getStoredAccessToken();
    if (playlistId) {
      const playlist = await fetchPlaylist(token, playlistId);
      return convertPlaylistToGameFormat(playlist);
    }
  }
  // We need authentication
  else {
    redirectToSpotifyAuthorization();
    return null;
  }
}

// Export the functions
export {
  initializeSpotify,
  isAuthenticated,
  redirectToSpotifyAuthorization
};