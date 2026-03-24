import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { cn } from '../utils/cn';

const Card = ({ card, onClick }) => {

    // Trigger confetti on match (once)
    useEffect(() => {
        if (card.isMatched) {
            // Get element position if possible, but simplest is random burst near center or just generic burst
            // We don't have ref to element easily without callback ref, but we can just fire generic for now
            // Or improvements: pass a ref or getBoundingClientRect

            // Small burst
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.7 }, // Bottom center-ish
                colors: ['#6366f1', '#a855f7'],
                disableForReducedMotion: true,
                startVelocity: 20,
                gravity: 2,
                scalar: 0.7
            });
        }
    }, [card.isMatched]);

    return (
        <div className="relative aspect-square perspective-1000">
            <motion.div
                className={cn(
                    "w-full h-full relative preserve-3d cursor-pointer shadow-lg rounded-xl",
                    card.isMatched && "opacity-0 transition-opacity duration-500 delay-500" // Fade out matches if desired, or keep them visible? Keeping visible is standard memory.
                    // Actually, let's keep them visible but perhaps dim or glow.
                )}
                initial={false}
                animate={{
                    rotateY: card.isFlipped ? 180 : 0,
                    scale: card.isMatched ? 1.1 : 1,
                    x: card.isError ? [0, -10, 10, -10, 10, 0] : 0, // Shake effect
                }}
                transition={{
                    rotateY: { duration: 0.3, type: "spring", stiffness: 260, damping: 20 },
                    scale: { type: "spring", stiffness: 300, damping: 15 },
                    x: { duration: 0.4 }
                }}
                onClick={() => onClick(card.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Back Face (Question Mark) - Visible when NOT flipped (rotateY: 0) */}
                <div
                    className={cn(
                        "absolute inset-0 backface-hidden rounded-xl flex items-center justify-center",
                        "bg-gradient-to-br from-indigo-900 to-slate-900 border-2 border-indigo-500/50",
                        "shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    )}
                >
                    <span className="text-4xl font-bold text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]">?</span>
                </div>

                {/* Front Face (Emoji) - Visible when FLIPPED (rotateY: 180) */}
                <div
                    className={cn(
                        "absolute inset-0 backface-hidden rounded-xl flex items-center justify-center rotate-y-180",
                        "bg-gradient-to-br from-slate-800 to-black border-2",
                        card.isError ? "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)]" : "border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]"
                    )}
                >
                    <span className="text-[clamp(2rem,5vw,3.5rem)] select-none filter drop-shadow-lg">{card.emoji}</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Card;
