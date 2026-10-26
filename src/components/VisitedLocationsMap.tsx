import React, { useState } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow 
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  PlusCircle, 
  Navigation, 
  Compass, 
  Calendar, 
  User, 
  Layers, 
  AlertCircle, 
  X, 
  Trash2, 
  ExternalLink,
  Lock,
  Sparkles,
  Edit3
} from 'lucide-react';
import { VisitedLocation } from '../types';

interface VisitedLocationsMapProps {
  locations: VisitedLocation[];
  onAddLocation: (loc: Omit<VisitedLocation, 'id'>) => void;
  onUpdateLocation?: (loc: VisitedLocation) => void;
  onDeleteLocation: (id: string) => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAxFPsVE88n-FggFQYvsjkyVJT2Jh_5C3Q';

export const VisitedLocationsMap: React.FC<VisitedLocationsMapProps> = ({
  locations,
  onAddLocation,
  onUpdateLocation,
  onDeleteLocation,
  isAdmin,
  onRequireAdmin,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<VisitedLocation | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocId, setEditingLocId] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('hybrid');

  const [formLoc, setFormLoc] = useState({
    name: '',
    somaliName: '',
    category: 'Kulmis Village Core' as VisitedLocation['category'],
    lat: -0.3421,
    lng: 42.5310,
    dateVisited: new Date().toISOString().split('T')[0],
    visitedBy: 'Adan Deeq Abdirahman Issa (Technical Staff)',
    findings: '',
    expansionPotential: '',
  });

  const categories = [
    'All',
    'Kulmis Village Core',
    'Water Borehole',
    'New Road Access',
    'School & Clinic',
    'Committee HQ',
    'Farmland Border',
  ];

  const filteredLocations = filterCategory === 'All'
    ? locations
    : locations.filter((loc) => loc.category === filterCategory);

  const handleOpenAddModal = () => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }
    setEditingLocId(null);
    setFormLoc({
      name: '',
      somaliName: '',
      category: 'Kulmis Village Core',
      lat: -0.3450,
      lng: 42.5320,
      dateVisited: new Date().toISOString().split('T')[0],
      visitedBy: 'Adan Deeq Abdirahman Issa (Technical Staff)',
      findings: '',
      expansionPotential: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (loc: VisitedLocation) => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }
    setEditingLocId(loc.id);
    setFormLoc({
      name: loc.name,
      somaliName: loc.somaliName || '',
      category: loc.category,
      lat: loc.lat,
      lng: loc.lng,
      dateVisited: loc.dateVisited,
      visitedBy: loc.visitedBy,
      findings: loc.findings,
      expansionPotential: loc.expansionPotential || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLoc.name.trim()) return;

    if (editingLocId && onUpdateLocation) {
      onUpdateLocation({
        ...formLoc,
        id: editingLocId,
      });
    } else {
      onAddLocation(formLoc);
    }
    setIsModalOpen(false);
    setEditingLocId(null);
  };

  const getPinColor = (category: VisitedLocation['category']) => {
    switch (category) {
      case 'Kulmis Village Core':
        return '#059669'; // Emerald
      case 'Water Borehole':
        return '#0284c7'; // Blue
      case 'New Road Access':
        return '#d97706'; // Amber
      case 'School & Clinic':
        return '#9333ea'; // Purple
      case 'Committee HQ':
        return '#0f172a'; // Slate
      default:
        return '#16a34a';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-md border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-800/40 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Google Maps Platform Survey System</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Kismayo & Kulmis Village Visited Locations
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Real GPS coordinates surveyed by Adan Deeq Abdirahman Issa and the Cali Saleebaan technical team for deep-water wells, access roads, and village demarcations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition shrink-0"
            >
              {isAdmin ? <PlusCircle className="w-4 h-4" /> : <Lock className="w-4 h-4 text-emerald-200" />}
              <span>Add Surveyed Location</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Filter Controls Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <span className="font-bold text-slate-500 mr-1 shrink-0">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                filterCategory === cat
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setMapType('hybrid')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              mapType === 'hybrid'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow'
                : 'text-slate-500'
            }`}
          >
            Hybrid
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              mapType === 'satellite'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow'
                : 'text-slate-500'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              mapType === 'roadmap'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow'
                : 'text-slate-500'
            }`}
          >
            Roads
          </button>
        </div>
      </div>

      {/* Main Google Maps View */}
      <div className="relative w-full h-[450px] sm:h-[500px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
        {GOOGLE_MAPS_API_KEY ? (
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY} solutionChannel="GMP_aistudio_interactive">
            <Map
              style={{ width: '100%', height: '100%' }}
              defaultCenter={{ lat: -0.3421, lng: 42.5310 }} // Kismayo / Kulmis coordinate center
              defaultZoom={13}
              gestureHandling="greedy"
              disableDefaultUI={false}
              mapTypeId={mapType}
              mapId="kulmis_committee_map_1"
              id="gmp_mcp_codeassist_v1_aistudio"
            >
              {filteredLocations.map((loc) => (
                <AdvancedMarker
                  key={loc.id}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  onClick={() => setSelectedLocation(loc)}
                  title={loc.name}
                >
                  <Pin
                    background={getPinColor(loc.category)}
                    glyphColor="#ffffff"
                    borderColor="#ffffff"
                    scale={1.1}
                  />
                </AdvancedMarker>
              ))}

              {selectedLocation && (
                <InfoWindow
                  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <div className="p-2 max-w-xs text-slate-900 text-xs space-y-1.5 font-sans">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {selectedLocation.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">
                      {selectedLocation.name}
                    </h4>
                    {selectedLocation.somaliName && (
                      <p className="text-[11px] text-emerald-800 font-medium italic">
                        {selectedLocation.somaliName}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-600 line-clamp-3">
                      {selectedLocation.findings}
                    </p>
                    <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500 font-mono">
                      GPS: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          <div className="w-full h-full bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
            <p className="font-bold text-sm">Google Maps API Key Required</p>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Please verify your Google Maps key in settings to render satellite imagery.
            </p>
          </div>
        )}
      </div>

      {/* Surveyed Location Cards Directory */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Surveyed GPS Registry ({filteredLocations.length} Points)
          </h3>
          <span className="text-xs text-slate-500">
            Kismayo · Kulmis Village Cadastre
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full">
                    {loc.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {loc.name}
                  </h4>
                  {loc.somaliName && (
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {loc.somaliName}
                    </p>
                  )}
                </div>

                <div className="text-right font-mono text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                  <div>{loc.lat.toFixed(4)}° N</div>
                  <div>{loc.lng.toFixed(4)}° E</div>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <p>
                  <strong className="text-slate-800 dark:text-slate-200">Survey Notes:</strong>{' '}
                  {loc.findings}
                </p>
                {loc.expansionPotential && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    <strong>Expansion:</strong> {loc.expansionPotential}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1 truncate max-w-[150px]">
                  <User className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{loc.visitedBy}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(loc)}
                    title="Edit Location (Wax ka beddel)"
                    className="p-1 rounded text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition flex items-center gap-0.5 font-medium text-[11px]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-600 hover:underline font-semibold"
                  >
                    <span>Nav</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {isAdmin && (
                    <button
                      onClick={() => onDeleteLocation(loc.id)}
                      title="Remove Visited Location"
                      className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Location Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-emerald-900 to-blue-950 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingLocId ? 'Edit Visited Location (Wax Ka Beddel)' : 'Add Surveyed Visited Location'}
                </h3>
                <p className="text-xs text-emerald-200">Kulmis & Kismayo GPS Coordinates</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formLoc.name}
                  onChange={(e) => setFormLoc({ ...formLoc, name: e.target.value })}
                  placeholder="e.g. Kulmis Solar Deep Water Borehole #2"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Somali Name (Magaca Soomaaliga ah)
                </label>
                <input
                  type="text"
                  value={formLoc.somaliName}
                  onChange={(e) => setFormLoc({ ...formLoc, somaliName: e.target.value })}
                  placeholder="e.g. Goobta Ceel-Biyoodka ee Qaybta Labaad"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formLoc.category}
                    onChange={(e) => setFormLoc({ ...formLoc, category: e.target.value as VisitedLocation['category'] })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Kulmis Village Core">Kulmis Village Core</option>
                    <option value="Water Borehole">Water Borehole</option>
                    <option value="New Road Access">New Road Access</option>
                    <option value="School & Clinic">School & Clinic</option>
                    <option value="Committee HQ">Committee HQ</option>
                    <option value="Farmland Border">Farmland Border</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date Visited
                  </label>
                  <input
                    type="date"
                    value={formLoc.dateVisited}
                    onChange={(e) => setFormLoc({ ...formLoc, dateVisited: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Latitude (e.g. -0.3450) *
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formLoc.lat}
                    onChange={(e) => setFormLoc({ ...formLoc, lat: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Longitude (e.g. 42.5320) *
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formLoc.lng}
                    onChange={(e) => setFormLoc({ ...formLoc, lng: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Survey Findings & Technical Observations *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formLoc.findings}
                  onChange={(e) => setFormLoc({ ...formLoc, findings: e.target.value })}
                  placeholder="Soil depth, water salinity, accessibility, boundary markers..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expansion Potential (Fursadaha Ballaarinta)
                </label>
                <input
                  type="text"
                  value={formLoc.expansionPotential}
                  onChange={(e) => setFormLoc({ ...formLoc, expansionPotential: e.target.value })}
                  placeholder="e.g. Suitable for 45 residential plots with direct access road"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl shadow transition"
                >
                  {editingLocId ? 'Save Changes' : 'Save Location to Map'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
