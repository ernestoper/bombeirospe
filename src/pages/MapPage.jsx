import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import InteractiveMap from '../components/map/InteractiveMap';
import Card from '../components/common/Card';
import { mockOccurrences } from '../data/mockOccurrences';

/**
 * Página dedicada ao mapa de ocorrências
 * 
 * Obs: Esta página é renderizada dentro do MainLayout pelo componente ProtectedRoute
 */
function MapPage() {
  const { hasPermission } = useAuth();
  const [occurrences, setOccurrences] = useState(mockOccurrences);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedOccurrence, setSelectedOccurrence] = useState(null);
  
  // Tipos únicos de ocorrências para o filtro
  const occurrenceTypes = ['all', ...new Set(occurrences.map(occ => occ.tipo))];
  
  // Status únicos para o filtro
  const occurrenceStatuses = ['all', ...new Set(occurrences.map(occ => occ.status))];
  
  // Filtrar ocorrências
  const filteredOccurrences = occurrences.filter(occurrence => {
    // Filtro por tipo
    if (filterType !== 'all' && occurrence.tipo !== filterType) {
      return false;
    }
    
    // Filtro por status
    if (filterStatus !== 'all' && occurrence.status !== filterStatus) {
      return false;
    }
    
    // Filtro por data
    if (dateRange !== 'all') {
      const occurrenceDate = new Date(occurrence.dataHora);
      const today = new Date();
      const diffDays = Math.floor((today - occurrenceDate) / (1000 * 60 * 60 * 24));
      
      if (dateRange === '24h' && diffDays >= 1) return false;
      if (dateRange === '7days' && diffDays >= 7) return false;
      if (dateRange === '30days' && diffDays >= 30) return false;
    }
    
    return true;
  });
  
  // Função para lidar com a seleção de uma ocorrência no mapa
  const handleSelectOccurrence = (occurrence) => {
    setSelectedOccurrence(occurrence);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Coluna de filtros e detalhes */}
      <div className="lg:col-span-3">
        {/* Filtros */}
        <Card title="Filtros">
          <div className="space-y-4">
            {/* Filtro por tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Ocorrência
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {occurrenceTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type === 'all' ? 'Todos os tipos' : type}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filtro por status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {occurrenceStatuses.map((status, index) => (
                  <option key={index} value={status}>
                    {status === 'all' ? 'Todos os status' : status}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filtro por período */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas as datas</option>
                <option value="24h">Últimas 24 horas</option>
                <option value="7days">Últimos 7 dias</option>
                <option value="30days">Últimos 30 dias</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Ocorrências encontradas: {filteredOccurrences.length}
            </p>
          </div>
        </Card>
        
        {/* Detalhes da ocorrência selecionada */}
        {selectedOccurrence && (
          <Card title="Detalhes da Ocorrência" className="mt-6">
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedOccurrence.tipo} #{selectedOccurrence.id}
                </h3>
                <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium mt-1 ${
                  selectedOccurrence.status === 'Em Andamento' ? 'bg-yellow-100 text-yellow-600' :
                  selectedOccurrence.status === 'Controlado' ? 'bg-blue-100 text-blue-600' :
                  selectedOccurrence.status === 'Finalizado' ? 'bg-green-100 text-green-600' : ''
                }`}>
                  {selectedOccurrence.status}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Data/Hora:</p>
                <p className="text-sm">
                  {new Date(selectedOccurrence.dataHora).toLocaleString('pt-BR')}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Endereço:</p>
                <p className="text-sm">{selectedOccurrence.endereco}</p>
              </div>
              
              {selectedOccurrence.vitimas > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Vítimas:</p>
                  <p className="text-sm font-medium text-red-600">{selectedOccurrence.vitimas}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">Tempo de Resposta:</p>
                <p className="text-sm">{selectedOccurrence.tempoResposta}</p>
              </div>
              
              {hasPermission('operador') && (
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Ver Relatório Completo
                  </button>
                </div>
              )}
              
              {hasPermission('admin') && (
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Ações:</h4>
                  <div className="flex flex-col gap-2">
                    <button className="w-full py-1 px-3 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                      Atribuir Equipe
                    </button>
                    <button className="w-full py-1 px-3 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                      Atualizar Status
                    </button>
                    <button className="w-full py-1 px-3 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                      Priorizar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
      
      {/* Mapa interativo */}
      <div className="lg:col-span-9">
        <InteractiveMap
          occurrences={filteredOccurrences}
          height="80vh" // Altura maior para a página dedicada ao mapa
          onSelectOccurrence={handleSelectOccurrence}
        />
      </div>
    </div>
  );
}

export default MapPage;