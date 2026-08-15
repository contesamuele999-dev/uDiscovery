import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Users, ShieldAlert, BookOpen, BarChart2, FileText, CheckCircle2, History } from 'lucide-react';

export const Navigation = ({ activeTab, setActiveTab }) => {
  const { activeUser } = useApp();
  const role = activeUser?.role || 'researcher';

  if (role === 'admin') {
    return (
      <nav className="nav-bar">
        <button 
          className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} /> Gestione Utenti & Account
        </button>
        <button 
          className={`nav-tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <ShieldAlert size={18} /> Audit Log & Attività Sistema
        </button>
        <button 
          className={`nav-tab ${activeTab === 'studies_overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('studies_overview')}
        >
          <BookOpen size={18} /> Panoramica Generale Studi
        </button>
      </nav>
    );
  }

  if (role === 'researcher') {
    return (
      <nav className="nav-bar">
        <button 
          className={`nav-tab ${activeTab === 'studies' ? 'active' : ''}`}
          onClick={() => setActiveTab('studies')}
        >
          <BookOpen size={18} /> I Miei Studi Clinici
        </button>
        <button 
          className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart2 size={18} /> Matrice CROMATICA & Analisi
        </button>
        <button 
          className={`nav-tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <FileText size={18} /> Registro Note Cliniche
        </button>
      </nav>
    );
  }

  // Tester role
  return (
    <nav className="nav-bar">
      <button 
        className={`nav-tab ${activeTab === 'today' ? 'active' : ''}`}
        onClick={() => setActiveTab('today')}
      >
        <CheckCircle2 size={18} /> Questionari & Task di Oggi
      </button>
      <button 
        className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
        onClick={() => setActiveTab('history')}
      >
        <History size={18} /> Storico Progressi & Colori
      </button>
    </nav>
  );
};
