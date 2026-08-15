import React from 'react';
import { useApp } from '../context/AppContext';
import { Activity, UserCheck, Shield, RefreshCw, Sparkles } from 'lucide-react';

export const Header = () => {
  const { users, activeUser, switchRoleUser, resetAllData } = useApp();

  return (
    <header className="main-header">
      <div className="header-brand">
        <div className="brand-icon">
          <Activity size={20} />
        </div>
        <span>ChromaLab</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="role-switcher-box">
          <span className="role-label">Utente Activo:</span>
          <select 
            className="role-select" 
            value={activeUser?.id || ''} 
            onChange={(e) => switchRoleUser(e.target.value)}
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role.toUpperCase()})
              </option>
            ))}
          </select>
          <span className={`role-badge ${activeUser?.role}`}>
            {activeUser?.role}
          </span>
        </div>

        <button 
          className="btn btn-outline btn-sm" 
          onClick={() => {
            if (window.confirm('Ripristinare i dati di esempio iniziali?')) {
              resetAllData();
            }
          }}
          title="Ripristina dati demo"
        >
          <RefreshCw size={14} /> Demo Reset
        </button>
      </div>
    </header>
  );
};
