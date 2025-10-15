import React from 'react';

function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white shadow-lg hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 border border-gray-100 animate-fade-in ${className}`}>
      {title && (
        <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-gray-50 to-transparent">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

export default Card;

