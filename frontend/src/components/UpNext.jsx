import React from 'react';
import SongCard from './SongCard';

function UpNext({ queue }) {
    if (!queue || queue.length === 0) return null;

    return (
        <div className="glass rounded-2xl p-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 tracking-wide uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ffcc]"></span>
                Up Next
            </h3>

            <div className="flex flex-col gap-2">
                {queue.slice(0, 4).map(song => (
                    <SongCard key={song.id} song={song} />
                ))}
            </div>
        </div>
    );
}

export default UpNext;
