import React, { useState, useMemo } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import AdvancedFilters from '../components/analysis/AdvancedFilters';
import ComparisonChart from '../components/analysis/ComparisonChart';
import SummaryTable from '../components/dashboard/SummaryTable'; // Reutilizar a tabela
import InteractiveMap from '../components/map/InteractiveMap'; // Reutilizar o mapa

// Importar os componentes de análise avançada
import {
  HourlyDistributionChart,
  ResponseTimeByTypeChart,
  TimeTypeCorrelationChart,
  MultiDimensionalAnalysisChart,
  ScatterAnalysisChart,
  AdvancedAnalysisPanel
} from '../components/analysis/AdvancedAnalysisComponents';

// Importar os componentes de análise geográfica
// CORRIGIDO: Use os nomes de componentes corretos
import {
  ZoneConcentrationChart,
  ResponseTimeByZoneChart,
  ZoneTypeAnalysisChart,
  GeographicAnalysisPanel
} from '../components/analysis/GeographicAnalysisComponents';

import { mockOccurrences } from '../data/mockOccurrences';

// Função auxiliar para agregar dados para gráficos
const aggregateData = (data, key) => {
  if (!data || data.length === 0) return [];
  const counts = data.reduce((acc, item) => {
    const value = item[key] || 'N/A';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value); // Ordenar por contagem
};

function AnalysisPage({ user, onLogout }) {
  const [filteredOccurrences, setFilteredOccurrences] = useState(mockOccurrences);
  const [viewMode, setViewMode] = useState('standard'); // 'standard', 'advanced' ou 'geographic'

  const handleApplyFilters = (filters) => {
    console.log('Aplicando filtros:', filters);
    let results = mockOccurrences;

    if (filters.tipo) {
      results = results.filter(occ => occ.tipo === filters.tipo);
    }
    if (filters.status) {
      results = results.filter(occ => occ.status === filters.status);
    }
    if (filters.bairro) {
      results = results.filter(occ => 
        occ.bairro && occ.bairro.toLowerCase().includes(filters.bairro.toLowerCase())
      );
    }
    if (filters.dataInicio) {
      results = results.filter(occ => new Date(occ.dataHora) >= filters.dataInicio);
    }
    if (filters.dataFim) {
      results = results.filter(occ => new Date(occ.dataHora) <= filters.dataFim);
    }

    setFilteredOccurrences(results);
  };

  const handleClearFilters = () => {
    console.log('Limpando filtros');
    setFilteredOccurrences(mockOccurrences);
    // Idealmente, o componente AdvancedFilters deveria resetar seus próprios campos aqui
    // ou fornecer uma função para ser chamada para resetá-los.
  };

  // Usar useMemo para evitar recálculos desnecessários dos dados agregados
  const occurrencesByType = useMemo(() => aggregateData(filteredOccurrences, 'tipo'), [filteredOccurrences]);
  const occurrencesByBairro = useMemo(() => aggregateData(filteredOccurrences, 'bairro'), [filteredOccurrences]);

  // Renderizar o conteúdo adequado conforme o modo de visualização
  const renderContent = () => {
    switch(viewMode) {
      case 'advanced':
        return <AdvancedAnalysisPanel occurrences={filteredOccurrences} />;
      case 'geographic':
        return <GeographicAnalysisPanel occurrences={filteredOccurrences} />;
      default: // 'standard'
        return (
          <>
            {/* Gráficos Comparativos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ComparisonChart 
                type="bar" 
                data={occurrencesByType} 
                title="Ocorrências por Tipo" 
                nameKey="name" 
                dataKey="value" 
                chartHeight='350px'
              />
              <ComparisonChart 
                type="pie" 
                data={occurrencesByBairro.slice(0, 6)} 
                title="Ocorrências por Bairro (Top 6)" 
                nameKey="name" 
                dataKey="value" 
                chartHeight='350px'
              />
            </div>

            {/* Mapa e Tabela com dados filtrados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <InteractiveMap occurrences={filteredOccurrences} height="400px" />
              <div className="lg:col-span-1">
                <SummaryTable data={filteredOccurrences} />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">

      <div className="flex-1 flex flex-col overflow-hidden">

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Análise Detalhada</h2>
              <p className="text-sm text-gray-500 mt-1">Explore os dados com diferentes perspectivas</p>
            </div>
            
            {/* Seletor de modo de visualização */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('standard')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  viewMode === 'standard' 
                    ? 'bg-primary text-white shadow-lg scale-105' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📊 Visão Padrão
              </button>
              <button
                onClick={() => setViewMode('advanced')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  viewMode === 'advanced' 
                    ? 'bg-primary text-white shadow-lg scale-105' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔬 Análise Avançada
              </button>
              <button
                onClick={() => setViewMode('geographic')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  viewMode === 'geographic' 
                    ? 'bg-primary text-white shadow-lg scale-105' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🗺️ Análise Geográfica
              </button>
            </div>
          </div>

          <AdvancedFilters 
            onApplyFilters={handleApplyFilters} 
            onClearFilters={handleClearFilters} 
          />

          {/* Renderiza o conteúdo com base no modo selecionado */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default AnalysisPage;

