import type { Card, LevelConfig } from '../types';

const EMOJI_POOL = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', 'nc', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', 'base',
    '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋',
    '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🕸', '🦂', '🐢', '🐍',
    '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠'
];

export const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const generateDeck = (pairCount: number): Card[] => {
    const symbols = shuffleArray(EMOJI_POOL).slice(0, pairCount);
    const deck: Card[] = [];

    symbols.forEach((symbol, index) => {
        // Create pair
        deck.push({
            id: `card-${index}-a`,
            symbol,
            isFlipped: false,
            isMatched: false,
        });
        deck.push({
            id: `card-${index}-b`,
            symbol,
            isFlipped: false,
            isMatched: false,
        });
    });

    return shuffleArray(deck);
};

export const getLevelConfig = (level: number, mode: 'classic' | 'time_limit' | 'lives'): LevelConfig => {
    // Base configuration scaling
    // Level 1: 4 pairs (8 cards) -> 2x4 or 4x2
    // Level 8: 24 pairs (48 cards) -> 6x8 or 8x6

    // const basePairs = 4 + (level - 1) * 2; 
    // Wait, requirement says L1=12 cards (6 pairs) to L8=48 cards (24 pairs).
    // Let's adjust logic to match requirement: L1 -> 6 pairs. L8 -> 24 pairs.
    // Linear interpolation: 6 + (level-1) * (18/7) roughly 2.5 per level?
    // Let's use specific map for cleaner grids.



    // Wait, 8x9 = 72? L8 is 48 cards. 6x8 = 48.

    const gridConfigs = [
        { cols: 3, rows: 4, pairs: 6 },   // 12 cards
        { cols: 4, rows: 4, pairs: 8 },   // 16 cards
        { cols: 5, rows: 4, pairs: 10 },  // 20 cards
        { cols: 6, rows: 4, pairs: 12 },  // 24 cards
        { cols: 6, rows: 5, pairs: 15 },  // 30 cards
        { cols: 6, rows: 6, pairs: 18 },  // 36 cards
        { cols: 7, rows: 6, pairs: 21 },  // 42 cards
        { cols: 8, rows: 6, pairs: 24 },  // 48 cards
    ];

    const config = gridConfigs[level - 1] || gridConfigs[7];

    let moveLimit;
    let lives;

    if (mode === 'classic') {
        moveLimit = undefined;
        lives = undefined;
    } else if (mode === 'time_limit') {
        // "Move Limit Mode" - Finite moves per level.
        // Heuristic: Min moves = pairs * 2. Give slightly more buffer that decreases.
        // Buffer: L1: +10, L8: +5?
        const minMoves = config.pairs * 2;
        moveLimit = Math.floor(minMoves * (1.5 - (level * 0.05))); // L1: 1.45x, L8: 1.1x
    } else if (mode === 'lives') {
        // Lives decrease by level (5 -> 1)
        // Map: 1->5, 2->4?, 3->4, 4->3, ...
        // Requirement: Lives decrease (5 -> 1). Linear.
        // 8 levels. 5, 5, 4, 4, 3, 3, 2, 1? 
        // Or 5, 4.4, ...
        const livesMap = [5, 5, 4, 4, 3, 3, 2, 1];
        lives = livesMap[level - 1];
    }

    return {
        level,
        gridCols: config.cols,
        gridRows: config.rows,
        pairCount: config.pairs,
        moveLimit,
        lives,
    };
};
