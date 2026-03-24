import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const StatItem = ({ label, value, subValue, highlight }) => (
    <div className={cn(
        "relative overflow-hidden group min-w-[100px]",
        "bg-slate-900/40 backdrop-blur-md border border-white/10",
        "rounded-2xl p-3 flex flex-col items-center justify-center",
        "shadow-lg transition-colors hover:bg-slate-800/50",
        highlight && "border-indigo-500/50 box-shadow-[0_0_15px_rgba(99,102,241,0.2)]"
    )}>
        <span className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">{label}</span>
        <div className="flex items-baseline gap-1">
            <AnimatePresence mode='popLayout'>
                <motion.span
                    key={value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className={cn(
                        "text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r",
                        highlight ? "from-indigo-400 to-cyan-300" : "from-white to-slate-300"
                    )}
                >
                    {value}
                </motion.span>
            </AnimatePresence>
            {subValue && <span className="text-xs text-slate-500">{subValue}</span>}
        </div>
    </div>
);

const StatsBar = ({ level, score, moves, lives, timer, mode, maxLives, pairs, matchedPairs }) => {

    // Format timer
    const minutes = Math.floor(timer / 60);
    const seconds = (timer % 60).toString().padStart(2, '0');

    return (
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 px-4">
            <StatItem label="Level" value={level + 1} highlight />
            <StatItem label="Score" value={score} />
            <StatItem
                label={mode === 'timed' ? 'Moves Left' : 'Moves'}
                value={moves}
                highlight={mode === 'timed' && moves < 5}
            />

            <StatItem label="Time" value={`${minutes}:${seconds}`} />

            {mode === 'hardcore' && (
                <div className="bg-slate-900/40 backdrop-blur-md border border-red-500/30 rounded-2xl p-3 flex flex-col items-center justify-center min-w-[100px]">
                    <span className="text-xs uppercase tracking-wider text-red-400 font-medium mb-1">Lives</span>
                    <div className="flex gap-1 text-lg">
                        {Array.from({ length: maxLives }).map((_, i) => (
                            <motion.span
                                key={i}
                                animate={{
                                    opacity: i < lives ? 1 : 0.2,
                                    scale: i < lives ? 1 : 0.8
                                }}
                            >
                                ❤️
                            </motion.span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatsBar;
