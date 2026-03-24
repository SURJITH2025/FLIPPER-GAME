import React, { useState } from 'react';
import Modal from './Modal';
import { supabase } from '../utils/supabaseClient';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Fill all fields');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single();

            if (fetchError || !data) {
                setError('User not found');
                return;
            }

            if (data.password !== password) {
                setError('Wrong password');
                return;
            }

            onLoginSuccess({
                username: data.username,
                email: data.email,
                createdAt: data.created_at,
                isGuest: false
            });
            onClose();
        } catch (err) {
            console.error(err);
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Login">
            <div className="space-y-4">
                <div>
                    <label className="block text-neon-blue font-semibold mb-2">Username</label>
                    <input
                        type="text"
                        className="w-full p-3 border-2 border-[rgba(0,255,255,0.3)] rounded-lg bg-glass-dark text-white focus:outline-none focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-neon-blue font-semibold mb-2">Password</label>
                    <input
                        type="password"
                        className="w-full p-3 border-2 border-[rgba(0,255,255,0.3)] rounded-lg bg-glass-dark text-white focus:outline-none focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <div className="text-neon-purple text-sm drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">{error}</div>}
                <button
                    className="w-full bg-gradient-to-br from-neon-purple to-neon-blue border-2 border-neon-purple text-white shadow-[0_0_20px_rgba(255,0,255,0.5)] py-3 rounded-full font-bold mt-2 hover:shadow-[0_0_40px_rgba(255,0,255,0.8)] transition-all disabled:opacity-50"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <button
                    className="w-full bg-glass-dark text-neon-blue border-2 border-neon-blue shadow-[0_0_20px_rgba(0,255,255,0.3)] py-3 rounded-full font-bold hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] transition-all"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </Modal>
    );
};

export const RegisterModal = ({ isOpen, onClose, onRegisterSuccess }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !email || !password) {
            setError('Fill all fields');
            return;
        }
        if (username.length < 3) {
            setError('Username too short');
            return;
        }
        setLoading(true);
        setError('');

        try {
            // Check existing
            const { data: existingUser } = await supabase
                .from('profiles')
                .select('username')
                .eq('username', username)
                .single();

            if (existingUser) {
                setError('Username taken');
                return;
            }

            const { error: insertError } = await supabase
                .from('profiles')
                .insert([{
                    username,
                    email,
                    password,
                    created_at: Date.now(),
                    is_guest: false
                }]);

            if (insertError) throw insertError;

            onRegisterSuccess({
                username,
                email,
                createdAt: Date.now(),
                isGuest: false
            });
            onClose();
        } catch (err) {
            console.error(err);
            setError('Registration failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Account">
            <div className="space-y-4">
                <div>
                    <label className="block text-neon-blue font-semibold mb-2">Username</label>
                    <input
                        type="text"
                        className="w-full p-3 border-2 border-[rgba(0,255,255,0.3)] rounded-lg bg-glass-dark text-white focus:outline-none focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all"
                        placeholder="Choose username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-neon-blue font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        className="w-full p-3 border-2 border-[rgba(0,255,255,0.3)] rounded-lg bg-glass-dark text-white focus:outline-none focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-neon-blue font-semibold mb-2">Password</label>
                    <input
                        type="password"
                        className="w-full p-3 border-2 border-[rgba(0,255,255,0.3)] rounded-lg bg-glass-dark text-white focus:outline-none focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all"
                        placeholder="Choose password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <div className="text-neon-purple text-sm drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">{error}</div>}
                <button
                    className="w-full bg-gradient-to-br from-neon-purple to-neon-blue border-2 border-neon-purple text-white shadow-[0_0_20px_rgba(255,0,255,0.5)] py-3 rounded-full font-bold mt-2 hover:shadow-[0_0_40px_rgba(255,0,255,0.8)] transition-all disabled:opacity-50"
                    onClick={handleRegister}
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Account'}
                </button>
                <button
                    className="w-full bg-glass-dark text-neon-blue border-2 border-neon-blue shadow-[0_0_20px_rgba(0,255,255,0.3)] py-3 rounded-full font-bold hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] transition-all"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </Modal>
    );
};
