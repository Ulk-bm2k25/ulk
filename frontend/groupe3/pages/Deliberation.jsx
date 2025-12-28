import React from 'react';

const Deliberation = () => {
    return (
        <div className="p-8 bg-[#F8F9FA]">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-[#2D3250] text-3xl font-black">Instances de Validation</h1>
                <button className="bg-[#2D3250] text-[#F6B17A] border-2 border-[#F6B17A] px-6 py-2 rounded-full font-bold hover:bg-[#F6B17A] hover:text-white transition-all">
                    Lancer la délibération annuelle
                </button>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-[#F6B17A]">
                    <p className="text-gray-400 text-sm uppercase">Moyenne de classe</p>
                    <p className="text-2xl font-bold text-[#2D3250]">12.85 / 20</p>
                </div>
                {/* Ajoutez d'autres cartes ici */}
            </div>
        </div>
    );
};

export default Deliberation;