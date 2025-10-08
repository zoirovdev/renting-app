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


function DetailMap({lat, lon}) {
    if (!lat || !lon) {
        return <div style={{ height: '400px', width: '400px' }} className="flex items-center justify-center bg-gray-100">
        Loading map...
        </div>
    }

    const position = [lat, lon]

    return (
        <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '500px', width: '800px' }}
        scrollWheelZoom={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>Home location</Popup>
            </Marker>
        </MapContainer>
    );
}

export default DetailMap;