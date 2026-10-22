import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
    <div className="min-h-screen flex flex-col bg-[#080B14] text-[#F8FAFC]">
      {/* Sticky Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        health={health}
      />

      {/* Main Dynamic View */}
      <main className="flex-1">
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

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
