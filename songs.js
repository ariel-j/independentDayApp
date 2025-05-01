// Default songs for Israeli Independence Day Song Quiz
// These are used as fallback when Spotify is not available
// Each song has a Spotify preview URL, which we'll get from the API
// But we provide default structured data for the game to use

const songs = [
    {
        id: 1,
        title: "התקווה",
        artist: "נפתלי הרץ אימבר",
        // No path provided - will be obtained from Spotify
        path: null,
        url: "https://www.youtube.com/watch?v=1DPqNHkm1bM",
        albumCover: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Flag_of_Israel.svg/320px-Flag_of_Israel.svg.png"
    },
    {
        id: 2,
        title: "ירושלים של זהב",
        artist: "נעמי שמר",
        path: null,
        url: "https://www.youtube.com/watch?v=JH8gtdDA5x0",
        albumCover: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Jerusalem_montage_%282).jpg/320px-Jerusalem_montage_%282).jpg"
    },
    {
        id: 3,
        title: "אני ואתה",
        artist: "אריק איינשטיין",
        path: null,
        url: "https://www.youtube.com/watch?v=8kB7OR161-U",
        albumCover: "https://upload.wikimedia.org/wikipedia/he/thumb/6/61/Ani_veata_album.jpg/320px-Ani_veata_album.jpg"
    },
    {
        id: 4,
        title: "הללויה",
        artist: "גלי עטרי",
        path: null,
        url: "https://www.youtube.com/watch?v=C33kO3fvjkI",
        albumCover: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/Hallelujah_Milk_and_Honey.jpg/320px-Hallelujah_Milk_and_Honey.jpg"
    },
    {
        id: 5,
        title: "חי",
        artist: "עופרה חזה",
        path: null,
        url: "https://www.youtube.com/watch?v=f8HfgP0_TQY",
        albumCover: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/Chai_%28Ofra_Haza_song%29.jpg/320px-Chai_%28Ofra_Haza_song%29.jpg"
    }
];

// Export the songs array for use in app.js
export default songs;