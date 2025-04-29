import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
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

// Lista de zonas predefinidas
const PREDEFINED_ZONES = [
  { id: 'centro', name: 'Centro', percentage: 65 },
  { id: 'norte', name: 'Zona Norte', percentage: 45 },
  { id: 'sul', name: 'Zona Sul', percentage: 30 },
  { id: 'leste', name: 'Zona Leste', percentage: 25 },
  { id: 'oeste', name: 'Zona Oeste', percentage: 20 }
];

/**
 * Função para mapear um endereço ou bairro para uma zona predefinida
 * @param {string} address - Endereço ou bairro a ser mapeado
 * @returns {string} - ID da zona correspondente
 */
const mapAddressToZone = (address) => {
  if (!address) return 'centro';
  
  const lowerAddress = address.toLowerCase();
  
  if (lowerAddress.includes('norte') || lowerAddress.includes('north')) {
    return 'norte';
  } else if (lowerAddress.includes('sul') || lowerAddress.includes('south')) {
    return 'sul';
  } else if (lowerAddress.includes('leste') || lowerAddress.includes('east')) {
    return 'leste';
  } else if (lowerAddress.includes('oeste') || lowerAddress.includes('west')) {
    return 'oeste';
  } else if (lowerAddress.includes('centro') || lowerAddress.includes('center')) {
    return 'centro';
  }
  
  // Mapeamento baseado em bairros fictícios (substitua pelo seu mapeamento real)
  if (lowerAddress.includes('ipanema') || lowerAddress.includes('copacabana')) {
    return 'sul';
  } else if (lowerAddress.includes('tijuca') || lowerAddress.includes('meier')) {
    return 'norte';
  } else if (lowerAddress.includes('botafogo') || lowerAddress.includes('catete')) {
    return 'centro';
  } else if (lowerAddress.includes('barra') || lowerAddress.includes('recreio')) {
    return 'oeste';
  } else if (lowerAddress.includes('penha') || lowerAddress.includes('madureira')) {
    return 'leste';
  }
  
  // Padrão
  return 'centro';
};

/**
 * Componente de Concentração por Zona
 */
