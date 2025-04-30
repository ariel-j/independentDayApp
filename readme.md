# Israeli Independence Day Song Quiz

A fun web application where participants guess Israeli songs by listening to short segments. The app plays two seconds of a song initially, and participants can choose to hear more segments until they recognize the song.

## Features

- Random song selection (never repeats a song until all songs have been played)
- Plays first 2 seconds of a song
- Button to play additional 1-second segments
- Option to reveal the song title
- Play the full song
- Move to the next song
- Score tracking
- Responsive design with Israeli flag colors and themes

## Project Structure

- `index.html` - Main HTML structure
- `styles.css` - All styling and responsive design
- `songs.js` - Database of Israeli songs
- `app.js` - Game logic and functionality

## Setup Instructions

1. Clone this repository to your local machine or download the files
2. Create a folder named `songs` in the project directory
3. Add your song files (MP3 format) to the `songs` folder
4. Update the `songs.js` file with correct paths and song titles
5. Open `index.html` in your web browser or deploy to GitHub Pages

## GitHub Pages Deployment

To deploy this app using GitHub Pages:

1. Push the code to a GitHub repository
2. Go to your repository settings
3. Navigate to the "Pages" section
4. Select the branch you want to deploy (usually `main` or `master`)
5. Click "Save"
6. Your app will be available at `https://[your-username].github.io/[repository-name]/`

## Customization

- Add more songs by updating the `songs` array in `songs.js`
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
