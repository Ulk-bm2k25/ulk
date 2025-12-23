import React from 'react';
import { X, Upload, FileText, CheckCircle } from 'lucide-react';

const FileUpload = ({ label, icon: Icon, selectedFile, onFileSelect, onFileRemove }) => {
    
    // Fonction pour gérer le changement de fichier
    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div className="space-y-2 text-left">
            <label className="text-sm font-bold text-[#1a2035]/80">{label}</label>
            
            <div className={`relative group transition-all duration-300 ${
                selectedFile 
                ? 'border-2 border-green-400 bg-green-50/30' 
                : 'border-2 border-dashed border-gray-300 bg-gray-50 hover:border-[#eb8e3a] hover:bg-orange-50/30'
            } rounded-2xl p-4 flex flex-col items-center justify-center min-h-[120px]`}>
                
                {!selectedFile ? (
                    // VUE : AUCUN FICHIER SÉLECTIONNÉ
                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                        <div className="p-3 bg-white rounded-xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                            <Icon className="text-gray-400 group-hover:text-[#eb8e3a]" size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-400">Cliquez pour uploader</span>
                        <input 
                            type="file" 
                            className="hidden" 
                            onChange={handleChange}
                            accept="image/*,.pdf"
                        />
                    </label>
                ) : (
                    // VUE : FICHIER SÉLECTIONNÉ
                    <div className="w-full flex items-center gap-4 animate-in fade-in zoom-in duration-300">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                            {selectedFile.type.startsWith('image/') ? (
                                <img 
                                    src={URL.createObjectURL(selectedFile)} 
                                    alt="preview" 
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <FileText size={24} />
                            )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#1a2035] truncate">
                                {selectedFile.name}
                            </p>
                            <p className="text-[10px] text-green-600 font-black uppercase flex items-center gap-1">
                                <CheckCircle size={10} /> Prêt à l'envoi
                            </p>
                        </div>

                        <button 
                            onClick={onFileRemove}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                            title="Supprimer"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;