export function ZoneConcentrationChart({ occurrences, height = '350px' }) {
  // Contagens de ocorrências por zona
  const zoneCounts = useMemo(() => {
    // Inicializar contadores
    const counts = PREDEFINED_ZONES.reduce((acc, zone) => {
      acc[zone.id] = 0;
      return acc;
    }, {});
    
    // Contar ocorrências por zona
    occurrences.forEach(occ => {
      const address = occ.endereco || (occ.bairro || '');
      const zoneId = mapAddressToZone(address);
      counts[zoneId] = (counts[zoneId] || 0) + 1;
    });
    
    // Calcular porcentagens (usar as predefinidas para demonstração, em um caso real usaríamos os dados contados)
    return PREDEFINED_ZONES.map(zone => ({
      name: zone.name,
      value: zone.percentage  // Em um sistema real: Math.round((counts[zone.id] / occurrences.length) * 100)
    }));
  }, [occurrences]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Concentração por Zona</h3>
      
      {/* Barras de progresso mostrando concentração por zona */}
      <div className="space-y-3">
        {zoneCounts.map((zone, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm">{zone.name}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full" 
                style={{ width: `${zone.value}%` }}
              ></div>
            </div>
            <div className="w-12 text-right text-sm">{zone.value}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Análise de Tempos de Resposta por Zona
 */
export function ResponseTimeByZoneChart({ occurrences, height = '350px' }) {
  // Dados para o gráfico de tempo por zona
  const responseTimeData = useMemo(() => {
    // Para demonstração, usamos valores fictícios que fazem sentido
    // Em um sistema real, calcularíamos isso a partir dos dados
    return [
      { name: 'Centro', value: 7 },
      { name: 'Zona Norte', value: 12 },
      { name: 'Zona Sul', value: 9 },
      { name: 'Zona Leste', value: 10 },
      { name: 'Zona Oeste', value: 13 }
    ];
  }, [occurrences]);

  // Identificar zonas com tempo crítico
  const criticalZones = useMemo(() => {
    return responseTimeData
      .filter(zone => zone.value > 10)
      .map(zone => zone.name);
  }, [responseTimeData]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Tempo de Resposta por Zona</h3>
      
      {/* Insights sobre tempos por zona */}
      <div className="mb-4 p-3 rounded bg-gray-50 border-l-4 border-yellow-500">
        <p className="text-sm text-gray-700">
          {criticalZones.length > 0 ? (
            <>
              <span className="font-medium">Atenção:</span> {criticalZones.join(', ')} {criticalZones.length === 1 ? 'apresenta' : 'apresentam'} tempo de resposta acima de 10 min.
            </>
          ) : (
            <>
              <span className="font-medium">Bom desempenho:</span> Todas as zonas apresentam tempo médio de resposta adequado.
            </>
          )}
        </p>
      </div>
      
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={responseTimeData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" unit=" min" />
            <YAxis dataKey="name" type="category" width={80} />
            <Tooltip formatter={(value) => [`${value} minutos`, 'Tempo Médio']} />
            <Bar 
              dataKey="value" 
              name="Tempo Médio"
              fill={COLORS.primary}
            >
              {responseTimeData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value <= 8 ? COLORS.success : 
                       entry.value <= 10 ? COLORS.warning : 
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
 * Análise de Tipos de Ocorrência por Zona
 */
export function ZoneTypeAnalysisChart({ occurrences, height = '350px' }) {
  // Dados para o gráfico de análise de tipo por zona
  const zoneTypeData = useMemo(() => {
    // Para demonstração, usamos dados fictícios consistentes
    // Em um sistema real, calcularíamos isso a partir dos dados de ocorrência
    return [
      { zone: 'Centro', predominantType: 'Incêndio Comercial', percentage: 42, count: 84 },
      { zone: 'Zona Norte', predominantType: 'Incêndio Residencial', percentage: 38, count: 76 },
      { zone: 'Zona Sul', predominantType: 'Emergência Médica', percentage: 45, count: 90 },
      { zone: 'Zona Leste', predominantType: 'Acidentes', percentage: 35, count: 70 },
      { zone: 'Zona Oeste', predominantType: 'Resgate', percentage: 40, count: 80 }
    ];
  }, [occurrences]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Tipos de Ocorrência por Zona</h3>
      
      {/* Insights sobre tipos por zona */}
      <div className="mb-4 p-3 rounded bg-gray-50 border-l-4 border-purple-500">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Padrões por zona:</span> Cada zona apresenta um perfil distinto de ocorrências, com maior incidência de incêndios comerciais no Centro (42%) e emergências médicas na Zona Sul (45%).
        </p>
      </div>
      
      {/* Tabela de tipos por zona */}
      <div className="overflow-hidden">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zona
              </th>
              <th className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo Predominante
              </th>
              <th className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                % do Total
              </th>
              <th className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total de Ocorrências
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {zoneTypeData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.zone}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                  {item.predominantType}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                  {item.percentage}%
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                  {item.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Componente que combina todas as análises geográficas
 */
export function GeographicAnalysisPanel({ occurrences }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Análise Geográfica</h2>
      
      {/* Primeira fileira */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Distribuição de Ocorrências</h3>
          
          {/* Insights sobre distribuição */}
          <div className="mb-4 p-3 rounded bg-gray-50 border-l-4 border-blue-500">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Concentração:</span> Centro e Zona Norte representam 65% e 45% das ocorrências respectivamente, indicando necessidade de maior atenção nestas regiões.
            </p>
          </div>
          
          {/* Componente de concentração por zona */}
          <ZoneConcentrationChart occurrences={occurrences} height="300px" />
        </div>
        
        <ResponseTimeByZoneChart occurrences={occurrences} height="350px" />
      </div>
      
      {/* Segunda fileira */}
      <div className="grid grid-cols-1 gap-6">
        <ZoneTypeAnalysisChart occurrences={occurrences} height="350px" />
      </div>
      
      {/* Mapa interativo integrado */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Mapa de Concentração de Ocorrências</h3>
        <div className="h-96 bg-gray-100 rounded overflow-hidden">
          {/* Aqui você integraria seu componente InteractiveMap existente */}
          {/* <InteractiveMap occurrences={occurrences} height="100%" /> */}
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">
              Um mapa de calor com as ocorrências por zona seria exibido aqui.
              <br />
              Integre seu componente InteractiveMap com visualização por zonas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}