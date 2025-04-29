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

// Cores para o gráfico de pizza (podem ser personalizadas com cores CBMPE)
const COLORS = ['#003366', '#CC0000', '#FF8042', '#00C49F', '#FFBB28', '#FF8C00', '#D2691E'];

function ComparisonChart({ type = 'bar', data, dataKey, nameKey, title, chartHeight = '300px' }) {

  const renderChart = () => {
    if (!data || data.length === 0) {
      return <p className="text-center text-gray-500 py-10">Sem dados para exibir.</p>;
    }

    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey || 'name'} />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => [value, 'Contagem']}/>
              <Legend verticalAlign="top" height={36}/>
              <Bar dataKey={dataKey || 'value'} name="Contagem" fill="#CC0000" /> {/* Cor CBMPE secundária */}
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
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey || 'value'}
                nameKey={nameKey || 'name'}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]}/>
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return <p>Tipo de gráfico inválido.</p>;
    }
  };

  return (
    <Card className={`h-[${chartHeight}]`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title || 'Gráfico Comparativo'}</h3>
      {renderChart()}
    </Card>
  );
}

export default ComparisonChart;

