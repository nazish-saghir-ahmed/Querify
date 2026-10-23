import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FixedHeroBackground from './components/FixedHeroBackground';
import CursorTrail from './components/CursorTrail';
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
        status: 'DEGRADED',
        databaseConnected: false,
        aiMode: 'demo',
      });
    }
  };

  const handleSelectQuestion = (qText) => {
    setInitialQuestion(qText);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#06080D] text-[#F8FAFC] selection:bg-[#00F5A0]/20 selection:text-[#00F5A0]">
      {/* 1. Ultra-HD Stationary AI + Database Background Layer */}
      <FixedHeroBackground />

      {/* 2. Fluid Electric Mint Glowing Cursor Trail (Canvas-based) */}
      <CursorTrail />

      {/* 3. Sticky Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        health={health}
      />

      {/* 4. Foreground Scrolling View Container */}
      <main className="flex-1 relative z-10 pb-12">
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
    </div>
  );
}
