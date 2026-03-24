import React from 'react';

const WelcomeScreen = ({ onLogin, onRegister, onPlayGuest, onViewStats }) => {
    return (
        <div className="text-center text-white animate-modal-slide">
            <h2 className="text-[clamp(32px,6vw,56px)] font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue drop-shadow-[0_0_20px_rgba(0,255,255,0.5)] uppercase tracking-widest mb-4 animate-title-glow">
                🎴 Flip Match
            </h2>
            <p className="text-lg opacity-90 mb-8">Test your memory and compete globally!</p>

            <div className="flex flex-wrap gap-4 justify-center">
                <button
                    onClick={onLogin}
                    className="btn-primary bg-gradient-to-br from-neon-purple to-neon-blue border-2 border-neon-purple text-white shadow-[0_0_20px_rgba(255,0,255,0.5)] px-7 py-3.5 rounded-full font-bold transition-all hover:shadow-[0_0_40px_rgba(255,0,255,0.8)] hover:-translate-y-1"
                >
                    Login
                </button>
                <button
                    onClick={onRegister}
                    className="btn-success bg-gradient-to-br from-neon-green to-neon-blue border-2 border-neon-green text-[#0a0e27] shadow-[0_0_20px_rgba(0,255,136,0.5)] px-7 py-3.5 rounded-full font-bold transition-all hover:shadow-[0_0_40px_rgba(0,255,136,0.8)] hover:-translate-y-1"
                >
                    Create Account
                </button>
                <button
                    onClick={onPlayGuest}
                    className="btn-secondary bg-glass-dark text-neon-blue border-2 border-neon-blue shadow-[0_0_20px_rgba(0,255,255,0.3)] px-7 py-3.5 rounded-full font-bold transition-all hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] hover:-translate-y-1"
                >
                    🎮 Play as Guest
                </button>
                <button
                    onClick={onViewStats}
                    className="btn-secondary bg-glass-dark text-neon-blue border-2 border-neon-blue shadow-[0_0_20px_rgba(0,255,255,0.3)] px-7 py-3.5 rounded-full font-bold transition-all hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] hover:-translate-y-1"
                >
                    🏆 Leaderboard
                </button>
            </div>
        </div>
    );
};

export default WelcomeScreen;
