import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const NotesParMatiere = () => {
    const [user, setUser] = useState(null);
    const [matieres, setMatieres] = useState([]);
    const [selectedMatiere, setSelectedMatiere] = useState('');
    const [teacherData, setTeacherData] = useState([]);
    const [selectedClasseIdx, setSelectedClasseIdx] = useState(0);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            if (parsedUser.role === 'ENSEIGNANT') {
                setLoading(true);
                fetch(`${API_BASE_URL}/get_teacher_overview.php?user_id=${parsedUser.id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (!data.error) setTeacherData(data);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error(err);
                        setLoading(false);
                    });
            } else {
                fetch(`${API_BASE_URL}/get_matieres.php`)
                    .then(res => res.json())
                    .then(setMatieres)
                    .catch(err => console.error("Erreur chargement matières:", err));
            }
        }
    }, []);


    useEffect(() => {
        if (user?.role !== 'ENSEIGNANT' && selectedMatiere) {
            fetch(`${API_BASE_URL}/get_notes_matiere.php?matiere_id=${selectedMatiere}`)
                .then(res => res.json())
                .then(setNotes)
                .catch(err => console.error("Erreur chargement notes:", err));
        }
    }, [selectedMatiere, user]);

    const isTeacher = user?.role === 'ENSEIGNANT';

    // --- LOGIQUE DE SELECTION (Calculée avant le rendu) ---
    // 1. Identifier les classes uniques (ID) pour le premier menu déroulant
    const uniqueClassesIds = [...new Set(teacherData.map(d => d.classe_id))];

    // 2. Identifier l'objet actuellement sélectionné (qui contient une Classe ET une Matière unique)
    const currentData = isTeacher && teacherData.length > 0 ? teacherData[selectedClasseIdx] : null;

    // 3. Si une classe est sélectionnée (via currentData), quelles sont les autres matières disponibles pour cette même classe ?
    const availableSubjectsForClass = currentData
        ? teacherData.filter(d => d.classe_id === currentData.classe_id)
        : [];

    return (
        <div className="slide-up">
            <header style={{ marginBottom: '40px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
                    {isTeacher ? "Aperçu de mes Classes" : "Analyse par Matière"}
                </h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>
                    {isTeacher
                        ? `Consultez les résultats de vos élèves en ${currentData?.matiere || 'votre matière'}.`
                        : "Visualisez les performances par discipline."}
                </p>
            </header>

            <div className="glass-card" style={{ padding: '30px' }}>
                {isTeacher ? (
                    <>
                        {/* --- SÉLECTION CLASSE & MATIÈRE --- */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>

                            {/* 1. SÉLECTEUR DE CLASSE */}
                            <div>
                                <label style={{ fontWeight: '800', color: 'var(--secondary)', fontSize: '0.8rem', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                                    1. CLASSE
                                </label>
                                <select
                                    value={uniqueClassesIds.indexOf(currentData?.classe_id)}
                                    onChange={(e) => {
                                        const newClassId = uniqueClassesIds[parseInt(e.target.value)];
                                        // On trouve le PREMIER index dans teacherData qui correspond à cette classe
                                        const firstIndexForClass = teacherData.findIndex(d => d.classe_id === newClassId);
                                        if (firstIndexForClass !== -1) setSelectedClasseIdx(firstIndexForClass);
                                    }}
                                    style={inputStyle}
                                >
                                    {uniqueClassesIds.map((clsId, idx) => {
                                        // On cherche le nom de la classe (n'importe quelle entrée avec cet ID fera l'affaire)
                                        const clsLabel = teacherData.find(d => d.classe_id === clsId)?.classe_nom.split('(')[0].trim() || 'Classe';
                                        return <option key={idx} value={idx}>{clsLabel}</option>;
                                    })}
                                </select>
                            </div>

                            {/* 2. SÉLECTEUR DE MATIÈRE (Visible seulement si on a une classe) */}
                            <div>
                                <label style={{ fontWeight: '800', color: 'var(--secondary)', fontSize: '0.8rem', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                                    2. MATIÈRE
                                </label>
                                <select
                                    value={currentData?.matiere || ''}
                                    onChange={(e) => {
                                        const selectedMatiere = e.target.value;
                                        // On cherche l'index précis dans teacherData qui a (Même Classe ID + Nouvelle Matière)
                                        const realIndex = teacherData.findIndex(d => d.classe_id === currentData.classe_id && d.matiere === selectedMatiere);
                                        if (realIndex !== -1) setSelectedClasseIdx(realIndex);
                                    }}
                                    style={inputStyle}
                                    disabled={availableSubjectsForClass.length <= 1} // Désactivé s'il n'y a qu'une seule matière
                                >
                                    {availableSubjectsForClass.map((sub, idx) => (
                                        <option key={idx} value={sub.matiere}>{sub.matiere}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {currentData ? (
                            <div className="table-responsive fade-in" style={{ animationDelay: '0.2s' }}>
                                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '15px' }}>
                                    Résultats en <span style={{ fontWeight: '900' }}>{currentData.matiere}</span>
                                </h3>
                                <table style={tableStyle}>
                                    <thead>
                                        <tr style={headerStyle}>
                                            <th style={thStyle}>Élève</th>
                                            <th style={thStyle}>D1</th>
                                            <th style={thStyle}>D2</th>
                                            <th style={thStyle}>D3</th>
                                            <th style={thStyle}>I1</th>
                                            <th style={thStyle}>I2</th>
                                            <th style={thStyle}>I3</th>
                                            <th style={thStyle}>E1</th>
                                            <th style={{ ...thStyle, backgroundColor: '#f8fafc' }}>Moyenne</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.eleves.map((e, i) => (
                                            <tr key={i} style={rowStyle}>
                                                <td style={{ ...tdStyle, fontWeight: '700' }}>{e.eleve}</td>
                                                <td style={tdStyle}>{e.notes.D1 ?? '-'}</td>
                                                <td style={tdStyle}>{e.notes.D2 ?? '-'}</td>
                                                <td style={tdStyle}>{e.notes.D3 ?? '-'}</td>
                                                <td style={tdStyle}>{e.notes.I1 ?? '-'}</td>
                                                <td style={tdStyle}>{e.notes.I2 ?? '-'}</td>
                                                <td style={tdStyle}>{e.notes.I3 ?? '-'}</td>
                                                <td style={tdStyle}>{e.notes.E1 ?? '-'}</td>
                                                <td style={{ ...tdStyle, fontWeight: '900', color: 'var(--primary)', backgroundColor: '#f8fafc' }}>
                                                    {e.moyenne}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                                {loading ? "Chargement des classes..." : "Veuillez sélectionner une classe."}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', color: 'var(--secondary)' }}>
                                Discipline :
                            </label>
                            <select
                                onChange={(e) => setSelectedMatiere(e.target.value)}
                                value={selectedMatiere}
                                style={inputStyle}
                            >
                                <option value="">-- Choisir une matière --</option>
                                {matieres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
                            </select>
                        </div>

                        <table style={tableStyle}>
                            <thead>
                                <tr style={headerStyle}>
                                    <th style={thStyle}>Élève</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Note</th>
                                    <th style={{ ...thStyle, textAlign: 'right' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notes.length > 0 ? notes.map((n, index) => (
                                    <tr key={index} style={rowStyle}>
                                        <td style={tdStyle}>{n.nom} {n.prenom}</td>
                                        <td style={{ ...tdStyle, textAlign: 'center', fontWeight: '800', color: 'var(--secondary)' }}>
                                            {n.note} / 20
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--text-dim)' }}>
                                            {n.date_saisie ? new Date(n.date_saisie).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                                            Sélectionnez une matière pour voir les résultats.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff',
    outline: 'none',
    fontSize: '0.9rem',
    fontWeight: '600'
};

const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const headerStyle = { borderBottom: '2px solid #f1f5f9', textAlign: 'left', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10 };
const thStyle = { padding: '16px', fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '800' };
const tdStyle = { padding: '16px', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' };
const rowStyle = { transition: 'background 0.2s' };

export default NotesParMatiere;
