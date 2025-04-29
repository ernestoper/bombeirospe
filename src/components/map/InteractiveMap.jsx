import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css'; // CSS for MarkerCluster
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import Card from '../common/Card';
import { mockOccurrences } from '../../data/mockOccurrences';

// Corrigir problema comum com ícones padrão do Leaflet no Webpack/Vite
try {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
} catch (e) {
  console.error("Erro ao configurar ícones do Leaflet:", e);
}

// Ícone customizado (exemplo - pode ser mais elaborado)
const fireIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/785/785116.png', // Exemplo de ícone de fogo
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25]
});

const defaultIcon = new L.Icon.Default();

function InteractiveMap({ occurrences = mockOccurrences, center = [-8.0578, -34.8829], zoom = 12, height = '400px' }) {
  const initialPosition = center;

  const getIcon = (type) => {
    // Adicionar mais ícones conforme necessário
    if (type.toLowerCase().includes('incêndio')) {
      return fireIcon;
    }
    return defaultIcon; // Ícone padrão para outros tipos
  };

  return (
    <Card className={`h-[${height}]`}> {/* Usar classe Tailwind para altura */}
      <MapContainer
        center={initialPosition}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }} // Ocupar todo o espaço do Card
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup chunkedLoading>
          {occurrences.map((occ) => (
            <Marker 
              key={occ.id} 
              position={occ.coordenadas} 
              icon={getIcon(occ.tipo)}
            >
              <Popup>
                <b>{occ.tipo}</b><br />
                ID: {occ.id}<br />
                Endereço: {occ.endereco}, {occ.bairro}<br />
                Status: {occ.status}<br />
                Data: {new Date(occ.dataHora).toLocaleString('pt-BR')}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </Card>
  );
}

export default InteractiveMap;

