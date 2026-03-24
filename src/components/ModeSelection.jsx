import React from 'react';

const ModeCard = ({ icon, title, description, details, onClick }) => (
    <div
        onClick={onClick}
        className="bg-gradient-to-br from-[#0f3460] to-[#16213e] border-2 border-[rgba(0,255,255,0.3)] shadow-[0_0_30px_rgba(0,255,255,0.2)] rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,255,255,0.5)] hover:border-neon-blue hover:-translate-y-2 flex flex-col items-center text-center"
    >
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-neon-blue text-2xl font-bold mb-3 drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]">{title}</h3>
        <p className="text-white text-base leading-relaxed mb-5 min-h-[60px] opacity-90">{description}</p>
        <div className="w-full pt-4 border-t-2 border-[rgba(0,255,255,0.2)] flex flex-col gap-2">
            {details.map((item, i) => (
                <span key={i} className="text-neon-blue text-sm flex items-center justify-center gap-2">
                    {item}
                </span>
            ))}
        </div>
    </div>
);

const ModeSelection = ({ onSelectMode, onBack }) => {
    return (
        <div className="w-full max-w-6xl mx-auto animate-modal-slide">
            <h2 className="text-neon-blue text-center text-4xl mb-8 drop-shadow-[0_0_30px_rgba(0,255,255,0.8)] font-bold">
                Choose Your Challenge
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <ModeCard
                    icon="🎯"
                    title="Classic Mode"
                    description="No pressure! Take your time and find all pairs. Perfect for relaxing."
                    details={["✓ Unlimited moves", "✓ No lives system", "✓ Pure memory test", "✓ 8 levels"]}
                    onClick={() => onSelectMode('classic')}
                />
                <ModeCard
                    icon="⏱️"
                    title="Move Limit Mode"
                    description="Beat each level within the move limit! Strategic thinking required."
                    details={["📊 Limited moves", "📈 Harder each level", "🎯 Efficiency bonus", "✓ 8 levels"]}
                    onClick={() => onSelectMode('timed')}
                />
                <ModeCard
                    icon="💀"
                    title="Lives Mode"
                    description="First mismatch is free! Fail the SAME emoji twice and lose a life!"
                    details={["❤️ 5→1 lives (decreasing)", "💔 2nd fail = -1 life", "🔥 Master challenge", "✓ 8 levels"]}
                    onClick={() => onSelectMode('hardcore')}
                />
            </div>

            <div className="flex justify-center">
                <button
                    onClick={onBack}
                    className="bg-glass-dark text-neon-blue border-2 border-neon-blue shadow-[0_0_20px_rgba(0,255,255,0.3)] px-7 py-3 rounded-full font-bold text-base transition-all hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] hover:-translate-y-1"
                >
                    ← Back
                </button>
            </div>
        </div>
    );
};

export default ModeSelection;
