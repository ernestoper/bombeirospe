import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '../common/Card';

// Cores do tema CBMPE
const COLORS = [
  '#DC2626', // Vermelho - Incêndio
  '#F59E0B', // Laranja - Acidente
  '#3B82F6', // Azul - Resgate
  '#06B6D4', // Ciano - Inundação
  '#10B981', // Verde - Emergência Médica
  '#8B5CF6', // Roxo - Desabamento
  '#EC4899', // Rosa - Queda de Árvore
];

function ComparisonChart({ type = 'bar', data, dataKey, nameKey, title, chartHeight = '300px' }) {

  const renderChart = () => {
    if (!data || data.length === 0) {
      return <p className="text-center text-gray-500 py-10">Sem dados para exibir.</p>;
    }

    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={nameKey || 'name'} 
                tick={{ fontSize: 12, fill: '#374151' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                allowDecimals={false}
                tick={{ fontSize: 12, fill: '#374151' }}
              />
              <Tooltip 
                formatter={(value) => [value, 'Contagem']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar 
                dataKey={dataKey || 'value'} 
                name="Contagem" 
                fill="#DC2626"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey={dataKey || 'value'}
                nameKey={nameKey || 'name'}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [value, name]}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return <p>Tipo de gráfico inválido.</p>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300" style={{ height: chartHeight }}>
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title || 'Gráfico Comparativo'}</h3>
      <div style={{ height: 'calc(100% - 3rem)' }}>
        {renderChart()}
      </div>
    </div>
  );
}

export default ComparisonChart;

