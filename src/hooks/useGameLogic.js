import { useState, useEffect, useRef, useCallback } from 'react';

const ALL_EMOJIS = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍒', '🍑', '🍉', '🥝', '🍍', '🥭', '🍋', '🫐', '🥥', '🍈', '🍐', '🥑', '🌶️', '🥒', '🥬', '🥦', '🌽', '🥕', '🥔', '🍆', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🥨', '🥯', '🥞', '🧇'];

const LEVELS_CONFIG = {
    classic: [
        { pairs: 6, grid: [3, 4], moves: Infinity, lives: Infinity },
        { pairs: 8, grid: [4, 4], moves: Infinity, lives: Infinity },
        { pairs: 10, grid: [4, 5], moves: Infinity, lives: Infinity },
        { pairs: 12, grid: [4, 6], moves: Infinity, lives: Infinity },
        { pairs: 15, grid: [5, 6], moves: Infinity, lives: Infinity },
        { pairs: 18, grid: [6, 6], moves: Infinity, lives: Infinity },
        { pairs: 21, grid: [6, 7], moves: Infinity, lives: Infinity },
        { pairs: 24, grid: [6, 8], moves: Infinity, lives: Infinity }
    ],
    timed: [
        { pairs: 6, grid: [3, 4], moves: 20 },
        { pairs: 8, grid: [4, 4], moves: 24 },
        { pairs: 10, grid: [4, 5], moves: 28 },
        { pairs: 12, grid: [4, 6], moves: 32 },
        { pairs: 15, grid: [5, 6], moves: 38 },
        { pairs: 18, grid: [6, 6], moves: 44 },
        { pairs: 21, grid: [6, 7], moves: 50 },
        { pairs: 24, grid: [6, 8], moves: 56 }
    ],
    hardcore: [
        { pairs: 6, grid: [3, 4], lives: 5 },
        { pairs: 8, grid: [4, 4], lives: 4 },
        { pairs: 10, grid: [4, 5], lives: 4 },
        { pairs: 12, grid: [4, 6], lives: 3 },
        { pairs: 15, grid: [5, 6], lives: 3 },
        { pairs: 18, grid: [6, 6], lives: 2 },
        { pairs: 21, grid: [6, 7], lives: 2 },
        { pairs: 24, grid: [6, 8], lives: 1 }
    ]
};

