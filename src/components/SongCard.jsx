import React from 'react';
import usePlayerStore from '../store/playerStore';
import { Heart } from 'lucide-react';

function SongCard({ song }) {
    const { playSong, currentSong, isPlaying, favorites, toggleFavorite } = usePlayerStore();
    const isActive = currentSong?.id === song.id;
    const isFav = favorites.some(f => f.id === song.id);

    const handlePlayClick = () => {
        if (!isActive) {
            playSong(song);
        }
    };

    const handleFavClick = (e) => {
        e.stopPropagation();
        toggleFavorite(song);
    };

    return (
        <div
            className={`group relative flex items-center justify-between p-3 sm:p-4 mb-3 sm:mb-4 rounded-2xl transition-all duration-200 ease-out cursor-pointer hover:-translate-y-[2px] active:scale-[0.98] active:-translate-y-0 overflow-hidden ${isActive
                ? 'bg-slate-800/80 border-[#00ffcc]/40 shadow-[0_8px_30px_rgba(0,0,0,0.4)] ring-1 ring-[#00ffcc]/20'
                : 'bg-transparent hover:bg-slate-800/40 border-transparent hover:ring-1 hover:ring-white/5 hover:shadow-lg'
                } border`}
            onClick={handlePlayClick}
        >
            {/* Active Left Border Highlight */}
            {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#00ffcc] shadow-[0_0_10px_rgba(0,255,204,0.6)]" />
            )}

            <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0 pr-4 z-10 pl-1 sm:pl-2">
                {/* Cover (56px-64px) */}
                <div className={`relative w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] rounded-[14px] overflow-hidden shrink-0 bg-slate-800 transition-all duration-300 ${isActive ? 'shadow-[0_0_20px_rgba(0,255,204,0.2)] ring-1 ring-[#00ffcc]/30' : 'shadow-md ring-1 ring-white/10 group-hover:shadow-xl'}`}>
                    <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
                    {isActive && isPlaying && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                            <div className="flex gap-[3px] h-3 items-end">
                                <div className="w-[3px] bg-[#00ffcc] animate-[bounce_0.8s_infinite] rounded-full h-2"></div>
                                <div className="w-[3px] bg-[#00ffcc] animate-[bounce_1.2s_infinite] rounded-full h-3"></div>
                                <div className="w-[3px] bg-[#00ffcc] animate-[bounce_1.0s_infinite] rounded-full h-1"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className={`font-bold truncate text-[16px] sm:text-[17px] tracking-wide transition-colors ${isActive ? 'text-[#00ffcc] drop-shadow-[0_0_8px_rgba(0,255,204,0.3)]' : 'text-slate-100 group-hover:text-white'}`}>
                        {song.title}
                    </h4>
                    <p className={`text-[14px] sm:text-[15px] truncate mt-1 font-medium transition-colors ${isActive ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-400'}`}>
                        {song.author}
                    </p>
                </div>
            </div>

            {/* Heart */}
            <button
                onClick={handleFavClick}
                className="w-12 h-12 flex items-center justify-center rounded-full text-slate-500 transition-all duration-300 shrink-0 outline-none z-10 group/btn hover:bg-slate-700/50 mr-1"
            >
                <Heart
                    size={22}
                    className={`transition-all duration-300 ${isFav ? "fill-[#00ffcc] text-[#00ffcc] drop-shadow-[0_0_12px_rgba(0,255,204,0.8)] scale-110" : "group-hover/btn:text-white group-hover/btn:scale-110"}`}
                />
            </button>
        </div>
    );
}

export default SongCard;
