import React from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import { RefreshCw, Menu, Share2 } from 'lucide-react';

const GameOverScreen: React.FC = () => {
    const { gameStatus, score, level, mode, restartLevel, quitGame } = useGame();

    if (gameStatus !== 'won' && gameStatus !== 'lost') return null;

    const isWin = gameStatus === 'won'; // 'won' logic not fully triggered in context yet unless Level 8 done
    // Wait, context has 'lost' but 'won' is hypothetical.

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
            <div className="max-w-md w-full text-center">
                <motion.h1
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-6xl font-orbitron font-bold mb-4 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)] ${isWin ? 'text-neon-blue' : 'text-neon-pink'}`}
                >
                    {isWin ? 'COMPLETE' : 'FAILURE'}
                </motion.h1>

                <p className="text-gray-400 mb-8 text-xl">
                    {isWin ? 'System synchronization achieved.' : 'Neural link severed.'}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="text-gray-500 text-xs uppercase mb-1">Total Score</div>
                        <div className="text-3xl font-orbitron font-bold text-white">{score.toLocaleString()}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="text-gray-500 text-xs uppercase mb-1">Level Reached</div>
                        <div className="text-3xl font-orbitron font-bold text-white">{level}</div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={restartLevel}
                        className="w-full py-4 rounded-xl bg-white text-dark-bg font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                    >
                        <RefreshCw size={20} />
                        <span>RETRY PROTOCOL</span>
                    </button>
                    <button
                        onClick={quitGame}
                        className="w-full py-4 rounded-xl bg-white/10 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                    >
                        <Menu size={20} />
                        <span>ABORT TO MENU</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default GameOverScreen;
