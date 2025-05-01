// Spotify Authentication Module - Using Implicit Grant Flow
// Import Spotify credentials from config
import { SPOTIFY_CONFIG } from './config.js';

// Spotify credentials
const CLIENT_ID = SPOTIFY_CONFIG.CLIENT_ID;
const REDIRECT_URI = SPOTIFY_CONFIG.REDIRECT_URI;
const PLAYLIST_ID = SPOTIFY_CONFIG.PLAYLIST_ID;

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
  
  // Using response_type=token for Implicit Grant Flow (no backend needed)
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('response_type', 'token'); // Changed from 'code' to 'token'
  authUrl.searchParams.append('client_id', CLIENT_ID);
  authUrl.searchParams.append('scope', SCOPES.join(' '));
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('state', state);
  
  console.log("Redirecting to:", authUrl.toString());
  window.location.href = authUrl.toString();
}

// Get token from URL hash after redirect from Spotify
function getTokenFromUrl() {
  if (!window.location.hash) {
    return null;
  }
  
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const token = hashParams.get('access_token');
  const state = hashParams.get('state');
  const storedState = localStorage.getItem('spotify_auth_state');
  
  if (state === null || state !== storedState) {
    console.error('State mismatch!');
    return null;
  }
  
  localStorage.removeItem('spotify_auth_state');
  return token;
}

// Check if user is already authenticated
function isAuthenticated() {
  const token = localStorage.getItem('spotify_token');
  if (!token) return false;
  
  // Check if token is expired
  const expiresTime = parseInt(localStorage.getItem('spotify_token_expires') || '0');
  if (expiresTime > Date.now()) {
    return true;
  } else {
    // Clear expired token
    localStorage.removeItem('spotify_token');
    return false;
  }
}

// Store the access token and related data
function storeTokenData(token, expiresIn) {
  localStorage.setItem('spotify_token', token);
  localStorage.setItem('spotify_token_expires', Date.now() + (expiresIn * 1000));
}

// Get the stored access token
function getStoredAccessToken() {
  return localStorage.getItem('spotify_token');
}

// Fetch a playlist from Spotify
async function fetchPlaylist(playlistId = PLAYLIST_ID) {
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
      if (response.status === 401) {
        // Token expired, need to re-authenticate
        localStorage.removeItem('spotify_token');
        throw new Error('Token expired');
      }
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
  
  console.log("Converting playlist with", playlistData.tracks.items.length, "tracks");
  
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

// Process hash after redirect to get token
function processRedirectIfNeeded() {
  // Check if we have a hash fragment (for implicit grant flow)
  if (window.location.hash.includes('access_token=')) {
    const token = getTokenFromUrl();
    if (token) {
      // Get expires_in from hash params
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const expiresIn = parseInt(hashParams.get('expires_in') || '3600');
      
      // Store the token data
      storeTokenData(token, expiresIn);
      
      // Remove the hash parameters from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      console.log("Successfully authenticated with Spotify!");
      return true;
    }
  }
  
  return false;
}

// Initialize the connection to Spotify
async function initializeSpotify() {
  console.log("Initializing Spotify with playlist ID:", PLAYLIST_ID);
  
  // First, check if we just returned from Spotify auth
  const justAuthenticated = processRedirectIfNeeded();
  
  // Check if we're already authenticated
  if (isAuthenticated() || justAuthenticated) {
    console.log("Already authenticated, returning songs");
    
    try {
      // Fetch the playlist from Spotify
      const playlistData = await fetchPlaylist();
      if (playlistData) {
        const songs = convertPlaylistToGameFormat(playlistData);
        console.log("Got songs from Spotify:", songs.length);
        return songs;
      }
    } catch (error) {
      console.error("Error fetching Spotify playlist:", error);
    }
  }
  
  // If we reached here, we need authentication or something went wrong
  console.log("Not authenticated or failed to get playlist");
  return null;
}

// Export the functions
export {
  initializeSpotify,
  isAuthenticated,
  redirectToSpotifyAuthorization,
  fetchPlaylist
};