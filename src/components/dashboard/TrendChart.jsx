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

// Função para agregar ocorrências por dia
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

function TrendChart({ occurrences }) {
  // Processar os dados diretamente com base nas ocorrências fornecidas
  const chartData = aggregateOccurrencesByDay(occurrences);

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Tendência de Ocorrências (Últimos 30 Dias)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 25,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(tick) => new Date(tick + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              angle={-45}
              textAnchor="end"
              height={50}
              interval="preserveStartEnd"
            />
            <YAxis 
              allowDecimals={false} 
              width={30}
            />
            <Tooltip
              labelFormatter={(label) => new Date(label + 'T00:00:00').toLocaleDateString('pt-BR')}
              formatter={(value) => [value, 'Ocorrências']}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="occurrences"
              name="Nº de Ocorrências"
              stroke="#003366"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TrendChart;