import React, { useState, useEffect } from 'react';
import { FileText, Download, Search, Filter } from 'lucide-react';
import api from '../../../api';

const Bulletins = () => {
  const [classes, setClasses] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    classe_id: '',
    semestre_id: '',
    search: '',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (filters.classe_id && filters.semestre_id) {
      loadStudents();
    }
  }, [filters.classe_id, filters.semestre_id]);

  const loadInitialData = async () => {
    // TODO: API calls
    setClasses([{ id: 1, name: '6ème A' }, { id: 2, name: 'Terminale D' }]);
    setSemestres([{ id: 1, nom: 'Trimestre 1' }, { id: 2, nom: 'Trimestre 2' }]);
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      // TODO: await api.get(`/bulletins`, { params: filters });
      
      // Mock data
      setStudents([
        {
          id: 1,
          nom: 'Dupont',
          prenom: 'Jean',
          moyenne: 15.5,
          rang: 1,
          bulletin_generated: true,
        },
        {
          id: 2,
          nom: 'Martin',
          prenom: 'Marie',
          moyenne: 12.0,
          rang: 2,
          bulletin_generated: false,
        },
      ]);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBulletin = async (studentId) => {
    try {
      // TODO: await api.post(`/bulletins/generate`, {
      //   eleve_id: studentId,
      //   semestre_id: filters.semestre_id,
      // });
      alert('Bulletin généré avec succès');
      loadStudents();
    } catch (error) {
      console.error('Erreur génération:', error);
      alert('Erreur lors de la génération du bulletin');
    }
  };

  const handleDownloadBulletin = async (studentId) => {
    try {
      // TODO: const response = await api.get(`/bulletins/${studentId}/download`, {
      //   responseType: 'blob',
      // });
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', `bulletin_${studentId}.pdf`);
      // document.body.appendChild(link);
      // link.click();
      alert('Téléchargement du bulletin...');
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      alert('Erreur lors du téléchargement');
    }
  };

  const filteredStudents = students.filter(s =>
    `${s.prenom} ${s.nom}`.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="text-orange-600" size={28} />
          Bulletins de Notes
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Générez et téléchargez les bulletins de notes par semestre/trimestre
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Classe *</label>
            <select
              value={filters.classe_id}
              onChange={(e) => setFilters({ ...filters, classe_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
            >
              <option value="">Sélectionner...</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Semestre/Trimestre *</label>
            <select
              value={filters.semestre_id}
              onChange={(e) => setFilters({ ...filters, semestre_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
            >
              <option value="">Sélectionner...</option>
              {semestres.map(s => (
                <option key={s.id} value={s.id}>{s.nom}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rechercher un élève</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Nom ou prénom..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des élèves */}
      {loading ? (
        <div className="text-center py-10">Chargement...</div>
      ) : filteredStudents.length > 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Élève</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Moyenne</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Rang</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {student.prenom} {student.nom}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-slate-800">{student.moyenne.toFixed(2)}</span>
                    <span className="text-sm text-slate-500">/20</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{student.rang}</td>
                  <td className="px-6 py-4">
                    {student.bulletin_generated ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        Généré
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                        Non généré
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {student.bulletin_generated ? (
                        <button
                          onClick={() => handleDownloadBulletin(student.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                        >
                          <Download size={18} />
                          Télécharger
                        </button>
                      ) : (
                        <button
                          onClick={() => handleGenerateBulletin(student.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
                        >
                          <FileText size={18} />
                          Générer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : filters.classe_id && filters.semestre_id ? (
        <div className="text-center py-10 text-slate-400">
          Aucun élève trouvé
        </div>
      ) : (
        <div className="text-center py-10 text-slate-400">
          Sélectionnez une classe et un semestre pour commencer
        </div>
      )}
    </div>
  );
};

export default Bulletins;

