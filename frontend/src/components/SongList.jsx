import React from 'react';
import usePlayerStore from '../store/playerStore';
import SongCard from './SongCard';
import { motion, AnimatePresence } from 'framer-motion';

function SongList() {
    const { queue, favorites, activeTab } = usePlayerStore();

    const displayList = activeTab === 'Up Next' ? queue : favorites;

    if (activeTab === 'Up Next' && queue.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-slate-400 text-[15px] font-medium w-full text-center"
            >
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/5 shadow-inner">
                    <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                </div>
                <p className="text-white text-lg font-bold mb-1 tracking-wide">Queue is empty</p>
                <p className="max-w-[250px] leading-relaxed text-sm mt-1">Search for your favorite tracks to start building a queue.</p>
            </motion.div>
        );
    }

    if (activeTab === 'Favorites' && favorites.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-slate-400 text-[15px] font-medium w-full text-center"
            >
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/5 shadow-inner">
                    <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <p className="text-white text-lg font-bold mb-1 tracking-wide">No favorites yet</p>
                <p className="max-w-[250px] leading-relaxed text-sm mt-1">Tap the heart icon on any playing song to save it here.</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col w-full max-w-4xl mx-auto px-2 pb-10 overflow-y-auto custom-scroll -mr-2 pr-2"
        >
            <AnimatePresence mode="popLayout">
                {displayList.map((song, idx) => (
                    <motion.div
                        key={song.id + '-' + idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                        transition={{ type: 'spring', stiffness: 500, damping: 40, delay: Math.min(idx * 0.04, 0.2) }}
                    >
                        <SongCard song={song} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}

export default SongList;
