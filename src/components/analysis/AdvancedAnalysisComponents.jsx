import React, { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis
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
 * Gráfico de Distribuição Temporal por Hora do Dia
 */
export function HourlyDistributionChart({ occurrences, height = '350px' }) {
  // Dados para o gráfico de distribuição horária
  const hourlyDistribution = useMemo(() => {
    const hourCounts = Array(24).fill(0).map((_, i) => ({ 
      hour: i, 
      label: `${i}h`, 
      count: 0 
    }));
    
    occurrences.forEach(occ => {
      const date = new Date(occ.dataHora);
      const hour = date.getHours();
      hourCounts[hour].count++;
    });
    
    return hourCounts;
  }, [occurrences]);

  // Identificar horário de pico
  const peakHour = useMemo(() => {
    return hourlyDistribution.reduce((max, current) => 
      current.count > max.count ? current : max, hourlyDistribution[0]);
  }, [hourlyDistribution]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Distribuição por Hora do Dia</h3>
      
      {/* Insights sobre o horário de pico */}
      <div className="mb-4 p-3 rounded bg-gray-50 border-l-4 border-blue-500">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Horário de pico:</span> {peakHour.label} com {peakHour.count} ocorrências
        </p>
      </div>
      
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={hourlyDistribution}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="label" 
              interval={2}
            />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value) => [`${value} ocorrências`, 'Total']} />
            <Bar 
              dataKey="count" 
              name="Ocorrências" 
              fill={COLORS.info}
              barSize={20}
            >
              {hourlyDistribution.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.hour === peakHour.hour ? COLORS.warning : COLORS.info} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Gráfico de Análise de Tempo de Resposta por Tipo de Ocorrência
 */
export function ResponseTimeByTypeChart({ occurrences, height = '350px' }) {
  // Dados para o gráfico de tempo de resposta por tipo
  const responseTimeData = useMemo(() => {
    const typeResponseTimes = {};
    const typeCounts = {};
    
    occurrences.forEach(occ => {
      if (occ.tipo && occ.tempoResposta) {
        const time = parseInt(occ.tempoResposta.replace('min', ''), 10);
        if (!isNaN(time)) {
          typeResponseTimes[occ.tipo] = (typeResponseTimes[occ.tipo] || 0) + time;
          typeCounts[occ.tipo] = (typeCounts[occ.tipo] || 0) + 1;
        }
      }
    });
    
    return Object.entries(typeResponseTimes)
      .map(([type, totalTime]) => ({
        tipo: type,
        tempoMedio: Math.round(totalTime / typeCounts[type]),
        count: typeCounts[type]
      }))
      .sort((a, b) => b.count - a.count) // Ordenar por frequência
      .slice(0, 8); // Limite para os 8 tipos mais comuns
  }, [occurrences]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Tempo Médio de Resposta por Tipo</h3>
      
      {/* Insights sobre tempo de resposta */}
      {responseTimeData.length > 0 && (
        <div className="mb-4 p-3 rounded bg-gray-50 border-l-4 border-green-500">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Tipo mais rápido:</span> {
              responseTimeData.reduce((min, current) => 
                current.tempoMedio < min.tempoMedio ? current : min, responseTimeData[0]).tipo
            } ({
              responseTimeData.reduce((min, current) => 
                current.tempoMedio < min.tempoMedio ? current : min, responseTimeData[0]).tempoMedio
            } min)
          </p>
        </div>
      )}
      
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={responseTimeData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" unit=" min" />
            <YAxis dataKey="tipo" type="category" width={150} />
            <Tooltip formatter={(value) => [`${value} minutos`, 'Tempo Médio']} />
            <Bar 
              dataKey="tempoMedio" 
              name="Tempo Médio" 
              fill={COLORS.primary}
            >
              {responseTimeData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.tempoMedio <= 8 ? COLORS.success : 
                        entry.tempoMedio <= 12 ? COLORS.warning : 
                        COLORS.danger} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Gráfico de Correlação entre Horário e Tipo de Ocorrência
 */
export function TimeTypeCorrelationChart({ occurrences, height = '350px' }) {
  // Dados para o gráfico de correlação
  const correlationData = useMemo(() => {
    // Obter os 5 tipos mais comuns
    const typeCounts = {};
    occurrences.forEach(occ => {
      if (occ.tipo) {
        typeCounts[occ.tipo] = (typeCounts[occ.tipo] || 0) + 1;
      }
    });
    
    const topTypes = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type]) => type);
    
    // Agrupar por período do dia
    const periods = [
      { name: 'Madrugada', range: [0, 5], counts: {} },
      { name: 'Manhã', range: [6, 11], counts: {} },
      { name: 'Tarde', range: [12, 17], counts: {} },
      { name: 'Noite', range: [18, 23], counts: {} }
    ];
    
    // Inicializar contagens como 0
    periods.forEach(period => {
      topTypes.forEach(type => {
        period.counts[type] = 0;
      });
    });
    
    // Contar ocorrências por tipo e período
    occurrences.forEach(occ => {
      if (occ.tipo && topTypes.includes(occ.tipo)) {
        const date = new Date(occ.dataHora);
        const hour = date.getHours();
        
        const period = periods.find(p => hour >= p.range[0] && hour <= p.range[1]);
        if (period) {
          period.counts[occ.tipo]++;
        }
      }
    });
    
    // Formatar dados para o gráfico
    return periods.map(period => ({
      periodo: period.name,
      ...period.counts
    }));
  }, [occurrences]);

  // Obter os tipos para o gráfico
  const occurrenceTypes = useMemo(() => {
    if (correlationData.length === 0) return [];
    return Object.keys(correlationData[0]).filter(key => key !== 'periodo');
  }, [correlationData]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Correlação Horário vs. Tipo de Ocorrência</h3>
      
      {/* Insights sobre correlações */}
      <div className="mb-4 p-3 rounded bg-gray-50 border-l-4 border-purple-500">
        <p className="text-sm text-gray-700">
          Este gráfico mostra a distribuição dos 5 tipos mais comuns de ocorrências ao longo do dia, 
          ajudando a identificar padrões temporais específicos para cada tipo.
        </p>
      </div>
      
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={correlationData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            {occurrenceTypes.map((type, index) => (
              <Bar 
                key={type}
                dataKey={type} 
                stackId="a"
                fill={COLORS.categories[index % COLORS.categories.length]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Gráfico de Radar para Análise Multidimensional
 */
export function MultiDimensionalAnalysisChart({ occurrences, height = '350px' }) {
  // Dados para o gráfico de radar
  const radarData = useMemo(() => {
    if (occurrences.length === 0) return [];
    
    // Calcular métricas relevantes
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    // Contagens por período
    const recentCount = occurrences.filter(occ => 
      new Date(occ.dataHora) >= lastWeek
    ).length;
    
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
    const avgResponseTime = respondedCount > 0 ? Math.round(totalResponseTime / respondedCount) : 0;
    
    // Contar status
    const finalizados = occurrences.filter(occ => occ.status === 'Finalizado').length;
    const emAndamento = occurrences.filter(occ => 
      occ.status === 'Em Andamento' || occ.status === 'Controlado'
    ).length;
    
    // Métricas normalizadas para o gráfico de radar (0-100)
    return [
      { 
        categoria: 'Volume Semanal', 
        A: Math.min(100, (recentCount / (occurrences.length || 1)) * 100),
        fullMark: 100
      },
      { 
        categoria: 'Tempo Resposta', 
        A: Math.max(0, 100 - (avgResponseTime / 15 * 100)),
        fullMark: 100
      },
      { 
        categoria: 'Taxa Conclusão', 
        A: Math.min(100, (finalizados / (occurrences.length || 1)) * 100),
        fullMark: 100
      },
      { 
        categoria: 'Em Andamento', 
        A: Math.min(100, (emAndamento / (occurrences.length || 1)) * 100),
        fullMark: 100
      },
      { 
        categoria: 'Criticidade', 
        A: occurrences.some(occ => occ.prioridade === 'Alta') ? 80 : 
           occurrences.some(occ => occ.prioridade === 'Média') ? 50 : 30,
        fullMark: 100
      }
    ];
  }, [occurrences]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Análise Multidimensional</h3>
      
      {/* Insights sobre a análise multidimensional */}
      <div className="mb-4 p-3 rounded bg-gray-50 border-l-4 border-blue-500">
        <p className="text-sm text-gray-700">
          Este gráfico representa uma visão multidimensional das ocorrências,
          permitindo identificar padrões em volume, tempo de resposta, conclusão e criticidade.
        </p>
      </div>
      
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="categoria" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar 
              name="Métricas" 
              dataKey="A" 
              stroke={COLORS.primary}
              fill={COLORS.primary} 
              fillOpacity={0.6} 
            />
            <Tooltip formatter={(value) => [`${value}%`, 'Valor']} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Gráfico de Dispersão para Relação entre Tempo de Resposta e Vítimas
 */
export function ScatterAnalysisChart({ occurrences, height = '350px' }) {
  // Preparar dados para o gráfico de dispersão
  const scatterData = useMemo(() => {
    return occurrences
      .filter(occ => occ.tempoResposta && occ.vitimas !== undefined)
      .map(occ => {
        const time = parseInt(occ.tempoResposta.replace('min', ''), 10);
        return {
          x: isNaN(time) ? 0 : time,
          y: occ.vitimas || 0,
          tipo: occ.tipo,
          id: occ.id
        };
      });
  }, [occurrences]);

  // Calcular correlação (simplificada)
  const correlation = useMemo(() => {
    if (scatterData.length < 3) return "Insuficiente";
    
    const hasPositiveCorrelation = scatterData.some(d => d.x > 10 && d.y > 2);
    const hasNegativeCorrelation = scatterData.some(d => d.x < 8 && d.y > 2);
    
    if (hasPositiveCorrelation && !hasNegativeCorrelation) {
      return "Positiva";
    } else if (hasNegativeCorrelation && !hasPositiveCorrelation) {
      return "Negativa";
    } else {
      return "Neutra";
    }
  }, [scatterData]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Relação Tempo de Resposta vs. Vítimas</h3>
      
      {/* Insights sobre correlação */}
      <div className="mb-4 p-3 rounded bg-gray-50 border-l-4 border-yellow-500">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Correlação observada:</span> {correlation}. 
          {correlation === "Positiva" ? 
            " Ocorrências com maior tempo de resposta tendem a ter mais vítimas." :
           correlation === "Negativa" ? 
            " Ocorrências com menor tempo de resposta tendem a ter mais vítimas." :
            " Não há padrão claro entre tempo de resposta e número de vítimas."}
        </p>
      </div>
      
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Tempo de Resposta" 
              unit=" min" 
              domain={[0, 'dataMax + 5']}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Vítimas" 
              allowDecimals={false}
              domain={[0, 'dataMax + 1']}
            />
            <ZAxis range={[60, 400]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name) => {
                if (name === 'x') return [`${value} minutos`, 'Tempo de Resposta'];
                if (name === 'y') return [`${value}`, 'Vítimas'];
                return [value, name];
              }}
            />
            <Legend />
            <Scatter 
              name="Ocorrências" 
              data={scatterData} 
              fill={COLORS.danger}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Painel de Análise Avançada que combina vários gráficos
 */
export function AdvancedAnalysisPanel({ occurrences }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Análise Avançada</h2>
      
      {/* Primeira fileira */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HourlyDistributionChart occurrences={occurrences} />
        <ResponseTimeByTypeChart occurrences={occurrences} />
      </div>
      
      {/* Segunda fileira */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeTypeCorrelationChart occurrences={occurrences} />
        <MultiDimensionalAnalysisChart occurrences={occurrences} />
      </div>
      
      {/* Terceira fileira */}
      <div className="grid grid-cols-1 gap-6">
        <ScatterAnalysisChart occurrences={occurrences} />
      </div>
    </div>
  );
}