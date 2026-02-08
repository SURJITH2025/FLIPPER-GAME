import React from 'react';
import { motion } from 'framer-motion';
import type { Card as CardType } from '../types';

interface CardProps {
    card: CardType;
    onClick: (id: string) => void;
}

const Card: React.FC<CardProps> = ({ card, onClick }) => {
    return (
        <div
            className="relative w-full aspect-square cursor-pointer"
            style={{ perspective: '1000px' }}
            onClick={() => onClick(card.id)}
        >
            <motion.div
                className="w-full h-full relative"
                animate={{ rotateY: card.isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front (Symbol) - Rotated 180deg */}
                <div
                    className="absolute w-full h-full rounded-xl shadow-lg border-2 border-neon-blue/50
                     bg-gradient-to-br from-neon-blue/20 to-neon-purple/20
                     flex items-center justify-center text-4xl select-none"
                    style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                    }}
                >
                    <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
                        {card.symbol}
                    </span>
                </div>

                {/* Back (Cover) - Visible initially (0deg) */}
                <div
                    className="absolute w-full h-full rounded-xl shadow-lg border-2 border-white/10
                     bg-dark-bg
                     flex items-center justify-center group hover:border-neon-pink/50 transition-colors"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                    }}
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-pink to-neon-purple opacity-50 blur-sm group-hover:opacity-80 transition-opacity" />
                </div>
            </motion.div>
        </div>
    );
};

export default Card;
