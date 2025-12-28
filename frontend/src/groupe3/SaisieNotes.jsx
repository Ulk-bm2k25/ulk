import React, { useState, useEffect } from "react";
import { API_BASE_URL } from '../config';

const SaisieNotes = () => {
    const [classes, setClasses] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const [semestres, setSemestres] = useState([]);
    const [eleves, setEleves] = useState([]);
    const [user, setUser] = useState(null);
    const [teacherInfo, setTeacherInfo] = useState(null);

    const [selectedClasse, setSelectedClasse] = useState("");
    const [selectedMatiere, setSelectedMatiere] = useState("");
    const [selectedSemestre, setSelectedSemestre] = useState("");

    const [notes, setNotes] = useState({});
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);


            if (userData.role === 'ENSEIGNANT') {
                fetch(`${API_BASE_URL}/get_enseignant_info.php?user_id=${userData.id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (!data.error) {
                            setTeacherInfo(data);
                            setClasses(data.classes);

                            fetch(`${API_BASE_URL}/get_matieres.php`)
                                .then(res => res.json())
                                .then(allMatieres => {
                                    const isSpecial = data.matiere && data.matiere.toLowerCase().includes("communication écrite") && data.matiere.toLowerCase().includes("lecture");

                                    const teacherMatieres = allMatieres.filter(m => {
                                        const mNom = m.nom.trim().toLowerCase();
                                        if (isSpecial) {
                                            return mNom === "communication écrite" || mNom === "lecture";
                                        }
                                        return mNom === data.matiere.trim().toLowerCase();
                                    });

                                    if (teacherMatieres.length > 0) {
                                        setMatieres(teacherMatieres);
                                        setSelectedMatiere(teacherMatieres[0].id);
                                    }
                                });
                        }
                    });
            } else {

                fetch(`${API_BASE_URL}/get_classes.php`).then(res => res.json()).then(setClasses);
            }
        }

        fetch(`${API_BASE_URL}/get_semestres.php`).then(res => res.json()).then(setSemestres);
    }, []);

    useEffect(() => {
        if (selectedClasse && user?.role !== 'ENSEIGNANT') {
            fetch(`${API_BASE_URL}/get_matieres.php?classe_id=${selectedClasse}`)
                .then(res => res.json())
                .then(setMatieres);
        } else if (!selectedClasse && user?.role !== 'ENSEIGNANT') {
            setMatieres([]);
        }
    }, [selectedClasse, user]);


    useEffect(() => {
        if (selectedClasse && selectedMatiere && selectedSemestre) {
            setLoading(true);


            fetch(`${API_BASE_URL}/get_eleves.php?classe_id=${selectedClasse}`)
                .then(res => res.json())
                .then(elevesData => {
                    setEleves(elevesData);


                    return fetch(`${API_BASE_URL}/get_notes_saisie.php?classe_id=${selectedClasse}&matiere_id=${selectedMatiere}&semestre_id=${selectedSemestre}`);
                })
                .then(res => res.json())
                .then(notesData => {

                    const notesParEleve = {};
                    notesData.forEach(note => {
                        if (!notesParEleve[note.eleve_id]) {
                            notesParEleve[note.eleve_id] = {};
                        }
                        const key = `${note.type_evaluation}_${note.numero_evaluation}`;
                        notesParEleve[note.eleve_id][key] = {
                            id: note.id,
                            valeur: note.valeur,
                            statut: note.statut
                        };
                    });
                    setNotes(notesParEleve);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [selectedClasse, selectedMatiere, selectedSemestre]);

    const handleNoteChange = (eleveId, type, numero, value) => {

        if (value !== '' && (parseFloat(value) < 0 || parseFloat(value) > 20)) {
            alert("La note doit être comprise entre 0 et 20");
            return;
        }

        const key = `${type}_${numero}`;
        setNotes(prev => ({
            ...prev,
            [eleveId]: {
                ...prev[eleveId],
                [key]: {
                    ...prev[eleveId]?.[key],
                    valeur: value,
                    modified: true
                }
            }
        }));
    };

    const calculateMoyenne = (eleveId) => {
        const eleveNotes = notes[eleveId] || {};


        const moyInterro = calculateMoyenneInterro(eleveId);
        if (moyInterro === '-') return '-';


        const d1 = eleveNotes['DEVOIR_1']?.valeur;
        const d2 = eleveNotes['DEVOIR_2']?.valeur;


        if (!d1 || d1 === '' || !d2 || d2 === '') return '-';


        const moyenne = (parseFloat(moyInterro) + parseFloat(d1) + parseFloat(d2)) / 3;
        return moyenne.toFixed(2);
    };

    const calculateMoyenneInterro = (eleveId) => {
        const eleveNotes = notes[eleveId] || {};
        let total = 0;
        let count = 0;


        for (let i = 1; i <= 3; i++) {
            const note = eleveNotes[`INTERROGATION_${i}`];
            if (note?.valeur && note.valeur !== '') {
                total += parseFloat(note.valeur);
                count++;
            }
        }

        return count > 0 ? (total / count).toFixed(2) : '-';
    };

    const calculateMoyenneCoef = (eleveId) => {
        const moyenne = calculateMoyenne(eleveId);
        if (moyenne === '-') return '-';


        const matiere = matieres.find(m => m.id === parseInt(selectedMatiere));
        const coef = matiere?.coefficient || 1;

        return (parseFloat(moyenne) * coef).toFixed(2);
    };

    const handleSaveAll = async () => {
        if (!selectedClasse || !selectedMatiere || !selectedSemestre) {
            alert("Veuillez sélectionner une classe, une matière et un semestre.");
            return;
        }

        setLoading(true);
        setSaveStatus("Enregistrement en cours...");

        try {
            const notesToSave = [];


            eleves.forEach(eleve => {
                const eleveNotes = notes[eleve.id] || {};


                for (let i = 1; i <= 3; i++) {
                    const note = eleveNotes[`INTERROGATION_${i}`];
                    const val = note?.valeur;
                    if (val !== undefined && val !== null && val !== '') {
                        notesToSave.push({
                            eleve_id: eleve.id,
                            matiere_id: selectedMatiere,
                            semestre_id: selectedSemestre,
                            type_evaluation: 'INTERROGATION',
                            numero_evaluation: i,
                            valeur: parseFloat(val)
                        });
                    }
                }


                for (let i = 1; i <= 2; i++) {
                    const note = eleveNotes[`DEVOIR_${i}`];
                    const val = note?.valeur;
                    if (val !== undefined && val !== null && val !== '') {
                        notesToSave.push({
                            eleve_id: eleve.id,
                            matiere_id: selectedMatiere,
                            semestre_id: selectedSemestre,
                            type_evaluation: 'DEVOIR',
                            numero_evaluation: i,
                            valeur: parseFloat(val)
                        });
                    }
                }
            });

            if (notesToSave.length === 0) {
                setSaveStatus("⚠️ Aucune note n'a été saisie.");
                setLoading(false);
                return;
            }

            const res = await fetch(`${API_BASE_URL}/save_notes_batch.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes: notesToSave })
            });

            const data = await res.json();

            if (data.success) {
                setSaveStatus(`✅ ${data.message || (data.saved + " note(s) enregistrée(s)")}`);
                setTimeout(() => setSaveStatus(""), 5000);


                const refreshRes = await fetch(`${API_BASE_URL}/get_notes_saisie.php?classe_id=${selectedClasse}&matiere_id=${selectedMatiere}&semestre_id=${selectedSemestre}`);
                const notesData = await refreshRes.json();
                const notesParEleve = {};
                notesData.forEach(note => {
                    if (!notesParEleve[note.eleve_id]) {
                        notesParEleve[note.eleve_id] = {};
                    }
                    const key = `${note.type_evaluation}_${note.numero_evaluation}`;
                    notesParEleve[note.eleve_id][key] = {
                        id: note.id,
                        valeur: note.valeur,
                        statut: note.statut
                    };
                });
                setNotes(notesParEleve);
            } else {
                alert("Erreur: " + data.error);
            }
        } catch (err) {
            alert("Erreur réseau.");
        } finally {
            setLoading(false);
        }
    };

    const isNoteValidated = (eleveId) => {
        const eleveNotes = notes[eleveId] || {};
        return Object.values(eleveNotes).some(note => note.statut === 'VALIDE');
    };

    return (
        <div className="slide-up">
            <header style={{ marginBottom: '32px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📊 Saisie des Notes</h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Interface de saisie rapide pour toute la classe</p>
            </header>

            {}
            <div className="glass-card" style={{ marginBottom: '24px', padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div style={styles.field}>
                        <label style={styles.label}>Classe</label>
                        <select style={styles.select} value={selectedClasse} onChange={(e) => setSelectedClasse(e.target.value)}>
                            <option value="">-- Sélectionner --</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Matière</label>
                        <select
                            style={styles.select}
                            value={selectedMatiere}
                            onChange={(e) => setSelectedMatiere(e.target.value)}
                            disabled={!selectedClasse || (user?.role === 'ENSEIGNANT' && matieres.length <= 1)}
                        >
                            <option value="">-- Sélectionner --</option>
                            {matieres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
                        </select>
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Semestre</label>
                        <select style={styles.select} value={selectedSemestre} onChange={(e) => setSelectedSemestre(e.target.value)}>
                            <option value="">-- Sélectionner --</option>
                            {semestres.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {}
            {selectedClasse && selectedMatiere && selectedSemestre && (
                <div className="glass-card" style={{ padding: '0', overflow: 'auto' }}>
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>
                            Chargement des données...
                        </div>
                    ) : eleves.length === 0 ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>
                            Aucun élève dans cette classe
                        </div>
                    ) : (
                        <>
                            {}
                            <div style={{
                                padding: '20px 24px',
                                borderBottom: '2px solid #e2e8f0',
                                backgroundColor: '#fff'
                            }}>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '1.2rem',
                                    fontWeight: '900',
                                    color: '#1e293b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    📋 FICHE DE NOTES : {classes.find(c => c.id == selectedClasse)?.nom}
                                    <span style={{
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        color: '#64748b',
                                        backgroundColor: '#f1f5f9',
                                        padding: '4px 12px',
                                        borderRadius: '20px'
                                    }}>
                                        {eleves.length} élève(s)
                                    </span>
                                </h3>
                            </div>

                            <div className="table-responsive">
                                <table style={styles.table}>
                                    <thead>
                                        <tr style={styles.headerRow}>
                                            <th style={{ ...styles.th, position: 'sticky', left: 0, backgroundColor: '#0f172a', zIndex: 2, color: '#fff' }} rowSpan="2">ÉLÈVE</th>
                                            <th style={{ ...styles.th, backgroundColor: '#fbbf24', color: '#000', borderBottom: '2px solid #b45309' }} colSpan="4">INTERROGATIONS (/20)</th>
                                            <th style={{ ...styles.th, backgroundColor: '#3b82f6', color: '#fff', borderBottom: '2px solid #1d4ed8' }} colSpan="2">DEVOIRS (/20)</th>
                                            <th style={{ ...styles.th, backgroundColor: '#6366f1', color: '#fff' }} rowSpan="2">MOYENNE</th>
                                            <th style={{ ...styles.th, backgroundColor: '#8b5cf6', color: '#fff' }} rowSpan="2">MOY. COEF</th>
                                            <th style={{ ...styles.th, color: '#fff' }} rowSpan="2">STATUT</th>
                                        </tr>
                                        <tr style={styles.subHeaderRow}>
                                            <th style={styles.subTh}>I1</th>
                                            <th style={styles.subTh}>I2</th>
                                            <th style={styles.subTh}>I3</th>
                                            <th style={{ ...styles.subTh, backgroundColor: '#fcd34d', color: '#000', fontWeight: '900' }}>MOY I</th>
                                            <th style={styles.subTh}>D1</th>
                                            <th style={styles.subTh}>D2</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eleves.map((eleve) => {
                                            const validated = isNoteValidated(eleve.id);
                                            return (
                                                <tr key={eleve.id} style={styles.row}>
                                                    <td style={{ ...styles.td, position: 'sticky', left: 0, backgroundColor: '#fff', fontWeight: '600', zIndex: 1 }}>
                                                        {eleve.prenom} {eleve.nom}
                                                    </td>
                                                    {}
                                                    {[1, 2, 3].map(num => (
                                                        <td key={`I${num}`} style={styles.td}>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="20"
                                                                step="0.25"
                                                                style={{
                                                                    ...styles.input,
                                                                    backgroundColor: validated ? '#f1f5f9' : '#fff'
                                                                }}
                                                                value={notes[eleve.id]?.[`INTERROGATION_${num}`]?.valeur || ''}
                                                                onChange={(e) => handleNoteChange(eleve.id, 'INTERROGATION', num, e.target.value)}
                                                                disabled={validated}
                                                            />
                                                        </td>
                                                    ))}
                                                    {}
                                                    <td style={{ ...styles.td, backgroundColor: '#fef3c7', fontWeight: '700', color: '#92400e' }}>
                                                        {calculateMoyenneInterro(eleve.id)}
                                                    </td>
                                                    {}
                                                    {[1, 2].map(num => (
                                                        <td key={`D${num}`} style={styles.td}>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="20"
                                                                step="0.25"
                                                                style={{
                                                                    ...styles.input,
                                                                    backgroundColor: validated ? '#f1f5f9' : '#fff'
                                                                }}
                                                                value={notes[eleve.id]?.[`DEVOIR_${num}`]?.valeur || ''}
                                                                onChange={(e) => handleNoteChange(eleve.id, 'DEVOIR', num, e.target.value)}
                                                                disabled={validated}
                                                            />
                                                        </td>
                                                    ))}
                                                    {}
                                                    <td style={{ ...styles.td, backgroundColor: 'rgba(99, 102, 241, 0.1)', fontWeight: '700', color: '#6366f1' }}>
                                                        {calculateMoyenne(eleve.id)}
                                                    </td>
                                                    {}
                                                    <td style={{ ...styles.td, backgroundColor: 'rgba(139, 92, 246, 0.1)', fontWeight: '700', color: '#8b5cf6' }}>
                                                        {calculateMoyenneCoef(eleve.id)}
                                                    </td>
                                                    {}
                                                    <td style={styles.td}>
                                                        {validated ? (
                                                            <span style={styles.badgeValidated}>✓ Validé</span>
                                                        ) : (
                                                            <span style={styles.badgeDraft}>Brouillon</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {}
                            <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        {saveStatus && (
                                            <span style={{ color: saveStatus.includes('✅') ? '#10b981' : 'var(--text-dim)', fontWeight: '600' }}>
                                                {saveStatus}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleSaveAll}
                                        disabled={loading}
                                        className="btn-premium"
                                        style={{ minWidth: '200px' }}
                                    >
                                        {loading ? 'ENREGISTREMENT...' : 'ENREGISTRER TOUTES LES NOTES 💾'}
                                    </button>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '12px', marginBottom: 0 }}>
                                    💡 Les notes validées par l'administrateur ne peuvent plus être modifiées
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    field: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-dim)', textTransform: 'uppercase' },
    select: {
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#fff',
        outline: 'none',
        fontSize: '0.95rem'
    },
    table: { width: '100%', borderCollapse: 'collapse', minWidth: '1000px' },
    headerRow: { backgroundColor: '#1e293b' },
    subHeaderRow: { backgroundColor: '#334155' },
    th: {
        padding: '16px 12px',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: '#fff',
        fontWeight: '800',
        textTransform: 'uppercase',
        borderBottom: '2px solid #334155',
        letterSpacing: '0.5px'
    },
    subTh: {
        padding: '10px 12px',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#fff',
        fontWeight: '800',
        borderBottom: '1px solid #1e293b',
        letterSpacing: '1.5px',
        backgroundColor: '#334155'
    },
    row: { borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' },
    td: { padding: '12px', textAlign: 'center' },
    input: {
        width: '70px',
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        textAlign: 'center',
        fontSize: '0.9rem',
        outline: 'none',
        transition: 'all 0.2s'
    },
    badgeValidated: {
        padding: '4px 12px',
        backgroundColor: '#d1fae5',
        color: '#065f46',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: '700'
    },
    badgeDraft: {
        padding: '4px 12px',
        backgroundColor: '#fef3c7',
        color: '#92400e',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: '700'
    }
};

export default SaisieNotes;
