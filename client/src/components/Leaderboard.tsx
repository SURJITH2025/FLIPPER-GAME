import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Trophy, Medal, User as UserIcon } from 'lucide-react';
import { clsx } from 'clsx';
import type { GameMode } from '../types';

interface ScoreEntry {
    id: string;
    username: string;
    score: number;
    mode: GameMode;
    created_at: string;
    profiles?: {
        username: string;
    }
}

const Leaderboard: React.FC<{ initialMode?: GameMode }> = ({ initialMode = 'classic' }) => {
    const [currentMode, setCurrentMode] = useState<GameMode>(initialMode);
    const [scores, setScores] = useState<ScoreEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchScores();
    }, [currentMode]);

    const fetchScores = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('scores')
                .select(`
                    *,
                    profiles (username)
                `)
                .eq('mode', currentMode)
                .order('score', { ascending: false })
                .limit(1000); // Fetch more to allow for filtering duplicates

            if (error) {
                // Mock data if table doesn't exist or error
                console.warn("Error fetching scores, using mock data:", error.message);
                setScores(getMockScores(currentMode));
            } else {
                // Filter to keep only the highest score per user
                const uniqueScoresMap = new Map<string, ScoreEntry>();

                (data || []).forEach((score: any) => {
                    const username = score.profiles?.username || score.username;
                    // Since we ordered by score DESC, the first time we see a user, it's their highest score
                    if (username && !uniqueScoresMap.has(username)) {
                        uniqueScoresMap.set(username, score);
                    }
                });

                const uniqueScores = Array.from(uniqueScoresMap.values());
                setScores(uniqueScores);
            }
        } catch (e) {
            setScores(getMockScores(currentMode));
        } finally {
            setLoading(false);
        }
    };

    const getMockScores = (m: GameMode): ScoreEntry[] => {
        return Array.from({ length: 10 }).map((_, i) => ({
            id: `mock-${i}`,
            username: `Player_${Math.floor(Math.random() * 1000)}`,
            score: Math.floor(10000 / (i + 1)),
            mode: m,
            created_at: new Date().toISOString()
        }));
    };

    return (
        <div className="bg-dark-bg/80 backdrop-blur-md rounded-2xl border border-white/10 p-4 md:p-6 w-full max-w-2xl mx-auto shadow-2xl">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
                <Trophy className="text-neon-blue" size={24} />
                <h3 className="text-xl md:text-2xl font-orbitron font-bold text-white">GLOBAL_RANKINGS</h3>
            </div>

            <div className="flex gap-2 mb-4 md:mb-6 bg-black/40 p-1 rounded-lg overflow-x-auto">
                {(['classic', 'time_limit', 'lives'] as GameMode[]).map((m) => (
                    <button
                        key={m}
                        onClick={() => setCurrentMode(m)}
                        className={clsx(
                            "flex-1 py-1.5 px-2 md:py-2 md:px-3 rounded-md text-xs md:text-sm font-bold transition-all uppercase whitespace-nowrap",
                            currentMode === m ? "bg-neon-blue text-black shadow-[0_0_10px_rgba(0,243,255,0.5)]" : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {m === 'time_limit' ? 'MOVE LIMIT' : m}
                    </button>
                ))}
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                {loading ? (
                    <div className="text-center text-gray-500 py-10">SYNCING_DATABASE...</div>
                ) : (
                    scores.map((entry, index) => (
                        <div
                            key={entry.id}
                            className={clsx(
                                "flex items-center justify-between p-2 md:p-3 rounded-lg border border-white/5 transition-colors",
                                {
                                    'bg-yellow-500/10 border-yellow-500/50': index === 0,
                                    'bg-gray-400/10 border-gray-400/50': index === 1,
                                    'bg-orange-700/10 border-orange-700/50': index === 2,
                                    'bg-white/5 hover:bg-white/10': index > 2
                                }
                            )}
                        >
                            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                <div className={clsx(
                                    "w-6 h-6 md:w-8 md:h-8 flex shrink-0 items-center justify-center font-bold rounded-full text-sm md:text-base",
                                    {
                                        'text-yellow-500': index === 0,
                                        'text-gray-400': index === 1,
                                        'text-orange-500': index === 2,
                                        'text-gray-600': index > 2
                                    }
                                )}>
                                    {index < 3 ? <Medal size={20} className="w-5 h-5 md:w-6 md:h-6" /> : <span>#{index + 1}</span>}
                                </div>
                                <div className="flex items-center gap-2 truncate">
                                    <UserIcon size={16} className="text-gray-500 shrink-0" />
                                    <span className="text-white font-mono text-sm md:text-base truncate max-w-[100px] md:max-w-xs">
                                        {entry.profiles?.username || entry.username || 'Unknown_Operative'}
                                    </span>
                                </div>
                            </div>
                            <span className="text-neon-blue font-bold font-orbitron text-sm md:text-base shrink-0 ml-2">{entry.score.toLocaleString()}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
