import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const INITIAL_USERS = [
  { id: 'usr_admin', name: 'Dr. Alessandro Vardi', email: 'admin@chromalab.org', password: 'admin123', role: 'admin', avatar: '👨‍💼', status: 'attivo', dateAdded: '2026-01-10' },
  { id: 'usr_res1', name: 'Dr. Elena Rostova', email: 'elena.rostova@chromalab.org', password: 'research123', role: 'researcher', avatar: '👩‍🔬', institution: 'Istituto di Neuroscienze Cromatiche', status: 'attivo', dateAdded: '2026-01-15' },
  { id: 'usr_res2', name: 'Dr. Marco Bellini', email: 'marco.bellini@chromalab.org', password: 'research123', role: 'researcher', avatar: '👨‍🔬', institution: 'Dipartimento di Psicologia dello Sport', status: 'attivo', dateAdded: '2026-02-01' },
  { id: 'usr_test1', name: 'Sofia Rossi', email: 'sofia.rossi@example.com', password: 'tester123', role: 'tester', avatar: '👩', age: 28, condition: 'Gruppo A - Esercizi Respiratori', status: 'attivo', dateAdded: '2026-02-10' },
  { id: 'usr_test2', name: 'Matteo Bianchi', email: 'matteo.b@example.com', password: 'tester123', role: 'tester', avatar: '👨', age: 34, condition: 'Gruppo B - Allenamento Motorio', status: 'attivo', dateAdded: '2026-02-12' },
  { id: 'usr_test3', name: 'Giulia Verdi', email: 'giulia.v@example.com', password: 'tester123', role: 'tester', avatar: '👩‍🦰', age: 24, condition: 'Gruppo A - Esercizi Respiratori', status: 'attivo', dateAdded: '2026-02-15' },
];

const INITIAL_STUDIES = [
  {
    id: 'std_1',
    title: 'Studio Cromatico-Fisiologico su Fatica e Percezione Visiva',
    code: 'CHROMA-2026-01',
    researcherId: 'usr_res1',
    researcherName: 'Dr. Elena Rostova',
    abstract: 'Analisi longitudinale sull\'impatto degli esercizi fisici e di respirazione ad alta intensità sulla percezione cromatica intuitiva e sullo sforzo percepito nei soggetti adulti.',
    objective: 'Valutare come il carico cardiovascolare modifichi la preferenza tono/saturazione del colore e ridurre il livello di sforzo percepito (RPE).',
    category: 'Neuroscienze & Sport',
    status: 'in_corso',
    startDate: '2026-03-01',
    endDate: '2026-09-01',
    frequency: 'giornaliera',
    targetSubmissions: 30,
    assignedTesters: ['usr_test1', 'usr_test2'],
    schema: {
      hasExerciseLog: true,
      hasColorPicker: true,
      hasRatingScale: true,
      hasNotes: true,
      exerciseTypes: ['Corsa Leggera', 'Esercizi di Respirazione Pranayama', 'Stretching Dinamico', 'HIIT Cardio'],
      ratingLabel: 'Percezione dello Sforzo (RPE 1-10)'
    }
  },
  {
    id: 'std_2',
    title: 'Studio Cognitivo su Memoria Visiva e Variazione Croma',
    code: 'CHROMA-2026-02',
    researcherId: 'usr_res2',
    researcherName: 'Dr. Marco Bellini',
    abstract: 'Monitoraggio settimanale della concentrazione visivo-spaziale e preferenza di saturazione cromatica in compiti di memorizzazione a intervalli regolari.',
    objective: 'Verificare la correlazione tra aumento della memoria a breve termine e la selezione di tonalità fredde (blu/verde) rispetto a quelle calde.',
    category: 'Psicologia Cognitiva',
    status: 'in_corso',
    startDate: '2026-04-01',
    endDate: '2026-10-15',
    frequency: 'settimanale',
    targetSubmissions: 12,
    assignedTesters: ['usr_test1', 'usr_test3'],
    schema: {
      hasExerciseLog: true,
      hasColorPicker: true,
      hasRatingScale: true,
      hasNotes: true,
      exerciseTypes: ['Test di Memoria Sequenziale', 'Focus Visivo su Target', 'Meditazione Guidata'],
      ratingLabel: 'Livello di Focus e Chiarezza Mentale (1-10)'
    }
  }
];

