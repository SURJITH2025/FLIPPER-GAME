import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import WelcomeScreen from './components/WelcomeScreen';
import ModeSelection from './components/ModeSelection';
import GameScreen from './components/GameScreen';
import { LoginModal, RegisterModal } from './components/AuthModals';
import GlobalStatsModal from './components/GlobalStatsModal';
import LeaderboardModal from './components/LeaderboardModal';
import { supabase } from './utils/supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('welcome'); // 'welcome', 'modes', 'game'
  const [gameMode, setGameMode] = useState(null);

  // Modals state
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    // Check local session
    const savedUser = localStorage.getItem('flipMatchUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('modes');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('flipMatchUser', JSON.stringify(userData));
    setView('modes');
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('flipMatchUser', JSON.stringify(userData));
    setView('modes');
  };

  const handleGuestPlay = () => {
    let guestId = localStorage.getItem('flipMatchGuestId');
    if (!guestId) {
      guestId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      localStorage.setItem('flipMatchGuestId', guestId);
    }
    const guestUser = {
      username: 'Guest_' + guestId,
      isGuest: true,
      guestId: guestId,
      createdAt: Date.now()
    };
    setUser(guestUser);
    localStorage.setItem('flipMatchUser', JSON.stringify(guestUser));
    setView('modes');
  };

  const handleLogout = () => {
    localStorage.removeItem('flipMatchUser');
    if (user?.isGuest) {
      // Keep guest ID in storage for re-use if they come back as guest
    }
    setUser(null);
    setView('welcome');
  };

  const handleSelectMode = (mode) => {
    setGameMode(mode);
    setView('game');
  };

  const handleSubmitScore = async (scoreData) => {
    if (!user) return;

    try {
      // Unconditionally insert every new score as the leaderboard now handles deduplication
      const { error: insertError } = await supabase.from('scores').insert([{
        username: user.username,
        moves: scoreData.moves,
        time: scoreData.time,
        level: scoreData.level,
        mode: scoreData.mode,
        total_score: scoreData.totalScore,
        timestamp: Date.now()
      }]);

      if (insertError) {
        console.error("Error inserting score:", insertError);
      } else {
        console.log("Score inserted successfully!");
      }
    } catch (err) {
      console.error("Score submit error", err);
    }
  };

  return (
    <Layout>
      {view === 'welcome' && (
        <WelcomeScreen
          onLogin={() => setShowLogin(true)}
          onRegister={() => setShowRegister(true)}
          onPlayGuest={handleGuestPlay}
          onViewStats={() => setShowStats(true)}
        />
      )}

      {view === 'modes' && (
        <ModeSelection
          onSelectMode={handleSelectMode}
          onBack={() => setView('welcome')} // Or logout if user wants? 'Back' usually goes to prev screen.
        // If logged in, maybe we just show logout button in header instead of back?
        // Design has a "Back" button in mode selection. If we go back, do we logout?
        // The original app: Back goes to Welcome, but if logged in, Welcome screen shows login buttons?
        // Original: `backToWelcome` hides modeSelection. 
        // If user is logged in, they stay logged in. 
        />
      )}

      {view === 'game' && (
        <GameScreen
          mode={gameMode}
          username={user?.username}
          onMenu={() => setView('modes')}
          onSubmitScore={handleSubmitScore}
        />
      )}

      {/* Global Modals for Welcome Screen */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onRegisterSuccess={handleRegisterSuccess}
      />

      <LeaderboardModal // Use LeaderboardModal instead of GlobalStatsModal
        isOpen={showStats} // We can reuse showStats state variable for simplicity, or rename it. Let's reuse for now to minimize diff.
        onClose={() => setShowStats(false)}
      />

      {/* If view is modes, show user info header? */}
      {view === 'modes' && user && (
        <div className="absolute top-0 right-0 p-4">
          <button onClick={handleLogout} className="text-neon-blue border border-neon-blue px-3 py-1 rounded-full text-sm hover:bg-glass-dark">
            Logout
          </button>
        </div>
      )}
    </Layout>
  );
}

export default App;
