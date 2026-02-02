import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons using CDN
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

// Custom icons
const depotIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapControllerProps {
  origin: [number, number] | null;
  destination: [number, number] | null;
}

function MapController({ origin, destination }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (origin && destination) {
      const bounds = L.latLngBounds([origin, destination]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (origin) {
      map.setView(origin, 14);
    } else if (destination) {
      map.setView(destination, 14);
    }
  }, [origin, destination, map]);

  return null;
}

interface MapClickHandlerProps {
  onMapClick?: (latlng: [number, number]) => void;
}

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
}

interface RouteMapProps {
  origin: [number, number] | null;
  destination: [number, number] | null;
  route: [number, number][];
  onMapClick?: (latlng: [number, number]) => void;
  baseMap?: 'osm' | 'satellite';
}

export default function RouteMap({
  origin,
  destination,
  route,
  onMapClick,
  baseMap = 'osm',
}: RouteMapProps) {
  const defaultCenter: [number, number] = [-6.2088, 106.8456];

  const tileUrls = {
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  const tileAttribution = {
    osm: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    satellite: '&copy; <a href="https://www.esri.com/">Esri</a>',
  };

  return (
    <MapContainer
      center={origin || defaultCenter}
      zoom={13}
      className="h-full w-full"
    >
      <TileLayer url={tileUrls[baseMap]} attribution={tileAttribution[baseMap]} />
      <MapController origin={origin} destination={destination} />
      <MapClickHandler onMapClick={onMapClick} />

      {origin && (
        <Marker position={origin} icon={depotIcon}>
          <Popup>
            <div className="text-center">
              <strong className="text-primary">Origin (Depot)</strong>
              <br />
              <span className="text-sm text-muted-foreground">
                {origin[0].toFixed(4)}, {origin[1].toFixed(4)}
              </span>
            </div>
          </Popup>
        </Marker>
      )}

      {destination && (
        <Marker position={destination} icon={destinationIcon}>
          <Popup>
            <div className="text-center">
              <strong className="text-destructive">Destination</strong>
              <br />
              <span className="text-sm text-muted-foreground">
                {destination[0].toFixed(4)}, {destination[1].toFixed(4)}
              </span>
            </div>
          </Popup>
        </Marker>
      )}

      {route.length > 0 && (
        <Polyline
          positions={route}
          pathOptions={{
            color: '#0D9488',
            weight: 5,
            opacity: 0.8,
            dashArray: '10, 10',
          }}
        />
      )}
    </MapContainer>
  );
}
