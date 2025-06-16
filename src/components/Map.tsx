import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Institution, LocationData } from '../types';
import { locationService } from '../services/locationService';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons with better visuals
const userIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B82F6" width="32" height="32">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      <circle cx="12" cy="9" r="2" fill="white"/>
    </svg>
  `),
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowSize: [41, 41]
});

const institutionIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10B981" width="32" height="32">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <path d="M12 6c-1.1 0-2 .9-2 2v6h4V8c0-1.1-.9-2-2-2z" fill="white"/>
      <rect x="10" y="10" width="4" height="1" fill="#10B981"/>
      <rect x="10" y="12" width="4" height="1" fill="#10B981"/>
    </svg>
  `),
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowSize: [41, 41]
});

interface MapProps {
  userLocation: LocationData | null;
  institutions: Institution[];
  onInstitutionClick?: (institution: Institution) => void;
  height?: string;
  zoom?: number;
}

// Component to update map view when location changes
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

export const Map: React.FC<MapProps> = ({
  userLocation,
  institutions,
  onInstitutionClick,
  height = '400px',
  zoom = 13
}) => {
  const mapRef = useRef<any>(null);

  // Default center (São Paulo)
  const defaultCenter: [number, number] = [-23.5505, -46.6333];
  const center: [number, number] = userLocation 
    ? [userLocation.latitude, userLocation.longitude]
    : defaultCenter;

  const handleInstitutionClick = (institution: Institution) => {
    if (onInstitutionClick) {
      onInstitutionClick(institution);
    }
  };

  const getDistanceText = (institution: Institution): string => {
    if (!userLocation) return '';
    
    const distance = locationService.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      institution.address.latitude,
      institution.address.longitude
    );
    
    return distance < 1 
      ? `${Math.round(distance * 1000)}m`
      : `${distance.toFixed(1)}km`;
  };

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden shadow-sm">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <MapUpdater center={center} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>📍 Sua localização</strong>
                {userLocation.address && (
                  <p className="text-sm text-gray-600 mt-1">
                    {userLocation.address}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Institution markers */}
        {institutions.map((institution) => (
          <Marker
            key={institution.id}
            position={[institution.address.latitude, institution.address.longitude]}
            icon={institutionIcon}
            eventHandlers={{
              click: () => handleInstitutionClick(institution)
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  🏢 {institution.name}
                </h3>
                
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    📍 {institution.address.street}, {institution.address.number}
                  </p>
                  <p className="text-gray-600">
                    {institution.address.neighborhood}, {institution.address.city}
                  </p>
                  
                  {userLocation && (
                    <p className="text-green-600 font-medium">
                      🚶 {getDistanceText(institution)} de distância
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-500">⭐</span>
                    <span>{institution.rating.toFixed(1)}</span>
                    <span className="text-gray-500">({institution.totalRatings} avaliações)</span>
                  </div>
                  
                  <div className="mt-3">
                    <p className="font-medium mb-1">Aceita:</p>
                    <div className="flex flex-wrap gap-1">
                      {institution.acceptedCategories.slice(0, 3).map((category) => (
                        <span
                          key={category}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                        >
                          {category}
                        </span>
                      ))}
                      {institution.acceptedCategories.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{institution.acceptedCategories.length - 3} mais
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleInstitutionClick(institution)}
                  className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                >
                  Ver detalhes
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};