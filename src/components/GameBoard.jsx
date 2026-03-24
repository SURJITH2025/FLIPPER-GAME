import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import { cn } from '../utils/cn';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const GameBoard = ({ cards, onCardClick, gridConfig }) => {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className={cn(
                "grid gap-4 mx-auto perspective-1000 mb-8 max-w-[95vw] sm:max-w-2xl",
                // Responsive grid gap
            )}
            style={{
                gridTemplateColumns: `repeat(${gridConfig[0]}, minmax(0, 1fr))`
            }}
        >
            {cards.map((card) => (
                <motion.div key={card.id} variants={item}>
                    <Card
                        card={card}
                        onClick={onCardClick}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default GameBoard;
