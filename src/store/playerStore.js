import { create } from 'zustand';

const loadInitialFavorites = () => {
    try {
        const saved = localStorage.getItem("avmusic_favorites");
        if (saved) return JSON.parse(saved);
    } catch (error) {
        console.error("Failed to parse favorites from local storage:", error);
    }
    return [];
};

const usePlayerStore = create((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    searchResults: [],
    isSearching: false,
    hasSearched: false,
    favorites: loadInitialFavorites(),
    activeTab: 'Up Next',

    setSearchResults: (results) => set({ searchResults: results }),
    setIsSearching: (isSearching) => set({ isSearching }),
    setHasSearched: (hasSearched) => set({ hasSearched }),
    setActiveTab: (tab) => set({ activeTab: tab }),

    toggleFavorite: (song) => set((state) => {
        const isFav = state.favorites.some(f => f.id === song.id);
        let newFavorites;

        if (isFav) {
            newFavorites = state.favorites.filter(f => f.id !== song.id);
        } else {
            newFavorites = [...state.favorites, song];
        }

        try {
            localStorage.setItem("avmusic_favorites", JSON.stringify(newFavorites));
        } catch (error) {
            console.error("Failed to save favorites to local storage:", error);
        }

        return { favorites: newFavorites };
    }),

    playSong: (song) => set({
        currentSong: song,
        isPlaying: true
    }),

    pauseSong: () => set({ isPlaying: false }),
    resumeSong: () => set({ isPlaying: true }),

    setQueue: (queue) => set({ queue }),

    playNext: () => set((state) => {
        if (state.queue.length > 0) {
            const nextSong = state.queue[0];
            const newQueue = state.queue.slice(1);
            return {
                currentSong: nextSong,
                queue: newQueue,
                isPlaying: true
            };
        }
        return { isPlaying: false };
    }),

    playPrev: () => set((state) => {
        // Placeholder for previous history, for now just restart or play first from queue if available
        // A complete app would maintain history
        if (state.currentSong) {
            return { isPlaying: true }; // Just re-trigger play
        }
        return { isPlaying: false };
    })
}));

export default usePlayerStore;
