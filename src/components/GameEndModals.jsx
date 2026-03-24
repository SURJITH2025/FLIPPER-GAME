import React from 'react';
import Modal from './Modal';

export const GameOverModal = ({ isOpen, reason, level, score, onRetry, onRestart, onMenu }) => {
    return (
        <Modal isOpen={isOpen} onClose={onMenu} title="💔 Game Over">
            <div className="text-center space-y-4 text-white">
                <p className="text-lg text-neon-purple drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">{reason}</p>
                <p>Level: <strong>{level}</strong></p>
                <p>Score: <strong>{score}</strong></p>

                <button onClick={onRetry} className="w-full btn-primary bg-gradient-to-br from-neon-purple to-neon-blue border-2 border-neon-purple text-white shadow-[0_0_20px_rgba(255,0,255,0.5)] py-3 rounded-full font-bold">
                    🔄 Retry Level
                </button>
                <button onClick={onRestart} className="w-full bg-glass-dark text-neon-blue border-2 border-neon-blue shadow-[0_0_20px_rgba(0,255,255,0.3)] py-3 rounded-full font-bold">
                    🔄 Restart Game
                </button>
                <button onClick={onMenu} className="w-full bg-glass-dark text-neon-blue border-2 border-neon-blue shadow-[0_0_20px_rgba(0,255,255,0.3)] py-3 rounded-full font-bold">
                    🏠 Menu
                </button>
            </div>
        </Modal>
    );
};

export const VictoryModal = ({ isOpen, score, moves, time, onLeaderboard, onMenu }) => {
    return (
        <Modal isOpen={isOpen} onClose={onMenu} title="🏆 VICTORY!">
            <div className="text-center space-y-4 text-white">
                <p className="text-xl mb-4">All levels complete!</p>
                <p className="text-3xl font-bold text-neon-blue drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">Score: {score}</p>
                <p>Time: <strong>{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</strong></p>
                <p>Total Moves: <strong>{moves}</strong></p>

                <button onClick={onLeaderboard} className="w-full btn-primary bg-gradient-to-br from-neon-purple to-neon-blue border-2 border-neon-purple text-white shadow-[0_0_20px_rgba(255,0,255,0.5)] py-3 rounded-full font-bold">
                    🏆 Leaderboard
                </button>
                <button onClick={onMenu} className="w-full bg-glass-dark text-neon-blue border-2 border-neon-blue shadow-[0_0_20px_rgba(0,255,255,0.3)] py-3 rounded-full font-bold">
                    🏠 Menu
                </button>
            </div>
        </Modal>
    );
};

export const LevelCompleteModal = ({ isOpen, level, moves, time, score, totalScore, onNext, onMenu }) => {
    // Optional sharing logic could adhere
    return (
        <Modal isOpen={isOpen} onClose={onMenu} title="🎉 Level Complete!">
            <div className="text-center space-y-3 text-white">
                <p>Level: <strong>{level}</strong></p>
                <p>Moves: <strong>{moves}</strong></p>
                <p>Time: <strong>{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</strong></p>
                <p>Level Score: <strong>{score}</strong></p>
                <p className="text-xl">Total: <strong className="text-neon-blue">{totalScore}</strong></p>

                <button onClick={onNext} className="w-full btn-primary bg-gradient-to-br from-neon-purple to-neon-blue border-2 border-neon-purple text-white shadow-[0_0_20px_rgba(255,0,255,0.5)] py-3 rounded-full font-bold mt-4">
                    ➡️ Next Level
                </button>
                <button onClick={onMenu} className="w-full bg-glass-dark text-neon-blue border-2 border-neon-blue shadow-[0_0_20px_rgba(0,255,255,0.3)] py-3 rounded-full font-bold">
                    🏠 Menu
                </button>
            </div>
        </Modal>
    );
};
