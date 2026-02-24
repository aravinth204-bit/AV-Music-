import React from 'react';
import usePlayerStore from '../store/playerStore';
import SongCard from './SongCard';
import { motion, AnimatePresence } from 'framer-motion';

function SearchResults() {
    const { searchResults, isSearching, hasSearched } = usePlayerStore();

    if (isSearching) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-slate-700 border-t-[#00ffcc] rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium">Fetching tracks from YouTube...</p>
            </div>
        );
    }

    if (searchResults.length === 0) {
        if (hasSearched) {
            return (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-500">
                    <p className="text-lg">No results found for your search</p>
                    <p className="text-sm">Try a different track name</p>
                </div>
            );
        }
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-500">
                <p className="text-lg">Discover your next favorite song</p>
                <p className="text-sm">Type a track name above</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto pb-24 grid gap-3 pr-2 custom-scroll">
            <AnimatePresence>
                {searchResults.map((song, index) => (
                    <motion.div
                        key={song.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <SongCard song={song} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export default SearchResults;
