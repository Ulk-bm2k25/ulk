import React from 'react';
import { X, Printer, Share2 } from 'lucide-react';

const StudentCardPreview = ({ student, onClose }) => {
  
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  // --- MAPPING BASE DE DONNÉES LARAVEL ---
  // Carte générée à la volée ou stockée dans `cartes_scolarite`
  const cardData = {
    ...student,
    // Via table `annee_scolaires`
    year: '2024 - 2025', 
    
    // Donnée médicale (souvent ajoutée dans une table `dossiers_medicaux` ou colonne extra dans `eleves`)
    // Pour l'instant simulé car absent des migrations actuelles
    blood: 'O+', 
    
    // Via table `parents_tuteurs` (téléphone du tuteur principal)
    emergency: student.parent?.phone || '+229 97 00 00 00', 
    
    // Via table `cartes_scolarite` (colonne `numero_carte`)
    // Ou via `users.username` si utilisé comme matricule
    matricule: student.id || 'MAT-PENDING'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Container Principal (Masqué à l'impression) */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] print:hidden">
        
        {/* Header Modal */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Aperçu Carte Scolaire</h2>
            <p className="text-xs text-slate-500">Format CR80 (Standard ISO 7810)</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Zone de Prévisualisation */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-100 flex flex-col items-center justify-center gap-8">
          
          {/* === DÉBUT ZONE IMPRESSION === */}
          {/* L'ID 'printable-card' est la seule chose visible quand on imprime */}
          <div id="printable-card" className="flex flex-col md:flex-row gap-8 items-center print:flex-row print:gap-4 print:items-start">
            
            {/* RECTO */}
            <div className="card-dimension bg-brand-dark rounded-xl overflow-hidden relative shadow-xl print:shadow-none text-white flex flex-col print:border print:border-slate-300">
               {/* Design de fond */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full -mr-10 -mt-10 opacity-20"></div>
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 rounded-full -ml-8 -mb-8 opacity-20"></div>

               {/* Header Carte */}
               <div className="p-4 flex justify-between items-start z-10">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-bold text-lg text-white">É</div>
                     <div className="leading-tight">
                        <div className="font-bold text-sm tracking-wide text-white">SCHOOL-Hub</div>
                        <div className="text-[10px] text-slate-300">Excellence Académique</div>
                     </div>
                  </div>
                  <div className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-white">
                     {cardData.year}
                  </div>
               </div>

               {/* Corps Carte */}
               <div className="flex-1 px-4 flex items-center gap-4 z-10">
                  {/* Photo */}
                  <div className="w-24 h-24 bg-slate-200 rounded-lg border-2 border-orange-500 overflow-hidden shrink-0">
                     <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-500 text-2xl font-bold">
                        {cardData.firstName?.[0]}{cardData.lastName?.[0]}
                     </div>
                  </div>
                  
                  {/* Infos */}
                  <div className="space-y-1">
                     <h3 className="font-bold text-lg uppercase leading-tight text-orange-400 truncate w-40">
                        {cardData.lastName}
                     </h3>
                     <div className="font-medium text-white text-base truncate w-40">
                        {cardData.firstName}
                     </div>
                     
                     <div className="pt-2 space-y-0.5">
                        <div className="text-[10px] text-slate-400 uppercase">Classe</div>
                        <div className="font-bold text-sm text-white">{cardData.class}</div>
                     </div>
                     
                     <div className="space-y-0.5">
                        <div className="text-[10px] text-slate-400 uppercase">Matricule</div>
                        <div className="font-mono text-sm tracking-wider text-white">{cardData.matricule}</div>
                     </div>
                  </div>
               </div>

               {/* Footer Carte */}
               <div className="bg-orange-500 h-2 w-full mt-auto"></div>
            </div>

            {/* VERSO */}
            <div className="card-dimension bg-white rounded-xl overflow-hidden relative shadow-xl print:shadow-none border border-slate-200 flex flex-col">
               <div className="p-4 flex-1 flex flex-col">
                  
                  <div className="flex justify-between items-start">
                     <div className="space-y-2">
                        <div>
                           <div className="text-[9px] text-slate-500 uppercase font-bold">Groupe Sanguin</div>
                           <div className="font-bold text-slate-800">{cardData.blood}</div>
                        </div>
                        <div>
                           <div className="text-[9px] text-slate-500 uppercase font-bold">Contact Urgence</div>
                           <div className="font-bold text-slate-800 text-sm">{cardData.emergency}</div>
                        </div>
                     </div>
                     
                     {/* QR Code pour Projet 4 (Présence) */}
                     <div className="text-center space-y-1">
                        <div className="w-20 h-20 bg-slate-900 p-1 rounded">
                           {/* API QR Code publique pour la démo */}
                           <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${cardData.matricule}`} 
                              alt="QR Code" 
                              className="w-full h-full object-cover bg-white"
                           />
                        </div>
                        <div className="text-[8px] text-slate-400">Scan Présence</div>
                     </div>
                  </div>

                  <div className="mt-auto space-y-3">
                     <div className="text-[8px] text-slate-400 leading-tight text-justify">
                        Cette carte est la propriété de l'établissement SchoolHUb. Elle doit être présentée à toute réquisition.
                     </div>
                     
                     <div className="flex justify-between items-end border-t border-slate-100 pt-2">
                         <div className="text-[8px] text-slate-500">
                             www.schoolhub-enseignement.com
                         </div>
                         <div className="text-center">
                             <div className="h-8 w-20 mb-1 flex items-end justify-center">
                                 <span className="font-serif italic text-slate-400 text-xs">Le Directeur</span>
                             </div>
                             <div className="h-px w-20 bg-slate-300"></div>
                         </div>
                     </div>
                  </div>
               </div>
               <div className="bg-brand-dark h-2 w-full mt-auto"></div>
            </div>

          </div>
          {/* === FIN ZONE IMPRESSION === */}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Share2 size={16} />
            Envoyer par mail
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
          >
            <Printer size={16} />
            Imprimer
          </button>
        </div>
      </div>

      {/* Styles CSS pour l'impression spécifique à ce composant */}
      <style>{`
        /* Format Carte Bancaire CR80 */
        .card-dimension {
          width: 85.6mm;
          height: 53.98mm;
          min-width: 85.6mm;
          min-height: 53.98mm;
        }
        
        @media print {
          @page { 
            size: landscape; 
            margin: 10mm; 
          }
          
          body * { 
            visibility: hidden; 
          }
          
          /* Seul l'élément #printable-card et ses enfants sont visibles */
          #printable-card, #printable-card * { 
            visibility: visible; 
          }
          
          #printable-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10mm; /* Espace entre recto et verso sur le papier */
          }

          /* Force l'impression des couleurs de fond (important pour Chrome/Edge) */
          .card-dimension {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            border: 1px solid #ccc; /* Bordure légère pour découpe */
          }
        }
      `}</style>
    </div>
  );
};

export default StudentCardPreview;