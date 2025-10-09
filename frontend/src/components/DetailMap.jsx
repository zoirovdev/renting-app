import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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



function DetailMap({lat, lon, rentad}) {
    if (!lat || !lon) {
        return (
        <div style={{ 
            height: '500px', 
            width: '800px', 
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

    const position = [lat, lon]

    return (
        <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '500px', width: '800px', borderRadius: '12px' }}
        scrollWheelZoom={true}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} 
                icon={createCustomIcon(Math.floor(rentad.rent), rentad.rent_currency || '$')}
            >
                <Popup>Home location</Popup>
            </Marker>
        </MapContainer>
    );
}

export default DetailMap;