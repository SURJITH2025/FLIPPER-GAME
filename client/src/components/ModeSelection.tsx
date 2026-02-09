import React from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Brain, Clock, Heart, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import Leaderboard from './Leaderboard';
import { audioManager } from '../utils/audio';

const ModeCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    onClick: () => void;
}> = ({ icon, title, description, color, onClick }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={clsx(
                "relative p-6 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden group",
                "bg-dark-bg/80 backdrop-blur-sm shadow-lg hover:shadow-2xl",
                {
                    'border-neon-blue shadow-neon-blue/20': color === 'blue',
                    'border-neon-purple shadow-neon-purple/20': color === 'purple',
                    'border-neon-pink shadow-neon-pink/20': color === 'pink',
                }
            )}
        >
            {/* Background Gradient */}
            <div className={clsx(
                "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br",
                {
                    'from-neon-blue to-transparent': color === 'blue',
                    'from-neon-purple to-transparent': color === 'purple',
                    'from-neon-pink to-transparent': color === 'pink',
                }
            )} />

            <div className={clsx("mb-4 p-3 rounded-xl w-fit", {
                'bg-neon-blue/20 text-neon-blue': color === 'blue',
                'bg-neon-purple/20 text-neon-purple': color === 'purple',
                'bg-neon-pink/20 text-neon-pink': color === 'pink',
            })}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold font-orbitron text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </motion.button>
    );
};

const ModeSelection: React.FC = () => {
    const { startGame, quitGame } = useGame();
    const { signOut } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-5xl mx-auto p-4 relative">

            <div className="relative z-10 w-full max-w-4xl p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-4">
                    <h1 className="text-4xl md:text-7xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink drop-shadow-[0_0_15px_rgba(0,243,255,0.5)] text-center md:text-left">
                        MEMORY_FLIP
                    </h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                audioManager.resume();
                                audioManager.playMatch();
                                alert("Audio Test: Playing Match Sound");
                            }}
                            className="p-2 border border-neon-blue/30 rounded-lg text-neon-blue hover:bg-neon-blue/10 transition-colors"
                            title="Test Audio"
                        >
                            🔊
                        </button>
                        <button
                            onClick={() => {
                                if (window.confirm("Are you sure you want to logout?")) {
                                    signOut();
                                    quitGame();
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-orbitron text-sm tracking-widest"
                        >
                            <LogOut size={16} />
                            LOGOUT
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full mb-8 md:mb-12">
                    <ModeCard
                        icon={<Brain size={32} />}
                        title="Classic"
                        description="Pure memory challenge. Unlimited moves. 8 progressive levels."
                        color="blue"
                        onClick={() => startGame('classic')}
                    />
                    <ModeCard
                        icon={<Clock size={32} />}
                        title="Move Limit"
                        description="Efficiency is key. Finite moves per level. Exhaustion leads to failure."
                        color="purple"
                        onClick={() => startGame('time_limit')}
                    />
                    <ModeCard
                        icon={<Heart size={32} />}
                        title="Survival"
                        description="High stakes. Limited lives. Mismatches are penalized. Survive to the end."
                        color="pink"
                        onClick={() => startGame('lives')}
                    />
                </div>

                {/* Leaderboard Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full"
                >
                    <Leaderboard />
                </motion.div>
            </div>
        </div>
    );
};

export default ModeSelection;
