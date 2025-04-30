// Spotify Authentication Module - Fixed Version
// Important fix: Uses Authorization Code Flow

// Spotify credentials - hardcoded for direct debugging
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
  
  console.log("Using Client ID:", CLIENT_ID);
  console.log("Using Redirect URI:", REDIRECT_URI);
  
  // CRITICAL FIX: Using response_type=code instead of token
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('response_type', 'code'); // CHANGED FROM 'token' to 'code'
  authUrl.searchParams.append('client_id', CLIENT_ID);
  authUrl.searchParams.append('scope', SCOPES.join(' '));
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('state', state);
  
  console.log("Redirecting to:", authUrl.toString());
  window.location.href = authUrl.toString();
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

// Store the access token
function storeAccessToken(token) {
  localStorage.setItem('spotify_token', token);
}

// Get the stored access token
function getStoredAccessToken() {
  return localStorage.getItem('spotify_token');
}

// Simulated playlist fetch for testing without a backend
function simulateFetchPlaylist(playlistId) {
  console.log("Simulating playlist fetch for ID:", playlistId);
  
  // Return some sample data for testing
  return [
    {
      title: "התקווה",
      artist: "Sample Artist 1",
      path: "songs/hatikvah.mp3", // Fallback to local file
      played: false,
      albumCover: "https://via.placeholder.com/300"
    },
    {
      title: "ירושלים של זהב",
      artist: "Sample Artist 2",
      path: "songs/jerusalem_of_gold.mp3",
      played: false,
      albumCover: "https://via.placeholder.com/300"
    },
    {
      title: "הללויה",
      artist: "Sample Artist 3",
      path: "songs/hallelujah.mp3",
      played: false,
      albumCover: "https://via.placeholder.com/300"
    },
    {
      title: "אני ואתה",
      artist: "Sample Artist 4",
      path: "songs/ani_veata.mp3",
      played: false,
      albumCover: "https://via.placeholder.com/300"
    }
  ];
}

// Initialize the connection to Spotify
async function initializeSpotify(playlistId = PLAYLIST_ID) {
  // If we're on the callback page with an authorization code
  if (window.location.search.includes('code=')) {
    const code = getAuthCodeFromUrl();
    if (code) {
      // Simply store a simulated token for now
      const simulatedToken = 'simulated_' + generateRandomString(20);
      storeAccessToken(simulatedToken);
      
      // Remove the query parameters from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Now fetch the playlist (simulated for now)
      return simulateFetchPlaylist(playlistId);
    }
  } 
  // If we already have a token
  else if (isAuthenticated()) {
    return simulateFetchPlaylist(playlistId);
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