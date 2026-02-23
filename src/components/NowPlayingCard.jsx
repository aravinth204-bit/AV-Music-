import React from 'react';
import usePlayerStore from '../store/playerStore';
import { motion } from 'framer-motion';
import { Heart, Music } from 'lucide-react';
import Equalizer from './Equalizer';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';

function NowPlayingCard({ currentTime, duration, onSeek, onPlayPause, onNext, onPrev }) {
    const { currentSong, isPlaying, favorites, toggleFavorite } = usePlayerStore();

    if (!currentSong) return null;
    const isFav = favorites.some(f => f.id === currentSong.id);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center w-full relative z-10"
        >
            <div className="glass bg-slate-800/30 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-10 pb-8 relative overflow-hidden ring-1 ring-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] lg:max-w-[80vw] max-w-[500px] lg:max-w-none mx-auto w-full flex flex-col items-center">

                {/* Background ambient glow matching current player theme */}
                {isPlaying && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.05 }}
                        className="absolute inset-x-0 inset-y-0 bg-[#00ffcc] pointer-events-none blur-[120px]"
                    />
                )}

                {/* Wide Equalizer */}
                <div className="w-full flex justify-center mt-2 mb-3 h-[30px]">
                    {isPlaying ? (
                        <Equalizer />
                    ) : (
                        <div className="flex items-end gap-[4px] h-[30px] justify-center opacity-40">
                            {Array.from({ length: 27 }).map((_, i) => (
                                <div key={i} className="w-[3px] bg-[#00ffcc] rounded-full h-[6px]" />
                            ))}
                        </div>
                    )}
                </div>

                {/* Now Playing text with Icon */}
                <div className="flex items-center justify-center gap-2 mb-8 text-[#00ffcc] text-[12px] font-bold tracking-widest drop-shadow-sm uppercase">
                    <Music size={14} className="mb-[-1px]" />
                    <span>Now Playing...</span>
                </div>

                {/* Title Container flex relative to right heart */}
                <div className="relative w-full text-center px-10 mb-[6px]">
                    <h2 className="text-xl sm:text-[22px] font-bold text-white truncate drop-shadow-md tracking-wide px-2 inline-block max-w-full">
                        {currentSong.title}
                    </h2>

                    {/* Absolute Heart on the far right edge of the card inner */}
                    <div className="absolute right-0 top-1/2 rounded-full -translate-y-1/2">
                        <button
                            onClick={() => toggleFavorite(currentSong)}
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-[#00ffcc]/50 bg-slate-800/40 hover:bg-slate-700/60 transition-colors shrink-0 outline-none"
                        >
                            <Heart
                                size={18}
                                className={isFav ? "fill-[#00ffcc] text-[#00ffcc] drop-shadow-[0_0_8px_rgba(0,255,204,0.6)]" : "text-slate-400 border-white"}
                            />
                        </button>
                    </div>
                </div>

                {/* Artist Name */}
                <div className="w-full text-center mb-10 px-10">
                    <p className="text-slate-400 text-[14px] sm:text-[15px] font-medium truncate tracking-wide">
                        {currentSong.author}
                    </p>
                </div>

                {/* Player Outline + Solid Buttons */}
                <div className="w-full flex justify-center mb-2">
                    <PlayerControls
                        onPlayPause={onPlayPause}
                        onNext={onNext}
                        onPrev={onPrev}
                    />
                </div>

                {/* Progress Element */}
                <div className="w-full sm:w-[85%] mx-auto relative z-20">
                    <ProgressBar
                        currentTime={currentTime}
                        duration={duration}
                        onSeek={onSeek}
                    />
                </div>

            </div>
        </motion.div>
    );
}

export default NowPlayingCard;
