import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyBuilderModal } from './StudyBuilderModal';
import { StudyDetailView } from './StudyDetailView';
import { BookOpen, PlusCircle, Users, BarChart2, FileText, ArrowRight, Palette } from 'lucide-react';

export const ResearcherDashboard = ({ activeTab }) => {
  const { studies, submissions, notes, activeUser } = useApp();
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter studies created by or accessible to researcher
  const myStudies = studies;

  if (selectedStudy) {
    return <StudyDetailView study={selectedStudy} onBack={() => setSelectedStudy(null)} />;
  }

  if (activeTab === 'analytics') {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title"><BarChart2 className="text-purple-400" /> Matrice CROMATICA & Analisi Piattaforma</h1>
            <p className="page-subtitle">Sintesi globale delle risposte dei soggetti e delle variazioni percettive.</p>
          </div>
        </div>

        <div className="grid-stats">
          <div className="card stat-card">
            <div className="stat-icon">
              <BookOpen />
            </div>
            <div>
              <div className="stat-value">{studies.length}</div>
              <div className="stat-title">Studi Attivi</div>
            </div>
          </div>

          <div className="card stat-card">
            <div className="stat-icon purple">
              <Palette />
            </div>
            <div>
              <div className="stat-value">{submissions.length}</div>
              <div className="stat-title">Compilazioni Totali</div>
            </div>
          </div>

          <div className="card stat-card">
            <div className="stat-icon teal">
              <FileText />
            </div>
            <div>
              <div className="stat-value">{notes.length}</div>
              <div className="stat-title">Note Cliniche</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Panoramica Scelte Cromatiche Aggregate</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {submissions.map((sub, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-input)', padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: sub.selectedColor }}></span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{sub.colorName}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({sub.testerName.split(' ')[0]})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'notes') {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title"><FileText /> Registro Note Cliniche</h1>
            <p className="page-subtitle">Raccolta di tutte le osservazioni cliniche registrate per ciascun soggetto.</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notes.map(nte => (
            <div key={nte.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="status-pill active">{nte.category}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(nte.timestamp).toLocaleString('it-IT')}</span>
              </div>
              <p style={{ fontSize: '1rem', lineHeight: '1.5', marginBottom: '0.75rem' }}>"{nte.text}"</p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Tester: <strong>{nte.testerName}</strong></span>
                <span>Ricercatore: {nte.researcherName}</span>
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
          <h1 className="page-title"><BookOpen /> I Miei Studi Clinici & Sperimentali</h1>
          <p className="page-subtitle">Crea nuovi studi, configura questionari schedulati ed analizza i progressi dei tester.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <PlusCircle size={18} /> Crea Nuovo Studio
        </button>
      </div>

      <div className="grid-cards">
        {myStudies.map(st => {
          const subCount = submissions.filter(s => s.studyId === st.id).length;
          return (
            <div key={st.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="status-pill active">{st.code}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Cadenza: {st.frequency.toUpperCase()}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{st.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {st.abstract}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  <span><Users size={14} style={{ display: 'inline', marginRight: '4px' }} /> Tester: <strong>{st.assignedTesters?.length || 0}</strong></span>
                  <span>Compilazioni: <strong>{subCount}</strong></span>
                </div>

                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setSelectedStudy(st)}>
                  Apri Studio & Analisi <ArrowRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <StudyBuilderModal 
          onClose={() => setShowCreateModal(false)}
          onCreated={(newStudy) => setSelectedStudy(newStudy)}
        />
      )}
    </div>
  );
};
