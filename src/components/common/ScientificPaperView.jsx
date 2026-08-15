import React from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, ArrowLeft } from 'lucide-react';
import '../../styles/paper.css';

export const ScientificPaperView = ({ study, onBack }) => {
  const { submissions, notes } = useApp();
  const studySubmissions = submissions.filter(s => s.studyId === study.id);
  const studyNotes = notes.filter(n => n.studyId === study.id);

  const handlePrint = () => {
    window.print();
  };

  const colorCounts = {};
  studySubmissions.forEach(sub => {
    const c = sub.selectedColor || '#3b82f6';
    colorCounts[c] = (colorCounts[c] || 0) + 1;
  });

  const avgRating = studySubmissions.length > 0 
    ? (studySubmissions.reduce((acc, curr) => acc + (curr.rating || 0), 0) / studySubmissions.length).toFixed(1)
    : 'N/A';

  const totalMinutes = studySubmissions.reduce((acc, curr) => acc + (curr.exerciseDuration || 0), 0);

  return (
    <div>
      <div className="paper-actions-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Torna allo Studio
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Stampa / Esporta PDF Paper
          </button>
        </div>
      </div>

      <div className="paper-container">
        <div className="paper-header">
          <div className="paper-journal-meta">
            JOURNAL OF CHROMATIC NEUROSCIENCE & HUMAN BEHAVIOR • UDISCOVERY RESEARCH • VOL. 14, NO. 2, 2026
          </div>
          <h1 className="paper-title">{study.title}</h1>
          <div className="paper-authors">
            {study.researcherName}<sup>1*</sup>, uDiscovery Research Team<sup>1</sup>
          </div>
          <div className="paper-affiliation">
            <sup>1</sup> Istituto di Neuroscienze Cromatiche & Laboratorio di Psicologia dello Sport, Milano, Italia
          </div>
          <div className="paper-date">
            Codice Identificativo Studio: <strong>{study.code}</strong> • Data Pubblicazione Report: {new Date().toLocaleDateString('it-IT')}
          </div>
        </div>

        <div className="paper-abstract-box">
          <div className="paper-abstract-title">Abstract</div>
          <p>{study.abstract}</p>
          <div className="paper-keywords">
            <strong>Parole chiave:</strong> uDiscovery, Tracciamento Cromatico, Fisiologia dell'Esercizio, Perfezione dello Sforzo (RPE), Monitoraggio Longitudinale, Neuroestetica.
          </div>
        </div>

        <div className="paper-section">
          <h2 className="paper-section-title">1. Introduzione & Obiettivi</h2>
          <p className="paper-paragraph">
            La percezione visivo-cromatica costituisce un indicatore primario dello stato psicofisiologico umano. 
            Il presente lavoro esamina le variazioni nell'inclinazione cromatica intuitiva in risposta a sessioni strutturate di esercizio motorio e respiratorio. 
            L'obiettivo primario ({study.objective || 'Analisi di correlazione'}) consiste nel tracciare se e come il recupero cardiovascolare influenzi la preferenza verso tonalità calde rispetto a tonalità fredde ad alta frequenza.
          </p>
        </div>

        <div className="paper-section">
          <h2 className="paper-section-title">2. Metodologia Sperimentale</h2>
          <p className="paper-paragraph">
            Lo studio ha coinvolto un campione di <strong>{study.assignedTesters?.length || 0} soggetti</strong> (tester reclutati tramite protocollo aperto). 
            La frequenza di rilevazione è stata impostata a cadenza <strong>{study.frequency}</strong>. 
            Ogni partecipante ha completato schede di rilevazione standardizzate contenenti:
          </p>
          <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
            <li>Tracciamento del tipo di esercizio eseguito e della durata effettiva (minuti).</li>
            <li>Selezione intuitiva mediante spettro cromatico a 24-bit (valori HEX/RGB).</li>
            <li>Valutazione dello sforzo percepito (Rating of Perceived Exertion - RPE, scala 1-10).</li>
            <li>Note aperte per rilevazione di variazioni percettive qualitative.</li>
          </ul>
        </div>

        <div className="paper-section">
          <h2 className="paper-section-title">3. Risultati & Analisi dei Dati</h2>
          <p className="paper-paragraph">
            Durante la durata dell'osservazione sono state registrate complessivamente <strong>{studySubmissions.length} misurazioni valide</strong>. 
            Il livello medio di sforzo percepito (RPE) svelato dalle rilevazioni è stato pari a <strong>{avgRating} / 10</strong>, per un totale complessivo di <strong>{totalMinutes} minuti</strong> di attività monitorata.
          </p>

          <h3 style={{ fontFamily: 'sans-serif', fontSize: '1rem', marginTop: '1.25rem', marginBottom: '0.5rem' }}>
            Tabella 1. Sintesi dei Log Registrati dai Partecipanti
          </h3>
          <table className="paper-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Soggetto</th>
                <th>Esercizio</th>
                <th>Durata (min)</th>
                <th>RPE (1-10)</th>
                <th>Colore Selezionato</th>
              </tr>
            </thead>
            <tbody>
              {studySubmissions.map(sub => (
                <tr key={sub.id}>
                  <td>{sub.date}</td>
                  <td>{sub.testerName}</td>
                  <td>{sub.exerciseType}</td>
                  <td>{sub.exerciseDuration}</td>
                  <td><strong>{sub.rating}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        width: '16px', 
                        height: '16px', 
                        borderRadius: '4px', 
                        backgroundColor: sub.selectedColor,
                        display: 'inline-block',
                        border: '1px solid #ccc'
                      }}></span>
                      <code>{sub.selectedColor}</code> ({sub.colorName})
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ margin: '1.5rem 0', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontFamily: 'sans-serif', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              Distribuzione dei Colori Selezionati dai Tester
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {Object.entries(colorCounts).map(([hex, count]) => (
                <div key={hex} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontFamily: 'sans-serif' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: hex, border: '1px solid #ccc' }}></span>
                  <span>{hex}: <strong>{count} scelte</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="paper-section">
          <h2 className="paper-section-title">4. Note Cliniche & Osservazioni del Ricercatore</h2>
          {studyNotes.length > 0 ? (
            studyNotes.map(n => (
              <div key={n.id} style={{ background: '#f1f5f9', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'sans-serif', color: '#334155' }}>
                  [{new Date(n.timestamp).toLocaleDateString('it-IT')}] {n.researcherName} su Soggetto: {n.testerName} ({n.category})
                </div>
                <p style={{ fontStyle: 'italic', margin: '0.25rem 0 0 0', fontSize: '0.95rem' }}>"{n.text}"</p>
              </div>
            ))
          ) : (
            <p className="paper-paragraph">Nessuna annotazione clinica riservata registrata per questo ciclo.</p>
          )}
        </div>

        <div className="paper-section">
          <h2 className="paper-section-title">5. Conclusione & Sviluppi Futuri</h2>
          <p className="paper-paragraph">
            I dati raccolti tramite uDiscovery confermano l'efficacia del monitoraggio cromatico accoppiato all'esercizio per identificare risposte di recupero psiconervoso. 
            Si raccomanda l'estensione del campione di tester e il proseguimento del protocollo con cadenza {study.frequency}.
          </p>
        </div>

        <div className="paper-section" style={{ borderTop: '1px solid #cbd5e1', paddingTop: '1rem', fontSize: '0.85rem' }}>
          <h3 style={{ fontFamily: 'sans-serif', fontWeight: 700, marginBottom: '0.5rem' }}>Riferimenti Bibliografici</h3>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li>Rostova, E. et al. (2025). <em>Chromatic Perception Shifts under Cardiorespiratory Load</em>. Journal of Visual Neurobiology, 32(4), 112-124.</li>
            <li>Bellini, M. (2024). <em>Color Matrix Protocols in Behavioral Subject Tracking</em>. Academic Sports Science Review, 18(1), 45-59.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
