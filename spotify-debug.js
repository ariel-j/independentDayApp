// Standalone script for debugging Spotify integration
// Add this to your HTML to diagnose connection issues

document.addEventListener('DOMContentLoaded', function() {
    // Get the debug elements
    const statusElement = document.getElementById('spotify-status');
    const debugElement = document.getElementById('spotify-debug');
    
    // Debug logging function
    function logDebug(message) {
        if (debugElement) {
            const timestamp = new Date().toISOString().substr(11, 8);
            debugElement.innerHTML += `[${timestamp}] ${message}<br>`;
            console.log(message);
        }
    }
    
    // Update status
    function updateStatus(message, isError = false) {
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.style.color = isError ? 'red' : 'green';
        }
    }
    
    // Check if we're authenticated with Spotify
    function checkAuthentication() {
        const token = localStorage.getItem('spotify_token');
        
        if (token) {
            logDebug('Found token in localStorage');
            updateStatus('מחובר לספוטיפיי');
            
            // Validate the token by making a test API call
            fetch('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                logDebug(`Token validated. User: ${data.display_name || data.id}`);
                updateStatus(`מחובר כ-${data.display_name || data.id}`);
                
                // Try to fetch the playlist
                return fetchPlaylist(token);
            })
            .catch(error => {
                logDebug(`Token validation failed: ${error.message}`);
                updateStatus('האסימון לא תקף - נא להתחבר מחדש', true);
                localStorage.removeItem('spotify_token');
            });
        } else {
            logDebug('No token found');
            updateStatus('לא מחובר לספוטיפיי', true);
        }
    }
    
    // Fetch the playlist as a test
    function fetchPlaylist(token) {
        const playlistId = '4EgZlZ9ZccgdLyE33GNOCw';
        
        logDebug(`Attempting to fetch playlist: ${playlistId}`);
        
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            logDebug(`Playlist fetched successfully. Name: ${data.name}`);
            logDebug(`Tracks: ${data.tracks?.total || 0}`);
            
            const tracksWithPreviews = data.tracks?.items.filter(
                item => item.track && item.track.preview_url
            ).length || 0;
            
            logDebug(`Tracks with previews: ${tracksWithPreviews}`);
            
            if (tracksWithPreviews === 0) {
                updateStatus('מחובר, אך אין שירים עם תצוגה מקדימה בפלייליסט', true);
            }
        })
        .catch(error => {
            logDebug(`Failed to fetch playlist: ${error.message}`);
        });
    }
    
    // Run the check on page load
    checkAuthentication();
    
    // Handle the login button click
    const loginButton = document.getElementById('spotify-login');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            logDebug('Login button clicked');
            
            // Direct authentication without using the module
            const CLIENT_ID = 'cc355c7f55514ef49516b4cc469844ae';
            const REDIRECT_URI = 'https://ariel-j.github.io/independentDayApp/callback.html';
            const SCOPES = ['user-read-private', 'user-read-email', 'playlist-read-private', 'playlist-read-collaborative'];
            
            // Generate state
            const state = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('spotify_auth_state', state);
            
            // Build the URL
            const authUrl = new URL('https://accounts.spotify.com/authorize');
            authUrl.searchParams.append('response_type', 'token');
            authUrl.searchParams.append('client_id', CLIENT_ID);
            authUrl.searchParams.append('scope', SCOPES.join(' '));
            authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
            authUrl.searchParams.append('state', state);
            
            // Log and redirect
            logDebug(`Redirecting to: ${authUrl.toString()}`);
            window.location.href = authUrl.toString();
        });
    }
});
