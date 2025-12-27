import React, { useState, useEffect } from 'react';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = 'http://localhost:8000/api';
    const getHeaders = () => ({
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/courses`, {
                    headers: getHeaders()
                });
                if (!response.ok) throw new Error('Erreur');
                const data = await response.json();
                setCourses(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) return <div>Chargement des cours...</div>;

    return (
        <div className="courses-view">
            <h2>Gestion des Cours</h2>
            <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                {courses.length > 0 ? courses.map(course => (
                    <div key={course.id} className="course-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h3>{course.subject || course.nom}</h3>
                        <p><strong>Classe:</strong> {course.classe?.nom || 'N/A'}</p>
                        <p><strong>Horaire:</strong> {course.heure_debut} - {course.heure_fin}</p>
                    </div>
                )) : <p>Aucun cours trouvé.</p>}
            </div>
        </div>
    );
};

export default Courses;
