import React from 'react';
import { useGame } from '../context/GameContext';
import Card from './Card';

const GameBoard: React.FC = () => {
    const { cards, flipCard, level } = useGame();

    // Determine config based on level
    const renderGrid = () => {
        let cols = 4;
        if (level === 1) cols = 3;
        else if (level === 2) cols = 4;
        else if (level >= 3 && level < 7) cols = 5;
        else cols = 6;

        // Adjust for mobile vs desktop if needed, but grid-cols is robust
        // We'll use inline styles for strict column count
        return (
            <div
                className="grid gap-4 place-items-center mx-auto"
                style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    width: 'fit-content'
                }}
            >
                {cards.map((card) => (
                    <div key={card.id} className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
                        <Card card={card} onClick={flipCard} />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full flex justify-center items-center">
            {renderGrid()}
        </div>
    );
};

export default GameBoard;
