import { useState, useCallback, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { RouteResult } from '@/types';
import { Route, MapPin, Clock, Zap, Navigation, RotateCcw, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Leaflet Imports
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

type SelectionMode = 'origin' | 'destination' | null;

// Jakarta Selatan Coordinates
const JAKSEL_CENTER: [number, number] = [-6.2615, 106.8106];
const UBAHARA_COORDS: [number, number] = [-6.2555, 106.8062];

export default function RouteSearchPage() {
  const [origin, setOrigin] = useState<[number, number] | null>(UBAHARA_COORDS);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(null);
  const { toast } = useToast();

  const API_URL = import.meta.env.VITE_API_URL;

  // Helper component to handle map clicks
  function MapEvents() {
    useMapEvents({
      click(e) {
        const latlng: [number, number] = [e.latlng.lat, e.latlng.lng];
        if (selectionMode === 'origin') {
          setOrigin(latlng);
          setSelectionMode(null);
          toast({ title: 'Origin Set', description: `${latlng[0].toFixed(4)}, ${latlng[1].toFixed(4)}` });
        } else if (selectionMode === 'destination') {
          setDestination(latlng);
          setSelectionMode(null);
          toast({ title: 'Destination Set', description: `${latlng[0].toFixed(4)}, ${latlng[1].toFixed(4)}` });
        }
      },
    });
    return null;
  }

  const calculateRoute = async () => {
    if (!origin || !destination) {
      toast({
        title: 'Lokasi belum lengkap',
        description: 'Silakan tentukan titik asal dan tujuan pada peta.',
        variant: 'destructive',
      });
      return;
    }

    setIsCalculating(true);

    // try {
      const response = await fetch(`${API_URL}/route/dijkstra`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${localStorage.getItem('rutekita_token')}`
        },
        body: JSON.stringify({
          "start_lat": origin[0],
          "start_lon": origin[1],
          "end_lat": destination[0],
          "end_lon": destination[1]
        }),
      });

      if (!response.ok) throw new Error('Server Error');

      const data = await response.json();

      if (data.status === "success") {
        // Konversi koordinat GeoJSON [lon, lat] ke Leaflet [lat, lon]
        const formattedPath = data.route.flatMap((step: any) => 
          step.geometry?.coordinates?.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]) || []
        );

        const totalDist = data.route.reduce((acc: number, step: any) => acc + step.cost, 0);

        setRoutePath(formattedPath);
        setRouteResult({
          distance: parseFloat(totalDist.toFixed(2)),
          duration: Math.round(totalDist * 3), // Estimasi 3 menit per KM
          executionTime: data.execution_time,
          path: formattedPath,
        });

        toast({ title: 'Rute Berhasil', description: `Jarak: ${totalDist.toFixed(2)} km` });
      }
    // } catch (error) {
    //   console.error(error);
    //   toast({ title: 'Gagal', description: 'Gagal menghubungi server Dijkstra.', variant: 'destructive' });
    // } finally {
    // }
    console.log("oke")
    setIsCalculating(false);
  };

  const resetRoute = () => {
    setOrigin(UBAHARA_COORDS);
    setDestination(null);
    setRoutePath([]);
    setRouteResult(null);
    setSelectionMode(null);
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-7rem)] flex flex-col lg:flex-row gap-4">
        {/* Map Section */}
        <div className="flex-1 min-h-[400px] lg:min-h-0 relative rounded-xl overflow-hidden border shadow-sm">
          <MapContainer 
            center={JAKSEL_CENTER} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapEvents />
            
            {origin && <Marker position={origin} />}
            {destination && <Marker position={destination} />}
            
            {routePath.length > 0 && (
              <Polyline positions={routePath} color="blue" weight={5} opacity={0.7} />
            )}
          </MapContainer>

          {selectionMode && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-primary text-white px-6 py-2 rounded-full shadow-2xl animate-pulse">
              Klik pada peta untuk menentukan {selectionMode === 'origin' ? 'Titik Awal' : 'Titik Tujuan'}
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Navigasi Dijkstra
            </h3>

            {/* Origin Input */}
            <div className="mb-4">
              <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Asal (Depot/Ubahara)</label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 text-sm">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span className="truncate">{origin ? `${origin[0].toFixed(4)}, ${origin[1].toFixed(4)}` : 'Belum ditentukan'}</span>
                </div>
                <button 
                  onClick={() => setSelectionMode('origin')}
                  className={`p-2 rounded-lg border ${selectionMode === 'origin' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                >
                  <Target className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Destination Input */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Tujuan Pengiriman</label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-sm">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="truncate">{destination ? `${destination[0].toFixed(4)}, ${destination[1].toFixed(4)}` : 'Klik Target -> Pilih di Peta'}</span>
                </div>
                <button 
                  onClick={() => setSelectionMode('destination')}
                  className={`p-2 rounded-lg border ${selectionMode === 'destination' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                >
                  <Target className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={calculateRoute}
                disabled={isCalculating || !destination}
                className="flex-1 bg-primary text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCalculating ? 'Menghitung...' : <><Route className="h-4 w-4" /> Cari Rute</>}
              </button>
              <button onClick={resetRoute} className="p-2 border rounded-lg hover:bg-gray-50">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Result Card */}
          {routeResult && (
            <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xl font-bold">{routeResult.distance} km</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Jarak Total</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-xl font-bold">{routeResult.duration} mnt</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Estimasi Waktu</p>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                <div className="flex items-center gap-2 text-emerald-700 mb-1">
                  <Zap className="h-4 w-4" />
                  <span className="text-xs font-bold">Performa Algoritma</span>
                </div>
                <p className="text-sm">Selesai dalam <span className="font-mono font-bold">{routeResult.executionTime.toFixed(4)} ms</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}