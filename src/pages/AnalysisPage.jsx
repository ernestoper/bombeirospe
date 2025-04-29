import React, { useState, useMemo } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import AdvancedFilters from '../components/analysis/AdvancedFilters';
import ComparisonChart from '../components/analysis/ComparisonChart';
import SummaryTable from '../components/dashboard/SummaryTable'; // Reutilizar a tabela
import InteractiveMap from '../components/map/InteractiveMap'; // Reutilizar o mapa
// import DataExporter from '../components/analysis/DataExporter'; // Adicionar depois se necessário
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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Análise Detalhada</h2>

          <AdvancedFilters 
            onApplyFilters={handleApplyFilters} 
            onClearFilters={handleClearFilters} 
          />

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
              data={occurrencesByBairro.slice(0, 6)} // Mostrar top 6 bairros + 'Outros' seria ideal
              title="Ocorrências por Bairro (Top 6)" 
              nameKey="name" 
              dataKey="value" 
              chartHeight='350px'
            />
          </div>

          {/* Mapa e Tabela com dados filtrados */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
             <InteractiveMap occurrences={filteredOccurrences} height="400px" />
             {/* Pode-se adicionar uma tabela aqui também, ou focar nos gráficos */}
             <div className="lg:col-span-1">
                <SummaryTable data={filteredOccurrences} />
             </div>
          </div>
          
          {/* Exportação (a ser adicionada) */}
          {/* <DataExporter filteredData={filteredOccurrences} /> */}

        </main>
      </div>
    </div>
  );
}

export default AnalysisPage;

