import React from 'react';

const PlaceholderPage = ({ title, icon: Icon }) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <Icon size={64} className="mx-auto mb-4 text-gray-400" />
      <h2 className="text-2xl font-bold mb-2" style={{ color: '#3d4365' }}>
        {title}
      </h2>
      <p className="text-gray-600">Page en construction (à développer dans une autre tâche)</p>
    </div>
  </div>
);

export default PlaceholderPage;