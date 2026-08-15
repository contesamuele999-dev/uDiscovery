import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestionnaireFormModal } from './QuestionnaireFormModal';
import { CheckCircle2, Flame, History, Award, ArrowRight } from 'lucide-react';

export const TesterPortal = ({ activeTab }) => {
  const { studies, submissions, activeUser } = useApp();
  const [selectedStudyToFill, setSelectedStudyToFill] = useState(null);

  const myStudies = studies.filter(s => (s.assignedTesters || []).includes(activeUser.id));
  const mySubmissions = submissions.filter(s => s.testerId === activeUser.id);
  const streakDays = mySubmissions.length > 0 ? mySubmissions.length : 1;

  if (activeTab === 'history') {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title"><History className="text-teal-400" /> Storico Progressi & Selezione Colori</h1>
            <p className="page-subtitle">Rivedi le tue compilazioni passate e l'evoluzione delle tue scelte cromatiche.</p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Linea del Tempo CROMATICA</h3>
          <div className="color-timeline">
            {mySubmissions.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>Non hai ancora compilato questionari.</div>
            ) : (
              mySubmissions.map(sub => (
                <div key={sub.id} className="color-timeline-node">
                  <div className="color-node-circle" style={{ backgroundColor: sub.selectedColor }}></div>
                  <div style={{ fontWeight: 700, fontSize: '0.75rem' }}>{sub.colorName}</div>
                  <div className="color-node-date">{sub.date}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Registro Attività Completo</h3>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Data & Ora</th>
                  <th>Esercizio</th>
                  <th>Durata</th>
                  <th>Valutazione Sforzo</th>
                  <th>Colore Percepito</th>
                  <th>Note Personali</th>
                </tr>
              </thead>
              <tbody>
                {mySubmissions.map(sub => (
                  <tr key={sub.id}>
                    <td>{new Date(sub.timestamp).toLocaleDateString('it-IT')} {new Date(sub.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td style={{ fontWeight: 600 }}>{sub.exerciseType}</td>
                    <td>{sub.exerciseDuration} min</td>
                    <td><span className="status-pill active">{sub.rating} / 10</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: sub.selectedColor }}></span>
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
    );
  }

  return (
    <div>
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))', border: '1px solid rgba(59, 130, 246, 0.3)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Portale Tester Partecipante
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.25rem' }}>
              Bentornato/a, {activeUser.name}! 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Sei attualmente iscritto/a a <strong>{myStudies.length} studi attivi</strong>. Compila le schede previste per oggi.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-card)', padding: '0.75rem 1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <Flame className="text-amber-500" size={32} />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{streakDays} Giorni</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Striscia di Costanza</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <div>
          <h2 className="page-title"><CheckCircle2 className="text-teal-400" /> Questionari & Task di Oggi</h2>
          <p className="page-subtitle">I ricercatori hanno schedulato le seguenti attività di monitoraggio per te.</p>
        </div>
      </div>

      {myStudies.length === 0 ? (
        <div className="empty-state">
          <Award className="empty-icon" />
          <div className="empty-title">Nessuno studio assegnato</div>
          <div className="empty-desc">Attendi che un ricercatore ti recluti per un nuovo studio cromatico-fisiologico.</div>
        </div>
      ) : (
        <div className="grid-cards">
          {myStudies.map(st => {
            const hasCompletedToday = mySubmissions.some(sub => sub.studyId === st.id && sub.date === new Date().toISOString().split('T')[0]);

            return (
              <div key={st.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="status-pill active">{st.code}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Cadenza: {st.frequency}</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{st.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    Ricercatore Responsabile: <strong>{st.researcherName}</strong>
                  </p>

                  <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Parametri Richiesti:</div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      • Tracciamento Esercizio ({st.schema?.exerciseTypes?.slice(0, 2).join(', ')})<br />
                      • Selezione Colore / Umore Post-Esercizio<br />
                      • Scala Sforzo RPE (1-10)
                    </div>
                  </div>
                </div>

                <div>
                  {hasCompletedToday ? (
                    <div style={{ padding: '0.6rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-teal)', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      ✓ Rilevazione Inviata per Oggi!
                    </div>
                  ) : (
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setSelectedStudyToFill(st)}>
                      Compila Questionario <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedStudyToFill && (
        <QuestionnaireFormModal 
          study={selectedStudyToFill} 
          onClose={() => setSelectedStudyToFill(null)} 
        />
      )}
    </div>
  );
};
