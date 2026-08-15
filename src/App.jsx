import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ResearcherDashboard } from './components/researcher/ResearcherDashboard';
import { TesterPortal } from './components/tester/TesterPortal';
import './styles/main.css';

const AppContent = () => {
  const { activeUser } = useApp();
  const role = activeUser?.role || 'researcher';

  // Active sub-tab state
  const [activeTab, setActiveTab] = useState(() => {
    if (role === 'admin') return 'users';
    if (role === 'researcher') return 'studies';
    return 'today';
  });

  // Reset active tab when role changes
  useEffect(() => {
    if (role === 'admin') setActiveTab('users');
    else if (role === 'researcher') setActiveTab('studies');
    else setActiveTab('today');
  }, [role]);

  return (
    <div className="app-container">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        {role === 'admin' && <AdminDashboard activeTab={activeTab} />}
        {role === 'researcher' && <ResearcherDashboard activeTab={activeTab} />}
        {role === 'tester' && <TesterPortal activeTab={activeTab} />}
      </main>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
