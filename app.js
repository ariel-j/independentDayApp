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

// Game state
let currentSongIndex = null;
let playedSegments = 0;
let score = 0;
let gameSongs = [];
let unplayedSongs = [];

// Import Spotify configuration 
import { SPOTIFY_CONFIG } from './config.js';

// Initialize the game
async function initializeGame() {
  // Check if we need to get songs from Spotify
  if (loginButton) {
    loginButton.addEventListener('click', () => redirectToSpotifyAuthorization());
  }
  
  if (isAuthenticated()) {
    try {
      // Hide login button if authenticated
      if (loginButton) {
        loginButton.classList.add('hidden');
      }
      
      // Get songs from Spotify
      const spotifySongs = await initializeSpotify(SPOTIFY_CONFIG.PLAYLIST_ID);
      
      if (spotifySongs && spotifySongs.length > 0) {
        gameSongs = spotifySongs;
        unplayedSongs = [...gameSongs];
        resetGameState();
        selectNextSong();
      } else {
        // If we couldn't get Spotify songs, use the default ones
        gameSongs = songs;
        unplayedSongs = [...songs];
        resetGameState();
        selectNextSong();
      }
    } catch (error) {
      console.error('Error initializing with Spotify:', error);
      // Fall back to local songs
      gameSongs = songs;
      unplayedSongs = [...songs];
      resetGameState();
      selectNextSong();
    }
  } else {
    // If not authenticated, use local songs
    gameSongs = songs;
    unplayedSongs = [...songs];
    resetGameState();
    selectNextSong();
    
    // Show login button
    if (loginButton) {
      loginButton.classList.remove('hidden');
    }
  }
}

// Reset the game state
function resetGameState() {
  playedSegments = 0;
  songTitle.classList.add('hidden');
  if (songArtist) songArtist.classList.add('hidden');
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
    albumCover.classList.remove('hidden');
  } else if (albumCover) {
    albumCover.classList.add('hidden');
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

// Event listeners
playSegmentBtn.addEventListener('click', playInitialSegment);
playNextSegmentBtn.addEventListener('click', playNextSegment);
revealSongBtn.addEventListener('click', revealSong);
playFullBtn.addEventListener('click', playFullSong);
nextSongBtn.addEventListener('click', moveToNextSong);

// Reset playback helper function
function resetPlayback() {
  songPlayer.pause();
  songPlayer.currentTime = 0;
}

// Initialize the game when page loads
window.addEventListener('DOMContentLoaded', initializeGame);