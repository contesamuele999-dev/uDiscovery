import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Lock, Mail, Shield, BookOpen, Users, LogIn, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

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
      padding: '2rem 1.5rem',
      background: 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.15), transparent 70%), var(--bg-primary)'
    }}>
      <div style={{ width: '100%', maxWidth: '960px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
        
        {/* Left Side: Brand & Feature Highlights */}
        <div>
          <div className="header-brand" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
            <div className="brand-icon" style={{ width: '42px', height: '42px' }}>
              <Activity size={24} />
            </div>
            <span>ChromaLab</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: '1.25', marginBottom: '1rem' }}>
            Piattaforma di Ricerca & Monitoraggio Cromatico
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Gestione completa di studi clinici e comportamentali con tracciamento cromatico ed esercizio a 3 livelli di accesso autorizzato.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(244, 63, 94, 0.15)', padding: '0.6rem', borderRadius: '12px', color: 'var(--accent-rose)' }}>
                <Shield size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Administrator Level</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Gestione account, attivazione ruoli, impostazioni di sicurezza ed audit log.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.6rem', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                <BookOpen size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Ricercatore Level</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Creazione studi, builder questionari, matrice crolli cromatici ed export Paper IMRAD.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.6rem', borderRadius: '12px', color: 'var(--accent-teal)' }}>
                <Users size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Tester / Partecipante Level</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Compilazione schede schedulate, selettore colore/stato visivo e grafico dei progressi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card & Demo Quick Access */}
        <div className="card" style={{ padding: '2.25rem', background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', border: '1px solid var(--glass-border)' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Accedi a ChromaLab</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Inserisci le tue credenziali per accedere al tuo profilo.</p>
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
                placeholder="es. elena.rostova@chromalab.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label"><Lock size={14} style={{ display: 'inline', marginRight: '4px' }} /> Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}>
              <LogIn size={18} /> Accedi
            </button>
          </form>

          {/* Quick Demo Login Section */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🚀 Accedi Subito come Demo:
              </span>
              <Sparkles size={14} className="text-amber-400" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ justifyContent: 'space-between', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.3)' }}
                onClick={() => quickLogin(adminUser?.id || 'usr_admin')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>👨‍💼</span>
                  <span style={{ fontWeight: 600 }}>Accedi come Admin</span>
                </div>
                <span className="role-badge admin">Admin</span>
              </button>

              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ justifyContent: 'space-between', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.3)' }}
                onClick={() => quickLogin(researcherUser?.id || 'usr_res1')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>👩‍🔬</span>
                  <span style={{ fontWeight: 600 }}>Accedi come Ricercatore</span>
                </div>
                <span className="role-badge researcher">Researcher</span>
              </button>

              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ justifyContent: 'space-between', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                onClick={() => quickLogin(testerUser?.id || 'usr_test1')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
