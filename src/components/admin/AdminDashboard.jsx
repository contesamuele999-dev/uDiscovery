import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, UserPlus, Shield, Activity, BookOpen, Search } from 'lucide-react';

export const AdminDashboard = ({ activeTab }) => {
  const { users, studies, submissions, auditLogs, addUser, toggleUserStatus } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'tester',
    avatar: '👤',
    institution: '',
    condition: ''
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    addUser(formData);
    setFormData({ name: '', email: '', role: 'tester', avatar: '👤', institution: '', condition: '' });
    setShowAddModal(false);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalResearchers = users.filter(u => u.role === 'researcher').length;
  const totalTesters = users.filter(u => u.role === 'tester').length;

  if (activeTab === 'logs') {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title"><Shield className="text-rose-500" /> Audit Log & Monitoraggio Sistema</h1>
            <p className="page-subtitle">Registro cronologico completo delle attività e modifiche effettuate sulla piattaforma.</p>
          </div>
        </div>

        <div className="card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Data & Ora</th>
                  <th>Utente</th>
                  <th>Azione</th>
                  <th>Dettagli</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td>{new Date(log.timestamp).toLocaleString('it-IT')}</td>
                    <td style={{ fontWeight: 600 }}>{log.user}</td>
                    <td>
                      <span className="status-pill active">{log.action}</span>
                    </td>
                    <td>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'studies_overview') {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title"><BookOpen /> Panoramica Generale Studi</h1>
            <p className="page-subtitle">Monitoraggio di tutti gli studi clinici e comportamentali creati dai ricercatori.</p>
          </div>
        </div>

        <div className="grid-cards">
          {studies.map(st => (
            <div key={st.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="status-pill active">{st.code}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Frequenza: {st.frequency}</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{st.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Ricercatore: <strong>{st.researcherName}</strong>
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span>Tester Iscritti: {st.assignedTesters?.length || 0}</span>
                <span>Compilazioni: {submissions.filter(sub => sub.studyId === st.id).length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title"><Users /> Gestione Utenti & Account</h1>
          <p className="page-subtitle">Gestisci gli accessi dei ricercatori e dei tester partecipanti agli studi.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <UserPlus size={18} /> Nuovo Utente
        </button>
      </div>

      <div className="grid-stats">
        <div className="card stat-card">
          <div className="stat-icon">
            <Users />
          </div>
          <div>
            <div className="stat-value">{users.length}</div>
            <div className="stat-title">Utenti Registrati</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon purple">
            <Activity />
          </div>
          <div>
            <div className="stat-value">{totalResearchers}</div>
            <div className="stat-title">Ricercatori</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon teal">
            <UserPlus />
          </div>
          <div>
            <div className="stat-value">{totalTesters}</div>
            <div className="stat-title">Tester</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon amber">
            <BookOpen />
          </div>
          <div>
            <div className="stat-value">{studies.length}</div>
            <div className="stat-title">Studi Attivi</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Elenco Account Registrati</h3>
          <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Cerca utente..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Utente</th>
                <th>Ruolo</th>
                <th>Dettagli / Gruppo</th>
                <th>Data Iscrizione</th>
                <th>Stato Account</th>
                <th style={{ textAlign: 'right' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{u.avatar || '👤'}</span>
                      <div>
                        <div style={{ fontWeight: 700 }}>{u.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td>{u.institution || u.condition || '-'}</td>
                  <td>{u.dateAdded}</td>
                  <td>
                    <span className={`status-pill ${u.status === 'attivo' ? 'active' : 'pending'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className={`btn btn-sm ${u.status === 'attivo' ? 'btn-danger' : 'btn-secondary'}`}
                      onClick={() => toggleUserStatus(u.id)}
                    >
                      {u.status === 'attivo' ? 'Sospendi' : 'Riattiva'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2 className="modal-title">Crea Nuovo Account Utente</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nome Completo</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="es. Dr. Marco Rossi" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email di Accesso</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="es. marco.rossi@udiscovery.org" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Livello di Account / Ruolo</label>
                  <select 
                    className="form-select"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="tester">Tester (Partecipante allo studio)</option>
                    <option value="researcher">Ricercatore (Crea studi & analizza dati)</option>
                    <option value="admin">Administrator (Gestore piattaforma)</option>
                  </select>
                </div>

                {formData.role === 'researcher' ? (
                  <div className="form-group">
                    <label className="form-label">Istituto di Ricerca / Università</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="es. Dipartimento di Psicologia Visiva" 
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    />
                  </div>
                ) : formData.role === 'tester' ? (
                  <div className="form-group">
                    <label className="form-label">Gruppo Sperimentale / Note Condizione</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="es. Gruppo A - Controllo Visivo" 
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    />
                  </div>
                ) : null}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Annulla</button>
                <button type="submit" className="btn btn-primary">Crea Utente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
