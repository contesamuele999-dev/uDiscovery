import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, Shield, BookOpen, Users, LogIn, Sparkles } from 'lucide-react';

export const LoginView = () => {
  const { login, quickLogin, users } = useApp();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Per favore inserisci sia l\'email che la password.');
      return;
    }

    const res = login(email, password);
    if (!res.success) {
      setErrorMsg(res.error);
    }
  };

  const adminUser = users.find(u => u.role === 'admin');
  const researcherUser = users.find(u => u.role === 'researcher');
  const testerUser = users.find(u => u.role === 'tester');

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem 1rem',
      background: 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.15), transparent 70%), var(--bg-primary)'
    }}>
      <div style={{ width: '100%', maxWidth: '960px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '2rem', alignItems: 'center' }}>
        
        {/* Left Side: Brand & Feature Highlights */}
        <div>
          <div className="header-brand" style={{ fontSize: '1.6rem', marginBottom: '0.85rem' }}>
            <div className="brand-icon" style={{ width: '42px', height: '42px', padding: '0' }}>
              <img src="./favicon.svg" alt="uDiscovery Logo" style={{ width: '42px', height: '42px', borderRadius: '10px' }} />
            </div>
            <span>uDiscovery</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, lineHeight: '1.25', marginBottom: '0.85rem' }}>
            Piattaforma di Ricerca & Monitoraggio Cromatico
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
            Gestione completa di studi clinici e comportamentali con tracciamento cromatico ed esercizio a 3 livelli di accesso autorizzato.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(244, 63, 94, 0.15)', padding: '0.55rem', borderRadius: '10px', color: 'var(--accent-rose)', flexShrink: 0 }}>
                <Shield size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Administrator Level</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gestione account, attivazione ruoli, impostazioni di sicurezza ed audit log.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.55rem', borderRadius: '10px', color: 'var(--accent-primary)', flexShrink: 0 }}>
                <BookOpen size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Ricercatore Level</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Creazione studi, builder questionari, matrice crolli cromatici ed export Paper IMRAD.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.55rem', borderRadius: '10px', color: 'var(--accent-teal)', flexShrink: 0 }}>
                <Users size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Tester / Partecipante Level</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Compilazione schede schedulate, selettore colore/stato visivo e grafico dei progressi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card & Demo Quick Access */}
        <div className="card" style={{ padding: '1.75rem', background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', border: '1px solid var(--glass-border)' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Accedi a uDiscovery</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Inserisci le tue credenziali per accedere al tuo profilo.</p>
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label className="form-label"><Mail size={14} style={{ display: 'inline', marginRight: '4px' }} /> Email di Registrazione</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="es. elena.rostova@udiscovery.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label"><Lock size={14} style={{ display: 'inline', marginRight: '4px' }} /> Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}>
              <LogIn size={18} /> Accedi
            </button>
          </form>

          {/* Quick Demo Login Section */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🚀 Accedi Subito come Demo:
              </span>
              <Sparkles size={14} className="text-amber-400" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ justifyContent: 'space-between', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '0.6rem 0.85rem' }}
                onClick={() => quickLogin(adminUser?.id || 'usr_admin')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <span>👨‍💼</span>
                  <span style={{ fontWeight: 600 }}>Accedi come Admin</span>
                </div>
                <span className="role-badge admin">Admin</span>
              </button>

              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ justifyContent: 'space-between', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '0.6rem 0.85rem' }}
                onClick={() => quickLogin(researcherUser?.id || 'usr_res1')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <span>👩‍🔬</span>
                  <span style={{ fontWeight: 600 }}>Accedi come Ricercatore</span>
                </div>
                <span className="role-badge researcher">Researcher</span>
              </button>

              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ justifyContent: 'space-between', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.6rem 0.85rem' }}
                onClick={() => quickLogin(testerUser?.id || 'usr_test1')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <span>👩</span>
                  <span style={{ fontWeight: 600 }}>Accedi come Tester</span>
                </div>
                <span className="role-badge tester">Tester</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
