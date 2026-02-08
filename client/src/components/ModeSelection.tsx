import React from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../hooks/useAuth';
import type { GameMode } from '../types';
import { motion } from 'framer-motion';
import { Brain, Clock, Heart, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import Leaderboard from './Leaderboard';

const ModeCard: React.FC<{
    mode: GameMode;
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    onClick: () => void;
}> = ({ mode, icon, title, description, color, onClick }) => {
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
    const { startGame } = useGame();
    const { signOut } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-5xl mx-auto p-4 relative">
            {/* Logout Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={signOut}
                className="fixed top-4 right-4 p-3 rounded-full bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500/20 transition-colors z-[100] cursor-pointer"
                title="Disconnect from System"
            >
                <LogOut size={24} />
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 mt-12"
            >
                <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink mb-4 drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                    MEMORY FLIP
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Engage your cognitive core. Select a protocol to begin synchronization.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
                <ModeCard
                    mode="classic"
                    icon={<Brain size={32} />}
                    title="Classic"
                    description="Pure memory challenge. Unlimited moves. 8 progressive levels."
                    color="blue"
                    onClick={() => startGame('classic')}
                />
                <ModeCard
                    mode="time_limit"
                    icon={<Clock size={32} />}
                    title="Move Limit"
                    description="Efficiency is key. Finite moves per level. Exhaustion leads to failure."
                    color="purple"
                    onClick={() => startGame('time_limit')}
                />
                <ModeCard
                    mode="lives"
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
    );
};

export default ModeSelection;
