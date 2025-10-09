// components/Map.jsx
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useRentadStore } from '../stores/useRentadStore.js';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Create custom icon with price badge
const createCustomIcon = (price, currency) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <img src="${markerIcon}" style="width: 25px; height: 41px;" />
        <div style="
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ">
          ${currency}${price}
        </div>
      </div>
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });
};

function Map() {
  const { rentadsWithLocations, getRentadWithLocs, loading } = useRentadStore();

  // Fetch rentads with locations on mount
  useEffect(() => {
    getRentadWithLocs();
  }, [getRentadWithLocs]);

  // Filter rentads that have valid coordinates
  const rentadsWithCoords = rentadsWithLocations.filter(
    rentad => rentad.latitude && rentad.longitude
  );

  // Calculate center based on available properties or default to Tashkent
  const mapCenter = rentadsWithCoords.length > 0
    ? [
        rentadsWithCoords.reduce((sum, r) => sum + parseFloat(r.latitude), 0) / rentadsWithCoords.length,
        rentadsWithCoords.reduce((sum, r) => sum + parseFloat(r.longitude), 0) / rentadsWithCoords.length
      ]
    : [41.2995, 69.2401]; // Tashkent coordinates

  if (loading) {
    return (
      <div style={{ 
        height: '500px', 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f3f4f6',
        borderRadius: '12px'
      }}>
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={12} 
      style={{ height: '500px', width: '100%', borderRadius: '12px' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {rentadsWithCoords.map((rentad) => (
        <Marker 
          key={rentad.id}
          position={[parseFloat(rentad.latitude), parseFloat(rentad.longitude)]}
          icon={createCustomIcon(
            Math.floor(rentad.rent), 
            rentad.rent_currency || '$'
          )}
        >
          <Popup>
            <div style={{ minWidth: '200px' }}>
              {rentad.images?.[0] && (
                <img 
                  src={rentad.images[0]} 
                  alt={rentad.property}
                  style={{ 
                    width: '100%', 
                    height: '120px', 
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}
                />
              )}
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '16px', 
                fontWeight: 'bold' 
              }}>
                {rentad.property}
              </h3>
              <p style={{ 
                margin: '4px 0', 
                color: '#84cc16', 
                fontSize: '18px', 
                fontWeight: 'bold' 
              }}>
                {rentad.rent_currency}{Math.floor(rentad.rent)} / {rentad.rent_period}
              </p>
              <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                📍 {rentad.location_display}
              </p>
              <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                🛏️ {rentad.bedrooms} bed{rentad.bedrooms > 1 ? 's' : ''} • 
                🚿 {rentad.bathrooms} bath{rentad.bathrooms > 1 ? 's' : ''}
              </p>
              <Link 
                to={`/detail/${rentad.id}`}
                style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  padding: '6px 12px',
                  background: '#84cc16',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                View Details
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;