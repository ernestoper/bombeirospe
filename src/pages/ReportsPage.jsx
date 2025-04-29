import React, { useState } from 'react';
import Card from '../components/common/Card';
import { mockOccurrences } from '../data/mockOccurrences';
import { EnhancedReport } from '../components/reports/EnhancedReport';

/**
 * Página de relatórios aprimorada com insights analíticos
 * Acessível para usuários com permissão de operador ou superior
 */
function ReportsPage() {
  const [reportType, setReportType] = useState('occurrence');
  const [dateRange, setDateRange] = useState('last30days');
  const [filterArea, setFilterArea] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [showAdvancedView, setShowAdvancedView] = useState(false);
  
  // Mock de áreas de atuação
  const areas = [
    { id: 'all', name: 'Todas as áreas' },
    { id: 'norte', name: 'Zona Norte' },
    { id: 'sul', name: 'Zona Sul' },
    { id: 'leste', name: 'Zona Leste' },
    { id: 'oeste', name: 'Zona Oeste' },
    { id: 'centro', name: 'Centro' }
  ];
  
  // Mock de tipos de relatórios
  const reportTypes = [
    { id: 'occurrence', name: 'Relatório de Ocorrências' },
    { id: 'performance', name: 'Relatório de Desempenho' },
    { id: 'resources', name: 'Utilização de Recursos' },
    { id: 'time', name: 'Tempos de Resposta' },
    { id: 'casualties', name: 'Relatório de Vítimas' }
  ];
  
  // Mock de períodos
  const dateRanges = [
    { id: 'last7days', name: 'Últimos 7 dias' },
    { id: 'last30days', name: 'Últimos 30 dias' },
    { id: 'last90days', name: 'Últimos 90 dias' },
    { id: 'thisyear', name: 'Este ano' },
    { id: 'custom', name: 'Período personalizado' }
  ];
  
  // Função para gerar relatório
  const generateReport = () => {
    setIsGenerating(true);
    
    // Simulando tempo de geração
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedReport({
        type: reportType,
        dateRange: dateRange,
        area: filterArea,
        generatedAt: new Date().toISOString(),
        data: {
          summary: {
            totalOccurrences: 45,
            avgResponseTime: '9.5 min',
            casualties: 12,
            resourcesUsed: '85%'
          },
          details: [
            // Detalhes do relatório seriam injetados aqui
          ]
        }
      });
    }, 1500);
  };
  
  // Função para renderizar o relatório padrão gerado
  const renderStandardReport = () => {
    if (!generatedReport) return null;
    
    const report = generatedReport;
    const reportTitle = reportTypes.find(type => type.id === report.type)?.name || 'Relatório';
    const areaName = areas.find(area => area.id === report.area)?.name || 'Todas as áreas';
    const dateRangeName = dateRanges.find(range => range.id === report.dateRange)?.name || 'Período personalizado';
    
    return (
      <Card title={`${reportTitle} - ${areaName}`} className="mt-6">
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Gerado em:</p>
              <p className="text-sm">{new Date(report.generatedAt).toLocaleString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Período:</p>
              <p className="text-sm">{dateRangeName}</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowAdvancedView(true)}
                className="px-3 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
              >
                Ver Insights Avançados
              </button>
              <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50">
                Imprimir
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                Exportar PDF
              </button>
            </div>
          </div>
        </div>
        
        {/* Resumo do relatório */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total de Ocorrências</p>
            <p className="text-2xl font-semibold text-blue-600">{report.data.summary.totalOccurrences}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Tempo Médio de Resposta</p>
            <p className="text-2xl font-semibold text-green-600">{report.data.summary.avgResponseTime}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Vítimas</p>
            <p className="text-2xl font-semibold text-red-600">{report.data.summary.casualties}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Utilização de Recursos</p>
            <p className="text-2xl font-semibold text-purple-600">{report.data.summary.resourcesUsed}</p>
          </div>
        </div>
        
        {/* Conteúdo do relatório - depende do tipo */}
        {report.type === 'occurrence' && (
          <>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Ocorrências por Tipo</h3>
            <div className="mb-6 bg-gray-100 p-4 rounded-lg">
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">Gráfico de ocorrências por tipo seria exibido aqui</p>
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-800 mb-4">Distribuição Geográfica</h3>
            <div className="mb-6 bg-gray-100 p-4 rounded-lg">
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">Mapa com distribuição geográfica seria exibido aqui</p>
              </div>
            </div>
          </>
        )}
        
        {report.type === 'performance' && (
          <>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Desempenho por Equipe</h3>
            <div className="mb-6 bg-gray-100 p-4 rounded-lg">
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">Gráfico de desempenho por equipe seria exibido aqui</p>
              </div>
            </div>
          </>
        )}
        
        {report.type === 'time' && (
          <>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Análise de Tempos de Resposta</h3>
            <div className="mb-6 bg-gray-100 p-4 rounded-lg">
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">Gráfico de tempos de resposta seria exibido aqui</p>
              </div>
            </div>
          </>
        )}
        
        {/* Tabela de detalhes - comum para todos os relatórios */}
        <h3 className="text-lg font-medium text-gray-800 mb-4">Detalhes das Ocorrências</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tempo Resposta
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockOccurrences.slice(0, 5).map((occurrence, index) => (
                <tr key={index}>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {occurrence.id}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {occurrence.tipo}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(occurrence.dataHora).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {occurrence.endereco}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      occurrence.status === 'Em Andamento' ? 'bg-yellow-100 text-yellow-800' :
                      occurrence.status === 'Controlado' ? 'bg-blue-100 text-blue-800' :
                      occurrence.status === 'Finalizado' ? 'bg-green-100 text-green-800' : ''
                    }`}>
                      {occurrence.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {occurrence.tempoResposta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  };
  
  // Função para renderizar a visão avançada de insights
  const renderAdvancedReport = () => {
    if (!generatedReport) return null;
    
    return (
      <div className="mt-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Insights Avançados</h2>
          <button 
            onClick={() => setShowAdvancedView(false)}
            className="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
          >
            Voltar para Visão Padrão
          </button>
        </div>
        
        {/* Componente de relatório avançado */}
        <EnhancedReport 
          reportType={reportType}
          occurrences={mockOccurrences}
          dateRange={dateRange}
          area={filterArea}
        />
      </div>
    );
  };
  
  return (
    <>
      {/* Formulário de geração de relatório */}
      <Card title="Gerar Relatório">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Relatório
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {reportTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {dateRanges.map((range) => (
                <option key={range.id} value={range.id}>{range.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área
            </label>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {areas.map((area) => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {dateRange === 'custom' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Inicial
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Final
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <span>Os relatórios incluem insights analíticos avançados</span>
            </div>
          </div>
          
          <button
            onClick={generateReport}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Gerando...
              </span>
            ) : (
              'Gerar Relatório'
            )}
          </button>
        </div>
      </Card>
      
      {/* Renderiza o relatório padrão ou avançado dependendo do estado */}
      {generatedReport && (
        showAdvancedView ? renderAdvancedReport() : renderStandardReport()
      )}
    </>
  );
}

export default ReportsPage;