import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Map, Layers, Globe, Satellite, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MapOption {
  id: 'osm' | 'satellite';
  name: string;
  description: string;
  icon: React.ReactNode;
  preview: string;
}

const mapOptions: MapOption[] = [
  {
    id: 'osm',
    name: 'OpenStreetMap',
    description: 'Standard map with street details and labels',
    icon: <Globe className="h-6 w-6" />,
    preview: 'https://tile.openstreetmap.org/10/512/512.png',
  },
  {
    id: 'satellite',
    name: 'Satellite',
    description: 'High-resolution satellite imagery',
    icon: <Satellite className="h-6 w-6" />,
    preview: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/10/512/512',
  },
];

export default function MapConfigPage() {
  const [selectedMap, setSelectedMap] = useState<'osm' | 'satellite'>('osm');
  const [zoomLevel, setZoomLevel] = useState(13);
  const [showLabels, setShowLabels] = useState(true);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Map configuration has been updated.',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Map Configuration</h1>
          <p className="text-muted-foreground">
            Configure the base map and display settings
          </p>
        </div>

        {/* Base Map Selection */}
        <div className="panel-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Base Map</h2>
              <p className="text-sm text-muted-foreground">
                Select the default map style
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {mapOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedMap(option.id)}
                className={`relative flex flex-col rounded-xl border-2 overflow-hidden transition-all ${
                  selectedMap === option.id
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="h-32 bg-muted overflow-hidden">
                  <img
                    src={option.preview}
                    alt={option.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                      (e.target as HTMLImageElement).className = 'hidden';
                    }}
                  />
                  <div className="absolute inset-0 h-32 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>
                <div className="p-4 text-left">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        selectedMap === option.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{option.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                    {selectedMap === option.id && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Display Settings */}
        <div className="panel-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Display Settings</h2>
              <p className="text-sm text-muted-foreground">
                Configure map appearance
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Default Zoom */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Default Zoom Level: {zoomLevel}
              </label>
              <input
                type="range"
                min={5}
                max={18}
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>City</span>
                <span>Street</span>
              </div>
            </div>

            {/* Show Labels */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Show Labels</p>
                <p className="text-sm text-muted-foreground">
                  Display street names and place labels
                </p>
              </div>
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  showLabels ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${
                    showLabels ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button onClick={handleSave} className="btn-primary">
            Save Configuration
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
