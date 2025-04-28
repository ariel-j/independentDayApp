const songs = [
    {
        id: 1,
        title: "התקווה",
        artist: "נפתלי הרץ אימבר",
        url: "https://www.youtube.com/watch?v=1DPqNHkm1bM"
    },
    {
        id: 2,
        title: "ירושלים של זהב",
        artist: "נעמי שמר",
        url: "https://www.youtube.com/watch?v=JH8gtdDA5x0"
    },
    {
        id: 3,
        title: "אני ואתה",
        artist: "אריק איינשטיין",
        url: "https://www.youtube.com/watch?v=8kB7OR161-U"
    },
    {
        id: 4,
        title: "הללויה",
        artist: "גלי עטרי",
        url: "https://www.youtube.com/watch?v=C33kO3fvjkI"
    },
    {
        id: 5,
        title: "חי",
        artist: "עופרה חזה",
        url: "https://www.youtube.com/watch?v=f8HfgP0_TQY"
    }
];

// Keep track of which songs have been played
let playedSongs = new Set(); 