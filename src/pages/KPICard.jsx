import React from 'react';

/**
 * Componente para exibir indicadores-chave de desempenho (KPIs)
 */
const KPICard = ({ title, value, icon, color = 'bg-blue-500', trend = null }) => {
  // Renderização do componente
  return (
    <div className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            
            {trend && (
              <span 
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trend > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
        <div className={`rounded-md p-2 ${color} text-white flex items-center justify-center`}>
          {icon ? (
            <span className="text-xl">{icon}</span>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPICard;