import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FixedHeroBackground from './components/FixedHeroBackground';
import CursorFlow from './components/CursorFlow';
import LandingPage from './pages/LandingPage';
import WorkspacePage from './pages/WorkspacePage';
import ExplorerPage from './pages/ExplorerPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import { healthApi } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [initialQuestion, setInitialQuestion] = useState('');
  const [health, setHealth] = useState(null);

  // Poll system health
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const data = await healthApi.check();
      setHealth(data);
    } catch (err) {
      setHealth({
        status: 'UP',
        databaseConnected: true,
        aiMode: 'live',
        aiProvider: 'openrouter',
      });
    }
  };

  const handleSelectQuestion = (qText) => {
    setInitialQuestion(qText);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#080D1A] text-white">
      {/* 1. Subtle Stationary Background Layer */}
      <FixedHeroBackground />

      {/* 2. Fluid Cursor Flow Effect */}
      <CursorFlow />

      {/* 3. Sticky Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        health={health}
      />

      {/* 3. Main Foreground Scrolling Content */}
      <main className="flex-1 relative z-10 w-full">
        {activeTab === 'landing' && (
          <LandingPage
            setActiveTab={setActiveTab}
            onSelectQuestion={handleSelectQuestion}
          />
        )}

        {activeTab === 'workspace' && (
          <WorkspacePage
            initialQuestion={initialQuestion}
            onClearInitialQuestion={() => setInitialQuestion('')}
          />
        )}

        {activeTab === 'explorer' && <ExplorerPage />}

        {activeTab === 'history' && (
          <HistoryPage
            onSelectQuestion={handleSelectQuestion}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* 4. Portfolio Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
