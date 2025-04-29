import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Sector, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// Cores para uso consistente em todos os gráficos
const COLORS = {
  primary: '#003366',
  secondary: '#FF6600',
  success: '#00C49F',
  warning: '#FFBB28',
  danger: '#FF0000',
  info: '#0088FE',
  categories: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B', '#6B66FF']
};

// ==================== GRÁFICO DE TENDÊNCIA APRIMORADO ====================
export function EnhancedTrendChart({ occurrences }) {
  // Estado para controlar o período de visualização
  const [period, setPeriod] = useState('30'); // 7, 30, 90, 365 dias
  
  // Função para agregar ocorrências por dia com período configurável
  const aggregateOccurrencesByDay = (data, days) => {
    const dailyCounts = {};
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // Inicializar todos os dias com zero
    for (let i = 0; i <= parseInt(days); i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dailyCounts[dateString] = 0;
    }
    
    // Contar ocorrências por dia
    data.forEach(occ => {
      const occDate = new Date(occ.dataHora);
      if (occDate >= startDate) {
        const dateString = occDate.toISOString().split('T')[0];
        dailyCounts[dateString] = (dailyCounts[dateString] || 0) + 1;
      }
    });
    
    // Converter para array e ordenar
    return Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, occurrences: count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  
  // Calcular média móvel de 7 dias
  const calculateMovingAverage = (data, window = 7) => {
    return data.map((item, index, array) => {
      if (index < window - 1) return { ...item, movingAvg: null };
      
      let sum = 0;
      for (let i = 0; i < window; i++) {
        sum += array[index - i].occurrences;
      }
      
      return {
        ...item,
        movingAvg: Math.round((sum / window) * 100) / 100
      };
    });
  };
  
  // Processar dados com base no período selecionado e calcular média móvel
  const chartData = useMemo(() => {
    const aggregatedData = aggregateOccurrencesByDay(occurrences, period);
    return calculateMovingAverage(aggregatedData);
  }, [occurrences, period]);
  
  // Identificar picos e tendências
  const trends = useMemo(() => {
    if (chartData.length < 7) return { trend: 'Insuficiente', percentage: 0 };
    
    const recentDays = chartData.slice(-7);
    const olderDays = chartData.slice(-14, -7);
    
    const recentAvg = recentDays.reduce((sum, item) => sum + item.occurrences, 0) / recentDays.length;
    const olderAvg = olderDays.reduce((sum, item) => sum + item.occurrences, 0) / olderDays.length;
    
    const percentChange = olderAvg === 0 
      ? recentAvg > 0 ? 100 : 0 
      : ((recentAvg - olderAvg) / olderAvg) * 100;
    
    let trend = 'Estável';
    if (percentChange > 10) trend = 'Aumento';
    else if (percentChange < -10) trend = 'Redução';
    
    return {
      trend,
      percentage: Math.round(percentChange)
    };
  }, [chartData]);
  
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Tendência de Ocorrências</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Período:</span>
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="7">7 dias</option>
            <option value="30">30 dias</option>
            <option value="90">90 dias</option>
            <option value="365">1 ano</option>
          </select>
        </div>
      </div>
      
      {/* Insights sobre tendências */}
      <div className="mb-4 p-3 rounded bg-gray-50 border-l-4 border-blue-500">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">
              Tendência atual: <span className={
                trends.trend === 'Aumento' ? 'text-red-600' : 
                trends.trend === 'Redução' ? 'text-green-600' : 'text-gray-600'
              }>{trends.trend}</span>
            </p>
            <p className="text-sm text-gray-600">
              {trends.percentage > 0 ? '+' : ''}{trends.percentage}% nos últimos 7 dias vs. semana anterior
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Média última semana:</p>
            <p className="font-medium">{
              Math.round(chartData.slice(-7).reduce((sum, item) => sum + item.occurrences, 0) / 7 * 10) / 10
            } por dia</p>
          </div>
        </div>
      </div>
      
      {/* Gráfico principal */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(tick) => new Date(tick + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              angle={-45}
              textAnchor="end"
              height={50}
              interval={period === '7' ? 0 : 'preserveStartEnd'}
            />
            <YAxis 
              allowDecimals={false} 
              width={30}
            />
            <Tooltip
              labelFormatter={(label) => new Date(label + 'T00:00:00').toLocaleDateString('pt-BR')}
              formatter={(value, name) => {
                if (name === 'Média Móvel (7d)') return [value, name];
                return [value, 'Ocorrências'];
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="occurrences"
              name="Ocorrências Diárias"
              stroke={COLORS.primary}
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="movingAvg"
              name="Média Móvel (7d)"
              stroke={COLORS.secondary}
              strokeWidth={2}
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ==================== GRÁFICO DE DISTRIBUIÇÃO POR TIPO ====================
export function OccurrenceTypesChart({ occurrences }) {
  // Agrupar ocorrências por tipo
  const typeData = useMemo(() => {
    const typeCounts = {};
    
    // Contar por tipo
    occurrences.forEach(occ => {
      typeCounts[occ.tipo] = (typeCounts[occ.tipo] || 0) + 1;
    });
    
    // Converter para array e ordenar por frequência
    return Object.entries(typeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [occurrences]);
  
  // Estado ativo para a interação com o Pie Chart
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Renderização personalizada do setor ativo no gráfico de pizza
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#999" className="text-xs">
          {value} casos ({(percent * 100).toFixed(1)}%)
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };
  
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Distribuição por Tipo de Ocorrência</h3>
      
      {/* Insights sobre distribuição */}
      <div className="mb-4 p-3 rounded bg-gray-50 border-l-4 border-purple-500">
        <p className="font-medium">Top 3 Tipos de Ocorrências:</p>
        <ul className="mt-2 space-y-1">
          {typeData.slice(0, 3).map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <span className="text-sm">{item.name}</span>
              <span className="text-sm font-medium">{item.value} ({(item.value / occurrences.length * 100).toFixed(1)}%)</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Gráfico de pizza */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={typeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {typeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS.categories[index % COLORS.categories.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ==================== GRÁFICO DE DISTRIBUIÇÃO POR REGIÃO ====================
export function RegionalDistributionChart({ occurrences }) {
  // Agrupar ocorrências por região/bairro
  const regionData = useMemo(() => {
    const regionCounts = {};
    
    // Função para extrair região/bairro do endereço
    const extractRegion = (address) => {
      if (!address) return 'Desconhecido';
      
      // Lógica simplificada - adaptar para seu formato de endereço
      const parts = address.split(',');
      return parts.length > 1 ? parts[1].trim() : parts[0].trim();
    };
    
    // Contar por região
    occurrences.forEach(occ => {
      const region = extractRegion(occ.endereco);
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });
    
    // Converter para array e ordenar por frequência
    return Object.entries(regionCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 regiões com mais ocorrências
  }, [occurrences]);
  
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Distribuição Regional</h3>
      
      {/* Insights sobre distribuição regional */}
      <div className="mb-4 p-3 rounded bg-gray-50 border-l-4 border-green-500">
        <p className="font-medium">Concentração de Ocorrências:</p>
        <p className="text-sm text-gray-600 mt-1">
          {regionData[0]?.name || 'N/A'} e {regionData[1]?.name || 'N/A'} são as áreas com maior número de ocorrências, 
          representando {regionData.length > 1 ? 
            ((regionData[0].value + regionData[1].value) / occurrences.length * 100).toFixed(1) 
            : 0}% do total.
        </p>
      </div>
      
      {/* Gráfico de barras horizontais */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={regionData}
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" tick={{fontSize: 12}} />
            <Tooltip formatter={(value) => [`${value} ocorrências`, 'Total']} />
            <Bar dataKey="value" fill={COLORS.info} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ==================== COMPONENTE DE MÉTRICAS DE PERFORMANCE ====================
export function PerformanceMetricsChart({ occurrences }) {
  // Agrupar e calcular métricas por equipe/unidade
  const performanceData = useMemo(() => {
    const teams = {};
    
    // Processar dados por equipe
    occurrences.forEach(occ => {
      const team = occ.equipe || 'Não atribuído';
      if (!teams[team]) {
        teams[team] = {
          ocorrencias: 0,
          tempoRespostaTotal: 0,
          tempoRespondidasCount: 0,
          finalizadas: 0,
          emAndamento: 0,
        };
      }
      
      teams[team].ocorrencias++;
      
      if (occ.status === 'Finalizado') {
        teams[team].finalizadas++;
      } else if (occ.status === 'Em Andamento' || occ.status === 'Controlado') {
        teams[team].emAndamento++;
      }
      
      if (occ.tempoResposta) {
        const time = parseInt(occ.tempoResposta.replace('min', ''), 10);
        if (!isNaN(time)) {
          teams[team].tempoRespostaTotal += time;
          teams[team].tempoRespondidasCount++;
        }
      }
    });
    
    // Calcular médias e taxas
    return Object.entries(teams).map(([name, data]) => ({
      name,
      tempoMedioResposta: data.tempoRespondidasCount > 0 
        ? Math.round(data.tempoRespostaTotal / data.tempoRespondidasCount) 
        : 0,
      taxaResolucao: data.ocorrencias > 0 
        ? (data.finalizadas / data.ocorrencias * 100) 
        : 0,
      ocorrenciasAtendidas: data.ocorrencias,
      emAndamento: data.emAndamento
    })).filter(team => team.ocorrenciasAtendidas > 0);
  }, [occurrences]);
  
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Métricas de Performance</h3>
      
      {/* Insights sobre performance */}
      <div className="mb-4 p-3 rounded bg-gray-50 border-l-4 border-yellow-500">
        <p className="font-medium">Destaques de Performance:</p>
        {performanceData.length > 0 ? (
          <>
            <p className="text-sm text-gray-600 mt-1">
              Equipe mais rápida: <span className="font-medium">
                {performanceData.sort((a, b) => a.tempoMedioResposta - b.tempoMedioResposta)[0]?.name || 'N/A'}
              </span> ({performanceData.sort((a, b) => a.tempoMedioResposta - b.tempoMedioResposta)[0]?.tempoMedioResposta || 0} min)
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Maior taxa de resolução: <span className="font-medium">
                {performanceData.sort((a, b) => b.taxaResolucao - a.taxaResolucao)[0]?.name || 'N/A'}
              </span> ({performanceData.sort((a, b) => b.taxaResolucao - a.taxaResolucao)[0]?.taxaResolucao.toFixed(1) || 0}%)
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-600 mt-1">Dados insuficientes para análise de performance</p>
        )}
      </div>
      
      {/* Gráfico de radar */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Radar name="Tempo Médio (min)" dataKey="tempoMedioResposta" stroke={COLORS.danger} 
                   fill={COLORS.danger} fillOpacity={0.5} />
            <Radar name="Taxa Resolução (%)" dataKey="taxaResolucao" stroke={COLORS.success} 
                   fill={COLORS.success} fillOpacity={0.5} />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ==================== COMPONENTE DE ANÁLISE TEMPORAL ====================
export function TimePatternAnalysis({ occurrences }) {
  // Análise da distribuição por período do dia
  const timeDistribution = useMemo(() => {
    const periodCounts = {
      'Madrugada (00h-06h)': 0,
      'Manhã (06h-12h)': 0, 
      'Tarde (12h-18h)': 0,
      'Noite (18h-00h)': 0
    };
    
    occurrences.forEach(occ => {
      const date = new Date(occ.dataHora);
      const hour = date.getHours();
      
      if (hour >= 0 && hour < 6) periodCounts['Madrugada (00h-06h)']++;
      else if (hour >= 6 && hour < 12) periodCounts['Manhã (06h-12h)']++;
      else if (hour >= 12 && hour < 18) periodCounts['Tarde (12h-18h)']++;
      else periodCounts['Noite (18h-00h)']++;
    });
    
    return Object.entries(periodCounts).map(([name, value]) => ({ name, value }));
  }, [occurrences]);
  
  // Análise por dia da semana
  const weekdayDistribution = useMemo(() => {
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const dayCounts = dayNames.reduce((acc, day) => ({ ...acc, [day]: 0 }), {});
    
    occurrences.forEach(occ => {
      const date = new Date(occ.dataHora);
      const dayName = dayNames[date.getDay()];
      dayCounts[dayName]++;
    });
    
    return dayNames.map(name => ({ name, value: dayCounts[name] }));
  }, [occurrences]);
  
  // Identificar padrões e previsões
  const patterns = useMemo(() => {
    // Identificar período com mais ocorrências
    const maxPeriod = timeDistribution.reduce(
      (max, period) => period.value > max.value ? period : max, 
      { name: '', value: 0 }
    );
    
    // Identificar dia da semana com mais ocorrências
    const maxDay = weekdayDistribution.reduce(
      (max, day) => day.value > max.value ? day : max, 
      { name: '', value: 0 }
    );
    
    return {
      peakPeriod: maxPeriod.name,
      peakDay: maxDay.name
    };
  }, [timeDistribution, weekdayDistribution]);

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Análise de Padrões Temporais</h3>
      
      {/* Insights sobre padrões */}
      <div className="mb-4 p-3 rounded bg-gray-50 border-l-4 border-blue-500">
        <p className="font-medium">Padrões Identificados:</p>
        <p className="text-sm text-gray-600 mt-1">
          Pico de ocorrências: <span className="font-medium">{patterns.peakPeriod}</span> em <span className="font-medium">{patterns.peakDay}</span>
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Esta análise pode orientar o planejamento de escala e distribuição de recursos.
        </p>
      </div>
      
      {/* Visualização em grid de dois gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-52">
          <p className="text-sm font-medium text-gray-700 mb-2">Distribuição por Período do Dia</p>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={timeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {timeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.categories[index % COLORS.categories.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} ocorrências`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="h-52">
          <p className="text-sm font-medium text-gray-700 mb-2">Distribuição por Dia da Semana</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weekdayDistribution}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{fontSize: 10}} />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => [`${value} ocorrências`, 'Total']} />
              <Bar dataKey="value" fill={COLORS.info} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ==================== COMPONENTE DE DASHBOARD DE INSIGHTS ====================
export function InsightsDashboard({ occurrences }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Painel de Insights para Tomada de Decisão</h2>
      
      {/* Primeira fileira */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnhancedTrendChart occurrences={occurrences} />
        <OccurrenceTypesChart occurrences={occurrences} />
      </div>
      
      {/* Segunda fileira */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RegionalDistributionChart occurrences={occurrences} />
        <TimePatternAnalysis occurrences={occurrences} />
      </div>
      
      {/* Terceira fileira */}
      <div className="grid grid-cols-1 gap-6">
        <PerformanceMetricsChart occurrences={occurrences} />
      </div>
    </div>
  );
}