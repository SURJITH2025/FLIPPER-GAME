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

        return (
            <div
                className="grid gap-2 md:gap-4 place-items-center mx-auto w-full max-w-[90vw] md:max-w-4xl"
                style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
                }}
            >
                {cards.map((card) => (
                    <div key={card.id} className="w-full aspect-square">
                        <Card card={card} onClick={flipCard} />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full h-full flex justify-center items-center p-2 md:p-4 overflow-y-auto">
            {renderGrid()}
        </div>
    );
};

export default GameBoard;
