import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { Palette, Dumbbell, Star, MessageSquare, Check } from 'lucide-react';

const PRESET_COLORS = [
  { hex: '#ef4444', name: 'Rosso Sforzo / Calore' },
  { hex: '#f97316', name: 'Arancione Energia' },
  { hex: '#f59e0b', name: 'Ambra Luminosa' },
  { hex: '#10b981', name: 'Verde Rigenerazione' },
  { hex: '#06b6d4', name: 'Ciano Freschezza' },
  { hex: '#3b82f6', name: 'Blu Calma / Focus' },
  { hex: '#8b5cf6', name: 'Viola Profondità' },
  { hex: '#ec4899', name: 'Rosa Armonia' }
];

export const QuestionnaireFormModal = ({ study, onClose, onSubmitted }) => {
  const { addSubmission } = useApp();
  const schema = study.schema || {};

  const [exerciseType, setExerciseType] = useState(schema.exerciseTypes?.[0] || 'Esercizio Generico');
  const [exerciseDuration, setExerciseDuration] = useState(25);
  const [rating, setRating] = useState(5);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[3].hex);
  const [colorName, setColorName] = useState(PRESET_COLORS[3].name);
  const [notes, setNotes] = useState('');

  const handleSelectPreset = (preset) => {
    setSelectedColor(preset.hex);
    setColorName(preset.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addSubmission({
      studyId: study.id,
      exerciseType: schema.hasExerciseLog ? exerciseType : 'N/A',
      exerciseDuration: schema.hasExerciseLog ? Number(exerciseDuration) : 0,
      rating: Number(rating),
      selectedColor: schema.hasColorPicker ? selectedColor : '#3b82f6',
      colorName: schema.hasColorPicker ? colorName : 'Standard',
      notes: notes || 'Nessuna nota aggiuntiva.'
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // fallback if confetti canvas fails
    }

    if (onSubmitted) onSubmitted();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Compilazione Questionario Studio</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{study.title} ({study.code})</div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {schema.hasExerciseLog && (
              <div className="card" style={{ background: 'var(--bg-input)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Dumbbell className="text-blue-400" size={18} /> Esercizio Fisico / Cognitivo Effettuato
                </h4>

                <div className="form-group">
                  <label className="form-label">Seleziona Tipo di Esercizio</label>
                  <select 
                    className="form-select"
                    value={exerciseType}
                    onChange={(e) => setExerciseType(e.target.value)}
                  >
                    {(schema.exerciseTypes || ['Esercizio Generico']).map((ex, idx) => (
                      <option key={idx} value={ex}>{ex}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Durata dell'Esercizio: <strong>{exerciseDuration} minuti</strong></label>
                  <input 
                    type="range" 
                    min="5" 
                    max="120" 
                    step="5" 
                    value={exerciseDuration} 
                    onChange={(e) => setExerciseDuration(e.target.value)}
                    style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  />
                </div>
              </div>
            )}

            {schema.hasColorPicker && (
              <div className="card" style={{ background: 'var(--bg-input)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Palette className="text-purple-400" size={18} /> Selezione Colore / Stato Percepito
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Scegli il colore che rappresenta meglio la tua sensazione o percezione visiva post-esercizio.
                </p>

                <div className="color-swatch-picker">
                  <div className="color-preview-box" style={{ backgroundColor: selectedColor }}></div>
                  <div style={{ flex: 1 }}>
                    <input 
                      type="color" 
                      value={selectedColor} 
                      onChange={(e) => {
                        setSelectedColor(e.target.value);
                        setColorName(`Tonalità custom ${e.target.value}`);
                      }}
                      style={{ width: '100%', height: '36px', border: 'none', cursor: 'pointer', borderRadius: '6px', background: 'transparent' }}
                    />
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>{colorName}</div>
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Palette Tonalità Suggerite:</div>
                  <div className="color-preset-pills">
                    {PRESET_COLORS.map(p => (
                      <button 
                        key={p.hex} 
                        type="button" 
                        className={`color-pill ${selectedColor === p.hex ? 'active' : ''}`}
                        style={{ backgroundColor: p.hex }}
                        onClick={() => handleSelectPreset(p)}
                        title={p.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {schema.hasRatingScale && (
              <div className="card" style={{ background: 'var(--bg-input)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star className="text-amber-400" size={18} /> {schema.ratingLabel || 'Valutazione Sforzo (1-10)'}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Minimo (1)</span>
                  <span className="status-pill active" style={{ fontSize: '1rem', fontWeight: 800 }}>Punteggio: {rating} / 10</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Massimo (10)</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={rating} 
                  onChange={(e) => setRating(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
                />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label"><MessageSquare size={14} style={{ display: 'inline', marginRight: '4px' }} /> Note & Riflessioni del Tester (Opzionale)</label>
              <textarea 
                className="form-textarea" 
                rows="3" 
                placeholder="Annota qualsiasi sensazione, variazione o commento qualitativo..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annulla</button>
            <button type="submit" className="btn btn-primary">
              <Check size={18} /> Invia Rilevazione
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
