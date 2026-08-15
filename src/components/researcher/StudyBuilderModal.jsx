import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, Palette, Dumbbell } from 'lucide-react';

export const StudyBuilderModal = ({ onClose, onCreated }) => {
  const { users, createStudy } = useApp();
  const availableTesters = users.filter(u => u.role === 'tester');

  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    objective: '',
    category: 'Neuroscienze & Sport',
    frequency: 'giornaliera',
    targetSubmissions: 30,
    assignedTesters: availableTesters.map(t => t.id),
    schema: {
      hasExerciseLog: true,
      hasColorPicker: true,
      hasRatingScale: true,
      hasNotes: true,
      exerciseTypes: ['Corsa Leggera', 'Respirazione Guidata', 'Stretching', 'HIIT'],
      ratingLabel: 'Percezione dello Sforzo (RPE 1-10)'
    }
  });

  const [newExerciseInput, setNewExerciseInput] = useState('');

  const handleAddExerciseType = () => {
    if (!newExerciseInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      schema: {
        ...prev.schema,
        exerciseTypes: [...prev.schema.exerciseTypes, newExerciseInput.trim()]
      }
    }));
    setNewExerciseInput('');
  };

  const handleRemoveExerciseType = (index) => {
    setFormData(prev => ({
      ...prev,
      schema: {
        ...prev.schema,
        exerciseTypes: prev.schema.exerciseTypes.filter((_, i) => i !== index)
      }
    }));
  };

  const toggleTesterAssignment = (testerId) => {
    setFormData(prev => {
      const exists = prev.assignedTesters.includes(testerId);
      return {
        ...prev,
        assignedTesters: exists 
          ? prev.assignedTesters.filter(id => id !== testerId)
          : [...prev.assignedTesters, testerId]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.abstract) return;
    const study = createStudy(formData);
    if (onCreated) onCreated(study);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '780px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Crea Nuovo Studio Scientifico</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Titolo dello Studio Scientifico</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="es. Studio Cromatico-Fisiologico su Fatica e Percezione Visiva"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Abstract e Descrizione Protocollo</label>
              <textarea 
                className="form-textarea" 
                rows="3"
                placeholder="Sintesi scientifica degli scopi dello studio e della metodologia..."
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Categoria Disciplinare</label>
                <select 
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Neuroscienze & Sport">Neuroscienze & Sport</option>
                  <option value="Psicologia Cognitiva">Psicologia Cognitiva</option>
                  <option value="Ergonomia Visiva">Ergonomia Visiva</option>
                  <option value="Riabilitazione Motoria">Riabilitazione Motoria</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Frequenza di Compilazione per il Tester</label>
                <select 
                  className="form-select"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                >
                  <option value="giornaliera">Giornaliera (Ogni giorno)</option>
                  <option value="settimanale">Settimanale (Una volta a settimana)</option>
                  <option value="mensile">Mensile (Una volta al mese)</option>
                  <option value="annuale">Annuale (Monitoraggio a lungo termine)</option>
                </select>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sliders size={18} className="text-blue-400" /> Configurazione Protocollo Questionario
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.schema.hasExerciseLog} 
                    onChange={(e) => setFormData({ ...formData, schema: { ...formData.schema, hasExerciseLog: e.target.checked } })}
                  />
                  <span><Dumbbell size={14} /> Registro Esercizi & Durata</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.schema.hasColorPicker} 
                    onChange={(e) => setFormData({ ...formData, schema: { ...formData.schema, hasColorPicker: e.target.checked } })}
                  />
                  <span><Palette size={14} /> Selettore Colore / Tono Percepito</span>
                </label>
              </div>

              {formData.schema.hasExerciseLog && (
                <div className="form-group">
                  <label className="form-label">Tipi di Esercizio Tracciabili</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Aggiungi esercizio (es. Pilates, Meditazione)..." 
                      value={newExerciseInput}
                      onChange={(e) => setNewExerciseInput(e.target.value)}
                    />
                    <button type="button" className="btn btn-secondary" onClick={handleAddExerciseType}>Aggiungi</button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {formData.schema.exerciseTypes.map((ex, idx) => (
                      <span key={idx} className="status-pill active" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {ex}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveExerciseType(idx)} 
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Tester Inizialmente Assegnati ({formData.assignedTesters.length})</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                {availableTesters.map(t => {
                  const isChecked = formData.assignedTesters.includes(t.id);
                  return (
                    <div 
                      key={t.id}
                      onClick={() => toggleTesterAssignment(t.id)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        border: `1px solid ${isChecked ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                        background: isChecked ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-input)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem'
                      }}
                    >
                      <input type="checkbox" checked={isChecked} readOnly />
                      <span>{t.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annulla</button>
            <button type="submit" className="btn btn-primary">Crea & Pubblica Studio</button>
          </div>
        </form>
      </div>
    </div>
  );
};
