import React, { useState, useRef, useEffect } from 'react';

function ProgressBar({ currentTime, duration, onSeek }) {

    const formatTime = (timeInSeconds) => {
        if (isNaN(timeInSeconds) || timeInSeconds === Infinity) return "0:00";
        const m = Math.floor(timeInSeconds / 60);
        const s = Math.floor(timeInSeconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragPercent, setDragPercent] = useState(0);

    const calculatePercent = (clientX) => {
        if (!containerRef.current) return 0;
        const rect = containerRef.current.getBoundingClientRect();
        return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    };

    const handleDragStart = (e) => {
        setIsDragging(true);
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        setDragPercent(calculatePercent(clientX));
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        setDragPercent(calculatePercent(clientX));
    };

    const handleDragEnd = () => {
        if (isDragging) {
            setIsDragging(false);
            onSeek(dragPercent * duration);
        }
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleDragMove);
            window.addEventListener('touchend', handleDragEnd);
        } else {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging, dragPercent, duration]);

    // Handle normal single click seek if not dragging
    const handleClick = (e) => {
        const percent = calculatePercent(e.clientX);
        onSeek(percent * duration);
    };

    const displayPercent = isDragging ? dragPercent * 100 : (duration > 0 ? (currentTime / duration) * 100 : 0);
    const displayTime = isDragging ? dragPercent * duration : currentTime;

    return (
        <div className="w-full mt-6 px-4">
            <div
                ref={containerRef}
                className="w-full h-[24px] flex items-center cursor-pointer group relative"
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                onClick={handleClick}
            >
                {/* Visual Track */}
                <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden shadow-inner relative">
                    <div
                        className="absolute top-0 left-0 h-full bg-[#00ffcc] rounded-full group-hover:bg-[#00e6b8] shadow-[0_0_10px_rgba(0,255,204,0.5)] transition-all ease-out duration-75"
                        style={{ width: `${displayPercent}%` }}
                    />
                </div>

                {/* Drag Handle Thumbnail */}
                <div
                    className={`absolute w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform -ml-1.5 ${isDragging ? 'scale-125 bg-[#00ffcc] shadow-[0_0_15px_rgba(0,255,204,0.8)]' : ''}`}
                    style={{ left: `${displayPercent}%` }}
                />
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 tracking-wider">
                <span>{formatTime(displayTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>
    );
}

export default ProgressBar;
