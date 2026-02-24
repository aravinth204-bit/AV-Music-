const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({ origin: "*" }));

// Parse JSON bodies
app.use(express.json());

// 1. Serve audio files from the '/songs' folder using static hosting
const songsPath = path.join(__dirname, "songs");
app.use("/songs", express.static(songsPath));

// Define paths for data storage
const dataPath = path.join(__dirname, 'data');
const favoritesFile = path.join(dataPath, 'favorites.json');

// Ensure data directory and favorites file exist
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
}
if (!fs.existsSync(favoritesFile)) {
    fs.writeFileSync(favoritesFile, JSON.stringify([]));
}

// Helper to read favorites
const readFavorites = () => {
    try {
        const data = fs.readFileSync(favoritesFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Helper to write favorites
const writeFavorites = (favorites) => {
    fs.writeFileSync(favoritesFile, JSON.stringify(favorites, null, 2));
};

const ytSearch = require('yt-search');
const ytdl = require('@distube/ytdl-core');

// 2. API Endpoint: GET /api/songs -> return list of default songs
app.get('/api/songs', async (req, res) => {
    try {
        // Fetch some trending/default songs for the initial queue
        const r = await ytSearch('top music hits');
        const videos = r.videos.slice(0, 10);
        const results = videos.map((v, index) => {
            const fileName = `${v.videoId}.mp3`;
            return {
                id: v.videoId,
                title: v.title,
                author: v.author.name,
                thumbnail: v.thumbnail,
                audioUrl: `/songs/${fileName}`
            };
        });
        res.json(results);
    } catch (error) {
        console.error("Error fetching default songs:", error);
        res.json([]);
    }
});

// Search API Endpoint: GET /api/search -> search youtube
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q || '';

        if (!query.trim()) {
            return res.json([]);
        }

        const r = await ytSearch(query);
        const videos = r.videos.slice(0, 15);

        const results = videos.map(v => {
            const fileName = `${v.videoId}.mp3`;
            return {
                id: v.videoId,
                title: v.title,
                author: v.author.name,
                thumbnail: v.thumbnail,
                audioUrl: `/songs/${fileName}`
            };
        });

        res.json(results);
    } catch (error) {
        console.error("Error searching youtube:", error);
        res.status(500).json({ error: "Search failed" });
    }
});

// Static media API endpoint
app.get('/api/play', (req, res) => {
    try {
        const videoId = req.query.id;
        if (!videoId) return res.status(400).send("No video id provided");

        const fileName = `${videoId}.mp3`;
        const filePath = path.join(songsPath, fileName);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "File not found" });
        }

        res.json({
            url: `${req.protocol}://${req.get("host")}/songs/${fileName}`
        });
    } catch (error) {
        console.error("Error playing video:", error);
        res.status(500).json({ error: "Streaming failed" });
    }
});

// 5. Add error handling and return JSON for /api/related even if empty
app.get('/api/related', (req, res) => {
    res.json([]);
});

// 3. Add Favorites System: GET /api/favorites -> return saved favorites
app.get('/api/favorites', (req, res) => {
    const favorites = readFavorites();
    res.json(favorites);
});

// 3. Add Favorites System: POST /api/favorites -> save favorite song
app.post('/api/favorites', (req, res) => {
    const { song } = req.body;

    if (!song || !song.id) {
        return res.status(400).json({ error: "Invalid song data" });
    }

    const favorites = readFavorites();

    // Check if song already exists in favorites
    const exists = favorites.find(fav => fav.id === song.id);

    if (!exists) {
        favorites.push(song);
        writeFavorites(favorites);
        res.status(201).json({ message: "Added to favorites", favorites });
    } else {
        // Optional: Toggle favorite (remove if exists)
        const updatedFavorites = favorites.filter(fav => fav.id !== song.id);
        writeFavorites(updatedFavorites);
        res.status(200).json({ message: "Removed from favorites", favorites: updatedFavorites });
    }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
    });
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
