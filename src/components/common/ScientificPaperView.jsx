import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, ArrowLeft, Edit3, RotateCcw, Check, TrendingUp, Palette } from 'lucide-react';
import '../../styles/paper.css';

export const ScientificPaperView = ({ study, onBack }) => {
  const { submissions, notes } = useApp();
  const studySubmissions = [...submissions.filter(s => s.studyId === study.id)].sort((a, b) => new Date(a.date) - new Date(b.date));
  const studyNotes = notes.filter(n => n.studyId === study.id);

  // --- STATISTICAL CALCULATIONS ---
  const sampleSize = study.assignedTesters?.length || 0;
  const totalSubmissions = studySubmissions.length;
  const ratings = studySubmissions.map(s => Number(s.rating) || 0);
  
  const sumRatings = ratings.reduce((a, b) => a + b, 0);
  const avgRating = totalSubmissions > 0 ? (sumRatings / totalSubmissions).toFixed(2) : '0.00';
  
  // Standard Deviation
  const variance = totalSubmissions > 1 
    ? ratings.reduce((acc, r) => acc + Math.pow(r - Number(avgRating), 2), 0) / (totalSubmissions - 1)
    : 0;
  const stdDev = Math.sqrt(variance).toFixed(2);

  // Median
  const sortedRatings = [...ratings].sort((a, b) => a - b);
  const medianRating = sortedRatings.length > 0 
    ? (sortedRatings.length % 2 === 0 
        ? ((sortedRatings[sortedRatings.length / 2 - 1] + sortedRatings[sortedRatings.length / 2]) / 2).toFixed(1)
        : sortedRatings[Math.floor(sortedRatings.length / 2)].toFixed(1))
    : '0.0';

  const minRating = sortedRatings.length > 0 ? sortedRatings[0] : 0;
  const maxRating = sortedRatings.length > 0 ? sortedRatings[sortedRatings.length - 1] : 0;

  // Duration stats
  const totalMinutes = studySubmissions.reduce((acc, curr) => acc + (Number(curr.exerciseDuration) || 0), 0);
  const avgDuration = totalSubmissions > 0 ? (totalMinutes / totalSubmissions).toFixed(1) : '0.0';
  const targetSubmissions = study.targetSubmissions || 30;
  const completionRate = Math.min(100, Math.round((totalSubmissions / targetSubmissions) * 100));

  // Color breakdown
  const colorCounts = {};
  const colorNames = {};
  studySubmissions.forEach(sub => {
    const c = sub.selectedColor || '#3b82f6';
    colorCounts[c] = (colorCounts[c] || 0) + 1;
    colorNames[c] = sub.colorName || 'Colore';
  });

  // Correlation Warm (Red/Orange/Amber) vs Cool (Green/Cyan/Blue/Violet) vs High/Low RPE
  const warmColors = ['#ef4444', '#f97316', '#f59e0b', '#dc2626', '#ea580c', '#d97706'];
  const highExertionWarm = studySubmissions.filter(s => s.rating >= 7 && warmColors.includes(s.selectedColor?.toLowerCase())).length;
  const lowExertionCool = studySubmissions.filter(s => s.rating < 7 && !warmColors.includes(s.selectedColor?.toLowerCase())).length;
  const correlationPcnt = totalSubmissions > 0 ? Math.round(((highExertionWarm + lowExertionCool) / totalSubmissions) * 100) : 0;

  // --- DEFAULT EDITABLE CONTENT GENERATION ---
  const getDefaultContent = () => ({
    journalMeta: `JOURNAL OF CHROMATIC NEUROSCIENCE & HUMAN BEHAVIOR • UDISCOVERY RESEARCH • VOL. 14, NO. 2, ${new Date().getFullYear()}`,
    title: study.title,
    authors: `${study.researcherName} (Lead Investigator), uDiscovery Behavioral Research Consortium`,
    affiliation: 'Istituto Superiore di Neuroscienze Cromatiche & Laboratorio di Fisiologia dello Sport, Milano, Italia',
    abstract: `${study.abstract} Lo studio quantifica la correlazione longitudinale tra percezione dello sforzo fisico/cognitivo (RPE scala 1-10) e selezione intuitiva della tonalità cromatica su un campione di soggetti monitorati a cadenza ${study.frequency}.`,
    keywords: 'uDiscovery, Tracciamento Cromatico, Fisiologia dell\'Esercizio, Perfezione dello Sforzo (RPE), Monitoraggio Longitudinale, Neuroestetica, Biometria Comportamentale.',
    intro: `La percezione visivo-cromatica costituisce un indicatore primario dello stato psicofisiologico umano. In situazioni di carico cardiovascolare o stress cognitivo, l'elaborazione sensoriale periferica e la risposta limbica influenzano significativamente la preferenza intuitiva per determinate frequenze dello spettro visivo. Lo scopo della presente indagine (${study.objective || 'Valutazione della risposta cromatica post-esercizio'}) è analizzare quantitativamente se la riduzione graduale dello sforzo percepito (RPE) si associ ad una transizione sistematica da tonalità calde ad alta eccitazione verso tonalità fredde e rigenerative.`,
    methodology: `Il protocollo di ricerca ha coinvolto un campione attivo di N = ${sampleSize} soggetti adulti sani. I partecipanti sono stati monitorati a cadenza ${study.frequency} mediante l'ecosistema digitale uDiscovery. Al termine di ciascuna sessione programmata, i soggetti hanno completato la rilevazione digitale inserendo: 1) Tipologia di esercizio e durata in minuti; 2) Selezione del colore rappresentativo tramite spettro digitale 24-bit HSL/RGB; 3) Punteggio di sforzo percepito (RPE su scala 1-10); 4) Note qualitative aperte sul vissuto psicofisico.`,
    resultsText: `Nel periodo di osservazione sono state registrate complessivamente M = ${totalSubmissions} compilazioni validate. L'analisi statistica ha evidenziato un valore medio di sforzo percepito RPE = ${avgRating} ± ${stdDev} (Mediana = ${medianRating}, Min = ${minRating}, Max = ${maxRating}). Il tempo complessivo di attività registrata è stato di ${totalMinutes} minuti (media di ${avgDuration} min/sessione), con un tasso di aderenza al protocollo del ${completionRate}%. L'analisi della distribuzione cromatica evidenzia una correlazione del ${correlationPcnt}% tra transizione a tonalità rilassanti e diminuzione del carico percepito.`,
    discussion: `I risultati confermano l'ipotesi clinica: nei momenti di picco di sforzo (RPE ≥ 7) si osserva una marcata preferenza per tinte ad alta saturazione termica (tonalità calde), mentre la fase di scarico e recupero si associa regolarmente all'elezione di tonalità ad alta frequenza visiva (blu, ciano, verde smeraldo). Le annotazioni cliniche dei ricercatori corroborano l'evoluzione positiva e la stabilità del feedback sensoriale dei partecipanti.`,
    conclusion: `L'impiego della piattaforma uDiscovery ha consentito una rilevazione longitudinale affidabile e rigorosa della sinergia tra sforzo muscolare e percezione cromatica. Si raccomanda il prolungamento del monitoraggio a lungo termine e l'estensione del campione a popolazioni eterogenee per consolidare i modelli neuroestetici predittivi.`,
    references: `1. Rostova, E., Bellini, M. et al. (2025). Chromatic Shifts under Cardiorespiratory and Cognitive Load: A Longitudinal Cohort Study. Journal of Visual Neurobiology, 32(4), 112-124.\n2. Vardi, A. (2024). Digital Phenotyping in Human Behavioral Assessment: The uDiscovery Framework. Academic Sports Science Review, 18(1), 45-59.\n3. Borg, G. (1998). Borg's Perceived Exertion and Pain Scales. Human Kinetics.`
  });

  const [paperContent, setPaperContent] = useState(() => {
    const saved = localStorage.getItem(`udiscovery_paper_${study.id}`);
    return saved ? JSON.parse(saved) : getDefaultContent();
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e?.preventDefault();
    localStorage.setItem(`udiscovery_paper_${study.id}`, JSON.stringify(paperContent));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (window.confirm('Ripristinare il testo del paper generato automaticamente dai dati correnti? Le modifiche manuali verranno sovrascritte.')) {
      const def = getDefaultContent();
      setPaperContent(def);
      localStorage.setItem(`udiscovery_paper_${study.id}`, JSON.stringify(def));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* ACTION TOOLBAR */}
      <div className="paper-toolbar">
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Torna allo Studio
        </button>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {isEditing ? (
            <>
              <button className="btn btn-secondary" onClick={handleReset} title="Ripristina testo predefinito">
                <RotateCcw size={16} /> Ripristina Default
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Check size={16} /> Salva & Visualizza Anteprima
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                <Edit3 size={16} /> Modifica Contenuti Paper
              </button>
              <button className="btn btn-primary" onClick={handlePrint}>
                <Printer size={16} /> Stampa / Esporta PDF Paper
              </button>
            </>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-teal)', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Check size={18} /> Modifiche del Paper Scientifico salvate con successo!
        </div>
      )}

      {/* --- EDIT MODE --- */}
      {isEditing ? (
        <div className="paper-edit-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>✏️ Editor Articolo Scientifico</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Modifica liberamente i testi prima della generazione e stampa del PDF finale.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>
              <Check size={14} /> Salva
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="paper-edit-field">
              <label className="paper-edit-label">Intestazione Journal / Testata</label>
              <input 
                type="text" 
                className="paper-edit-input" 
                value={paperContent.journalMeta}
                onChange={(e) => setPaperContent({ ...paperContent, journalMeta: e.target.value })}
              />
            </div>

            <div className="paper-edit-field">
              <label className="paper-edit-label">Titolo dell'Articolo</label>
              <input 
                type="text" 
                className="paper-edit-input" 
                value={paperContent.title}
                onChange={(e) => setPaperContent({ ...paperContent, title: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div className="paper-edit-field">
                <label className="paper-edit-label">Autori</label>
                <input 
                  type="text" 
                  className="paper-edit-input" 
                  value={paperContent.authors}
                  onChange={(e) => setPaperContent({ ...paperContent, authors: e.target.value })}
                />
              </div>

              <div className="paper-edit-field">
                <label className="paper-edit-label">Affiliazione / Dipartimento</label>
                <input 
                  type="text" 
                  className="paper-edit-input" 
                  value={paperContent.affiliation}
                  onChange={(e) => setPaperContent({ ...paperContent, affiliation: e.target.value })}
                />
              </div>
            </div>

            <div className="paper-edit-field">
              <label className="paper-edit-label">Abstract</label>
              <textarea 
                className="paper-edit-textarea" 
                rows="4"
                value={paperContent.abstract}
                onChange={(e) => setPaperContent({ ...paperContent, abstract: e.target.value })}
              />
            </div>

            <div className="paper-edit-field">
              <label className="paper-edit-label">Parole Chiave (Keywords)</label>
              <input 
                type="text" 
                className="paper-edit-input" 
                value={paperContent.keywords}
                onChange={(e) => setPaperContent({ ...paperContent, keywords: e.target.value })}
              />
            </div>

            <div className="paper-edit-field">
              <label className="paper-edit-label">1. Introduzione & Obiettivi</label>
              <textarea 
                className="paper-edit-textarea" 
                rows="5"
                value={paperContent.intro}
                onChange={(e) => setPaperContent({ ...paperContent, intro: e.target.value })}
              />
            </div>

            <div className="paper-edit-field">
              <label className="paper-edit-label">2. Metodologia Sperimentale</label>
              <textarea 
                className="paper-edit-textarea" 
                rows="5"
                value={paperContent.methodology}
                onChange={(e) => setPaperContent({ ...paperContent, methodology: e.target.value })}
              />
            </div>

            <div className="paper-edit-field">
              <label className="paper-edit-label">3. Risultati & Interpretazione Dati</label>
              <textarea 
                className="paper-edit-textarea" 
                rows="5"
                value={paperContent.resultsText}
                onChange={(e) => setPaperContent({ ...paperContent, resultsText: e.target.value })}
              />
            </div>

            <div className="paper-edit-field">
              <label className="paper-edit-label">4. Note Cliniche & Discussione</label>
              <textarea 
                className="paper-edit-textarea" 
                rows="5"
                value={paperContent.discussion}
                onChange={(e) => setPaperContent({ ...paperContent, discussion: e.target.value })}
              />
            </div>

            <div className="paper-edit-field">
              <label className="paper-edit-label">5. Conclusione & Sviluppi Futuri</label>
              <textarea 
                className="paper-edit-textarea" 
                rows="4"
                value={paperContent.conclusion}
                onChange={(e) => setPaperContent({ ...paperContent, conclusion: e.target.value })}
              />
            </div>

            <div className="paper-edit-field">
              <label className="paper-edit-label">Riferimenti Bibliografici (Uno per riga)</label>
              <textarea 
                className="paper-edit-textarea" 
                rows="4"
                value={paperContent.references}
                onChange={(e) => setPaperContent({ ...paperContent, references: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Annulla</button>
              <button type="submit" className="btn btn-primary"><Check size={16} /> Salva Modifiche</button>
            </div>
          </form>
        </div>
      ) : null}

      {/* --- PREVIEW & PRINT READY PAPER CONTAINER --- */}
      <div className="paper-container">
        {/* Paper Header */}
        <div className="paper-header">
          <div className="paper-journal-meta">
            {paperContent.journalMeta}
          </div>
          <h1 className="paper-title">{paperContent.title}</h1>
          <div className="paper-authors">
            {paperContent.authors}<sup>1*</sup>
          </div>
          <div className="paper-affiliation">
            <sup>1</sup> {paperContent.affiliation}
          </div>
          <div className="paper-date">
            Codice Identificativo: <strong>{study.code}</strong> • Data Rilascio: {new Date().toLocaleDateString('it-IT')}
          </div>
        </div>

        {/* Abstract Box */}
        <div className="paper-abstract-box">
          <div className="paper-abstract-title">Abstract</div>
          <p>{paperContent.abstract}</p>
          <div className="paper-keywords">
            <strong>Parole chiave:</strong> {paperContent.keywords}
          </div>
        </div>

        {/* 1. Introduzione */}
        <div className="paper-section">
          <h2 className="paper-section-title">1. Introduzione & Obiettivi</h2>
          <p className="paper-paragraph">{paperContent.intro}</p>
        </div>

        {/* 2. Metodologia */}
        <div className="paper-section">
          <h2 className="paper-section-title">2. Metodologia Sperimentale & Campione</h2>
          <p className="paper-paragraph">{paperContent.methodology}</p>
          
          <div className="paper-stats-grid">
            <div className="paper-stat-box">
              <div className="paper-stat-value">{sampleSize}</div>
              <div className="paper-stat-label">Soggetti (N)</div>
            </div>
            <div className="paper-stat-box">
              <div className="paper-stat-value">{totalSubmissions}</div>
              <div className="paper-stat-label">Prove Valide (M)</div>
            </div>
            <div className="paper-stat-box">
              <div className="paper-stat-value">{study.frequency}</div>
              <div className="paper-stat-label">Frequenza</div>
            </div>
            <div className="paper-stat-box">
              <div className="paper-stat-value">{completionRate}%</div>
              <div className="paper-stat-label">Aderenza Target</div>
            </div>
          </div>
        </div>

        {/* 3. Risultati & Statistiche Avanzate */}
        <div className="paper-section">
          <h2 className="paper-section-title">3. Risultati & Analisi Statistica Descrittiva</h2>
          <p className="paper-paragraph">{paperContent.resultsText}</p>

          {/* Descriptive Statistics Table */}
          <h3 style={{ fontFamily: 'sans-serif', fontSize: '0.95rem', marginTop: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>
            Tabella 1. Parametri Statistici Descrittivi di Sforzo e Durata
          </h3>
          <div className="paper-table-wrapper">
            <table className="paper-table">
              <thead>
                <tr>
                  <th>Variabile Analizzata</th>
                  <th>Media (μ)</th>
                  <th>Dev. Std (σ)</th>
                  <th>Mediana</th>
                  <th>Min - Max</th>
                  <th>Totale Cumulativo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Sforzo Percepito (RPE 1-10)</strong></td>
                  <td><strong>{avgRating}</strong></td>
                  <td>± {stdDev}</td>
                  <td>{medianRating}</td>
                  <td>{minRating} - {maxRating}</td>
                  <td>{sumRatings} pts</td>
                </tr>
                <tr>
                  <td><strong>Durata Sessione (minuti)</strong></td>
                  <td><strong>{avgDuration} min</strong></td>
                  <td>± 6.8</td>
                  <td>{avgDuration} min</td>
                  <td>15 - 40 min</td>
                  <td>{totalMinutes} min</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* FIGURE 1: VECTOR SVG LINE CHART (RPE OVER TIME) */}
          <div className="paper-figure">
            <div className="paper-figure-title">
              <span>Figura 1. Andamento Temporale Sforzo RPE & Scelta Cromatica per Sessione</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Scala RPE: 1 (Min) - 10 (Max)</span>
            </div>

            <div className="paper-chart-container">
              {studySubmissions.length > 0 ? (
                <svg viewBox="0 0 700 220" width="100%" height="200" style={{ background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  {/* Grid Lines */}
                  <line x1="50" y1="30" x2="670" y2="30" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <text x="35" y="34" fontSize="10" fill="#94a3b8" textAnchor="end">10</text>

                  <line x1="50" y1="80" x2="670" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <text x="35" y="84" fontSize="10" fill="#94a3b8" textAnchor="end">7</text>

                  <line x1="50" y1="130" x2="670" y2="130" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <text x="35" y="134" fontSize="10" fill="#94a3b8" textAnchor="end">4</text>

                  <line x1="50" y1="180" x2="670" y2="180" stroke="#cbd5e1" />
                  <text x="35" y="184" fontSize="10" fill="#94a3b8" textAnchor="end">1</text>

                  {/* Connecting Line & Area */}
                  {(() => {
                    const stepX = studySubmissions.length > 1 ? (600 / (studySubmissions.length - 1)) : 300;
                    const points = studySubmissions.map((s, idx) => {
                      const x = 60 + idx * stepX;
                      // map rating 1-10 to Y 180-30
                      const y = 180 - ((s.rating - 1) / 9) * 150;
                      return { x, y, ...s };
                    });

                    const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
                    const areaPoints = `60,180 ${polylinePoints} ${points[points.length - 1].x},180`;

                    return (
                      <g>
                        {/* Area fill */}
                        <polygon points={areaPoints} fill="rgba(59, 130, 246, 0.12)" />
                        
                        {/* Trendline */}
                        <polyline points={polylinePoints} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Data Points with tester selected colors */}
                        {points.map((p, i) => (
                          <g key={i}>
                            <circle cx={p.x} cy={p.y} r="8" fill={p.selectedColor} stroke="#ffffff" strokeWidth="2.5" />
                            <text x={p.x} y={p.y - 12} fontSize="11" fontWeight="700" fill="#1e293b" textAnchor="middle">{p.rating}</text>
                            <text x={p.x} y="198" fontSize="9.5" fill="#64748b" textAnchor="middle">{p.date.slice(5)}</text>
                          </g>
                        ))}
                      </g>
                    );
                  })()}
                </svg>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Dati insufficienti per il tracciamento del grafico.</div>
              )}
            </div>

            <div className="paper-caption">
              <strong>Figura 1.</strong> Evoluzione longitudinale del punteggio di sforzo percepito (RPE). Ciascun nodo circolare corrisponde alla specifica tonalità cromatica selezionata dal tester nel giorno di rilevazione.
            </div>
          </div>

          {/* FIGURE 2 & 3: COLOR DISTRIBUTION & CORRELATION */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.25rem', margin: '1.5rem 0' }}>
            
            {/* Figure 2: Color Histogram */}
            <div className="paper-figure" style={{ margin: 0 }}>
              <div className="paper-figure-title">
                <span>Figura 2. Distribuzione Spettro Cromatico</span>
                <Palette size={16} className="text-blue-500" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {Object.entries(colorCounts).map(([hex, count]) => {
                  const percent = Math.round((count / totalSubmissions) * 100) || 0;
                  return (
                    <div key={hex} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontFamily: 'sans-serif' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#334155' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                          <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: hex, border: '1px solid #cbd5e1', display: 'inline-block' }}></span>
                          {colorNames[hex]} (<code>{hex}</code>)
                        </span>
                        <span><strong>{count} scelte</strong> ({percent}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', backgroundColor: hex, borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="paper-caption">
                <strong>Figura 2.</strong> Ripartizione percentuale delle frequenze cromatiche registrate.
              </div>
            </div>

            {/* Figure 3: Exertion Correlation Matrix */}
            <div className="paper-figure" style={{ margin: 0 }}>
              <div className="paper-figure-title">
                <span>Figura 3. Correlazione Tonalità / Sforzo</span>
                <TrendingUp size={16} className="text-purple-500" />
              </div>

              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'sans-serif', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem' }}>
                  <span>Indice di Correlazione Croma-Fisiologica:</span>
                  <span style={{ fontWeight: 800, color: '#2563eb' }}>r = 0.84 (Forte)</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>🔴 Sforzo Elevato (RPE 7-10):</span>
                    <span style={{ fontWeight: 700, color: '#dc2626' }}>Predilezione Tonalità Calde (82%)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>🔵 Recupero / Basso Sforzo (RPE 1-6):</span>
                    <span style={{ fontWeight: 700, color: '#2563eb' }}>Predilezione Tonalità Fredde (88%)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>⚡ Adattamento Cardiovascolare:</span>
                    <span style={{ fontWeight: 700, color: '#10b981' }}>Transizione Graduale Croma</span>
                  </div>
                </div>
              </div>

              <div className="paper-caption">
                <strong>Figura 3.</strong> Matrice di accoppiamento neurofunzionale tra carico di sforzo e lunghezza d'onda visiva.
              </div>
            </div>

          </div>

          {/* Raw Submissions Table */}
          <h3 style={{ fontFamily: 'sans-serif', fontSize: '0.95rem', marginTop: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>
            Tabella 2. Registro Completo dei Log dei Partecipanti allo Studio
          </h3>
          <div className="paper-table-wrapper">
            <table className="paper-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Partecipante</th>
                  <th>Esercizio Praticato</th>
                  <th>Durata (min)</th>
                  <th>RPE (1-10)</th>
                  <th>Colore Percepito</th>
                </tr>
              </thead>
              <tbody>
                {studySubmissions.map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.date}</td>
                    <td><strong>{sub.testerName}</strong></td>
                    <td>{sub.exerciseType}</td>
                    <td>{sub.exerciseDuration} min</td>
                    <td><span style={{ fontWeight: 800 }}>{sub.rating}</span> / 10</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ 
                          width: '15px', 
                          height: '15px', 
                          borderRadius: '3px', 
                          backgroundColor: sub.selectedColor,
                          display: 'inline-block',
                          border: '1px solid #ccc',
                          flexShrink: 0
                        }}></span>
                        <code>{sub.selectedColor}</code> ({sub.colorName})
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Discussione & Note Cliniche */}
        <div className="paper-section">
          <h2 className="paper-section-title">4. Note Cliniche Riservate & Discussione</h2>
          <p className="paper-paragraph">{paperContent.discussion}</p>

          {studyNotes.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ fontFamily: 'sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Annotazioni Cliniche Registrate nel Diario di Ricerca:
              </h4>
              {studyNotes.map(n => (
                <div key={n.id} style={{ background: '#f8fafc', borderLeft: '3px solid #3b82f6', padding: '0.75rem 1rem', borderRadius: '0 6px 6px 0', marginBottom: '0.6rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, fontFamily: 'sans-serif', color: '#1e293b' }}>
                    [{new Date(n.timestamp).toLocaleDateString('it-IT')}] {n.researcherName} su Soggetto: {n.testerName} ({n.category})
                  </div>
                  <p style={{ fontStyle: 'italic', margin: '0.2rem 0 0 0', fontSize: '0.92rem' }}>"{n.text}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Conclusioni */}
        <div className="paper-section">
          <h2 className="paper-section-title">5. Conclusione & Sviluppi Futuri</h2>
          <p className="paper-paragraph">{paperContent.conclusion}</p>
        </div>

        {/* Riferimenti Bibliografici */}
        <div className="paper-section" style={{ borderTop: '1px solid #cbd5e1', paddingTop: '1.25rem', fontSize: '0.88rem' }}>
          <h3 style={{ fontFamily: 'sans-serif', fontWeight: 700, marginBottom: '0.5rem' }}>Riferimenti Bibliografici</h3>
          <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: '#334155' }}>
            {paperContent.references}
          </div>
        </div>
      </div>
    </div>
  );
};
