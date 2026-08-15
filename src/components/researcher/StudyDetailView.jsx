import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScientificPaperView } from '../common/ScientificPaperView';
import { ArrowLeft, Users, BarChart2, FileText, FileSpreadsheet, PlusCircle, Palette, Activity } from 'lucide-react';

export const StudyDetailView = ({ study, onBack }) => {
  const { users, submissions, notes, assignTesterToStudy, removeTesterFromStudy, addResearcherNote } = useApp();
  const [activeTab, setActiveTab] = useState('analytics'); // overview, analytics, notes, paper
  
  const availableTesters = users.filter(u => u.role === 'tester');
  const enrolledTesterIds = study.assignedTesters || [];
  const enrolledTesters = availableTesters.filter(t => enrolledTesterIds.includes(t.id));
  const unenrolledTesters = availableTesters.filter(t => !enrolledTesterIds.includes(t.id));

  const studySubmissions = submissions.filter(s => s.studyId === study.id);
  const studyNotes = notes.filter(n => n.studyId === study.id);

  // New Note state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState({
    testerId: enrolledTesters[0]?.id || '',
    text: '',
    category: 'Osservazione Clinica'
  });

  const handleCreateNote = (e) => {
    e.preventDefault();
    if (!newNote.text) return;
    const tester = users.find(u => u.id === newNote.testerId);
    addResearcherNote({
      studyId: study.id,
      testerId: newNote.testerId,
      testerName: tester?.name || 'Tester',
      text: newNote.text,
      category: newNote.category
    });
    setNewNote({ testerId: enrolledTesters[0]?.id || '', text: '', category: 'Osservazione Clinica' });
    setShowNoteModal(false);
  };

  if (activeTab === 'paper') {
    return <ScientificPaperView study={study} onBack={() => setActiveTab('overview')} />;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          <ArrowLeft size={16} /> Torna a Tutti gli Studi
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="status-pill active">{study.code}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Frequenza: {study.frequency}</span>
        </div>
      </div>

      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 className="page-title">{study.title}</h1>
          <p className="page-subtitle">Responsabile Studio: {study.researcherName} • Categoria: {study.category}</p>
        </div>

        <button className="btn btn-primary" onClick={() => setActiveTab('paper')}>
          <FileSpreadsheet size={18} /> Genera Paper Scientifico
        </button>
      </div>

      {/* Detail Navigation Tabs */}
      <div className="tabs-container">
        <button 
          className={`tab-pill ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Users size={16} /> Reclutamento ({enrolledTesters.length})
        </button>

        <button 
          className={`tab-pill ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart2 size={16} /> Matrice CROMATICA
        </button>

        <button 
          className={`tab-pill ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <FileText size={16} /> Note Cliniche ({studyNotes.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & TESTER ENROLLMENT */}
      {activeTab === 'overview' && (
        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Soggetti Tester Attualmente Iscritti</h3>
            {enrolledTesters.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nessun tester assegnato a questo studio.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {enrolledTesters.map(t => {
                  const subCount = studySubmissions.filter(s => s.testerId === t.id).length;
                  return (
                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border-color)', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                        <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{t.avatar || '👤'}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subCount} compilazioni</div>
                        </div>
                      </div>
                      <button className="btn btn-danger btn-sm" onClick={() => removeTesterFromStudy(study.id, t.id)}>
                        Rimuovi
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Recluta Altri Tester Disponibili</h3>
            {unenrolledTesters.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tutti i tester registrati nel sistema sono già iscritti allo studio.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {unenrolledTesters.map(t => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border-color)', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                      <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{t.avatar || '👤'}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.email}</div>
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => assignTesterToStudy(study.id, t.id)}>
                      Recluta
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ANALYTICS & COLOR SPECTRUM */}
      {activeTab === 'analytics' && (
        <div>
          <div className="grid-stats">
            <div className="card stat-card">
              <div className="stat-icon">
                <Activity />
              </div>
              <div>
                <div className="stat-value">{studySubmissions.length}</div>
                <div className="stat-title">Risposte Riconosciute</div>
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-icon purple">
                <Palette />
              </div>
              <div>
                <div className="stat-value">{new Set(studySubmissions.map(s => s.selectedColor)).size}</div>
                <div className="stat-title">Varietà Tonalità Scelte</div>
              </div>
            </div>
          </div>

          {/* Color Matrix Timeline */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Palette className="text-blue-400" size={18} /> Matrix & Timeline delle Scelte Cromatiche dei Tester
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Evoluzione cronologica del colore selezionato dai soggetti a seguito delle sessioni di esercizio.
            </p>

            <div className="color-timeline">
              {studySubmissions.length === 0 ? (
                <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>Ancora nessuna compilazione registrata.</div>
              ) : (
                studySubmissions.map(sub => (
                  <div key={sub.id} className="color-timeline-node">
                    <div 
                      className="color-node-circle" 
                      style={{ backgroundColor: sub.selectedColor }}
                      title={`${sub.colorName} (${sub.selectedColor}) - RPE: ${sub.rating}`}
                    ></div>
                    <div style={{ fontWeight: 700, fontSize: '0.75rem' }}>{sub.colorName}</div>
                    <div className="color-node-date">{sub.date}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sub.testerName.split(' ')[0]}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Submissions Data Table */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Registro Risposte Dettagliato</h3>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Tester</th>
                    <th>Esercizio Praticato</th>
                    <th>Durata</th>
                    <th>Sforzo RPE</th>
                    <th>Colore Scelto</th>
                    <th>Note Qualitative</th>
                  </tr>
                </thead>
                <tbody>
                  {studySubmissions.map(sub => (
                    <tr key={sub.id}>
                      <td>{sub.date}</td>
                      <td style={{ fontWeight: 600 }}>{sub.testerName}</td>
                      <td>{sub.exerciseType}</td>
                      <td>{sub.exerciseDuration} min</td>
                      <td>
                        <span className="status-pill active">{sub.rating} / 10</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: sub.selectedColor, border: '1px solid rgba(255,255,255,0.3)', flexShrink: 0 }}></span>
                          <span>{sub.colorName}</span>
                        </div>
                      </td>
                      <td style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>"{sub.notes}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLINICAL NOTES */}
      {activeTab === 'notes' && (
        <div>
          <div className="page-header" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Note Cliniche & Osservazioni Riservate</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Annotazioni riservate visibili solo ai ricercatori dello studio.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowNoteModal(true)}>
              <PlusCircle size={18} /> Nuova Nota Clinica
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {studyNotes.length === 0 ? (
              <div className="empty-state">
                <FileText className="empty-icon" />
                <div className="empty-title">Nessuna nota presente</div>
                <div className="empty-desc">Inserisci annotazioni cliniche sul comportamento o sui progressi dei tester.</div>
              </div>
            ) : (
              studyNotes.map(nte => (
                <div key={nte.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span className="status-pill active">{nte.category}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(nte.timestamp).toLocaleString('it-IT')}</span>
                  </div>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '0.75rem' }}>"{nte.text}"</p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span>Soggetto: <strong>{nte.testerName}</strong></span>
                    <span>Autore: {nte.researcherName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal Add Note */}
      {showNoteModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2 className="modal-title">Nuova Nota Clinica</h2>
              <button className="modal-close" onClick={() => setShowNoteModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateNote}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Soggetto Tester Riferito</label>
                  <select 
                    className="form-select"
                    value={newNote.testerId}
                    onChange={(e) => setNewNote({ ...newNote, testerId: e.target.value })}
                    required
                  >
                    {enrolledTesters.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Categoria Nota</label>
                  <select 
                    className="form-select"
                    value={newNote.category}
                    onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                  >
                    <option value="Osservazione Clinica">Osservazione Clinica</option>
                    <option value="Raccomandazione Protocollo">Raccomandazione Protocollo</option>
                    <option value="Anomalia Risposta">Anomalia Risposta</option>
                    <option value="Progressi Notevoli">Progressi Notevoli</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Testo dell'Annotazione</label>
                  <textarea 
                    className="form-textarea"
                    rows="4"
                    placeholder="Descrivi l'osservazione sul comportamento cromatico o fisico del soggetto..."
                    value={newNote.text}
                    onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowNoteModal(false)}>Annulla</button>
                <button type="submit" className="btn btn-primary">Salva Nota</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
