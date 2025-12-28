import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config';

const ConsulterBulletin = () => {
    const [classes, setClasses] = useState([]);
    const [eleves, setEleves] = useState([]);
    const [semestres, setSemestres] = useState([]);

    const [selectedClasse, setSelectedClasse] = useState('');
    const [selectedEleve, setSelectedEleve] = useState('');
    const [selectedSemestre, setSelectedSemestre] = useState('');
    const [type, setType] = useState('semestre');
    const [data, setData] = useState(null);
    const [allBulletins, setAllBulletins] = useState(null);
    const [loadingBulk, setLoadingBulk] = useState(false);
    const bulletinRef = useRef();

    useEffect(() => {
        fetch(`${API_BASE_URL}/get_classes.php`).then(res => res.json()).then(setClasses);
        fetch(`${API_BASE_URL}/get_semestres.php`).then(res => res.json()).then(setSemestres);
    }, []);

    useEffect(() => {
        if (selectedClasse) {
            fetch(`${API_BASE_URL}/get_eleves.php?classe_id=${selectedClasse}`)
                .then(res => res.json())
                .then(setEleves);
        }
    }, [selectedClasse]);

    const handleFetch = () => {
        if (!selectedEleve) return;
        if (type === 'semestre' && !selectedSemestre) {
            alert("Veuillez choisir un semestre.");
            return;
        }

        let url = `${API_BASE_URL}/get_bulletin.php?eleve_id=${selectedEleve}&type=${type}`;
        if (type === 'semestre') url += `&semestre_id=${selectedSemestre}`;

        fetch(url)
            .then(res => res.json())
            .then(res => {
                if (res.error) alert(res.error);
                else {
                    setData(res);
                    setAllBulletins(null);
                }
            });
    };

    const handleFetchAll = async () => {
        if (!selectedClasse) {
            alert("Veuillez choisir une classe.");
            return;
        }
        if (type === 'semestre' && !selectedSemestre) {
            alert("Veuillez choisir un semestre.");
            return;
        }

        setLoadingBulk(true);
        try {
            let url = `${API_BASE_URL}/get_all_bulletins_classe.php?classe_id=${selectedClasse}&type=${type}`;
            if (type === 'semestre') url += `&semestre_id=${selectedSemestre}`;

            const res = await fetch(url);
            const batchData = await res.json();

            if (batchData.error) {
                alert(batchData.error);
            } else {
                setAllBulletins(batchData.bulletins);
                setData(null);
            }
        } catch (err) {
            alert("Erreur lors de la récupération des bulletins.");
        } finally {
            setLoadingBulk(false);
        }
    };

    const handleDownload = () => {
        if (!data) return;
        const eleveObj = eleves.find(e => e.id === parseInt(selectedEleve));
        const classeObj = classes.find(c => c.id == selectedClasse);
        const semestreObj = semestres.find(s => s.id == selectedSemestre);
        const filename = `Bulletin_${eleveObj?.nom}_${eleveObj?.prenom}_${type}.pdf`;

        const htmlContent = generateBulletinHTML(data, eleveObj, classeObj, semestreObj, type);
        const opt = {
            margin: 0,
            filename: filename,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        if (window.html2pdf) {
            window.html2pdf().from(htmlContent).set(opt).save();
        } else {
            alert("Erreur: La librairie PDF n'est pas chargée.");
        }
    };

    const handleDownloadAll = async () => {
        if (!selectedClasse) {
            alert("Veuillez choisir une classe.");
            return;
        }
        if (type === 'semestre' && !selectedSemestre) {
            alert("Veuillez choisir un semestre.");
            return;
        }

        const confirmDownload = window.confirm(`Voulez-vous générer les bulletins de toute la classe ? Cela peut prendre quelques instants.`);
        if (!confirmDownload) return;

        setLoadingBulk(true);
        try {
            let url = `${API_BASE_URL}/get_all_bulletins_classe.php?classe_id=${selectedClasse}&type=${type}`;
            if (type === 'semestre') url += `&semestre_id=${selectedSemestre}`;

            const res = await fetch(url);
            const batchData = await res.json();

            if (batchData.error) {
                alert(batchData.error);
                return;
            }

            const classeObj = classes.find(c => c.id == selectedClasse);
            const semestreObj = semestres.find(s => s.id == selectedSemestre);
            const filename = `Bulletins_Complets_${classeObj?.nom}_${type}.pdf`;

            let combinedHTML = '';
            batchData.bulletins.forEach((bulletin, index) => {
                const studentHTML = generateBulletinHTML(bulletin, bulletin.eleve, classeObj, semestreObj, type);
                combinedHTML += studentHTML;
                if (index < batchData.bulletins.length - 1) {
                    combinedHTML += '<div class="html2pdf__page-break"></div>';
                }
            });

            const opt = {
                margin: 0,
                filename: filename,
                image: { type: 'jpeg', quality: 1.0 },
                html2canvas: { scale: 1.5, useCORS: true, letterRendering: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            if (window.html2pdf) {
                window.html2pdf().from(combinedHTML).set(opt).save();
            }
        } catch (err) {
            alert("Erreur lors de la génération en masse.");
        } finally {
            setLoadingBulk(false);
        }
    };

    const generateBulletinHTML = (bulletinData, eleveObj, classeObj, semestreObj, type) => {
        return `
            <div style="font-family: 'Helvetica', 'Arial', sans-serif; padding: 5px 40px 40px; color: #1e293b; background: white; width: 210mm; min-height: 297mm; margin: 0 auto; box-sizing: border-box; position: relative;">
                <div style="display: flex; justify-content: space-between; border-bottom: 3px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px;">
                    <div style="text-align: left;">
                        <h1 style="margin: 0; font-size: 28px; color: #1e40af; font-weight: 800;">ÉCOLE PLUS</h1>
                        <p style="margin: 5px 0; font-size: 14px; color: #64748b; font-style: italic;">"L'Excellence au service du Savoir"</p>
                        <p style="margin: 2px 0; font-size: 12px;">BP: 1234 - République du Bénin</p>
                    </div>
                    <div style="text-align: right;">
                        <h2 style="margin: 0; font-size: 16px; color: #334155;">ANNÉE SCOLAIRE 2025-2026</h2>
                        <div style="margin-top: 10px; padding: 8px 15px; background: #f1f5f9; border-radius: 5px; display: inline-block;">
                            <span style="font-weight: bold; color: #1e40af;">${type === 'annuel' ? 'SYNTHÈSE ANNUELLE' : (semestreObj?.nom || 'SEMESTRE')}</span>
                        </div>
                    </div>
                </div>
                <div style="text-align: center; margin-bottom: 40px;">
                    <h2 style="font-size: 28px; color: #ea580c; margin: 0; font-weight: 900; letter-spacing: 2px;">${type === 'annuel' ? 'BULLETIN DE SYNTHÈSE ANNUELLE' : 'BULLETIN DE NOTES SEMESTRIEL'}</h2>
                    <div style="height: 4px; width: 100px; background: #ea580c; margin: 10px auto; border-radius: 2px;"></div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div>
                        <p style="margin: 5px 0;"><strong>NOM ET PRÉNOMS :</strong></p>
                        <p style="margin: 0; font-size: 18px; color: #1e40af; text-transform: uppercase; font-weight: 800;">${eleveObj?.nom} ${eleveObj?.prenom}</p>
                    </div>
                    <div>
                        <p style="margin: 5px 0;"><strong>CLASSE :</strong> <span style="font-size: 16px;">${classeObj?.nom || '-'}</span></p>
                        <p style="margin: 5px 0;"><strong>EFFECTIF :</strong> ${eleves.length} élèves</p>
                    </div>
                </div>
                ${type === 'annuel' ? `
                    <div style="padding: 30px; background: #f8fafc; border-radius: 12px; margin-bottom: 40px; border: 2px solid #e2e8f0; text-align: center;">
                        <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #1e40af; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">RÉCAPITULATIF DES SEMESTRES</h3>
                        <div style="display: flex; justify-content: space-around; margin-bottom: 30px;">
                            <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1; min-width: 150px;">
                                <p style="margin: 0; font-size: 12px; font-weight: bold; color: #64748b;">MOYENNE SEMESTRE 1</p>
                                <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: 900; color: #1e40af;">${bulletinData.moyenne_s1 || '--'} / 20</p>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1; min-width: 150px;">
                                <p style="margin: 0; font-size: 12px; font-weight: bold; color: #64748b;">MOYENNE SEMESTRE 2</p>
                                <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: 900; color: #1e40af;">${bulletinData.moyenne_s2 || '--'} / 20</p>
                            </div>
                        </div>
                        <p style="font-size: 14px; font-style: italic; color: #64748b;">
                            La moyenne annuelle est obtenue en faisant la moyenne arithmétique des résultats des deux semestres.
                        </p>
                    </div>
                ` : `
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; border: 2px solid #334155;">
                        <thead>
                            <tr style="background-color: #1e40af; color: white;">
                                <th style="border: 1px solid #334155; padding: 12px; text-align: left;">MATIÈRE</th>
                                <th style="border: 1px solid #334155; padding: 12px; text-align: center;">COEFF.</th>
                                <th style="border: 1px solid #334155; padding: 12px; text-align: center;">MOYENNE / 20</th>
                                <th style="border: 1px solid #334155; padding: 12px; text-align: center;">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bulletinData.notes.map(n => `
                                <tr>
                                    <td style="border: 1px solid #334155; padding: 10px; font-weight: bold;">${n.matiere}</td>
                                    <td style="border: 1px solid #334155; padding: 10px; text-align: center;">${n.coefficient}</td>
                                    <td style="border: 1px solid #334155; padding: 10px; text-align: center; font-weight: bold;">${n.moyenne}</td>
                                    <td style="border: 1px solid #334155; padding: 10px; text-align: center;">${parseFloat(n.total_matiere).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr style="background-color: #e2e8f0; font-weight: 900;">
                                <td style="border: 1px solid #334155; padding: 12px;">BILAN GÉNÉRAL</td>
                                <td style="border: 1px solid #334155; padding: 12px; text-align: center;">${bulletinData.total_coefficients}</td>
                                <td style="border: 1px solid #334155; padding: 12px; text-align: center;">-</td>
                                <td style="border: 1px solid #334155; padding: 12px; text-align: center;">${bulletinData.total_points} pts</td>
                            </tr>
                        </tfoot>
                    </table>
                `}
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 50px;">
                    <div style="border: 3px solid #1e40af; padding: 25px; border-radius: 12px; text-align: center; background: #f0f7ff; min-width: 250px;">
                        <p style="margin: 0; font-size: 16px; color: #1e40af; font-weight: bold;">MOYENNE GÉNÉRALE</p>
                        <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: 900; color: #0f172a;">${bulletinData.moyenne_generale} / 20</p>
                        ${type === 'annuel' ? `
                            <div style="margin-top: 15px; padding: 10px; border: 3px solid ${bulletinData.moyenne_generale >= 10 ? '#16a34a' : '#dc2626'}; border-radius: 8px; background: white;">
                                <span style="font-size: 24px; font-weight: 900; color: ${bulletinData.moyenne_generale >= 10 ? '#16a34a' : '#dc2626'}; uppercase">
                                    ${bulletinData.moyenne_generale >= 10 ? 'PASSE' : 'REDOUBLE'}
                                </span>
                            </div>
                        ` : ''}
                    </div>
                    <div style="text-align: center; width: 300px;">
                        <p style="margin-bottom: 60px; font-weight: bold;">Le Chef d'Établissement</p>
                        <div style="border-bottom: 2px solid #334155; width: 100%;"></div>
                    </div>
                </div>
                <div style="position: absolute; bottom: 40px; left: 0; width: 100%; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                    École Plus - Document Officiel - ${new Date().toLocaleDateString('fr-FR')}
                </div>
            </div>
        `;
    };

    return (
        <div className="slide-up">
            <style>
                {`
                    .pdf-capture {
                        animation: none !important;
                        transform: none !important;
                        box-shadow: none !important;
                        margin: 0 !important;
                        width: 794px !important;
                        padding: 30px !important;
                        background: white !important;
                        borderRadius: 0 !important;
                    }
                    @media print {
                        
                        aside, .sidebar, header, .no-print, .glass-card:not(.bulletin-print-zone) {
                            display: none !important;
                        }
                        
                        
                        .bulletin-print-zone {
                            position: absolute !important;
                            top: 0 !important;
                            left: 0 !important;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 2mm !important;
                            box-shadow: none !important;
                            border: none !important;
                            background: white !important;
                        }
                        
                        
                        body { background: white !important; }
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    }
                `}
            </style>
            <header style={{ marginBottom: '48px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Édition des Bulletins</h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Générez les rapports officiels semestriels et annuels.</p>
            </header>

            <div className="glass-card no-print" style={styles.filterBar}>
                <div style={styles.filterGroup}>
                    <Selector label="Classe" value={selectedClasse} onChange={setSelectedClasse} options={classes} />
                    <Selector label="Élève" value={selectedEleve} onChange={setSelectedEleve} options={eleves} disabled={!selectedClasse} />

                    <div style={styles.field}>
                        <label style={styles.label}>Type de Rapport</label>
                        <select value={type} onChange={e => setType(e.target.value)} style={styles.input}>
                            <option value="semestre">Semestriel</option>
                            <option value="annuel">Synthèse Annuelle</option>
                        </select>
                    </div>

                    {type === 'semestre' && (
                        <Selector label="Semestre" value={selectedSemestre} onChange={setSelectedSemestre} options={semestres} />
                    )}
                </div>
                <div style={styles.actionGroup}>
                    <div style={styles.actionRow}>
                        <button onClick={handleFetch} className="btn-premium" style={{ flex: 1, padding: '12px', borderRadius: '30px' }}>
                            👤 VOIR ÉLÈVE
                        </button>
                        <button
                            onClick={handleFetchAll}
                            className="btn-premium"
                            style={{ flex: 1, padding: '12px', backgroundColor: '#8b5cf6', borderRadius: '30px' }}
                            disabled={loadingBulk || !selectedClasse}
                        >
                            {loadingBulk ? '⏳...' : '📋 VOIR CLASSE'}
                        </button>
                    </div>
                    <button
                        onClick={handleDownloadAll}
                        className="btn-premium"
                        style={{ width: '60%', padding: '12px', backgroundColor: '#1e40af', borderRadius: '30px', margin: '0 auto' }}
                        disabled={loadingBulk || !selectedClasse || (type === 'semestre' && !selectedSemestre)}
                    >
                        {loadingBulk ? '⏳...' : '📥 TÉLÉCHARGER TOUT (PDF)'}
                    </button>
                </div>
            </div>



            {data && (
                <div ref={bulletinRef} className="glass-card slide-up bulletin-print-zone" style={{ padding: '40px', marginTop: '32px', background: '#fff' }}>
                    <BulletinView
                        bulletin={data}
                        eleve={eleves.find(e => e.id == selectedEleve)}
                        classe={classes.find(c => c.id == selectedClasse)}
                        semestre={semestres.find(s => s.id == selectedSemestre)}
                        type={type}
                        onPrint={() => window.print()}
                        onDownload={handleDownload}
                        elevesCount={eleves.length}
                    />
                </div>
            )}

            {allBulletins && (
                <div style={{ marginTop: '32px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                        padding: '24px',
                        borderRadius: '20px',
                        marginBottom: '32px',
                        textAlign: 'center',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <h2 style={{
                            color: 'white',
                            margin: 0,
                            fontSize: '1.8rem',
                            fontWeight: '800',
                            letterSpacing: '0.5px'
                        }}>
                            📚 Bulletins de la Classe : <span style={{ color: '#fbbf24' }}>{classes.find(c => c.id == selectedClasse)?.nom}</span>
                        </h2>
                    </div>
                    {allBulletins.map((bulletin, idx) => (
                        <div key={idx} className="glass-card slide-up" style={{ padding: '40px', marginBottom: '32px', background: '#fff' }}>
                            <BulletinView
                                bulletin={bulletin}
                                eleve={bulletin.eleve}
                                classe={classes.find(c => c.id == selectedClasse)}
                                semestre={semestres.find(s => s.id == selectedSemestre)}
                                type={type}
                                elevesCount={allBulletins.length}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const BulletinView = ({ bulletin, eleve, classe, semestre, type, onPrint, onDownload, elevesCount }) => {
    return (
        <div>
            <div style={styles.bulletinHeader}>
                <div style={{ flex: 1 }}>
                    <h2 style={{
                        fontSize: '2.2rem',
                        color: '#ea580c',
                        marginBottom: '10px',
                        fontWeight: '900',
                        letterSpacing: '1px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        {type === 'annuel' ? "BULLETIN DE SYNTHÈSE ANNUELLE" : "BULLETIN DE NOTES SEMESTRIEL"}
                    </h2>
                    <div style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '700' }}>
                        ÉLÈVE : <span style={{ color: 'var(--secondary)', textTransform: 'uppercase' }}>
                            {eleve?.prenom} {eleve?.nom}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '30px', marginTop: '5px', fontSize: '0.95rem', color: '#64748b', fontWeight: '600' }}>
                        <span>CLASSE : {classe?.nom}</span>
                        {type === 'semestre' && (
                            <span>SEMESTRE : {semestre?.nom}</span>
                        )}
                        <span>EFFECTIF : {elevesCount} élèves</span>
                    </div>
                </div>
                {type === 'annuel' && (
                    <div style={{
                        padding: '10px 20px',
                        background: bulletin.moyenne_generale >= 10 ? '#dcfce7' : '#fee2e2',
                        color: bulletin.moyenne_generale >= 10 ? '#166534' : '#991b1b',
                        borderRadius: '12px',
                        fontWeight: '900',
                        fontSize: '1.2rem',
                        textAlign: 'center',
                        border: `2px solid ${bulletin.moyenne_generale >= 10 ? '#166534' : '#991b1b'}`,
                        minWidth: '150px'
                    }}>
                        {bulletin.moyenne_generale >= 10 ? 'ADMIS' : 'REFUSÉ'}
                    </div>
                )}
                <div style={styles.summaryBadge}>
                    MOYENNE GÉNÉRALE : <br />
                    <span style={{ fontSize: '1.8rem', fontWeight: '900' }}>{bulletin.moyenne_generale} / 20</span>
                </div>
            </div>

            {type === 'annuel' ? (
                <div style={{ padding: '40px', background: '#f8fafc', borderRadius: '15px', border: '2px dashed #e2e8f0', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '20px' }}>
                        Synthèse basée sur les résultats globaux des deux semestres.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', maxWidth: '500px', margin: '0 auto 30px' }}>
                        <div style={{ padding: '20px', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Semestre 1</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--secondary)' }}>{bulletin.moyenne_s1 || '--'} / 20</div>
                        </div>
                        <div style={{ padding: '20px', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Semestre 2</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--secondary)' }}>{bulletin.moyenne_s2 || '--'} / 20</div>
                        </div>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>
                        MOYENNE GÉNÉRALE ANNUELLE :
                        <span style={{ fontSize: '2.5rem', display: 'block', marginTop: '10px' }}>{bulletin.moyenne_generale} / 20</span>
                    </div>

                    <div style={{
                        marginTop: '30px',
                        padding: '15px 30px',
                        display: 'inline-block',
                        borderRadius: '50px',
                        background: bulletin.moyenne_generale >= 10 ? '#dcfce7' : '#fee2e2',
                        color: bulletin.moyenne_generale >= 10 ? '#166534' : '#991b1b',
                        fontWeight: '900',
                        fontSize: '1.2rem',
                        border: '2px solid currentColor'
                    }}>
                        {bulletin.moyenne_generale >= 10 ? 'PASSE' : 'REDOUBLE'}
                    </div>
                </div>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.th}>Matière</th>
                            <th style={styles.th}>Coefficient</th>
                            <th style={styles.th}>Moyenne (/20)</th>
                            <th style={styles.th}>Total Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bulletin.notes.map((n, i) => (
                            <tr key={i} style={styles.tr}>
                                <td style={{ ...styles.td, fontWeight: '700' }}>{n.matiere}</td>
                                <td style={styles.td}>{n.coefficient}</td>
                                <td style={{ ...styles.td, color: 'var(--secondary)', fontWeight: '800' }}>{n.moyenne}</td>
                                <td style={styles.td}>{parseFloat(n.total_matiere).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr style={{ borderTop: '2px solid var(--glass-border)' }}>
                            <td style={{ ...styles.td, fontWeight: '900' }}>TOTAL GÉNÉRAL</td>
                            <td style={styles.td}>{bulletin.total_coefficients}</td>
                            <td style={styles.td}>-</td>
                            <td style={{ ...styles.td, fontWeight: '900', color: 'var(--primary)' }}>{bulletin.total_points} pts</td>
                        </tr>
                    </tfoot>
                </table>
            )}

            {onPrint && (
                <div className="no-print" style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                    <button onClick={onPrint} className="btn-premium" style={{ padding: '14px 28px' }}>
                        🖨️ IMPRIMER
                    </button>
                    <button onClick={onDownload} className="btn-premium" style={{ padding: '14px 28px', backgroundColor: '#10b981' }}>
                        📥 TÉLÉCHARGER PDF
                    </button>
                </div>
            )}
        </div>
    );
};

const Selector = ({ label, value, onChange, options, disabled }) => (
    <div style={styles.field}>
        <label style={styles.label}>{label}</label>
        <select value={value} onChange={e => onChange(e.target.value)} style={styles.input} disabled={disabled}>
            <option value="">Choisir...</option>
            {options.map(o => <option key={o.id} value={o.id}>{o.nom} {o.prenom || ''}</option>)}
        </select>
    </div>
);

const styles = {
    filterBar: { display: 'flex', flexDirection: 'column', gap: '24px', padding: '30px' },
    filterGroup: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    actionGroup: { display: 'flex', flexDirection: 'column', gap: '12px' },
    actionRow: { display: 'flex', gap: '12px' },
    field: { display: 'flex', flexDirection: 'column', gap: '10px' },
    label: { fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' },
    input: { width: '100%', padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', color: 'var(--secondary)', outline: 'none' },
    bulletinHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '24px', borderBottom: '2px solid #f1f5f9' },
    summaryBadge: { background: 'var(--secondary)', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: '700' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeader: { textAlign: 'left', background: '#fcfdfe' },
    th: { padding: '16px 20px', fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' },
    tr: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '16px 20px', fontSize: '0.95rem' }
};

export default ConsulterBulletin;