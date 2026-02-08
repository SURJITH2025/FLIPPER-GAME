import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const UsernameSetup: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const { user } = useAuth();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !username.trim()) return;

        setLoading(true);
        setError(null);

        try {
            // Skip profile creation for guest users (local mock IDs)
            if (user.id.startsWith('guest-')) {
                onComplete();
                return;
            }

            const { error: insertError } = await supabase
                .from('profiles')
                .insert([{ id: user.id, username: username.trim() }]);

            if (insertError) {
                if (insertError.code === '23505') { // Unique violation
                    throw new Error('Username already taken');
                }
                throw insertError;
            }

            onComplete();
        } catch (err: any) {
            console.error("Profile creation error:", err);
            setError(err.message || "Failed to create profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-dark-bg border border-neon-blue/30 p-8 rounded-2xl max-w-md w-full shadow-[0_0_30px_rgba(0,243,255,0.2)]"
            >
                <div className="flex justify-center mb-6 text-neon-blue">
                    <User size={48} />
                </div>

                <h2 className="text-2xl font-orbitron font-bold text-white text-center mb-2">INITIALIZE IDENTITY</h2>
                <p className="text-gray-400 text-center mb-8">Establish your designation for the global network.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="ENTER_CODENAME"
                            maxLength={15}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue transition-colors font-mono text-center uppercase tracking-widest"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs text-center font-mono">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !username.trim()}
                        className="w-full py-3 px-4 rounded-xl bg-neon-blue/20 border border-neon-blue/50 text-neon-blue font-bold hover:bg-neon-blue/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'PROCESSING...' : 'CONFIRM IDENTITY'}
                    </button>

                    <p className="text-xs text-gray-600 text-center mt-4">
                        * This will be your display name on public leaderboards.
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default UsernameSetup;
