import React from 'react';

const BulletinHeader = () => (
  <div className="flex justify-between items-center border-b-2 border-[#F6B17A] pb-4 mb-6">
    <div>
      <h1 className="text-[#2D3250] text-3xl font-black italic">École+</h1>
      <p className="text-gray-500 text-sm">Excellence & Discipline</p>
    </div>
    <div className="text-right">
      <h2 className="text-xl font-bold text-[#2D3250]">BULLETIN DE NOTES</h2>
      <p className="bg-[#2D3250] text-white px-3 py-1 rounded mt-1 text-sm">1er Semestre</p>
    </div>
  </div>
);

const BulletinsList = () => {
  return (
    <div className="max-w-4xl mx-auto my-10 p-10 bg-white shadow-2xl rounded-sm border border-gray-100">
      <BulletinHeader />
      
      {/* Infos Élève */}
      <div className="grid grid-cols-2 gap-4 mb-8 text-[#2D3250]">
        <p><strong>Nom & Prénom :</strong> Kouassi Jean</p>
        <p><strong>Classe :</strong> Terminale C</p>
        <p><strong>Effectif :</strong> 32</p>
        <p><strong>Année :</strong> 2024-2025</p>
      </div>

      {/* Tableau des notes */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-[#2D3250] text-white">
            <th className="border p-2">Matières</th>
            <th className="border p-2">Coef</th>
            <th className="border p-2">Note</th>
            <th className="border p-2">Points</th>
            <th className="border p-2">Appréciation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2 font-bold">Mathématiques</td>
            <td className="border p-2 text-center">5</td>
            <td className="border p-2 text-center">14.00</td>
            <td className="border p-2 text-center">70.00</td>
            <td className="border p-2 text-sm italic">Bien</td>
          </tr>
          {/* Les autres lignes seront générées par un .map() sur vos données SQL */}
        </tbody>
        <tfoot>
          <tr className="bg-orange-50 font-bold">
            <td colSpan="3" className="border p-2 text-right">MOYENNE GÉNÉRALE</td>
            <td className="border p-2 text-center text-[#F6B17A]">14.50 / 20</td>
            <td className="border p-2 text-center">RANG : 3ème</td>
          </tr>
        </tfoot>
      </table>

      {/* Signature & Cachet */}
      <div className="mt-12 flex justify-end">
        <div className="text-center">
          <p className="font-bold text-[#2D3250] underline">Le Responsable Pédagogique</p>
          <div className="h-20 w-40 border-2 border-dashed border-gray-200 mt-2 flex items-center justify-center text-gray-300">
            Cachet de l'établissement
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulletinsList;