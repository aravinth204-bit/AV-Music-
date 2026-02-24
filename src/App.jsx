import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import usePlayerStore from './store/playerStore';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import NowPlayingCard from './components/NowPlayingCard';
import Tabs from './components/Tabs';
import SongList from './components/SongList';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api');

function App() {
  const { currentSong, isPlaying, playNext, playPrev, pauseSong, resumeSong, setQueue, queue, isSearching, searchResults, setSearchResults, hasSearched } = usePlayerStore();

  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Autoplay prevented or playback error:", error);
            pauseSong(); // Revert state if audio fails to play
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!currentSong) return;
      try {
        const res = await axios.get(`${API_URL}/related?id=${currentSong.id}`);
        setQueue(res.data);
      } catch (error) {
        console.error("Failed to fetch related", error);
      }
    };
    fetchRelated();
  }, [currentSong, setQueue]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        isPlaying ? pauseSong() : resumeSong();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, pauseSong, resumeSong]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    playNext();
  };

  const handleSeek = (timeInSeconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeInSeconds;
      setCurrentTime(timeInSeconds);
    }
  };

  const handlePlayPause = () => {
    isPlaying ? pauseSong() : resumeSong();
  };

  const isSearchActiveView = isSearching || searchResults.length > 0 || hasSearched;

  return (
    <div className="min-h-[100dvh] bg-slate-900 border-x border-white/5 text-slate-100 flex flex-col font-sans pb-10 selection:bg-[#00ffcc]/30 w-[95%] max-w-[420px] lg:w-[80vw] lg:max-w-[1200px] mx-auto shadow-2xl relative overflow-x-hidden">

      {currentSong && (
        <audio
          ref={audioRef}
          src={`${API_URL.replace('/api', '')}${currentSong.audioUrl}`}
          onError={(e) => {
            console.error("HTML Audio Element Error:", e.target.error);
            if (isPlaying) pauseSong();
          }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => { if (!isPlaying) resumeSong(); }}
          onPause={() => { if (isPlaying) pauseSong(); }}
        />
      )}

      {/* Main Container - Mobile First Layout */}
      <div className="w-full flex-1 flex flex-col items-center px-4 sm:px-5">

        {/* Soft Background Gradient Effect */}
        <div className="absolute top-[-10%] left-[-20%] w-[140%] h-[500px] bg-gradient-radial from-[#00ffcc] opacity-[0.03] to-transparent pointer-events-none blur-[100px] z-0"></div>

        <Header />

        <div className="w-full z-10">
          <SearchBar api={API_URL} />
        </div>

        <div className="w-full flex-1 flex flex-col items-center relative min-h-[500px] z-10 pb-6">
          <AnimatePresence mode="wait">

            {isSearchActiveView ? (
              <motion.div
                key="search-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                className="w-full bg-slate-800/40 glass rounded-[2rem] p-5 sm:p-6 shadow-2xl mb-8 flex flex-col ring-1 ring-white/10"
              >
                <div className="flex items-center justify-between mb-6 px-1">
                  <h2 className="text-[17px] font-bold tracking-wide text-white drop-shadow-sm">Search Results</h2>
                  <button
                    onClick={() => {
                      setSearchResults([]);
                      if (usePlayerStore.getState().setHasSearched) {
                        usePlayerStore.getState().setHasSearched(false);
                      }
                    }}
                    className="text-[11px] font-bold text-slate-400 hover:text-white uppercase tracking-wider bg-slate-800 hover:bg-slate-700 px-4 py-1.5 rounded-full transition-colors focus:outline-none"
                  >
                    Close
                  </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto custom-scroll pr-1">
                  <SearchResults />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="player-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex w-full flex-col items-center"
              >

                {/* Player Card */}
                <div className="w-full mb-8">
                  {currentSong ? (
                    <NowPlayingCard
                      currentTime={currentTime}
                      duration={duration}
                      onSeek={handleSeek}
                      onPlayPause={handlePlayPause}
                      onNext={playNext}
                      onPrev={playPrev}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center text-slate-400 bg-slate-800/30 glass rounded-[2.5rem] border border-white/5 shadow-2xl w-full">
                      <div className="w-24 h-24 bg-slate-900/60 rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/5">
                        <svg className="w-10 h-10 text-slate-600 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M15 4h3a1 1 0 011 1v15a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1h3m0 3h6m-3 5h3m-6 0h.01M9 16h6m-6 0h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <p className="text-[19px] font-bold text-white tracking-wide">Ready to play</p>
                      <p className="text-[14px] mt-2 leading-relaxed">Search your favorite track to start the queue.</p>
                    </div>
                  )}
                </div>

                {/* Tracks Section */}
                <div className="w-full flex-1 flex flex-col bg-gradient-to-b from-slate-800/30 to-slate-900/50 glass rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-8 pt-6 sm:pt-8 ring-1 ring-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] shadow-inner overflow-hidden mb-6">
                  <Tabs />
                  <SongList />
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
