import React, { useEffect, useRef, useState } from 'react';
import Card from '../common/Card';

/**
 * Versão do InteractiveMap otimizada para build
 * Remove dependências problemáticas como leaflet.markercluster
 */
const InteractiveMap = ({ occurrences = [], height = '400px', onSelectOccurrence }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Função para formatar data/hora
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

    // Inicializar o mapa quando o container estiver pronto e o Leaflet estiver carregado
    const initializeMap = async () => {
      try {
        if (!mapContainerRef.current) return;
        if (mapInstanceRef.current) return;
        
        await loadLeafletCSS();
        await loadLeafletJS();
        
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
        markersRef.current = [];
        setMapLoaded(false);
      }
    };
  }, []);

  // Atualizar marcadores quando as ocorrências mudarem ou o mapa for carregado
  useEffect(() => {
    const updateMarkers = () => {
      try {
        if (!mapInstanceRef.current || !window.L || !mapLoaded) return;
        
        // Remover marcadores existentes
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        
        // Adicionar novos marcadores
        const newMarkers = occurrences
          .filter(occ => occ.latitude && occ.longitude)
          .map(occurrence => {
            try {
              // Determinar a cor baseada no tipo
              const colorMap = {
                'Incêndio': 'red',
                'Acidente': 'orange',
                'Inundação': 'blue',
                'Resgate': 'green',
                'Desabamento': 'blue',
                'Salvamento': 'green',
                'Emergência Médica':'red',
                'Queda de Árvore':'orange',
              };
              
              const color = colorMap[occurrence.tipo] || 'gray';
              
              // Criar ícone para o marcador
              const icon = window.L.icon({
                iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                shadowSize: [41, 41]
              });
              
              // Criar o marcador
              const marker = window.L.marker([occurrence.latitude, occurrence.longitude], { icon });
              
              // Criar o conteúdo do popup
              const popupContent = document.createElement('div');
              popupContent.className = 'popup-content';
              popupContent.innerHTML = `
                <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">${occurrence.tipo}</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                  <div>
                    <span style="font-size: 12px; color: #6b7280;">Status:</span>
                    <p style="font-size: 14px; font-weight: 500; color: ${
                      occurrence.status === 'Em Andamento' ? '#d97706' :
                      occurrence.status === 'Controlado' ? '#2563eb' :
                      occurrence.status === 'Finalizado' ? '#059669' : '#374151'
                    };">${occurrence.status}</p>
                  </div>
                  <div>
                    <span style="font-size: 12px; color: #6b7280;">Data/Hora:</span>
                    <p style="font-size: 14px;">${formatDateTime(occurrence.dataHora)}</p>
                  </div>
                </div>
                <div style="margin-bottom: 8px;">
                  <span style="font-size: 12px; color: #6b7280;">Localização:</span>
                  <p style="font-size: 14px;">${occurrence.endereco}</p>
                </div>
                ${occurrence.vitimas > 0 ? `
                  <div style="margin-bottom: 8px;">
                    <span style="font-size: 12px; color: #6b7280;">Vítimas:</span>
                    <p style="font-size: 14px; font-weight: 500; color: #dc2626;">${occurrence.vitimas}</p>
                  </div>
                ` : ''}
                <div style="margin-top: 12px;">
                  <button class="details-button" style="width: 100%; padding: 4px 8px; font-size: 14px; background-color: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Ver Detalhes
                  </button>
                </div>
              `;
              
              // Adicionar evento de clique ao botão
              const bindButtonEvent = () => {
                const button = popupContent.querySelector('.details-button');
                if (button) {
                  button.addEventListener('click', () => {
                    if (onSelectOccurrence) {
                      onSelectOccurrence(occurrence);
                      marker.closePopup();
                    }
                  });
                }
              };
              
              // Criar popup e vincular ao marcador
              const popup = window.L.popup().setContent(popupContent);
              marker.bindPopup(popup);
              
              // Configurar evento para quando o popup abrir
              marker.on('popupopen', bindButtonEvent);
              
              // Adicionar ao mapa
              marker.addTo(mapInstanceRef.current);
              
              return marker;
            } catch (e) {
              console.error('Erro ao criar marcador:', e);
              return null;
            }
          })
          .filter(Boolean); // Remove valores nulos

        markersRef.current = newMarkers;
      } catch (e) {
        console.error('Erro ao atualizar marcadores:', e);
      }
    };

    updateMarkers();
  }, [occurrences, mapLoaded, onSelectOccurrence]);

  return (
    <Card title="Mapa de Ocorrências">
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
      </div>
    </Card>
  );
};

export default InteractiveMap;