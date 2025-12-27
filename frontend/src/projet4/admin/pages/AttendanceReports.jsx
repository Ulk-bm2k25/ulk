import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, Calendar } from 'lucide-react';
import api from '../../../api';

const AttendanceReports = () => {
  const [classes, setClasses] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    classe_id: '',
    date_debut: '',
    date_fin: '',
  });

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (filters.classe_id && filters.date_debut && filters.date_fin) {
      loadReports();
    }
  }, [filters]);

  const loadClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data || []);
    } catch (error) {
      console.error('Erreur chargement classes:', error);
      setClasses([]);
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.classe_id) params.append('classe_id', filters.classe_id);
      if (filters.date_debut) params.append('date_debut', filters.date_debut);
      if (filters.date_fin) params.append('date_fin', filters.date_fin);
      
      const response = await api.get(`/presence/reports?${params.toString()}`);
      setReports(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement rapports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!filters.classe_id || !filters.date_debut || !filters.date_fin) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await api.post('/presence/reports/generate', filters, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport_presence_${filters.date_debut}_${filters.date_fin}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur génération:', error);
      alert(error.response?.data?.message || 'Erreur lors de la génération');
    }
  };

  const handleDownloadReport = async (reportId) => {
    try {
      // TODO: const response = await api.get(`/presence/reports/${reportId}/download`, {
      //   responseType: 'blob',
      // });
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', `rapport_${reportId}.pdf`);
      // document.body.appendChild(link);
      // link.click();
      alert('Téléchargement du rapport...');
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      alert('Erreur lors du téléchargement');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="text-orange-600" size={28} />
          Rapports de Présence
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Générez et téléchargez les rapports de présence au format PDF
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Date début *</label>
            <input
              type="date"
              value={filters.date_debut}
              onChange={(e) => setFilters({ ...filters, date_debut: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date fin *</label>
            <input
              type="date"
              value={filters.date_fin}
              onChange={(e) => setFilters({ ...filters, date_fin: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={!filters.classe_id || !filters.date_debut || !filters.date_fin}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText size={20} />
              Générer PDF
            </button>
          </div>
        </div>
      </div>

      {/* Liste des rapports */}
      {loading ? (
        <div className="text-center py-10">Chargement...</div>
      ) : reports.length > 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Classe</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Présents</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Absents</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Taux</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-800">
                    {new Date(report.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-slate-800">{report.classe}</td>
                  <td className="px-6 py-4 text-green-600 font-semibold">{report.presents}</td>
                  <td className="px-6 py-4 text-red-600 font-semibold">{report.absents}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {report.taux_presence}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDownloadReport(report.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      <Download size={18} />
                      Télécharger
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : filters.classe_id && filters.date_debut && filters.date_fin ? (
        <div className="text-center py-10 text-slate-400 bg-white rounded-lg border border-slate-200">
          Aucun rapport disponible pour cette période
        </div>
      ) : (
        <div className="text-center py-10 text-slate-400 bg-white rounded-lg border border-slate-200">
          Sélectionnez une classe et une période pour générer un rapport
        </div>
      )}
    </div>
  );
};

export default AttendanceReports;