const INITIAL_SUBMISSIONS = [
  {
    id: 'sub_1',
    studyId: 'std_1',
    testerId: 'usr_test1',
    testerName: 'Sofia Rossi',
    timestamp: '2026-08-01T09:30:00Z',
    date: '2026-08-01',
    exerciseType: 'Esercizi di Respirazione Pranayama',
    exerciseDuration: 20,
    rating: 7,
    selectedColor: '#3b82f6',
    colorName: 'Blu Oceano',
    notes: 'Dopo i primi 10 minuti di respirazione ho avvertito un senso di nitidezza visiva e calma profonda.'
  },
  {
    id: 'sub_2',
    studyId: 'std_1',
    testerId: 'usr_test1',
    testerName: 'Sofia Rossi',
    timestamp: '2026-08-03T10:15:00Z',
    date: '2026-08-03',
    exerciseType: 'Esercizi di Respirazione Pranayama',
    exerciseDuration: 25,
    rating: 6,
    selectedColor: '#10b981',
    colorName: 'Verde Smeraldo',
    notes: 'Sensazione di recupero energetico più rapido. Il colore scelto riflette la sensazione di equilibrio.'
  },
  {
    id: 'sub_3',
    studyId: 'std_1',
    testerId: 'usr_test1',
    testerName: 'Sofia Rossi',
    timestamp: '2026-08-07T08:45:00Z',
    date: '2026-08-07',
    exerciseType: 'Corsa Leggera',
    exerciseDuration: 30,
    rating: 5,
    selectedColor: '#f59e0b',
    colorName: 'Ambra Calda',
    notes: 'Sforzo contenuto, battito regolare. Colore percepito molto caldo e dinamico.'
  },
  {
    id: 'sub_4',
    studyId: 'std_1',
    testerId: 'usr_test1',
    testerName: 'Sofia Rossi',
    timestamp: '2026-08-12T17:20:00Z',
    date: '2026-08-12',
    exerciseType: 'Esercizi di Respirazione Pranayama',
    exerciseDuration: 30,
    rating: 4,
    selectedColor: '#8b5cf6',
    colorName: 'Viola Mistico',
    notes: 'Maggiore rilassamento muscolare, percepito tono cromatico più profondo.'
  },
  {
    id: 'sub_5',
    studyId: 'std_1',
    testerId: 'usr_test2',
    testerName: 'Matteo Bianchi',
    timestamp: '2026-08-02T11:00:00Z',
    date: '2026-08-02',
    exerciseType: 'HIIT Cardio',
    exerciseDuration: 40,
    rating: 8,
    selectedColor: '#ef4444',
    colorName: 'Rosso Sforzo',
    notes: 'Fatica elevata a fine sessione. Sensazione di calore intenso.'
  },
  {
    id: 'sub_6',
    studyId: 'std_1',
    testerId: 'usr_test2',
    testerName: 'Matteo Bianchi',
    timestamp: '2026-08-09T11:30:00Z',
    date: '2026-08-09',
    exerciseType: 'Stretching Dinamico',
    exerciseDuration: 30,
    rating: 5,
    selectedColor: '#06b6d4',
    colorName: 'Ciano Rinfrescante',
    notes: 'Sessione di scarico muscolare. Sensazione di fresco ed allungamento.'
  },
  {
    id: 'sub_7',
    studyId: 'std_2',
    testerId: 'usr_test3',
    testerName: 'Giulia Verdi',
    timestamp: '2026-08-05T14:00:00Z',
    date: '2026-08-05',
    exerciseType: 'Test di Memoria Sequenziale',
    exerciseDuration: 15,
    rating: 9,
    selectedColor: '#6366f1',
    colorName: 'Indaco Profondo',
    notes: 'Massima concentrazione nel test delle tessere cromatiche.'
  }
];

