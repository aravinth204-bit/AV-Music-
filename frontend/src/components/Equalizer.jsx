import React from 'react';

function Equalizer() {
    return (
        <div className="flex items-end gap-[3px] sm:gap-[4px] h-[30px] justify-center items-center">
            {Array.from({ length: 27 }).map((_, i) => (
                <div
                    key={i}
                    className="w-[3px] bg-[#00ffcc] rounded-full equalizer-bar"
                    style={{ animationDelay: `${(i % 5) * 0.15 + (i % 3) * 0.1}s` }}
                />
            ))}
        </div>
    );
}

export default Equalizer;
