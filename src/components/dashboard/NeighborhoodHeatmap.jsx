import React, { useMemo } from 'react';

/**
 * Mapa de calor mostrando bairros com mais ocorrências
 */
export function NeighborhoodHeatmap({ occurrences }) {
  // Agregar ocorrências por bairro
  const bairroData = useMemo(() => {
    const counts = {};
    
    occurrences.forEach(occ => {
      const bairro = occ.bairro || 'Não informado';
      counts[bairro] = (counts[bairro] || 0) + 1;
    });
    
    // Converter para array e ordenar
    return Object.entries(counts)
      .map(([bairro, count]) => ({ bairro, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8
  }, [occurrences]);
  
  const maxCount = bairroData[0]?.count || 1;
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Bairros com Mais Ocorrências</h3>
        <span className="text-sm text-gray-500">Últimos 7 dias</span>
      </div>
      
      <div className="space-y-4">
        {bairroData.map((item, i) => {
          const percentage = (item.count / maxCount) * 100;
          
          return (
            <div key={i} className="group">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                  {item.bairro}
                </span>
                <span className="text-sm font-semibold text-primary">
                  {item.count}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {bairroData.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>Nenhum dado disponível</p>
        </div>
      )}
    </div>
  );
}

export default NeighborhoodHeatmap;