const INITIAL_NOTES = [
  {
    id: 'nte_1',
    studyId: 'std_1',
    testerId: 'usr_test1',
    testerName: 'Sofia Rossi',
    researcherId: 'usr_res1',
    researcherName: 'Dr. Elena Rostova',
    timestamp: '2026-08-08T16:00:00Z',
    text: 'Soggetto 101 mostra una costante transizione verso tonalità a lunghezza d\'onda maggiore (dal blu al verde/ambra) man mano che il punteggio RPE scende sotto il valore 5.',
    category: 'Osservazione Clinica'
  },
  {
    id: 'nte_2',
    studyId: 'std_1',
    testerId: 'usr_test2',
    testerName: 'Matteo Bianchi',
    researcherId: 'usr_res1',
    researcherName: 'Dr. Elena Rostova',
    timestamp: '2026-08-10T09:15:00Z',
    text: 'Soggetto 102 predilige colori ad alta saturazione (rosso/ciano) in concomitanza con picchi di sforzo HIIT. Consigliata aggiunta di sessioni di defaticamento.',
    category: 'Raccomandazione Protocollo'
  }
];

const INITIAL_LOGS = [
  { id: 'log_1', timestamp: '2026-08-14T15:00:00Z', user: 'Dr. Alessandro Vardi', action: 'Sistema avviato', details: 'Piattaforma ChromaLab pronta' },
  { id: 'log_2', timestamp: '2026-08-14T16:20:00Z', user: 'Dr. Elena Rostova', action: 'Aggiornamento Studio', details: 'Modificato schema CHROMA-2026-01' }
];

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('chromalab_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [studies, setStudies] = useState(() => {
    const saved = localStorage.getItem('chromalab_studies');
    return saved ? JSON.parse(saved) : INITIAL_STUDIES;
  });

  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('chromalab_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('chromalab_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('chromalab_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // Authentication State
  const [activeUser, setActiveUser] = useState(() => {
    const savedUser = localStorage.getItem('chromalab_active_user');
    if (savedUser) return JSON.parse(savedUser);
    return null; // Null means not logged in by default
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('chromalab_auth_status') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('chromalab_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('chromalab_studies', JSON.stringify(studies));
  }, [studies]);

  useEffect(() => {
    localStorage.setItem('chromalab_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('chromalab_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('chromalab_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    if (activeUser) {
      localStorage.setItem('chromalab_active_user', JSON.stringify(activeUser));
      localStorage.setItem('chromalab_auth_status', 'true');
    } else {
      localStorage.removeItem('chromalab_active_user');
      localStorage.setItem('chromalab_auth_status', 'false');
    }
  }, [activeUser]);

  // Auth Methods
  const login = (email, password) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!foundUser) {
      return { success: false, error: 'Nessun account trovato con questa email.' };
    }
    if (foundUser.status === 'sospeso') {
      return { success: false, error: 'Questo account è stato temporaneamente sospeso dall\'amministratore.' };
    }
    if (foundUser.password && foundUser.password !== password) {
      return { success: false, error: 'Password errata. Riprova.' };
    }
    
    setActiveUser(foundUser);
    setIsAuthenticated(true);
    addAuditLog(foundUser.name, 'Accesso Login', `Utente autenticato come ${foundUser.role.toUpperCase()}`);
    return { success: true, user: foundUser };
  };

  const quickLogin = (userId) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      setActiveUser(targetUser);
      setIsAuthenticated(true);
      addAuditLog(targetUser.name, 'Quick Login Demo', `Accesso rapido demo come ${targetUser.role.toUpperCase()}`);
    }
  };

  const logout = () => {
    if (activeUser) {
      addAuditLog(activeUser.name, 'Disconnessione', 'Utente disconnesso dal sistema');
    }
    setActiveUser(null);
    setIsAuthenticated(false);
  };

  const switchRoleUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setActiveUser(user);
      setIsAuthenticated(true);
    }
  };

  const addUser = (newUser) => {
    const userWithId = {
      ...newUser,
      id: `usr_${Date.now()}`,
      password: newUser.password || 'password123',
      dateAdded: new Date().toISOString().split('T')[0],
      status: 'attivo'
    };
    setUsers(prev => [userWithId, ...prev]);
    addAuditLog(activeUser?.name || 'Sistema', 'Creazione Utente', `Creato nuovo utente ${userWithId.name} (${userWithId.role})`);
    return userWithId;
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'attivo' ? 'sospeso' : 'attivo' } : u));
    addAuditLog(activeUser?.name || 'Admin', 'Modifica Stato Utente', `Cambiato stato per utente ID ${userId}`);
  };

  const createStudy = (studyData) => {
    const newStudy = {
      ...studyData,
      id: `std_${Date.now()}`,
      code: `CHROMA-2026-${studies.length + 1}`,
      researcherId: activeUser.id,
      researcherName: activeUser.name,
      status: 'in_corso',
      startDate: new Date().toISOString().split('T')[0],
      assignedTesters: studyData.assignedTesters || [],
      schema: studyData.schema || {
        hasExerciseLog: true,
        hasColorPicker: true,
        hasRatingScale: true,
        hasNotes: true,
        exerciseTypes: ['Esercizio Fisico Generico', 'Respirazione', 'Stretching'],
        ratingLabel: 'Intensità / Sforzo (1-10)'
      }
    };
    setStudies(prev => [newStudy, ...prev]);
    addAuditLog(activeUser.name, 'Creazione Studio', `Creato studio ${newStudy.code}: ${newStudy.title}`);
    return newStudy;
  };

  const assignTesterToStudy = (studyId, testerId) => {
    setStudies(prev => prev.map(s => {
      if (s.id === studyId) {
        const current = s.assignedTesters || [];
        if (!current.includes(testerId)) {
          return { ...s, assignedTesters: [...current, testerId] };
        }
      }
      return s;
    }));
    addAuditLog(activeUser.name, 'Assegnazione Tester', `Assegnato tester ${testerId} allo studio ${studyId}`);
  };

  const removeTesterFromStudy = (studyId, testerId) => {
    setStudies(prev => prev.map(s => {
      if (s.id === studyId) {
        return { ...s, assignedTesters: (s.assignedTesters || []).filter(id => id !== testerId) };
      }
      return s;
    }));
    addAuditLog(activeUser.name, 'Rimozione Tester', `Rimosso tester ${testerId} dallo studio ${studyId}`);
  };

  const addSubmission = (subData) => {
    const newSub = {
      ...subData,
      id: `sub_${Date.now()}`,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      testerId: activeUser.id,
      testerName: activeUser.name
    };
    setSubmissions(prev => [newSub, ...prev]);
    addAuditLog(activeUser.name, 'Compilazione Questionario', `Inviata risposta per studio ID ${subData.studyId}`);
    return newSub;
  };

  const addResearcherNote = (noteData) => {
    const newNote = {
      ...noteData,
      id: `nte_${Date.now()}`,
      timestamp: new Date().toISOString(),
      researcherId: activeUser.id,
      researcherName: activeUser.name
    };
    setNotes(prev => [newNote, ...prev]);
    addAuditLog(activeUser.name, 'Nota Clinica', `Aggiunta nota clinica per il tester ${noteData.testerName}`);
    return newNote;
  };

  const addAuditLog = (user, action, details) => {
    const log = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      user,
      action,
      details
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const resetAllData = () => {
    setUsers(INITIAL_USERS);
    setStudies(INITIAL_STUDIES);
    setSubmissions(INITIAL_SUBMISSIONS);
    setNotes(INITIAL_NOTES);
    setAuditLogs(INITIAL_LOGS);
    localStorage.clear();
    setActiveUser(INITIAL_USERS[1]);
    setIsAuthenticated(true);
  };

  return (
    <AppContext.Provider value={{
      users,
      studies,
      submissions,
      notes,
      auditLogs,
      activeUser,
      isAuthenticated,
      login,
      quickLogin,
      logout,
      switchRoleUser,
      addUser,
      toggleUserStatus,
      createStudy,
      assignTesterToStudy,
      removeTesterFromStudy,
      addSubmission,
      addResearcherNote,
      addAuditLog,
      resetAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
