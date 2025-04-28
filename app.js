// DOM Elements
const playSegmentButton = document.getElementById('playSegment');
const playNextSecondButton = document.getElementById('playNextSecond');
const playFullSongButton = document.getElementById('playFullSong');
const nextSongButton = document.getElementById('nextSong');
const currentSongElement = document.getElementById('currentSong');

// Game state
let currentSong = null;
let player = null;
let currentStartTime = 0;

// Disable buttons initially
playSegmentButton.disabled = true;
playNextSecondButton.disabled = true;
playFullSongButton.disabled = true;
nextSongButton.disabled = true;

// YouTube API callback
function onYouTubeIframeAPIReady() {
    console.log('YouTube API Ready');
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'disablekb': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onError': onPlayerError,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log('Player Ready');
    nextSongButton.disabled = false;
}

function onPlayerError(event) {
    console.error('Player Error:', event.data);
    alert('שגיאה בטעינת השיר. נסה שיר אחר.');
    nextSongButton.disabled = false;
}

function onPlayerStateChange(event) {
    console.log('Player State:', event.data);
}

// Game functions
function getRandomSong() {
    const availableSongs = songs.filter(song => !playedSongs.has(song.id));
    if (availableSongs.length === 0) {
        playedSongs.clear(); // Reset if all songs have been played
        return songs[Math.floor(Math.random() * songs.length)];
    }
    return availableSongs[Math.floor(Math.random() * availableSongs.length)];
}

function getYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function loadNewSong() {
    try {
        currentSong = getRandomSong();
        playedSongs.add(currentSong.id);
        currentStartTime = 0;
        const videoId = getYouTubeVideoId(currentSong.url);
        
        if (!videoId) {
            console.error('Invalid YouTube URL:', currentSong.url);
            alert('שגיאה בטעינת השיר. נסה שיר אחר.');
            return;
        }

        console.log('Loading song:', currentSong.title);
        player.loadVideoById(videoId);
        player.pauseVideo();
        currentSongElement.classList.add('hidden');
        
        // Enable play buttons
        playSegmentButton.disabled = false;
        playNextSecondButton.disabled = false;
        playFullSongButton.disabled = false;
    } catch (error) {
        console.error('Error loading song:', error);
        alert('שגיאה בטעינת השיר. נסה שוב.');
    }
}

function playCurrentSegment(duration) {
    if (!currentSong || !player) {
        console.error('No song loaded or player not ready');
        return;
    }
    
    try {
        console.log('Playing segment from:', currentStartTime, 'duration:', duration);
        player.seekTo(currentStartTime);
        player.playVideo();
        
        setTimeout(() => {
            player.pauseVideo();
        }, duration * 1000);
    } catch (error) {
        console.error('Error playing segment:', error);
        alert('שגיאה בהשמעת השיר. נסה שוב.');
    }
}

// Event Listeners
playSegmentButton.addEventListener('click', () => {
    playCurrentSegment(2);
});

playNextSecondButton.addEventListener('click', () => {
    currentStartTime += 1;
    playCurrentSegment(1);
});

playFullSongButton.addEventListener('click', () => {
    if (!currentSong || !player) return;
    
    try {
        player.seekTo(0);
        player.playVideo();
        currentSongElement.textContent = `השיר הוא: ${currentSong.title} - ${currentSong.artist}`;
        currentSongElement.classList.remove('hidden');
    } catch (error) {
        console.error('Error playing full song:', error);
        alert('שגיאה בהשמעת השיר. נסה שוב.');
    }
});

nextSongButton.addEventListener('click', loadNewSong);

// Initialize game
console.log('Game initialized'); 