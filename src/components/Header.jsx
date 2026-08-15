import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, Users } from 'lucide-react';

export const Header = () => {
  const { users, activeUser, switchRoleUser, logout } = useApp();
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  return (
    <header className="main-header">
      <div className="header-brand">
        <div className="brand-icon">
          <img src="./favicon.svg" alt="uDiscovery Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
        </div>
        <span>uDiscovery</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className="header-user-badge">
          <span style={{ fontSize: '1.1rem' }}>{activeUser?.avatar || '👤'}</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="header-user-name" style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.1 }}>{activeUser?.name}</span>
            <span className="header-user-email" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{activeUser?.email}</span>
          </div>
          <span className={`role-badge ${activeUser?.role}`}>
            {activeUser?.role}
          </span>
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => setShowSwitchModal(true)}
          title="Cambia Utente / Ruolo"
          style={{ padding: '0.4rem 0.6rem' }}
        >
          <Users size={14} /> <span className="btn-text-desktop">Ruolo</span>
        </button>

        <button 
          className="btn btn-danger btn-sm"
          onClick={logout}
          title="Disconnetti dal sistema"
          style={{ padding: '0.4rem 0.6rem' }}
        >
          <LogOut size={14} /> <span className="btn-text-desktop">Esci</span>
        </button>
      </div>

      {showSwitchModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Cambia Utente di Test</h2>
              <button className="modal-close" onClick={() => setShowSwitchModal(false)}>×</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Seleziona un account per passare istantaneamente al rispettivo ruolo:
              </p>
              {users.map(u => (
                <div 
                  key={u.id}
                  onClick={() => {
                    switchRoleUser(u.id);
                    setShowSwitchModal(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: `1px solid ${u.id === activeUser?.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    background: u.id === activeUser?.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-input)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{u.avatar || '👤'}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>
                  </div>
                  <span className={`role-badge ${u.role}`}>{u.role}</span>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowSwitchModal(false)}>Chiudi</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
