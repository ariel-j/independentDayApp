// Main application logic for the Israeli Independence Day Song Quiz

// DOM Elements
const songPlayer = document.getElementById('song-player');
const songTitle = document.getElementById('song-title');
const playSegmentBtn = document.getElementById('play-segment');
const playNextSegmentBtn = document.getElementById('play-next-segment');
const revealSongBtn = document.getElementById('reveal-song');
const playFullBtn = document.getElementById('play-full');
const nextSongBtn = document.getElementById('next-song');
const scoreElement = document.getElementById('score');

// Game state
let currentSongIndex = null;
let playedSegments = 0;
let score = 0;
let unplayedSongs = [...songs];

// Initialize the game
function initializeGame() {
  resetGameState();
  selectNextSong();
}

// Reset the game state
function resetGameState() {
  playedSegments = 0;
  songTitle.classList.add('hidden');
  songPlayer.pause();
  songPlayer.currentTime = 0;
}

// Select a random song that hasn't been played yet
function selectNextSong() {
  if (unplayedSongs.length === 0) {
    // All songs have been played, reset the list
    unplayedSongs = [...songs].map(song => ({...song, played: false}));
  }
  
  // Select a random unplayed song
  const randomIndex = Math.floor(Math.random() * unplayedSongs.length);
  const selectedSong = unplayedSongs[randomIndex];
  
  // Remove the selected song from unplayed songs
  unplayedSongs.splice(randomIndex, 1);
  
  // Update current song
  currentSongIndex = songs.findIndex(song => song.title === selectedSong.title);
  songPlayer.src = songs[currentSongIndex].path;
  
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
  songTitle.textContent = songs[currentSongIndex].title;
  songTitle.classList.remove('hidden');
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