export const useGameLogic = (mode, onLevelComplete, onGameOver) => {
    const [level, setLevel] = useState(0);
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [moves, setMoves] = useState(0);
    const [movesRemaining, setMovesRemaining] = useState(0);
    const [lives, setLives] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Combo system for "snappy" feel
    const [combo, setCombo] = useState(1);
    const lastMatchTimeRef = useRef(0);

    const timerRef = useRef(null);
    const failedEmojisRef = useRef(new Set());

    // Initialize level
    const startLevel = useCallback((levelIndex = 0) => {
        // Fallback to 'classic' if mode is invalid
        const safeMode = LEVELS_CONFIG[mode] ? mode : 'classic';
        const config = LEVELS_CONFIG[safeMode]?.[levelIndex];

        console.log(`Starting level: ${levelIndex}, Mode: ${mode} (using ${safeMode}), Config found:`, !!config);

        if (!config) {
            console.error(`Level config not found for mode: ${mode}, level: ${levelIndex}`);
            console.log('Available modes:', Object.keys(LEVELS_CONFIG));
            if (LEVELS_CONFIG[mode]) {
                console.log(`Max level for ${mode}: ${LEVELS_CONFIG[mode].length - 1}`);
            }
            return;
        }

        setLevel(levelIndex);
        setMatchedPairs(0);
        setFlippedCards([]);
        setIsProcessing(false);
        setGameStarted(false);
        setTimer(0);
        setCombo(1);
        clearInterval(timerRef.current);
        failedEmojisRef.current = new Set();
        lastMatchTimeRef.current = 0;

        // Set initial stats
        setMoves(0);
        setMovesRemaining(config.moves ?? Infinity);
        setLives(config.lives ?? Infinity);

        // Create board
        const levelCards = ALL_EMOJIS.slice(0, config.pairs);
        const deck = [...levelCards, ...levelCards];

        // Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        setCards(deck.map((emoji, index) => ({
            id: index,
            emoji,
            isFlipped: false,
            isMatched: false,
            isError: false
        })));
        console.log(`Cards generated: ${deck.length}`);

    }, [mode]);

    useEffect(() => {
        startLevel(0);
        return () => clearInterval(timerRef.current);
    }, [mode, startLevel]);

    // Timer logic
    useEffect(() => {
        if (gameStarted && !timerRef.current) {
            timerRef.current = setInterval(() => {
                setTimer(t => t + 1);
            }, 1000);
        }
        if (!gameStarted) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, [gameStarted]);

    const handleCardClick = (index) => {
        if (isProcessing || cards[index].isMatched || cards[index].isFlipped) return;

        if (!gameStarted) setGameStarted(true);

        // Flip card
        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedCards, index];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setIsProcessing(true);

            // Update moves
            setMoves(m => m + 1);
            if (mode === 'timed') {
                const newMovesLeft = movesRemaining - 1;
                setMovesRemaining(newMovesLeft);
            }

            // Snappy delay: 500ms is enough to see the second card
            setTimeout(() => checkMatch(newFlipped), 500);
        }
    };

    const checkMatch = (currentFlipped) => {
        const [idx1, idx2] = currentFlipped;
        const card1 = cards[idx1];
        const card2 = cards[idx2];
        const isMatch = card1.emoji === card2.emoji;

        if (isMatch) {
            // Combo Logic
            const now = Date.now();
            if (now - lastMatchTimeRef.current < 3000) { // 3 seconds window for combo
                setCombo(c => Math.min(c + 1, 5)); // Cap combo at 5x
            } else {
                setCombo(1);
            }
            lastMatchTimeRef.current = now;

            setCards(prev => prev.map(c =>
                (c.id === idx1 || c.id === idx2) ? { ...c, isMatched: true, isFlipped: true } : c
            ));

            setMatchedPairs(prev => {
                const newPairs = prev + 1;
                const config = LEVELS_CONFIG[mode][level];
                if (newPairs === config.pairs) {
                    clearInterval(timerRef.current);
                    // Slight delay before victory to show the last match
                    setTimeout(() => {
                        onLevelComplete({
                            level: level + 1,
                            moves: moves + 1,
                            time: timer,
                            mode
                        });
                    }, 500);
                }
                return newPairs;
            });

            failedEmojisRef.current.delete(card1.emoji);
            setIsProcessing(false);
            setFlippedCards([]);
        } else {
            // Mismatch
            // Reset combo on mismatch
            setCombo(1);

            const config = LEVELS_CONFIG[mode][level];
            let gameOverReason = null;

            if (mode === 'timed' && movesRemaining <= 1) {
                gameOverReason = 'Out of moves!';
            }

            if (mode === 'hardcore') {
                const hasFailed1 = failedEmojisRef.current.has(card1.emoji);
                const hasFailed2 = failedEmojisRef.current.has(card2.emoji);

                if (hasFailed1 || hasFailed2) {
                    const newLives = lives - 1;
                    setLives(newLives);

                    // Show error state
                    setCards(prev => prev.map(c =>
                        (c.id === idx1 || c.id === idx2) ? { ...c, isError: true } : c
                    ));

                    if (newLives <= 0) {
                        gameOverReason = 'Out of lives!';
                    }
                } else {
                    failedEmojisRef.current.add(card1.emoji);
                    failedEmojisRef.current.add(card2.emoji);
                }
            } else {
                // For non-hardcore, also show error state briefly
                setCards(prev => prev.map(c =>
                    (c.id === idx1 || c.id === idx2) ? { ...c, isError: true } : c
                ));
            }

            // Hide cards after delay
            // Snappy delay: 800ms to see the mistake
            setTimeout(() => {
                if (gameOverReason) {
                    onGameOver(gameOverReason, { level: level + 1, score });
                    return;
                }

                setCards(prev => prev.map(c =>
                    (c.id === idx1 || c.id === idx2) ? { ...c, isFlipped: false, isError: false } : c
                ));
                setFlippedCards([]);
                setIsProcessing(false);
            }, gameOverReason ? 500 : 800);
        }
    };

    const nextLevel = () => {
        if (level + 1 < LEVELS_CONFIG[mode].length) {
            startLevel(level + 1);
        } else {
            onLevelComplete({ victory: true });
        }
    };

    const retryLevel = () => {
        startLevel(level);
    };

    const calculateScore = (levelStats) => {
        const config = LEVELS_CONFIG[mode][levelStats.level - 1];
        if (!config) return 0;

        let base = config.pairs * 100;
        let movePenalty = levelStats.moves * 5;
        let timePenalty = levelStats.time * 2;
        // Add combo bonus if we were tracking it per match, but for now just base it on performance
        return Math.max(10, base - movePenalty - timePenalty);
    };

    return {
        level,
        cards,
        moves,
        movesRemaining,
        lives,
        timer,
        score,
        combo,
        handleCardClick,
        nextLevel,
        retryLevel,
        calculateScore,
        config: LEVELS_CONFIG[mode][level],
        matchedPairs
    };
};
