import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { supabase } from '../utils/supabaseClient';

const LeaderboardModal = ({ isOpen, onClose }) => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [timeFilter, setTimeFilter] = useState('daily');
    const [modeFilter, setModeFilter] = useState('classic');

    useEffect(() => {
        if (isOpen) {
            fetchScores();
        }
    }, [isOpen, timeFilter, modeFilter]);

    const fetchScores = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('scores')
                .select('*')
                .eq('mode', modeFilter)
                .order('total_score', { ascending: false })
                .limit(1000);

            if (timeFilter === 'daily') {
                const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
                query = query.gte('timestamp', oneDayAgo);
            } else if (timeFilter === 'weekly') {
                const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                query = query.gte('timestamp', oneWeekAgo);
            }

            const { data, error } = await query;
            if (error) throw error;
            
            // Filter unique players, showing only their highest score
            const uniqueScoresMap = new Map();
            (data || []).forEach(score => {
                const existing = uniqueScoresMap.get(score.username);
                if (!existing || score.total_score > existing.total_score) {
                    uniqueScoresMap.set(score.username, score);
                }
            });

            const sortedUniqueScores = Array.from(uniqueScoresMap.values())
                .sort((a, b) => b.total_score - a.total_score);

            setScores(sortedUniqueScores);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getRankStyle = (rank) => {
        if (rank === 1) return 'text-[#FFD700] drop-shadow-[0_0_15px_#FFD700]';
        if (rank === 2) return 'text-[#C0C0C0] drop-shadow-[0_0_15px_#C0C0C0]';
        if (rank === 3) return 'text-[#CD7F32] drop-shadow-[0_0_15px_#CD7F32]';
        return 'text-neon-blue';
    };

    const getMedal = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="🏆 Leaderboard">
            <div className="flex gap-2 justify-center mb-4 flex-wrap">
                {['daily', 'weekly', 'alltime'].map(t => (
                    <button
                        key={t}
                        onClick={() => setTimeFilter(t)}
                        className={`px-4 py-2 rounded-full border-2 transition-all font-orbitron text-sm
               ${timeFilter === t
                                ? 'bg-gradient-to-br from-neon-purple to-neon-blue border-neon-purple text-white shadow-[0_0_20px_rgba(255,0,255,0.5)]'
                                : 'bg-glass-dark border-[rgba(0,255,255,0.3)] text-neon-blue hover:border-neon-blue'
                            }`}
                    >
                        {t === 'daily' ? 'Today' : t === 'weekly' ? 'Week' : 'All Time'}
                    </button>
                ))}
            </div>

            <div className="flex gap-2 justify-center mb-4 flex-wrap">
                {[
                    { id: 'classic', label: '🎯 Classic' },
                    { id: 'timed', label: '⏱️ Moves' },
                    { id: 'hardcore', label: '💀 Lives' }
                ].map(m => (
                    <button
                        key={m.id}
                        onClick={() => setModeFilter(m.id)}
                        className={`px-4 py-2 rounded-full border-2 transition-all font-orbitron text-sm
               ${modeFilter === m.id
                                ? 'bg-gradient-to-br from-neon-purple to-neon-blue border-neon-purple text-white shadow-[0_0_20px_rgba(255,0,255,0.5)]'
                                : 'bg-glass-dark border-[rgba(0,255,255,0.3)] text-neon-blue hover:border-neon-blue'
                            }`}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                {loading ? (
                    <p className="text-center text-gray-400">Loading...</p>
                ) : scores.length === 0 ? (
                    <p className="text-center text-gray-400">No scores yet!</p>
                ) : (
                    scores.map((score, index) => {
                        const rank = index + 1;
                        return (
                            <div key={index} className="flex justify-between items-center p-3 bg-[rgba(10,14,39,0.5)] border-b border-[rgba(0,255,255,0.2)] hover:bg-[rgba(0,255,255,0.1)] transition-colors rounded">
                                <span className={`w-10 font-bold text-lg ${getRankStyle(rank)}`}>
                                    {getMedal(rank)}
                                </span>
                                <span className="flex-1 font-semibold text-white truncate px-2">{score.username}</span>
                                <div className="text-neon-blue text-sm text-right">
                                    <div>{score.total_score} pts</div>
                                    <div className="text-xs opacity-70">Lvl {score.level || 1}</div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <button
                className="w-full mt-5 bg-glass-dark text-neon-blue border-2 border-neon-blue shadow-[0_0_20px_rgba(0,255,255,0.3)] py-3 rounded-full font-bold hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] transition-all"
                onClick={onClose}
            >
                Close
            </button>
        </Modal>
    );
};

export default LeaderboardModal;
