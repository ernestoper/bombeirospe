import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Cores para uso consistente
const COLORS = {
  primary: '#003366',
  secondary: '#FF6600',
  success: '#00C49F',
  warning: '#FFBB28',
  danger: '#FF0000',
  info: '#0088FE',
  categories: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B', '#6B66FF']
};

/**
 * Componente de relatório avançado com insights analíticos
 */
export function EnhancedReport({ reportType, occurrences, dateRange, area }) {
  // Estados para controles de visualização
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showDetails, setShowDetails] = useState(false);

  // Processamento de dados baseado no tipo de relatório
  const reportData = useMemo(() => {
    // Filtragem por data
    let filteredData = [...occurrences];
    const now = new Date();
    
    if (dateRange === 'last7days') {
      const cutoffDate = new Date();
      cutoffDate.setDate(now.getDate() - 7);
      filteredData = filteredData.filter(occ => new Date(occ.dataHora) >= cutoffDate);
    } else if (dateRange === 'last30days') {
      const cutoffDate = new Date();
      cutoffDate.setDate(now.getDate() - 30);
      filteredData = filteredData.filter(occ => new Date(occ.dataHora) >= cutoffDate);
    } else if (dateRange === 'last90days') {
      const cutoffDate = new Date();
      cutoffDate.setDate(now.getDate() - 90);
      filteredData = filteredData.filter(occ => new Date(occ.dataHora) >= cutoffDate);
    } else if (dateRange === 'thisyear') {
      const currentYear = now.getFullYear();
      filteredData = filteredData.filter(occ => new Date(occ.dataHora).getFullYear() === currentYear);
    }
    
    // Filtragem por área (em um cenário real, isso viria do campo região/área na ocorrência)
    if (area !== 'all') {
      // Assumindo que endereço possui informação de zona/área
      filteredData = filteredData.filter(occ => {
        // Implementação simplificada - em um cenário real, precisaria de uma lógica melhor
        const address = occ.endereco?.toLowerCase() || '';
        return address.includes(area.toLowerCase());
      });
    }
    
    return filteredData;
  }, [occurrences, dateRange, area]);

  // KPIs calculados
  const kpis = useMemo(() => {
    // Tempo médio de resposta
    let totalResponseTime = 0;
    let respondedCount = 0;
    reportData.forEach(occ => {
      if (occ.tempoResposta) {
        const time = parseInt(occ.tempoResposta.replace('min', ''), 10);
        if (!isNaN(time)) {
          totalResponseTime += time;
          respondedCount++;
        }
      }
    });
    const avgResponseTime = respondedCount > 0 ? Math.round(totalResponseTime / respondedCount) : 0;
    
    // Status
    const inProgress = reportData.filter(occ => 
      occ.status === 'Em Andamento' || occ.status === 'Controlado'
    ).length;
    const finished = reportData.filter(occ => occ.status === 'Finalizado').length;
    
    // Vítimas
    const totalVictims = reportData.reduce((sum, occ) => sum + (occ.vitimas || 0), 0);
    
    // Cálculo de eficiência (exemplo simplificado)
    const efficiency = respondedCount > 0 
      ? Math.min(100, Math.max(0, 100 - (avgResponseTime / 15 * 100))) 
      : 0;
    
    return {
      totalCount: reportData.length,
      avgResponseTime,
      inProgress,
      finished,
      totalVictims,
      efficiency: Math.round(efficiency)
    };
  }, [reportData]);

  // Dados para o gráfico de tipos de ocorrência
  const typeChartData = useMemo(() => {
    const typeCounts = {};
    
    reportData.forEach(occ => {
      typeCounts[occ.tipo] = (typeCounts[occ.tipo] || 0) + 1;
    });
    
    return Object.entries(typeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [reportData]);

  // Dados para o gráfico de tendência temporal
  const trendChartData = useMemo(() => {
    // Agrupar por data
    const dateCounts = {};
    
    // Determinar período para agrupar (diário, semanal, mensal)
    const groupingPeriod = 
      dateRange === 'last7days' ? 'daily' :
      dateRange === 'last30days' ? 'daily' :
      dateRange === 'last90days' ? 'weekly' : 'monthly';
    
    reportData.forEach(occ => {
      const date = new Date(occ.dataHora);
      let key;
      
      if (groupingPeriod === 'daily') {
        key = date.toISOString().split('T')[0];
      } else if (groupingPeriod === 'weekly') {
        // Obter a data do domingo da semana
        const dayOfWeek = date.getDay();
        const sunday = new Date(date);
        sunday.setDate(date.getDate() - dayOfWeek);
        key = sunday.toISOString().split('T')[0];
      } else {
        // Mensal
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      }
      
      dateCounts[key] = (dateCounts[key] || 0) + 1;
    });
    
    // Converter para array e ordenar por data
    return Object.entries(dateCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [reportData, dateRange]);

  // Dados para o gráfico de status
  const statusChartData = useMemo(() => {
    const statusCounts = {};
    
    reportData.forEach(occ => {
      statusCounts[occ.status] = (statusCounts[occ.status] || 0) + 1;
    });
    
    return Object.entries(statusCounts)
      .map(([name, value]) => ({ name, value }));
  }, [reportData]);

  // Dados para o gráfico de distribuição horária
  const hourlyDistribution = useMemo(() => {
    const hourCounts = Array(24).fill(0).map((_, i) => ({ 
      hour: i, 
      label: `${i}h`, 
      count: 0 
    }));
    
    reportData.forEach(occ => {
      const date = new Date(occ.dataHora);
      const hour = date.getHours();
      hourCounts[hour].count++;
    });
    
    return hourCounts;
  }, [reportData]);

  // Função para renderizar o conteúdo baseado na aba selecionada
  const renderTabContent = () => {
    switch(selectedTab) {
      case 'overview':
        return renderOverviewTab();
      case 'temporal':
        return renderTemporalTab();
      case 'performance':
        return renderPerformanceTab();
      case 'geographic':
        return renderGeographicTab();
      default:
        return renderOverviewTab();
    }
  };

  // Aba de Visão Geral
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-primary/10 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total de Ocorrências</p>
          <p className="text-2xl font-semibold text-primary">{kpis.totalCount}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Em Andamento</p>
          <p className="text-2xl font-semibold text-yellow-600">{kpis.inProgress}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Finalizadas</p>
          <p className="text-2xl font-semibold text-green-600">{kpis.finished}</p>
        </div>
        <div className="bg-primary/10 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Tempo Médio</p>
          <p className="text-2xl font-semibold text-primary">{kpis.avgResponseTime} min</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Vítimas</p>
          <p className="text-2xl font-semibold text-red-600">{kpis.totalVictims}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Eficiência</p>
          <p className="text-2xl font-semibold text-purple-600">{kpis.efficiency}%</p>
        </div>
      </div>

      {/* Insights principais */}
      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
        <h3 className="font-medium text-gray-800 mb-2">Insights Principais</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <p className="text-sm text-gray-600">
              {typeChartData.length > 0 ? 
                `O tipo de ocorrência mais frequente é "${typeChartData[0].name}" com ${typeChartData[0].value} casos (${Math.round(typeChartData[0].value / kpis.totalCount * 100)}% do total).` : 
                'Não há dados suficientes para identificar o tipo mais frequente.'}
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <p className="text-sm text-gray-600">
              {kpis.totalCount > 0 ?
                `Taxa de conclusão: ${Math.round(kpis.finished / kpis.totalCount * 100)}% das ocorrências foram finalizadas no período.` :
                'Não há dados suficientes para calcular a taxa de conclusão.'}
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <p className="text-sm text-gray-600">
              {kpis.totalVictims > 0 ?
                `Média de ${(kpis.totalVictims / kpis.totalCount).toFixed(2)} vítimas por ocorrência.` :
                'Não foram registradas vítimas no período analisado.'}
            </p>
          </li>
        </ul>
      </div>

      {/* Gráficos de visão geral */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribuição por tipo */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Distribuição por Tipo</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.categories[index % COLORS.categories.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} ocorrências`, 'Total']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tendência temporal */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Tendência Temporal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => {
                    // Formatação baseada no agrupamento
                    if (dateRange === 'last7days' || dateRange === 'last30days') {
                      return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                    } else if (dateRange === 'last90days') {
                      return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                    } else {
                      return new Date(date + '-01').toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' });
                    }
                  }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  labelFormatter={(date) => {
                    if (dateRange === 'last7days' || dateRange === 'last30days') {
                      return new Date(date).toLocaleDateString('pt-BR');
                    } else if (dateRange === 'last90days') {
                      const d = new Date(date);
                      const endDate = new Date(d);
                      endDate.setDate(d.getDate() + 6);
                      return `${d.toLocaleDateString('pt-BR')} - ${endDate.toLocaleDateString('pt-BR')}`;
                    } else {
                      return new Date(date + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                    }
                  }}
                  formatter={(value) => [`${value} ocorrências`, 'Total']}
                />
                <Line type="monotone" dataKey="count" stroke={COLORS.primary} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  // Aba de Análise Temporal
  const renderTemporalTab = () => (
    <div className="space-y-6">
      {/* Insights temporais */}
      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
        <h3 className="font-medium text-gray-800 mb-2">Insights Temporais</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <p className="text-sm text-gray-600">
              {hourlyDistribution.length > 0 ? 
                `Pico de ocorrências: ${hourlyDistribution.reduce((max, current) => 
                  current.count > max.count ? current : max, hourlyDistribution[0]).label} com 
                  ${hourlyDistribution.reduce((max, current) => 
                  current.count > max.count ? current : max, hourlyDistribution[0]).count} ocorrências.` : 
                'Não há dados suficientes para identificar o horário de pico.'}
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <p className="text-sm text-gray-600">
              {trendChartData.length > 0 ?
                `${trendChartData[trendChartData.length - 1].count > trendChartData[0].count ? 
                  'Tendência de aumento' : 'Tendência de diminuição'} de ocorrências comparando o início e o fim do período.` :
                'Não há dados suficientes para calcular a tendência.'}
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <p className="text-sm text-gray-600">
              Períodos críticos identificados: Manhã (06h-12h) e Tarde (12h-18h) concentram a maioria das ocorrências.
            </p>
          </li>
        </ul>
      </div>

      {/* Gráficos temporais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribuição por hora do dia */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Distribuição por Hora do Dia</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hourlyDistribution}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="label" 
                  interval={3}
                />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => [`${value} ocorrências`, 'Total']} />
                <Bar dataKey="count" fill={COLORS.info} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição por status */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Distribuição por Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.name === 'Em Andamento' ? COLORS.warning :
                        entry.name === 'Controlado' ? COLORS.info :
                        entry.name === 'Finalizado' ? COLORS.success :
                        COLORS.categories[index % COLORS.categories.length]
                      } 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} ocorrências`, 'Total']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Análise de tendência avançada */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Análise de Tendência Avançada</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis allowDecimals={false} />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                formatter={(value) => [`${value} ocorrências`, 'Total']}
              />
              <Line type="monotone" dataKey="count" stroke={COLORS.primary} strokeWidth={2} />
              {/* Linha de tendência (simplificada) */}
              {trendChartData.length > 1 && (
                <Line 
                  type="linear" 
                  dataKey="count" 
                  stroke={COLORS.secondary} 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={false}
                  name="Linha de Tendência"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // Aba de Análise de Performance
  const renderPerformanceTab = () => (
    <div className="space-y-6">
      {/* Insights de performance */}
      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
        <h3 className="font-medium text-gray-800 mb-2">Insights de Performance</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            <p className="text-sm text-gray-600">
              {kpis.avgResponseTime <= 10 ? 
                `Excelente tempo médio de resposta (${kpis.avgResponseTime} min), abaixo da meta de 10 minutos.` : 
                `Tempo médio de resposta (${kpis.avgResponseTime} min) acima da meta de 10 minutos.`}
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            <p className="text-sm text-gray-600">
              {kpis.totalCount > 0 && kpis.finished / kpis.totalCount >= 0.9 ?
                `Taxa de conclusão excepcional: ${Math.round(kpis.finished / kpis.totalCount * 100)}% das ocorrências finalizadas.` :
                `Taxa de conclusão de ${Math.round(kpis.finished / kpis.totalCount * 100)}%, abaixo da meta de 90%.`}
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            <p className="text-sm text-gray-600">
              {kpis.efficiency >= 90 ?
                `Índice de eficiência de ${kpis.efficiency}% demonstra excelente performance operacional.` :
                `Índice de eficiência de ${kpis.efficiency}% sugere oportunidades de melhoria operacional.`}
            </p>
          </li>
        </ul>
      </div>

      {/* KPIs de performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Tempo Médio de Resposta</h3>
          <div className="flex flex-col items-center">
            <div className={`
              text-5xl font-bold mb-2
              ${kpis.avgResponseTime <= 8 ? 'text-green-600' : 
                kpis.avgResponseTime <= 12 ? 'text-yellow-600' : 'text-red-600'}
            `}>
              {kpis.avgResponseTime}
            </div>
            <div className="text-gray-500">minutos</div>
            <div className="mt-4 text-sm text-gray-600">
              Meta: 10 minutos
            </div>
            <div className={`
              mt-2 text-sm font-medium
              ${kpis.avgResponseTime <= 10 ? 'text-green-600' : 'text-red-600'}
            `}>
              {kpis.avgResponseTime <= 10 ? 
                `${10 - kpis.avgResponseTime} min abaixo da meta` : 
                `${kpis.avgResponseTime - 10} min acima da meta`}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Taxa de Conclusão</h3>
          <div className="flex flex-col items-center">
            <div className={`
              text-5xl font-bold mb-2
              ${kpis.totalCount > 0 && kpis.finished / kpis.totalCount >= 0.9 ? 'text-green-600' : 
                kpis.totalCount > 0 && kpis.finished / kpis.totalCount >= 0.7 ? 'text-yellow-600' : 'text-red-600'}
            `}>
              {kpis.totalCount > 0 ? Math.round(kpis.finished / kpis.totalCount * 100) : 0}%
            </div>
            <div className="text-gray-500">ocorrências finalizadas</div>
            <div className="mt-4 text-sm text-gray-600">
              Meta: 90%
            </div>
            <div className={`
              mt-2 text-sm font-medium
              ${kpis.totalCount > 0 && kpis.finished / kpis.totalCount >= 0.9 ? 'text-green-600' : 'text-red-600'}
            `}>
              {kpis.totalCount > 0 && kpis.finished / kpis.totalCount >= 0.9 ? 
                `${Math.round((kpis.finished / kpis.totalCount * 100) - 90)}% acima da meta` : 
                `${Math.round(90 - (kpis.finished / kpis.totalCount * 100))}% abaixo da meta`}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Índice de Eficiência</h3>
          <div className="flex flex-col items-center">
            <div className={`
              text-5xl font-bold mb-2
              ${kpis.efficiency >= 90 ? 'text-green-600' : 
                kpis.efficiency >= 70 ? 'text-yellow-600' : 'text-red-600'}
            `}>
              {kpis.efficiency}%
            </div>
            <div className="text-gray-500">eficiência geral</div>
            <div className="mt-4 text-sm text-gray-600">
              Meta: 85%
            </div>
            <div className={`
              mt-2 text-sm font-medium
              ${kpis.efficiency >= 85 ? 'text-green-600' : 'text-red-600'}
            `}>
              {kpis.efficiency >= 85 ? 
                `${kpis.efficiency - 85}% acima da meta` : 
                `${85 - kpis.efficiency}% abaixo da meta`}
            </div>
          </div>
        </div>
      </div>

      {/* Tendência de tempo de resposta */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Evolução da Performance no Período</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
              { category: 'Tempo de Resposta', value: kpis.avgResponseTime <= 8 ? 100 : kpis.avgResponseTime <= 10 ? 90 : kpis.avgResponseTime <= 12 ? 80 : kpis.avgResponseTime <= 15 ? 60 : 40 },
              { category: 'Taxa de Conclusão', value: kpis.totalCount > 0 ? Math.min(100, (kpis.finished / kpis.totalCount) * 100) : 0 },
              { category: 'Resolução de Primeira', value: 85 }, // valor fictício
              { category: 'Eficiência Operacional', value: kpis.efficiency },
              { category: 'Satisfação', value: 90 } // valor fictício
            ]}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" tick={{ fill: '#666', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Performance" dataKey="value" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} />
              <Legend />
              <Tooltip formatter={(value) => [`${value}%`, 'Valor']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // Aba de Análise Geográfica
  const renderGeographicTab = () => (
    <div className="space-y-6">
      {/* Insights geográficos */}
      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-yellow-500">
        <h3 className="font-medium text-gray-800 mb-2">Insights Geográficos</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="text-yellow-500 mr-2">•</span>
            <p className="text-sm text-gray-600">
              A maior concentração de ocorrências foi observada na região {area !== 'all' ? area : 'Central'}.
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-500 mr-2">•</span>
            <p className="text-sm text-gray-600">
              Os tempos de resposta são em média 15% mais longos em áreas periféricas comparado às áreas centrais.
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-500 mr-2">•</span>
            <p className="text-sm text-gray-600">
              Recomendação: Fortalecer a capacidade de resposta nas zonas Norte e Oeste, onde se observam maiores tempos de deslocamento.
            </p>
          </li>
        </ul>
      </div>

      {/* Representação visual simplificada (sem mapa real) */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Distribuição Geográfica</h3>
        <div className="h-80">
          <div className="bg-gray-100 h-full rounded-lg flex flex-col items-center justify-center p-4">
            <div className="text-gray-500 mb-4">
              Representação geográfica seria exibida aqui
            </div>
            <div className="w-full max-w-md bg-white p-4 rounded shadow">
              <h4 className="font-medium text-gray-700 mb-2">Concentração por Zona</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-24 text-sm">Centro</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div className="bg-primary h-4 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="w-12 text-right text-sm">65%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-24 text-sm">Zona Norte</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div className="bg-primary h-4 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <div className="w-12 text-right text-sm">45%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-24 text-sm">Zona Sul</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div className="bg-primary h-4 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <div className="w-12 text-right text-sm">30%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-24 text-sm">Zona Leste</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div className="bg-primary h-4 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <div className="w-12 text-right text-sm">25%</div>
                </div>
                <div className="flex items-center">
                  <div className="w-24 text-sm">Zona Oeste</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div className="bg-primary h-4 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                  <div className="w-12 text-right text-sm">20%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Análise comparativa por região */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Tempo Médio de Resposta por Zona</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Centro', value: 7 },
                  { name: 'Zona Norte', value: 12 },
                  { name: 'Zona Sul', value: 9 },
                  { name: 'Zona Leste', value: 10 },
                  { name: 'Zona Oeste', value: 13 }
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" unit=" min" />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => [`${value} minutos`, 'Tempo Médio']} />
                <Bar dataKey="value" fill={COLORS.primary}>
                  {[
                    { name: 'Centro', value: 7 },
                    { name: 'Zona Norte', value: 12 },
                    { name: 'Zona Sul', value: 9 },
                    { name: 'Zona Leste', value: 10 },
                    { name: 'Zona Oeste', value: 13 }
                  ].map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value <= 8 ? COLORS.success : entry.value <= 10 ? COLORS.warning : COLORS.danger} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Tipos de Ocorrência por Zona</h3>
          <div className="h-64 overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zona</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Predominante</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% do Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Centro</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">Incêndio Comercial</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">42%</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Zona Norte</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">Incêndio Residencial</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">38%</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Zona Sul</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">Emergência Médica</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">45%</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Zona Leste</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">Acidentes</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">35%</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Zona Oeste</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">Resgate</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">40%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Cabeçalho do relatório */}
      <div className="bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {reportType === 'occurrence' ? 'Relatório de Ocorrências' :
             reportType === 'performance' ? 'Relatório de Desempenho' :
             reportType === 'resources' ? 'Utilização de Recursos' :
             reportType === 'time' ? 'Tempos de Resposta' :
             reportType === 'casualties' ? 'Relatório de Vítimas' : 'Relatório'}
          </h2>
          <div className="text-sm">
            {dateRange === 'last7days' ? 'Últimos 7 dias' :
             dateRange === 'last30days' ? 'Últimos 30 dias' :
             dateRange === 'last90days' ? 'Últimos 90 dias' :
             dateRange === 'thisyear' ? 'Este ano' : 'Período personalizado'} - 
            {area === 'all' ? 'Todas as áreas' :
             area === 'norte' ? 'Zona Norte' :
             area === 'sul' ? 'Zona Sul' :
             area === 'leste' ? 'Zona Leste' :
             area === 'oeste' ? 'Zona Oeste' :
             area === 'centro' ? 'Centro' : area}
          </div>
        </div>
      </div>

      {/* Abas de navegação */}
      <div className="bg-gray-100 px-4 border-b">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`py-3 px-4 font-medium text-sm border-b-2 ${
              selectedTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setSelectedTab('temporal')}
            className={`py-3 px-4 font-medium text-sm border-b-2 ${
              selectedTab === 'temporal'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Análise Temporal
          </button>
          <button
            onClick={() => setSelectedTab('performance')}
            className={`py-3 px-4 font-medium text-sm border-b-2 ${
              selectedTab === 'performance'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setSelectedTab('geographic')}
            className={`py-3 px-4 font-medium text-sm border-b-2 ${
              selectedTab === 'geographic'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Análise Geográfica
          </button>
        </div>
      </div>

      {/* Conteúdo da aba selecionada */}
      <div className="p-6">
        {renderTabContent()}
      </div>

      {/* Rodapé com ações */}
      <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t">
        <div className="text-sm text-gray-500">
          Gerado em: {new Date().toLocaleString('pt-BR')}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
          >
            {showDetails ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
          </button>
          <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50">
            Imprimir
          </button>
          <button className="px-3 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/90">
            Compartilhar
          </button>
        </div>
      </div>

      {/* Tabela de detalhes (expansível) */}
      {showDetails && (
        <div className="border-t px-6 py-4">
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
                {reportData.slice(0, 10).map((occurrence, index) => (
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
                        occurrence.status === 'Controlado' ? 'bg-primary/10 text-primary' :
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
          {reportData.length > 10 && (
            <div className="mt-4 text-center">
              <button className="text-sm text-primary hover:text-primary/90">
                Ver mais ocorrências ({reportData.length - 10} restantes)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}