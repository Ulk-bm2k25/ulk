import React from 'react';

// Configuration des couleurs conservée telle quelle
const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600',
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  color = 'blue',
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
          
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
          {/* Adaptation pour Lucide React qui préfère 'size' mais accepte width/height */}
          <Icon size={24} /> 
        </div>
      </div>
    </div>
  );
};

export default StatCard;