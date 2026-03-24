import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const Modal = ({ isOpen, onClose, title, children }) => {
    // We expect the parent to handle AnimatePresence if they want exit animations on unmount
    // But since `isOpen` is passed, we can handle it internally here if we wrap the content.
    // However, if the component unmounts (e.g. conditional rendering in parent), internal AnimatePresence won't work unless parent has it.
    // GameScreen uses AnimatePresence, so we just need motion.divs here.

    // actually, GameScreen conditionally renders the Modal COMPONENT.
    // So `isOpen` might always be true when mounted.
    // However, App.jsx renders it unconditionally, so we MUST check isOpen here.
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className={cn(
                    "relative w-full max-w-lg p-8 overflow-hidden",
                    "bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl",
                    "before:absolute before:inset-0 before:bg-gradient-to-br before:from-indigo-500/10 before:to-purple-500/10 before:pointer-events-none"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 drop-shadow-sm">
                        {title}
                    </h2>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {children}
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                >
                    ✕
                </button>
            </motion.div>
        </motion.div>
    );
};

export default Modal;
