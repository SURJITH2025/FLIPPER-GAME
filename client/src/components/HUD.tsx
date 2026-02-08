import React from 'react';
import { useGame } from '../context/GameContext';
import { Heart, Hash, Trophy, Timer } from 'lucide-react';

const HUD: React.FC = () => {
    const { score, level, lives, maxLives, moves, maxMoves, mode, endGame } = useGame();

    return (
        <div className="w-full max-w-6xl mx-auto p-4 mb-4 glass rounded-xl border border-white/10 flex justify-between items-center text-white bg-dark-bg/50 backdrop-blur-md sticky top-0 z-50 shadow-neon-blue/20 shadow-lg">

            {/* Level */}
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-neon-blue/20 border border-neon-blue/50 text-neon-blue">
                    <Trophy size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold">Level</span>
                    <span className="text-xl font-orbitron font-bold">{level}</span>
                </div>
            </div>

            {/* Mode Specific Stats */}
            <div className="flex gap-6">
                {mode === 'lives' && (
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-neon-pink/20 border border-neon-pink/50 text-neon-pink">
                            <Heart size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase font-bold">Lives</span>
                            <span className="text-xl font-orbitron font-bold">{lives} <span className="text-sm text-gray-500">/ {maxLives}</span></span>
                        </div>
                    </div>
                )}

                {mode === 'time_limit' && (
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-neon-purple/20 border border-neon-purple/50 text-neon-purple">
                            <Hash size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase font-bold">Moves Left</span>
                            <span className="text-xl font-orbitron font-bold">{maxMoves - moves}</span>
                        </div>
                    </div>
                )}

                {/* Moves (General) */}
                {mode === 'classic' && (
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-neon-purple/20 border border-neon-purple/50 text-neon-purple">
                            <Hash size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase font-bold">Moves</span>
                            <span className="text-xl font-orbitron font-bold">{moves}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Score */}
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <span className="text-xs text-gray-400 uppercase font-bold block">Score</span>
                    <span className="text-2xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                        {score.toLocaleString()}
                    </span>
                </div>

                <button
                    onClick={endGame}
                    className="p-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-500 hover:bg-red-500/30 transition-colors"
                    title="End Game & Save"
                >
                    <Timer size={20} />
                </button>
            </div>

        </div>
    );
};

export default HUD;
