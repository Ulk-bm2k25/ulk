import React, { useState, useEffect } from 'react';

const BulletinEleve = ({ eleveId }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (eleveId) {
            fetch(`http://localhost/Projet/backend/get_bulletin.php?eleve_id=${eleveId}`)
                .then(res => res.json())
                .then(res => {
                    if (res.error) console.error(res.error);
                    else setData(res);
                });
        }
    }, [eleveId]);

    if (!data) return <div>Chargement...</div>;

    return (
        <div className="group3-container">
            <div className="form-card">
                <h3>📊 Bulletin de notes</h3>
                <div style={{ marginBottom: '15px', fontWeight: 'bold' }}>
                    Moyenne Générale : <span style={{ color: 'var(--primary)' }}>{data.moyenne_generale} / 20</span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#1a2a44', color: 'white' }}>
                            <th style={{ padding: '10px' }}>Matière</th>
                            <th>Coeff</th>
                            <th>Moyenne</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.notes.map((n, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                                <td style={{ padding: '10px' }}>{n.matiere}</td>
                                <td>{n.coefficient}</td>
                                <td style={{ fontWeight: 'bold', color: n.moyenne >= 10 ? 'green' : 'red' }}>
                                    {parseFloat(n.moyenne).toFixed(2)}
                                </td>
                                <td>{parseFloat(n.total_matiere).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                            <td style={{ padding: '10px' }}>TOTAL</td>
                            <td>{data.total_coefficients}</td>
                            <td>-</td>
                            <td>{data.total_points}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default BulletinEleve;