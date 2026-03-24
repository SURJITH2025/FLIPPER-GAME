import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti'; // Import confetti
import { useGameLogic } from '../hooks/useGameLogic';
import GameBoard from './GameBoard';
import StatsBar from './StatsBar';
import { GameOverModal, LevelCompleteModal, VictoryModal } from './GameEndModals';
import LeaderboardModal from './LeaderboardModal';

const GameScreen = ({ mode, username, onMenu, onSubmitScore }) => {
    console.log('GameScreen rendered with mode:', mode);
    const [modalState, setModalState] = useState({
        type: null,
        data: null
    });
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    // Track total score
    const [totalScore, setTotalScore] = useState(0);

    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#a855f7', '#ec4899']
        });
    };

    const triggerVictoryConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    };

    const onLevelComplete = (data) => {
        if (data.victory) {
            triggerVictoryConfetti();
            setModalState({ type: 'victory', data: { ...data } });

            // Submit score on victory
            onSubmitScore({
                moves: logic.moves,
                time: logic.timer,
                level: logic.level + 1, // Or max levels
                mode: mode,
                totalScore: totalScore // totalScore should be up to date from previous level complete
            });
        } else {
            triggerConfetti();
            const levelScore = logic.calculateScore(data);
            // Update total score immediately or wait for modal?
            // Let's update it here so modal shows correct new total.
            setModalState({ type: 'levelComplete', data: { ...data, levelScore } });
        }
    };

    const onGameOver = (reason, data) => {
        setModalState({ type: 'gameOver', data: { reason, ...data } });

        // Submit score on game over
        onSubmitScore({
            moves: logic.moves,
            time: logic.timer,
            level: data.level, // Level reached
            mode: mode,
            totalScore: totalScore // Current total score
        });
    };

    const logic = useGameLogic(mode, onLevelComplete, onGameOver);

    useEffect(() => {
        if (modalState.type === 'levelComplete') {
            setTotalScore(prev => prev + modalState.data.levelScore);
        }
    }, [modalState.type]);

    const handleNextLevel = () => {
        setModalState({ type: null, data: null });
        logic.nextLevel();
    };

    const handleRetry = () => {
        setModalState({ type: null, data: null });
        // Retry keeps total score from previous levels?
        // Usually retry resets the current level progress, so score should revert to before level?
        // We haven't added levelScore to totalScore until levelComplete, so totalScore is safe.
        logic.retryLevel();
    };

    const handleRestart = () => {
        setModalState({ type: null, data: null });
        setTotalScore(0);
        logic.startLevel(0);
    };

    // Calculate score for victory outside of modalState to be safe
    const finalScore = totalScore + (modalState.data?.levelScore || 0);

    return (
        <div className="min-h-screen w-full flex flex-col items-center py-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            {/* Header */}
            <div className="w-full max-w-4xl px-4 mb-4 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                        {(username || 'G').charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-200">{username || 'Guest'}</span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowLeaderboard(true)}
                        className="p-2 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/50 transition-all text-yellow-400"
                        title="Leaderboard"
                    >
                        🏆
                    </button>
                    <button
                        onClick={onMenu}
                        className="p-2 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/50 transition-all text-slate-300"
                        title="Menu"
                    >
                        🏠
                    </button>
                </div>
            </div>

            {/* Stats */}
            <StatsBar
                level={logic.level}
                score={totalScore}
                moves={mode === 'timed' ? logic.movesRemaining : logic.moves}
                lives={logic.lives}
                timer={logic.timer}
                mode={mode}
                maxLives={logic.config?.lives || 5}
                pairs={logic.config?.pairs || 6}
                matchedPairs={logic.matchedPairs}
            />

            {/* Game Board */}
            <GameBoard
                cards={logic.cards}
                onCardClick={logic.handleCardClick}
                gridConfig={logic.config?.grid || [3, 4]}
            />

            {/* Controls */}
            <div className="mt-4 z-10">
                <button
                    onClick={logic.retryLevel}
                    className="group relative px-6 py-2 rounded-full overflow-hidden bg-slate-800 text-slate-300 font-medium transition-all hover:text-white hover:bg-slate-700 border border-slate-600"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span>
                        Restart Level
                    </span>
                </button>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {modalState.type === 'levelComplete' && (
                    <LevelCompleteModal
                        isOpen={true}
                        level={logic.level}
                        moves={modalState.data?.moves}
                        time={modalState.data?.time}
                        score={modalState.data?.levelScore}
                        totalScore={finalScore} // Show accumulated score including this level
                        onNext={handleNextLevel}
                        onMenu={onMenu}
                    />
                )}

                {modalState.type === 'gameOver' && (
                    <GameOverModal
                        isOpen={true}
                        reason={modalState.data?.reason}
                        level={logic.level + 1}
                        score={totalScore}
                        onRetry={handleRetry}
                        onRestart={handleRestart}
                        onMenu={onMenu}
                    />
                )}

                {modalState.type === 'victory' && (
                    <VictoryModal
                        isOpen={true}
                        score={totalScore}
                        moves={logic.moves}
                        time={logic.timer}
                        onLeaderboard={() => setShowLeaderboard(true)}
                        onMenu={onMenu}
                    />
                )}

                {showLeaderboard && (
                    <LeaderboardModal
                        isOpen={true}
                        onClose={() => setShowLeaderboard(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default GameScreen;
