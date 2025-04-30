# Israeli Independence Day Song Quiz with Spotify Integration

A fun web application where participants guess Israeli songs by listening to short segments. The app plays two seconds of a song initially, and participants can choose to hear more segments until they recognize the song. Now with Spotify integration!

## Features

- Connect to Spotify to use your own playlists
- Random song selection (never repeats a song until all songs have been played)
- Plays first 2 seconds of a song
- Button to play additional 1-second segments
- Option to reveal the song title and artist
- Play the full song/preview
- Move to the next song
- Score tracking
- Display album artwork
- Responsive design with Israeli flag colors and themes

## Project Structure

- `index.html` - Main HTML structure
- `callback.html` - Handles Spotify authentication callback
- `styles.css` - All styling and responsive design
- `songs.js` - Default database of Israeli songs (as fallback)
- `app.js` - Game logic and functionality
- `spotify-auth.js` - Spotify authentication and playlist handling
- `config.js` - Configuration for Spotify credentials

## Setup Instructions

### Local Development

1. Clone this repository to your local machine or download the files
2. Create a Spotify Developer account at [developer.spotify.com](https://developer.spotify.com/) if you don't have one
3. Create a new Spotify app in the developer dashboard
4. Set the redirect URI to `http://localhost:5173/callback.html` (or your local server address)
5. Copy your Client ID from the Spotify dashboard
6. Open `config.js` and set your CLIENT_ID and PLAYLIST_ID
7. Start a local web server (you can use `npx http-server` or any other method)
8. Open the application in your browser

### GitHub Pages Deployment

1. Fork this repository to your GitHub account
2. Go to your repository settings
3. Navigate to the "Pages" section
4. Select the branch you want to deploy (usually `main` or `master`)
5. Click "Save"
6. Update the `config.js` file with your Spotify credentials and update the REDIRECT_URI to your GitHub Pages URL (`https://[your-username].github.io/[repository-name]/callback.html`)
7. Push the changes to GitHub

## Using with Spotify

1. Create a playlist in Spotify with Israeli songs
2. Get the playlist ID from the Spotify URL (it's the alphanumeric string after "playlist/" in the URL)
3. Update the PLAYLIST_ID in `config.js`
4. When you run the app, click "Connect to Spotify" button
5. Authorize the application to access your Spotify account
6. The app will load songs from your playlist

Note: Spotify provides 30-second previews for many songs. Not all songs have preview URLs available. Songs without previews will be skipped.

## Customization

- Add more fallback songs by updating the `songs` array in `songs.js`
- Adjust styling by modifying `styles.css`
- Change game mechanics by editing `app.js`

## Development

This project follows clean code principles with:
- Separation of concerns (HTML, CSS, JS)
- Clear naming conventions
- Single-responsibility functions
- Responsive design
- Proper comments and documentation

Enjoy the quiz and celebrate Israeli Independence Day with music!
