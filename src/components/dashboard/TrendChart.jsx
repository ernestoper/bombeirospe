import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '../common/Card';
import { mockOccurrences } from '../../data/mockOccurrences';

// Função para agregar ocorrências por dia (simples)
const aggregateOccurrencesByDay = (occurrences) => {
  const dailyCounts = {};
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  occurrences.forEach(occ => {
    const occDate = new Date(occ.dataHora);
    if (occDate >= thirtyDaysAgo) {
      const dateString = occDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      dailyCounts[dateString] = (dailyCounts[dateString] || 0) + 1;
    }
  });

  // Preencher dias sem ocorrências e ordenar
  const trendData = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    trendData.push({
      date: dateString,
      occurrences: dailyCounts[dateString] || 0,
    });
  }

  return trendData.sort((a, b) => new Date(a.date) - new Date(b.date)); // Ordenar por data
};

function TrendChart({ data }) { // Receber dados via props ou usar mock
  const chartData = data || aggregateOccurrencesByDay(mockOccurrences);

  return (
    <Card className="h-80"> {/* Ajustar altura conforme necessário */}
      <h3 className="text-lg font-medium text-gray-900 mb-4">Tendência de Ocorrências (Últimos 30 Dias)</h3>
      <ResponsiveContainer width="100%" height="85%"> {/* Ajustar altura interna */}
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 0, // Ajustado para não cortar o eixo Y
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(tick) => new Date(tick + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} // Adiciona T00:00:00 para evitar problemas de fuso
            angle={-45}
            textAnchor="end"
            height={50} // Aumentar espaço para labels rotacionados
            interval="preserveStartEnd" // Mostrar primeiro e último label
          />
          <YAxis allowDecimals={false} width={30}/>
          <Tooltip
            labelFormatter={(label) => new Date(label + 'T00:00:00').toLocaleDateString('pt-BR')}
            formatter={(value) => [value, 'Ocorrências']}
          />
          <Legend verticalAlign="top" height={36}/>
          <Line
            type="monotone"
            dataKey="occurrences"
            name="Nº de Ocorrências"
            stroke="#003366" // Cor institucional primária CBMPE
            strokeWidth={2}
            activeDot={{ r: 8 }}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default TrendChart;

