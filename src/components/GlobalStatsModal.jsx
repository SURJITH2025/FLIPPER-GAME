import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { supabase } from '../utils/supabaseClient';

const StatCard = ({ value, label }) => (
    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-[rgba(0,255,255,0.3)] shadow-[0_0_20px_rgba(0,255,255,0.2)] p-5 rounded-xl text-center">
        <div className="text-neon-blue text-3xl font-bold mb-1 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">{value}</div>
        <div className="text-sm opacity-90 text-white">{label}</div>
    </div>
);

const GlobalStatsModal = ({ isOpen, onClose }) => {
    const [stats, setStats] = useState({ online: 0, totalPlayers: 0, gamesPlayed: 0 });

    useEffect(() => {
        if (isOpen) {
            updateStats();
        }
    }, [isOpen]);

    const updateStats = async () => {
        try {
            const { count: usersCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            const { count: gamesCount } = await supabase
                .from('scores')
                .select('*', { count: 'exact', head: true });

            setStats({
                online: Math.floor(Math.random() * 5) + 1, // Mock as per original
                totalPlayers: usersCount || 0,
                gamesPlayed: gamesCount || 0
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="📊 Global Stats">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard value={stats.online} label="Online Now" />
                <StatCard value={stats.totalPlayers} label="Total Players" />
                <StatCard value={stats.gamesPlayed} label="Games Played" />
            </div>
            <button
                className="w-full mt-6 bg-glass-dark text-neon-blue border-2 border-neon-blue shadow-[0_0_20px_rgba(0,255,255,0.3)] py-3 rounded-full font-bold hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] transition-all"
                onClick={onClose}
            >
                Close
            </button>
        </Modal>
    );
};

export default GlobalStatsModal;
