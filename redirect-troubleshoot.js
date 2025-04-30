// This is a debugging script to test the Spotify authentication
// Add this to your project temporarily to diagnose issues

console.log('===== SPOTIFY AUTH DEBUGGING =====');

// Check if the URL in the browser contains 'YOUR_CLIENT_ID' literally
const currentUrl = window.location.href;
if (currentUrl.includes('YOUR_CLIENT_ID')) {
  console.error('Error: The URL contains the literal string "YOUR_CLIENT_ID"');
  console.error('This suggests that the client ID was not correctly inserted into the request URL');
}

// Import your config
import { SPOTIFY_CONFIG } from './config.js';

// Log the configuration values
console.log('Client ID:', SPOTIFY_CONFIG.CLIENT_ID);
console.log('Redirect URI:', SPOTIFY_CONFIG.REDIRECT_URI);

// Manual test function - call this from the browser console to test
window.testSpotifyAuth = function() {
  const CLIENT_ID = SPOTIFY_CONFIG.CLIENT_ID;
  const REDIRECT_URI = SPOTIFY_CONFIG.REDIRECT_URI;
  
  // Generate a test state
  const state = Math.random().toString(36).substring(2, 15);
  
  // Build the authorization URL manually
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('response_type', 'token');
  authUrl.searchParams.append('client_id', CLIENT_ID);
  authUrl.searchParams.append('scope', 'user-read-private user-read-email playlist-read-private playlist-read-collaborative');
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('state', state);
  
  console.log('Auth URL:', authUrl.toString());
  
  // Don't automatically redirect, just log the URL
  console.log('To test manually, copy and paste this URL in your browser:');
  console.log(authUrl.toString());
  
  return authUrl.toString();
};

// Check if the redirect URI matches exactly what's in the Spotify Dashboard
// Common URI format issues:
// - Missing trailing slash
// - Different capitalization
// - http vs https
// - Different port number
console.log('If your redirect URI is "https://ariel-j.github.io/independentDayApp/callback.html",');
console.log('make sure it matches EXACTLY in both your code and Spotify Dashboard');

console.log('===== END DEBUGGING =====');
