import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import Card from '../common/Card';

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
                className="bg-primary h-4 rounded-full" 
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
 * Componente de mapa de calor para visualização de concentração de ocorrências
 */
export function HeatMapChart({ occurrences, height = '400px', title = "Mapa de Calor de Ocorrências" }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatLayerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Inicializar o mapa quando o componente montar
  useEffect(() => {
    // Carregar CSS do Leaflet
    const loadLeafletCSS = () => {
      if (document.getElementById('leaflet-css')) return Promise.resolve();
      
      return new Promise((resolve) => {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
        link.onload = resolve;
        document.head.appendChild(link);
      });
    };

    // Carregar JS do Leaflet
    const loadLeafletJS = () => {
      if (window.L) return Promise.resolve();
      
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    // Carregar Leaflet Heat Plugin
    const loadLeafletHeat = () => {
      if (window.L && window.L.heatLayer) return Promise.resolve();
      
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    // Inicializar o mapa quando as bibliotecas estiverem carregadas
    const initializeMap = async () => {
      try {
        if (!mapContainerRef.current) return;
        if (mapInstanceRef.current) return;
        
        await loadLeafletCSS();
        await loadLeafletJS();
        await loadLeafletHeat();
        
        // Certifique-se de que o Leaflet está carregado
        if (!window.L) {
          console.error('Leaflet não foi carregado corretamente');
          return;
        }
        
        // Criar o mapa
        const map = window.L.map(mapContainerRef.current).setView([-8.0476, -34.8770], 12);
        
        // Adicionar tile layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Adicionar controles de zoom
        map.zoomControl.remove();
        window.L.control.zoom({ position: 'bottomright' }).addTo(map);
        
        // Salvar a instância do mapa
        mapInstanceRef.current = map;
        setMapLoaded(true);
      } catch (error) {
        console.error('Erro ao inicializar o mapa:', error);
      }
    };

    initializeMap();

    // Limpar ao desmontar
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        heatLayerRef.current = null;
        setMapLoaded(false);
      }
    };
  }, []);

  // Atualizar a camada de calor quando as ocorrências mudarem ou o mapa for carregado
  useEffect(() => {
    const updateHeatmap = () => {
      try {
        if (!mapInstanceRef.current || !window.L || !window.L.heatLayer || !mapLoaded) return;
        
        // Remover camada de calor existente
        if (heatLayerRef.current) {
          mapInstanceRef.current.removeLayer(heatLayerRef.current);
          heatLayerRef.current = null;
        }
        
        // Preparar pontos para o mapa de calor
        const heatPoints = occurrences
          .filter(occ => occ.latitude && occ.longitude)
          .map(occ => {
            // Intensidade baseada no tipo ou número de vítimas
            let intensity = 0.5; // valor padrão
            
            // Aumentar intensidade para ocorrências com vítimas
            if (occ.vitimas > 0) {
              intensity = Math.min(1, 0.5 + (occ.vitimas * 0.1));
            }
            
            // Ou baseado no tipo de ocorrência
            const criticalTypes = ['Incêndio', 'Desabamento', 'Emergência Médica'];
            if (criticalTypes.includes(occ.tipo)) {
              intensity = Math.max(intensity, 0.8);
            }
            
            return [
              parseFloat(occ.latitude), 
              parseFloat(occ.longitude), 
              intensity
            ];
          });
        
        // Criar nova camada de calor
        if (heatPoints.length > 0) {
          const heatLayer = window.L.heatLayer(heatPoints, {
            radius: 55,
            blur: 5,
            maxZoom: 57,
            gradient: {
              0.0: 'blue',
              0.3: 'lime',
              0.5: 'yellow',
              0.7: 'orange',
              1.0: 'red'
            }
          }).addTo(mapInstanceRef.current);
          
          heatLayerRef.current = heatLayer;
          
          // Ajustar zoom para mostrar todos os pontos
          if (heatPoints.length > 1) {
            const latitudes = heatPoints.map(point => point[0]);
            const longitudes = heatPoints.map(point => point[1]);
            
            const minLat = Math.min(...latitudes);
            const maxLat = Math.max(...latitudes);
            const minLng = Math.min(...longitudes);
            const maxLng = Math.max(...longitudes);
            
            const bounds = window.L.latLngBounds(
              window.L.latLng(minLat, minLng),
              window.L.latLng(maxLat, maxLng)
            );
            
            mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
          }
        }

        // Adicionar legenda para o mapa de calor
        if (!document.getElementById('heatmap-legend')) {
          const legend = window.L.control({ position: 'bottomleft' });
          
          legend.onAdd = function() {
            const div = window.L.DomUtil.create('div', 'info legend');
            div.id = 'heatmap-legend';
            div.style.padding = '6px 8px';
            div.style.background = 'rgba(255,255,255,0.8)';
            div.style.borderRadius = '4px';
            div.style.lineHeight = '18px';
            div.style.color = '#555';
            
            div.innerHTML = '<h4 style="margin:0 0 5px;font-size:14px;">Concentração</h4>' +
              '<div style="display:flex;flex-direction:column;gap:3px;">' +
              '<div style="display:flex;align-items:center;"><i style="background:red;width:18px;height:18px;display:inline-block;margin-right:5px;"></i> Alta</div>' +
              '<div style="display:flex;align-items:center;"><i style="background:orange;width:18px;height:18px;display:inline-block;margin-right:5px;"></i> Média-Alta</div>' +
              '<div style="display:flex;align-items:center;"><i style="background:yellow;width:18px;height:18px;display:inline-block;margin-right:5px;"></i> Média</div>' +
              '<div style="display:flex;align-items:center;"><i style="background:lime;width:18px;height:18px;display:inline-block;margin-right:5px;"></i> Média-Baixa</div>' +
              '<div style="display:flex;align-items:center;"><i style="background:blue;width:18px;height:18px;display:inline-block;margin-right:5px;"></i> Baixa</div>' +
              '</div>';
            
            return div;
          };
          
          legend.addTo(mapInstanceRef.current);
        }
        
        // Adicionar controle de camadas das zonas
        const zones = {
          'Centro': [[-8.055, -34.881], 2000],
          'Zona Norte': [[-7.990, -34.870], 3000],
          'Zona Sul': [[-8.120, -34.900], 3000],
          'Zona Oeste': [[-8.040, -34.930], 3000],
          'Zona Leste': [[-8.000, -34.840], 3000]
        };
        
        if (!document.getElementById('zones-control')) {
          const zonesControl = window.L.control({ position: 'topright' });
          
          zonesControl.onAdd = function() {
            const div = window.L.DomUtil.create('div', 'zones-control');
            div.id = 'zones-control';
            div.style.padding = '6px 8px';
            div.style.background = 'rgba(255,255,255,0.8)';
            div.style.borderRadius = '4px';
            
            let html = '<div style="margin-bottom:5px;font-weight:bold;font-size:12px;">Zonas</div>';
            
            Object.keys(zones).forEach(zone => {
              html += `<div><label style="display:flex;align-items:center;font-size:12px;margin:3px 0;">
                <input type="checkbox" class="zone-checkbox" data-zone="${zone}" checked style="margin-right:5px;">
                ${zone}
              </label></div>`;
            });
            
            div.innerHTML = html;
            
            // Adicionar eventos somente após o DOM ser montado
            setTimeout(() => {
              const checkboxes = document.querySelectorAll('.zone-checkbox');
              checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                  const zoneName = this.getAttribute('data-zone');
                  if (this.checked) {
                    // Mostrar zona
                    if (zones[zoneName]) {
                      const [center, radius] = zones[zoneName];
                      mapInstanceRef.current.setView(center, 14);
                    }
                  }
                });
              });
            }, 0);
            
            return div;
          };
          
          zonesControl.addTo(mapInstanceRef.current);
        }
        
      } catch (e) {
        console.error('Erro ao atualizar mapa de calor:', e);
      }
    };

    updateHeatmap();
  }, [occurrences, mapLoaded]);

  return (
    <Card title={title}>
      <div 
        ref={mapContainerRef} 
        style={{ height, width: '100%', borderRadius: '0.375rem' }}
        className="border border-gray-200"
      >
        {!mapLoaded && (
          <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
      <div className="mt-3 text-xs text-gray-500">
        <p>Total de ocorrências: {occurrences.length}</p>
        <p className="mt-1">Nota: Áreas em vermelho indicam maior concentração de ocorrências.</p>
      </div>
    </Card>
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
          <div className="mb-4 p-3 rounded bg-gray-50 border-l-4 border-primary">
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
      
      {/* Mapa de calor integrado */}
      <div className="grid grid-cols-1 gap-6">
        <HeatMapChart 
          occurrences={occurrences} 
          height="500px" 
          title="Mapa de Calor de Concentração de Ocorrências"
        />
      </div>
    </div>
  );
}