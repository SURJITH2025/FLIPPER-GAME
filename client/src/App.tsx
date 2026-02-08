import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import ModeSelection from './components/ModeSelection';
import GameBoard from './components/GameBoard';
import HUD from './components/HUD';
import AuthScreen from './components/AuthScreen';
import GameOverScreen from './components/GameOverScreen';
import UsernameSetup from './components/UsernameSetup';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabase';

const GameContainer: React.FC = () => {
  const { gameStatus } = useGame();
  const { user, loading } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      checkProfile();
    } else {
      setHasProfile(null);
    }
  }, [user]);

  const checkProfile = async () => {
    if (!user) return;
    setCheckingProfile(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error checking profile:", error);
      }

      setHasProfile(!!data);
    } catch (error) {
      console.error("Profile check failed:", error);
      setHasProfile(false);
    } finally {
      setCheckingProfile(false);
    }
  };

  if (loading || checkingProfile) return <div className="text-white text-center mt-20 font-orbitron">LOADING SYSTEM...</div>;

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-4">
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-md"
        >
          <AuthScreen />
        </motion.div>
      </div>
    );
  }

  // If user is logged in but has no profile, show setup
  if (hasProfile === false) {
    return <UsernameSetup onComplete={() => setHasProfile(true)} />;
  }

  return (
    <div className="w-full min-h-screen flex flex-col relative overflow-hidden">
      {/* Background elements if needed */}
      <div className="flex-1 flex flex-col items-center justify-center w-full p-4 relative z-10">
        {gameStatus !== 'idle' && <HUD />}
        <GameOverScreen />

        <AnimatePresence mode="wait">
          {gameStatus === 'idle' ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full h-full flex flex-col items-center justify-center"
            >
              <ModeSelection />
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full h-full flex flex-col items-center justify-center py-4"
            >
              <GameBoard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <GameProvider>
        <Layout>
          <GameContainer />
        </Layout>
      </GameProvider>
    </AuthProvider>
  );
};

export default App;
