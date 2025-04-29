import React, { useEffect, useRef, useState } from 'react';
import Card from '../common/Card';

/**
 * Componente de mapa de calor para visualização de concentração de ocorrências
 */
const HeatMap = ({ occurrences = [], height = '400px', onSelectOccurrence, title = "Mapa de Calor de Ocorrências" }) => {
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
            radius: 25,
            blur: 15,
            maxZoom: 17,
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
        
        // Adicionar controle de camadas
        const zones = {
          'Centro': [[-8.055, -34.881], 2000],
          'Zona Norte': [[-7.990, -34.870], 3000],
          'Zona Sul': [[-8.120, -34.900], 3000],
          'Zona Oeste': [[-8.040, -34.930], 3000],
          'Zona Leste': [[-8.000, -34.840], 3000]
        };
        
        // Definir limites das zonas
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
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
      <div className="mt-3 text-xs text-gray-500">
        <p>Total de ocorrências: {occurrences.length}</p>
        <p className="mt-1">Nota: Áreas em vermelho indicam maior concentração de ocorrências.</p>
      </div>
    </Card>
  );
};

export default HeatMap;