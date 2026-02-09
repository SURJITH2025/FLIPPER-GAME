import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Heart, Hash, Trophy, Timer, Volume2, VolumeX } from 'lucide-react';
import { audioManager } from '../utils/audio';

const HUD: React.FC = () => {
    const { score, level, lives, maxLives, moves, maxMoves, mode, endGame } = useGame();
    const [isMuted, setIsMuted] = useState(audioManager.getMutedState());

    return (
        <div className="w-full max-w-6xl mx-auto p-2 md:p-4 mb-4 glass rounded-xl border border-white/10 flex justify-between items-center text-white bg-dark-bg/50 backdrop-blur-md sticky top-0 z-50 shadow-neon-blue/20 shadow-lg">

            {/* Level */}
            <div className="flex items-center gap-2">
                <div className="p-1.5 md:p-2 rounded-lg bg-neon-blue/20 border border-neon-blue/50 text-neon-blue">
                    <Trophy size={16} className="md:w-5 md:h-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs text-gray-400 uppercase font-bold hidden md:block">Level</span>
                    <span className="text-lg md:text-xl font-orbitron font-bold">{level}</span>
                </div>
            </div>

            {/* Mode Specific Stats */}
            <div className="flex gap-3 md:gap-6">
                {mode === 'lives' && (
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 md:p-2 rounded-lg bg-neon-pink/20 border border-neon-pink/50 text-neon-pink">
                            <Heart size={16} className="md:w-5 md:h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs text-gray-400 uppercase font-bold hidden md:block">Lives</span>
                            <span className="text-lg md:text-xl font-orbitron font-bold">{lives} <span className="text-sm text-gray-500">/ {maxLives}</span></span>
                        </div>
                    </div>
                )}

                {mode === 'time_limit' && (
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 md:p-2 rounded-lg bg-neon-purple/20 border border-neon-purple/50 text-neon-purple">
                            <Hash size={16} className="md:w-5 md:h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs text-gray-400 uppercase font-bold hidden md:block">Moves</span>
                            <span className="text-lg md:text-xl font-orbitron font-bold">{maxMoves - moves}</span>
                        </div>
                    </div>
                )}

                {/* Moves (General) */}
                {mode === 'classic' && (
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 md:p-2 rounded-lg bg-neon-purple/20 border border-neon-purple/50 text-neon-purple">
                            <Hash size={16} className="md:w-5 md:h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs text-gray-400 uppercase font-bold hidden md:block">Moves</span>
                            <span className="text-lg md:text-xl font-orbitron font-bold">{moves}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Score */}
            <div className="flex items-center gap-2 md:gap-4">
                <div className="text-right">
                    <span className="text-[10px] md:text-xs text-gray-400 uppercase font-bold block hidden md:block">Score</span>
                    <span className="text-lg md:text-2xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                        {score.toLocaleString()}
                    </span>
                </div>

                <div className="flex gap-1 md:gap-2">
                    <button
                        onClick={() => {
                            setIsMuted(audioManager.toggleMute());
                            audioManager.playClick();
                        }}
                        className="p-1.5 md:p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                        title={isMuted ? "Unmute Audio" : "Mute Audio"}
                    >
                        {isMuted ? <VolumeX size={16} className="md:w-5 md:h-5" /> : <Volume2 size={16} className="md:w-5 md:h-5" />}
                    </button>

                    <button
                        onClick={endGame}
                        className="p-1.5 md:p-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-500 hover:bg-red-500/30 transition-colors"
                        title="End Game & Save"
                    >
                        <Timer size={16} className="md:w-5 md:h-5" />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default HUD;
