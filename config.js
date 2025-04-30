// Configuration file for the Israeli Independence Day Song Quiz
// Replace these values with your own Spotify application details

// Your Spotify application credentials
// Create a Spotify app at https://developer.spotify.com/dashboard
export const SPOTIFY_CONFIG = {
  CLIENT_ID: 'YOUR_CLIENT_ID', // Replace with your Spotify Client ID
  REDIRECT_URI: window.location.origin + '/callback.html', // This will dynamically set based on your deployment URL
  PLAYLIST_ID: 'YOUR_PLAYLIST_ID' // Replace with your Spotify playlist ID
};

// To find your playlist ID:
// 1. Go to your Spotify playlist
// 2. Click on "Share" and then "Copy link to playlist"
// 3. The ID is the alphanumeric string after "playlist/" in the URL
// Example: https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd
// The ID would be: 37i9dQZF1DX0XUsuxWHRQd
