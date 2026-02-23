import React from 'react';
import usePlayerStore from '../store/playerStore';
import { motion } from 'framer-motion';

function Tabs() {
    const { activeTab, setActiveTab } = usePlayerStore();
    const tabs = ['Up Next', 'Favorites'];

    return (
        <div className="flex w-full mb-8 justify-center relative z-10">
            <div className="flex bg-slate-800/60 p-1.5 rounded-full w-full max-w-sm ring-1 ring-white/10 backdrop-blur-md shadow-inner">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 relative py-3 sm:py-3.5 text-[14px] sm:text-[15px] font-bold tracking-wide rounded-full transition-all focus:outline-none z-10 ${isActive ? 'text-slate-900' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="tabBackground"
                                    className="absolute inset-0 bg-[#00ffcc] rounded-full shadow-[0_4px_15px_rgba(0,255,204,0.3)]"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className="relative z-20">{tab}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default Tabs;
