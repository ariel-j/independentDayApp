// Configuration file for the Israeli Independence Day Song Quiz
// Replace these values with your own Spotify application details

// Your Spotify application credentials
export const SPOTIFY_CONFIG = {
  CLIENT_ID: 'cc355c7f55514ef49516b4cc469844ae', // Your Spotify Client ID
  REDIRECT_URI: 'https://ariel-j.github.io/independentDayApp/callback.html', // Exact redirect URI from Spotify Dashboard
  PLAYLIST_ID: '4EgZlZ9ZccgdLyE33GNOCw' // Your Spotify playlist ID
};

// Note: It's important that the REDIRECT_URI exactly matches what's in your Spotify Developer Dashboard
// Do not use window.location.origin here as it needs to match exactly what's registered in Spotify