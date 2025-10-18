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


const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <img src="${markerIcon}" style="width: 25px; height: 41px;" />
      </div>
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });
};



function DetailMap({lat, lon, wth}) {
    if (!lat || !lon) {
        return (
        <div className='h-[250px] md:h-[400px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl'>
            <p className='dark:text-gray-50'>Loading map...</p>
        </div>
        );
    }

    const position = [lat, lon]

    return (
        <MapContainer 
        center={position} 
        zoom={13} 
        className='h-[250px] md:h-[400px] w-full rounded-xl z-10'
        scrollWheelZoom={true}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} 
                icon={createCustomIcon()}
            >
                <Popup>Home location</Popup>
            </Marker>
        </MapContainer>
    );
}

export default DetailMap;