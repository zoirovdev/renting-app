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
  const { loading, rentads } = useRentadStore();

  // Filter rentads that have valid coordinates
  const rentadsWithCoords = rentads.filter(
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
      <div className='h-[300px] md:h-[500px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl'>
        <p className='dark:text-gray-50'>Loading map...</p>
      </div>
    );
  }

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={12} 
      className='h-[300px] md:h-[500px] w-full rounded-xl z-4'
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
          <Popup maxWidth={250} minWidth={180}>
            <div className='flex flex-col'>
              {rentad.images?.[0] && (
                <img 
                  src={rentad.images[0]} 
                  alt={rentad.property}
                  className='w-full h-[100px] md:h-[120px] object-cover rounded-lg mb-2'
                />
              )}
              <h3 className='m-0 mb-2 text-sm md:text-base font-bold text-gray-900'>
                {rentad.property}
              </h3>
              <p className='my-1 text-lime-500 text-base md:text-lg font-bold'>
                {rentad.rent_currency}{Math.floor(rentad.rent)} / {rentad.rent_period}
              </p>
              <p className='my-1 text-xs md:text-sm text-gray-600'>
                📍 {rentad.location_display}
              </p>
              <p className='my-1 text-xs md:text-sm text-gray-600'>
                🛏️ {rentad.bedrooms} bed{rentad.bedrooms > 1 ? 's' : ''} • 
                🚿 {rentad.bathrooms} bath{rentad.bathrooms > 1 ? 's' : ''}
              </p>
              <Link 
                to={`/detail/${rentad.id}`}
                className='inline-block mt-2 py-2 px-3 bg-lime-500 hover:bg-lime-600 text-white 
                  no-underline rounded-lg text-xs md:text-sm font-medium text-center transition-colors'
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