import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import InteractiveMap from '../components/map/InteractiveMap';
import Card from '../components/common/Card';
import ExportButton from '../components/common/ExportButton';
import { mockOccurrences } from '../data/mockOccurrences';
import { toast } from 'sonner';

/**
 * Página dedicada ao mapa de ocorrências
 * 
 * Obs: Esta página é renderizada dentro do MainLayout pelo componente ProtectedRoute
 */
function MapPage() {
  const { hasPermission } = useAuth();
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedOccurrence, setSelectedOccurrence] = useState(null);

  // Tipos únicos de ocorrências para o filtro
  const occurrenceTypes = ['all', ...new Set(mockOccurrences.map(occ => occ.tipo))];

  // Status únicos para o filtro
  const occurrenceStatuses = ['all', ...new Set(mockOccurrences.map(occ => occ.status))];

  // Filtrar ocorrências
  const filteredOccurrences = mockOccurrences.filter(occurrence => {
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

  // Estatísticas dos dados filtrados
  const stats = useMemo(() => ({
    total: filteredOccurrences.length,
    emAndamento: filteredOccurrences.filter(o => o.status === 'Em Andamento').length,
    controlado: filteredOccurrences.filter(o => o.status === 'Controlado').length,
    finalizado: filteredOccurrences.filter(o => o.status === 'Finalizado').length,
    vitimas: filteredOccurrences.reduce((sum, o) => sum + (o.vitimas || 0), 0),
  }), [filteredOccurrences]);

  return (
    <div className="space-y-6">
      {/* Header com estatísticas e exportar */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🗺️ Mapa de Ocorrências</h2>
          <p className="text-sm text-gray-500 mt-1">Visualização geográfica em tempo real</p>
        </div>
        <ExportButton data={filteredOccurrences} filename="mapa_ocorrencias" />
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <p className="text-xs text-gray-500 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl p-4 shadow-lg border border-yellow-200 hover:shadow-xl transition-all duration-300">
          <p className="text-xs text-gray-500 mb-1">Em Andamento</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.emAndamento}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-4 shadow-lg border border-red-200 hover:shadow-xl transition-all duration-300">
          <p className="text-xs text-gray-500 mb-1">Controlado</p>
          <p className="text-2xl font-bold text-primary">{stats.controlado}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
          <p className="text-xs text-gray-500 mb-1">Finalizado</p>
          <p className="text-2xl font-bold text-green-600">{stats.finalizado}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300">
          <p className="text-xs text-gray-500 mb-1">Vítimas</p>
          <p className="text-2xl font-bold text-purple-600">{stats.vitimas}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna de filtros e detalhes */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filtros Modernos */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🔍</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Filtros</h3>
            </div>

            <div className="space-y-4">
              {/* Filtro por tipo - Botões visuais */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-base">🔥</span>
                  Tipo de Ocorrência
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 transform hover:scale-105 ${filterType === 'all'
                        ? 'bg-gradient-to-r from-primary to-red-700 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                      }`}
                  >
                    Todos
                  </button>
                  {occurrenceTypes.filter(t => t !== 'all').map((type, index) => (
                    <button
                      key={index}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 transform hover:scale-105 ${filterType === type
                          ? 'bg-gradient-to-r from-primary to-red-700 text-white shadow-lg scale-105'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro por status - Botões visuais */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-base">📊</span>
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 transform hover:scale-105 ${filterStatus === 'all'
                        ? 'bg-gradient-to-r from-primary to-red-700 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                      }`}
                  >
                    Todos
                  </button>
                  {occurrenceStatuses.filter(s => s !== 'all').map((status, index) => (
                    <button
                      key={index}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 transform hover:scale-105 ${filterStatus === status
                          ? 'bg-gradient-to-r from-primary to-red-700 text-white shadow-lg scale-105'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                        }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro por período - Botões visuais */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-base">⏰</span>
                  Período
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'all', label: 'Tudo', icon: '📅' },
                    { value: '24h', label: '24h', icon: '🕐' },
                    { value: '7days', label: '7 dias', icon: '📆' },
                    { value: '30days', label: '30 dias', icon: '📊' },
                  ].map((period) => (
                    <button
                      key={period.value}
                      onClick={() => setDateRange(period.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 transform hover:scale-105 ${dateRange === period.value
                          ? 'bg-gradient-to-r from-primary to-red-700 text-white shadow-lg scale-105'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                        }`}
                    >
                      {period.icon} {period.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botão limpar filtros */}
              <button
                onClick={() => {
                  setFilterType('all');
                  setFilterStatus('all');
                  setDateRange('all');
                  toast.info('Filtros limpos');
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                🔄 Limpar Filtros
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-base">📍</span>
                  Resultados:
                </p>
                <span className="px-4 py-1.5 bg-gradient-to-r from-primary to-red-700 text-white rounded-full text-sm font-bold shadow-lg animate-pulse">
                  {filteredOccurrences.length}
                </span>
              </div>
            </div>
          </div>

          {/* Detalhes da ocorrência selecionada */}
          {selectedOccurrence && (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 animate-fadeIn">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl">📋</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Detalhes</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <h3 className="text-base font-bold text-gray-800 mb-2">
                    {selectedOccurrence.tipo}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">ID:</span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      #{selectedOccurrence.id}
                    </span>
                  </div>
                  <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium mt-2 ${selectedOccurrence.status === 'Em Andamento' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                      selectedOccurrence.status === 'Controlado' ? 'bg-red-50 text-primary border border-red-200' :
                        selectedOccurrence.status === 'Finalizado' ? 'bg-green-100 text-green-700 border border-green-300' : ''
                    }`}>
                    {selectedOccurrence.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">📅</span>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">Data/Hora</p>
                      <p className="text-sm text-gray-800 font-medium">
                        {new Date(selectedOccurrence.dataHora).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-lg">📍</span>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">Endereço</p>
                      <p className="text-sm text-gray-800">{selectedOccurrence.endereco}</p>
                    </div>
                  </div>

                  {selectedOccurrence.vitimas > 0 && (
                    <div className="flex items-start gap-3 bg-red-50 rounded-lg p-3 border border-red-200">
                      <span className="text-lg">🚑</span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Vítimas</p>
                        <p className="text-lg font-bold text-red-600">{selectedOccurrence.vitimas}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <span className="text-lg">⏱️</span>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">Tempo de Resposta</p>
                      <p className="text-sm text-gray-800 font-medium">{selectedOccurrence.tempoResposta}</p>
                    </div>
                  </div>
                </div>

                {hasPermission('operador') && (
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <button className="w-full py-3 px-4 rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary transition-all duration-300 transform hover:scale-105">
                      📄 Ver Relatório Completo
                    </button>
                  </div>
                )}

                {hasPermission('admin') && (
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <span>⚡</span>
                      Ações Rápidas
                    </h4>
                    <div className="flex flex-col gap-2">
                      <button className="w-full py-2 px-3 text-xs font-medium bg-gradient-to-r from-primary to-red-700 text-white rounded-lg hover:from-red-700 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                        👥 Atribuir Equipe
                      </button>
                      <button className="w-full py-2 px-3 text-xs font-medium bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                        ✅ Atualizar Status
                      </button>
                      <button className="w-full py-2 px-3 text-xs font-medium bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                        🔥 Priorizar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mapa interativo */}
        <div className="lg:col-span-9">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-2 hover:shadow-2xl transition-all duration-300">
            <InteractiveMap
              occurrences={filteredOccurrences}
              height="80vh"
              onSelectOccurrence={handleSelectOccurrence}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;