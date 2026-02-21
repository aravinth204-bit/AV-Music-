import React from 'react';
import { motion } from 'framer-motion';

function Header() {
    return (
        <header className="w-full pt-8 pb-4 flex flex-col items-center justify-center bg-transparent z-50">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
            >
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                    <img src="/src/assets/AV-Music.png" alt="AV-Music Logo" className="h-[40px] md:h-[48px] object-contain drop-shadow-[0_0_12px_rgba(0,255,204,0.4)]" />
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.15em] uppercase text-white drop-shadow-md">
                        AV <span className="text-[#00ffcc] drop-shadow-[0_0_8px_rgba(0,255,204,0.6)]">MUSIC</span>
                    </h2>
                </div>

                {/* Clean underline from the reference image */}
                <div className="mt-2.5 w-[140px] h-[3px] bg-[#00ffcc] shadow-[0_0_8px_rgba(0,255,204,0.6)]"></div>
            </motion.div>
        </header>
    );
}

export default Header;
