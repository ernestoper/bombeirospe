import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import KPICard from '../components/dashboard/KPICard';
import SummaryTable from '../components/dashboard/SummaryTable';
// Importe o InteractiveMap vanilla (sem react-leaflet)
import InteractiveMap from '../components/map/InteractiveMap-vanilla';
// Importe os dados mockados
import { mockOccurrences } from '../data/mockOccurrences';

// Função para calcular KPIs
const calculateKPIs = (occurrences) => {
  const today = new Date().toISOString().split('T')[0];
  const occurrencesToday = occurrences.filter(occ => occ.dataHora.startsWith(today)).length;
  const inProgress = occurrences.filter(occ => occ.status === 'Em Andamento' || occ.status === 'Controlado').length;
  
  // Calcular tempo médio de resposta
  let totalResponseTime = 0;
  let respondedCount = 0;
  occurrences.forEach(occ => {
    if (occ.tempoResposta) {
      const time = parseInt(occ.tempoResposta.replace('min', ''), 10);
      if (!isNaN(time)) {
        totalResponseTime += time;
        respondedCount++;
      }
    }
  });
  const avgResponseTime = respondedCount > 0 ? (totalResponseTime / respondedCount).toFixed(0) : 'N/A';
  
  // Contar vítimas
  const totalVictims = occurrences.reduce((sum, occ) => sum + (occ.vitimas || 0), 0);
  
  return {
    occurrencesToday,
    inProgress,
    avgResponseTime: `${avgResponseTime} min`,
    totalVictims
  };
};

/**
 * Página principal do Dashboard
 * 
 * Obs: Esta página é renderizada dentro do MainLayout pelo componente ProtectedRoute
 */
function DashboardPage() {
  const { user, hasPermission } = useAuth();
  const [selectedOccurrence, setSelectedOccurrence] = useState(null);
  
  // Pegar os dados mockados
  const [occurrences, setOccurrences] = useState(mockOccurrences);
  
  // Calcular KPIs
  const kpis = calculateKPIs(occurrences);
  
  // Pegar as 10 ocorrências mais recentes para a tabela
  const recentOccurrences = [...occurrences]
    .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
    .slice(0, 10);
  
  // Função para lidar com a seleção de uma ocorrência no mapa
  const handleSelectOccurrence = (occurrence) => {
    setSelectedOccurrence(occurrence);
    // Aqui você poderia abrir um modal ou fazer scroll para a tabela
  };
  
  return (
    <>
      {/* KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Ocorrências Hoje"
          value={kpis.occurrencesToday}
          color="bg-red-500"
        />
        <KPICard
          title="Em Andamento"
          value={kpis.inProgress}
          color="bg-yellow-500"
        />
        <KPICard
          title="Tempo Médio Resposta"
          value={kpis.avgResponseTime}
          color="bg-blue-500"
        />
        <KPICard
          title="Total de Vítimas (Período)"
          value={kpis.totalVictims}
          color="bg-purple-500"
        />
      </div>
      
      {/* Chart & Map Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Tendência de Ocorrências</h3>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-gray-500">Gráfico de tendências será exibido aqui</p>
            </div>
          </div>
        </div>
        <div>
          <InteractiveMap 
            occurrences={occurrences} 
            height="400px" 
            onSelectOccurrence={handleSelectOccurrence}
          />
        </div>
      </div>
      
      {/* Selected Occurrence Info (if any) */}
      {selectedOccurrence && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">
              Ocorrência Selecionada: {selectedOccurrence.tipo}
            </h3>
            <button 
              onClick={() => setSelectedOccurrence(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">ID:</p>
              <p>{selectedOccurrence.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status:</p>
              <p className={`font-medium ${
                selectedOccurrence.status === 'Em Andamento' ? 'text-yellow-600' :
                selectedOccurrence.status === 'Controlado' ? 'text-blue-600' :
                selectedOccurrence.status === 'Finalizado' ? 'text-green-600' : ''
              }`}>
                {selectedOccurrence.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data/Hora:</p>
              <p>{new Date(selectedOccurrence.dataHora).toLocaleString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Endereço:</p>
              <p>{selectedOccurrence.endereco}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tempo de Resposta:</p>
              <p>{selectedOccurrence.tempoResposta}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vítimas:</p>
              <p>{selectedOccurrence.vitimas || 'Nenhuma'}</p>
            </div>
          </div>
          {hasPermission && hasPermission('admin') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Ações Administrativas:</h4>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                  Atribuir Equipe
                </button>
                <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                  Atualizar Status
                </button>
                <button className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                  Priorizar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Summary Table */}
      <div className="w-full">
        <SummaryTable data={recentOccurrences} onSelectRow={setSelectedOccurrence} />
      </div>
    </>
  );
}

export default DashboardPage;           