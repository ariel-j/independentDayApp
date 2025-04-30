// Main application logic for the Israeli Independence Day Song Quiz
import { initializeSpotify, isAuthenticated, redirectToSpotifyAuthorization } from './spotify-auth.js';

// DOM Elements
const songPlayer = document.getElementById('song-player');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const albumCover = document.getElementById('album-cover');
const playSegmentBtn = document.getElementById('play-segment');
const playNextSegmentBtn = document.getElementById('play-next-segment');
const revealSongBtn = document.getElementById('reveal-song');
const playFullBtn = document.getElementById('play-full');
const nextSongBtn = document.getElementById('next-song');
const scoreElement = document.getElementById('score');
const loginButton = document.getElementById('spotify-login');
const spotifyStatus = document.getElementById('spotify-status');

// Game state
let currentSongIndex = null;
let playedSegments = 0;
let score = 0;
let gameSongs = [];
let unplayedSongs = [];

// Initialize the game
async function initializeGame() {
  try {
    console.log("Initializing game...");
    
    // Setup Spotify login button
    if (loginButton) {
      loginButton.addEventListener('click', handleSpotifyLogin);
    }
    
    // Check if authenticated with Spotify
    if (isAuthenticated()) {
      updateSpotifyStatus("מחובר לספוטיפיי");
      try {
        // Get songs from Spotify (or simulated data)
        console.log("Getting songs from Spotify...");
        const spotifySongs = await initializeSpotify();
        
        if (spotifySongs && spotifySongs.length > 0) {
          console.log("Got songs from Spotify:", spotifySongs.length);
          gameSongs = spotifySongs;
        } else {
          console.log("No songs from Spotify, using default songs");
          gameSongs = songs; // Fallback to local songs
        }
      } catch (error) {
        console.error("Error getting Spotify songs:", error);
        gameSongs = songs; // Fallback to local songs
      }
    } else {
      console.log("Not authenticated with Spotify, using default songs");
      gameSongs = songs;
      updateSpotifyStatus("לא מחובר לספוטיפיי");
    }
    
    // Initialize game with songs
    unplayedSongs = [...gameSongs];
    resetGameState();
    selectNextSong();
    
    console.log("Game initialized with", gameSongs.length, "songs");
  } catch (error) {
    console.error("Error in game initialization:", error);
    // Fallback to local songs in case of any error
    gameSongs = songs;
    unplayedSongs = [...songs];
    resetGameState();
    selectNextSong();
  }
}

// Handle Spotify login button click
function handleSpotifyLogin() {
  console.log("Spotify login button clicked");
  redirectToSpotifyAuthorization();
}

// Update Spotify status display
function updateSpotifyStatus(message) {
  if (spotifyStatus) {
    spotifyStatus.textContent = message;
  }
}

// Reset the game state
function resetGameState() {
  playedSegments = 0;
  songTitle.classList.add('hidden');
  if (songArtist) songArtist.classList.add('hidden');
  if (albumCover) albumCover.classList.add('hidden');
  songPlayer.pause();
  songPlayer.currentTime = 0;
}

// Select a random song that hasn't been played yet
function selectNextSong() {
  if (unplayedSongs.length === 0) {
    // All songs have been played, reset the list
    unplayedSongs = [...gameSongs].map(song => ({...song, played: false}));
  }
  
  // Select a random unplayed song
  const randomIndex = Math.floor(Math.random() * unplayedSongs.length);
  const selectedSong = unplayedSongs[randomIndex];
  
  // Remove the selected song from unplayed songs
  unplayedSongs.splice(randomIndex, 1);
  
  // Update current song
  currentSongIndex = gameSongs.findIndex(song => song.title === selectedSong.title);
  songPlayer.src = gameSongs[currentSongIndex].path;
  
  // Update album cover if available
  if (albumCover && gameSongs[currentSongIndex].albumCover) {
    albumCover.src = gameSongs[currentSongIndex].albumCover;
    albumCover.classList.add('hidden'); // Keep hidden until revealed
  }
  
  return selectedSong;
}

// Play initial segment (first 2 seconds)
function playInitialSegment() {
  resetPlayback();
  playedSegments = 1;
  playSegment(0, 2);
}

// Play next segment (additional 1 second)
function playNextSegment() {
  if (playedSegments === 0) {
    playInitialSegment();
    return;
  }
  
  const startTime = playedSegments + 1;
  playedSegments++;
  playSegment(startTime, startTime + 1);
}

// Play a specific segment of the current song
function playSegment(startTime, endTime) {
  songPlayer.currentTime = startTime;
  
  const playPromise = songPlayer.play();
  
  if (playPromise !== undefined) {
    playPromise.then(() => {
      // Set timeout to pause after segment duration
      setTimeout(() => {
        songPlayer.pause();
      }, (endTime - startTime) * 1000);
    }).catch(error => {
      console.error('Playback error:', error);
    });
  }
}

// Reveal the current song title
function revealSong() {
  songTitle.textContent = gameSongs[currentSongIndex].title;
  songTitle.classList.remove('hidden');
  
  // Show artist if available
  if (songArtist && gameSongs[currentSongIndex].artist) {
    songArtist.textContent = gameSongs[currentSongIndex].artist;
    songArtist.classList.remove('hidden');
  }
  
  // Show album cover if available
  if (albumCover && gameSongs[currentSongIndex].albumCover) {
    albumCover.classList.remove('hidden');
  }
}

// Play the full song
function playFullSong() {
  songPlayer.currentTime = 0;
  songPlayer.play();
  revealSong();
}

// Move to the next song
function moveToNextSong() {
  score++;
  scoreElement.textContent = score;
  resetGameState();
  selectNextSong();
}

// Reset playback helper function
function resetPlayback() {
  songPlayer.pause();
  songPlayer.currentTime = 0;
}

// Event listeners
playSegmentBtn.addEventListener('click', playInitialSegment);
playNextSegmentBtn.addEventListener('click', playNextSegment);
revealSongBtn.addEventListener('click', revealSong);
playFullBtn.addEventListener('click', playFullSong);
nextSongBtn.addEventListener('click', moveToNextSong);

// Initialize the game when page loads
window.addEventListener('DOMContentLoaded', initializeGame);