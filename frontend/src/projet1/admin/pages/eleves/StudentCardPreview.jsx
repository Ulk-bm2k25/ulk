import React, { useState, useRef } from 'react';
import { X, Share2, Loader2, FileDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const StudentCardPreview = ({ student, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const printTemplateRef = useRef(null);

  if (!student) return null;

  const cardData = {
    ...student,
    year: '2025 - 2026',
    blood: 'O+', 
    emergency: student.parent?.phone || '+229 97 00 00 00', 
    matricule: student.id || 'MAT-PENDING'
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    
    const element = printTemplateRef.current;
    if (!element) { setIsGenerating(false); return; }

    try {
        // Capture haute résolution
        const canvas = await html2canvas(element, {
            scale: 2, 
            useCORS: true, // Important pour l'image QR Code externe
            backgroundColor: '#ffffff',
            logging: false,
            width: 1050, 
            height: 350
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4'); // Paysage, mm, A4
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdfWidth - 20; // Marge 10mm
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        
        const x = 10;
        const y = (pdfHeight - imgHeight) / 2; // Centré verticalement

        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save(`Carte_${cardData.matricule}.pdf`);

    } catch (error) {
        console.error("Erreur PDF:", error);
        alert("Erreur lors de la création du PDF. Vérifiez la console.");
    } finally {
        setIsGenerating(false);
    }
  };

  // --- STYLES INLINE (Template Caché pour le rendu PDF) ---
  const styles = {
    offScreenContainer: {
        position: 'fixed', left: '-5000px', top: 0,
        width: '1050px', height: '350px',
        display: 'flex', flexDirection: 'row', gap: '40px', padding: '20px',
        backgroundColor: 'white', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Arial, sans-serif', zIndex: -100
    },
    card: {
        width: '460px', height: '291px', borderRadius: '15px',
        overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    // RECTO
    recto: { backgroundColor: '#2A2D3E', color: 'white' },
    headerRecto: {
        padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    bodyRecto: { flex: 1, padding: '20px', display: 'flex', gap: '20px', alignItems: 'center', position: 'relative', zIndex: 10 },
    photoBox: {
        width: '90px', height: '110px', backgroundColor: '#374151', borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', fontSize: '30px', fontWeight: 'bold', color: 'rgba(255,255,255,0.2)'
    },
    footerRecto: {
        backgroundColor: '#F59E0B', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    // VERSO
    verso: { backgroundColor: 'white', color: '#333', border: '1px solid #ccc' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* 1. MODAL VISIBLE (Tailwind - UI Utilisateur) */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Aperçu Carte Scolaire</h2>
            <p className="text-xs text-slate-500">Design Officiel 2025-2026</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} className="text-slate-600" /></button>
        </div>

        {/* Prévisualisation Écran */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-100 flex flex-col items-center justify-center gap-8">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                
                {/* RECTO VISUEL */}
                <div className="relative w-[340px] h-[215px] rounded-xl overflow-hidden bg-[#2A2D3E] text-white shadow-xl flex flex-col shrink-0 select-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B] rounded-full -mr-16 -mt-16 opacity-10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 rounded-full -ml-12 -mb-12 opacity-10 blur-xl"></div>

                    <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-sm z-10">
                        <div className="text-[10px] font-black tracking-tighter uppercase italic">SchoolHub Academy</div>
                        <div className="text-[8px] opacity-70">{cardData.year}</div>
                    </div>

                    <div className="flex-1 p-4 flex gap-4 z-10">
                        <div className="w-20 h-24 bg-slate-700 rounded-lg border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                            <div className="text-2xl font-bold text-white/20">
                                {(cardData.firstName?.[0] || '')}{(cardData.lastName?.[0] || '')}
                            </div>
                        </div>
                        <div className="space-y-2 flex-1 min-w-0">
                            <div>
                                <div className="text-[8px] uppercase tracking-widest text-[#F59E0B] font-bold">Nom & Prénoms</div>
                                <div className="text-sm font-bold truncate leading-tight uppercase">{cardData.lastName}</div>
                                <div className="text-xs font-semibold truncate leading-tight text-white/90 uppercase">{cardData.firstName}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <div className="text-[7px] uppercase text-white/50">Classe</div>
                                    <div className="text-xs font-bold">{cardData.class}</div>
                                </div>
                                <div>
                                    <div className="text-[7px] uppercase text-white/50">Matricule</div>
                                    <div className="text-xs font-bold">{cardData.matricule}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-2 bg-[#F59E0B] flex justify-between items-center px-4 z-10 mt-auto">
                        <div className="text-[10px] font-bold text-white">CARTE SCOLAIRE</div>
                        <div className="flex gap-1">
                            <div className="w-1 h-3 bg-white/30 rounded-full"></div>
                            <div className="w-1 h-3 bg-white/30 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* VERSO VISUEL */}
                <div className="w-[340px] h-[215px] bg-white rounded-xl relative overflow-hidden shadow-lg border border-slate-200 p-4 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-xs space-y-2">
                            <div>
                                <div className="font-bold text-slate-400 uppercase text-[9px]">Groupe Sanguin</div>
                                <div className="font-bold text-slate-800">{cardData.blood}</div>
                            </div>
                            <div>
                                <div className="font-bold text-slate-400 uppercase text-[9px]">Urgence</div>
                                <div className="font-bold text-slate-800">{cardData.emergency}</div>
                            </div>
                        </div>
                        <div className="bg-white p-1 border border-slate-100 rounded">
                             <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${cardData.matricule}`} 
                                alt="QR" 
                                className="w-16 h-16" 
                                crossOrigin="anonymous"
                             />
                        </div>
                    </div>
                    <div className="mt-auto space-y-2">
                        <div className="text-[8px] text-slate-400 text-justify leading-tight">
                            Cette carte est strictement personnelle et reste la propriété de l'établissement. En cas de perte, merci de le signaler au secrétariat.
                        </div>
                        <div className="h-px w-full bg-slate-100"></div>
                        <div className="flex justify-between items-center">
                            <div className="text-[8px] text-slate-400">schoolhub.com</div>
                            <div className="text-[8px] font-bold text-slate-600">Le Directeur</div>
                        </div>
                    </div>
                    <div className="h-2 bg-[#2A2D3E] w-full mt-2 absolute bottom-0 left-0"></div>
                </div>

            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Share2 size={16} /> Envoyer
          </button>
          <button 
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-70 disabled:cursor-wait"
          >
            {isGenerating ? <><Loader2 size={18} className="animate-spin" /> Génération...</> : <><FileDown size={18} /> Exporter PDF</>}
          </button>
        </div>
      </div>


      {/* ======================================================= */}
      {/* 2. TEMPLATE PDF CACHÉ (STYLE FIXE POUR HTML2CANVAS)     */}
      {/* ======================================================= */}
      <div ref={printTemplateRef} style={styles.offScreenContainer}>
        
        {/* RECTO PDF */}
        <div style={{...styles.card, ...styles.recto}}>
            <div style={{position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#F59E0B', opacity: 0.1}}></div>
            <div style={{position: 'absolute', bottom: '-40px', left: '-40px', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#3B82F6', opacity: 0.1}}></div>

            <div style={styles.headerRecto}>
                <div>
                    <div style={{fontStyle: 'italic', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase'}}>SchoolHub Academy</div>
                </div>
                <div style={{fontSize: '11px', opacity: 0.8}}>{cardData.year}</div>
            </div>

            <div style={styles.bodyRecto}>
                <div style={styles.photoBox}>
                    {(cardData.firstName?.[0] || '')}{(cardData.lastName?.[0] || '')}
                </div>
                <div style={{flex: 1}}>
                    <div style={{fontSize: '10px', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '2px'}}>Nom & Prénoms</div>
                    <div style={{fontSize: '22px', fontWeight: 'bold', textTransform: 'uppercase', lineHeight: '1', marginBottom: '4px'}}>{cardData.lastName}</div>
                    <div style={{fontSize: '16px', fontWeight: '600', textTransform: 'uppercase', opacity: 0.9, marginBottom: '15px'}}>{cardData.firstName}</div>
                    
                    <div style={{display: 'flex', gap: '20px'}}>
                        <div>
                            <div style={{fontSize: '9px', textTransform: 'uppercase', opacity: 0.5}}>Classe</div>
                            <div style={{fontSize: '14px', fontWeight: 'bold'}}>{cardData.class}</div>
                        </div>
                        <div>
                            <div style={{fontSize: '9px', textTransform: 'uppercase', opacity: 0.5}}>Matricule</div>
                            <div style={{fontSize: '14px', fontWeight: 'bold'}}>{cardData.matricule}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{marginTop: 'auto', ...styles.footerRecto}}>
                <div style={{fontSize: '12px', fontWeight: 'bold', color: 'white'}}>CARTE SCOLAIRE</div>
                <div style={{display: 'flex', gap: '5px'}}>
                    <div style={{width: '4px', height: '12px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '2px'}}></div>
                    <div style={{width: '4px', height: '12px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '2px'}}></div>
                </div>
            </div>
        </div>

        {/* VERSO PDF */}
        <div style={{...styles.card, ...styles.verso}}>
            <div style={{padding: '25px', flex: 1, display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <div>
                        <div style={{fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase'}}>Groupe Sanguin</div>
                        <div style={{fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '15px'}}>{cardData.blood}</div>
                        
                        <div style={{fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase'}}>Contact Urgence</div>
                        <div style={{fontSize: '14px', fontWeight: 'bold', color: '#1e293b'}}>{cardData.emergency}</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${cardData.matricule}`} 
                            width="90" height="90" 
                            style={{border: '1px solid #eee', padding: '5px', borderRadius: '5px'}}
                            crossOrigin="anonymous" 
                            alt="QR"
                        />
                        <div style={{fontSize: '10px', color: '#64748b', marginTop: '5px'}}>Scan Présence</div>
                    </div>
                </div>

                <div style={{marginTop: 'auto'}}>
                    <div style={{fontSize: '9px', color: '#94a3b8', textAlign: 'justify', marginBottom: '10px', lineHeight: '1.4'}}>
                        Cette carte est strictement personnelle et reste la propriété de l'établissement. En cas de perte, merci de le signaler au secrétariat.
                    </div>
                    <div style={{borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{fontSize: '10px', color: '#94a3b8'}}>schoolhub.com</div>
                        <div style={{fontSize: '10px', fontWeight: 'bold', color: '#475569'}}>Le Directeur</div>
                    </div>
                </div>
            </div>
            <div style={{height: '8px', width: '100%', backgroundColor: '#2A2D3E'}}></div>
        </div>

      </div>

    </div>
  );
};

export default StudentCardPreview;