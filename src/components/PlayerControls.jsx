import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import usePlayerStore from '../store/playerStore';

function PlayerControls({ onPlayPause, onNext, onPrev }) {
    const { isPlaying } = usePlayerStore();

    return (
        <div className="flex items-center justify-center gap-6 sm:gap-10 w-full mt-4">

            {/* Outline Circular Previous */}
            <button
                className="w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] flex items-center justify-center rounded-full border border-[#00ffcc]/30 hover:border-[#00ffcc] text-[#00ffcc] transition-all hover:bg-[#00ffcc]/10 active:scale-95 outline-none"
                onClick={onPrev}
            >
                <SkipBack size={18} className="fill-current -ml-0.5" />
            </button>

            {/* Solid Play/Pause Big Center */}
            <button
                type="button"
                className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] flex items-center justify-center rounded-full bg-[#00ffcc] text-slate-900 shadow-[0_5px_20px_rgba(0,255,204,0.4)] hover:bg-[#00e6b8] hover:scale-105 transition-all active:scale-[0.9] outline-none z-10"
                onClick={(e) => {
                    e.stopPropagation();
                    onPlayPause();
                }}
            >
                {isPlaying ? (
                    <Pause size={28} className="fill-current" />
                ) : (
                    <Play size={28} className="fill-current translate-x-[2px]" />
                )}
            </button>

            {/* Outline Circular Next */}
            <button
                className="w-[100px] h-[100px] sm:w-[48px] sm:h-[48px] flex items-center justify-center rounded-full border border-[#00ffcc]/30 hover:border-[#00ffcc] text-[#00ffcc] transition-all hover:bg-[#00ffcc]/10 active:scale-95 outline-none"
                onClick={onNext}
            >
                <SkipForward size={18} className="fill-current ml-0.5" />
            </button>

        </div>
    );
}

export default PlayerControls;
