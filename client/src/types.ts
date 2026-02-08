export type GameMode = 'classic' | 'time_limit' | 'lives';

export interface Card {
    id: string;
    symbol: string; // Emoji or image URL
    isFlipped: boolean;
    isMatched: boolean;
}

export interface Player {
    id: string;
    username: string;
    isGuest: boolean;
}

export interface GameState {
    cards: Card[];
    flippedIndices: number[];
    matchedPairs: number[];
    moves: number;
    score: number;
    level: number;
    lives: number; // For Lives mode
    maxLives: number;
    maxMoves: number; // For Move Limit mode
    gameStatus: 'idle' | 'playing' | 'won' | 'lost';
    mode: GameMode;
}

export interface LevelConfig {
    level: number;
    gridCols: number;
    gridRows: number;
    pairCount: number;
    timeLimit?: number; // seconds
    moveLimit?: number;
    lives?: number;
}
