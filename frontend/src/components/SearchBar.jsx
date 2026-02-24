import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mic, Search, Loader2 } from 'lucide-react';
import usePlayerStore from '../store/playerStore';
import { motion } from 'framer-motion';

function SearchBar({ api }) {
    const [query, setQuery] = useState('');
    const { setSearchResults, setIsSearching, isSearching } = usePlayerStore();

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setSearchResults([]);
                setIsSearching(false);
                if (usePlayerStore.getState().setHasSearched) {
                    usePlayerStore.getState().setHasSearched(false);
                }
                return;
            }

            setIsSearching(true);
            if (usePlayerStore.getState().setHasSearched) {
                usePlayerStore.getState().setHasSearched(true);
            }
            try {
                const res = await axios.get(`${api}/search?q=${encodeURIComponent(query)}`);
                setSearchResults(res.data || []);
            } catch (error) {
                console.error("Search API failed:", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchResults();
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [query, api, setSearchResults, setIsSearching]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Search is handled automatically via useEffect debounce,
        // but this keeps the form submission from refreshing the page 
        // and handles pressing enter.
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full px-4 mb-2 mt-4"
        >
            <form onSubmit={handleSearch} className="flex flex-row items-center justify-center gap-[10px] sm:gap-4 w-full">

                {/* Outlined Mic Circular Button */}
                <button type="button" className="w-[48px] h-[48px] sm:w-[50px] sm:h-[50px] flex items-center justify-center rounded-full border border-[#00ffcc]/40 hover:border-[#00ffcc] text-[#00ffcc] hover:bg-[#00ffcc]/10 transition-all shrink-0 outline-none">
                    <Mic size={18} />
                </button>

                {/* Input Pill */}
                <div className="flex-1 lg:max-w-none max-w-[400px] h-[48px] sm:h-[50px] bg-slate-800/40 backdrop-blur-md rounded-full shadow-lg border border-white/5 mx-1 transition-all flex items-center overflow-hidden">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Explore the soundscape..."
                        className="w-full h-full bg-transparent text-slate-100 text-[14px] sm:text-[15px] px-6 outline-none placeholder:text-slate-500 font-medium tracking-wide"
                    />
                </div>

                {/* Solid Search Button */}
                <button
                    type="submit"
                    className="w-[48px] h-[48px] sm:w-[50px] sm:h-[50px] flex items-center justify-center shrink-0 rounded-full bg-[#00ffcc] text-slate-900 shadow-[0_4px_15px_rgba(0,255,204,0.3)] hover:bg-[#00e6b8] hover:scale-[1.03] active:scale-95 transition-all outline-none"
                    disabled={isSearching}
                >
                    {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                </button>

            </form>
        </motion.div>
    );
}

export default SearchBar;
