'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VenueWithWeddings, getWeddingStatus } from '@/lib/weddingStatus';
import { useTheme } from 'next-themes';

function MapController({ selectedVenue, districtStats }: { selectedVenue: VenueWithWeddings | null, districtStats: Record<string, { lat: number; lng: number }> }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedVenue && districtStats[selectedVenue.district]) {
      const dist = districtStats[selectedVenue.district];
      map.flyTo([dist.lat, dist.lng], 10, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [selectedVenue, districtStats, map]);

  return null;
}

function ZoomTracker({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    }
  });

  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);

  return null;
}

interface KeralaMapProps {
  venues: VenueWithWeddings[];
  selectedVenueId: string | null;
  onMarkerClick: (id: string) => void;
  onDistrictClick: (district: string) => void;
}

export default function KeralaMap({ venues, selectedVenueId, onMarkerClick, onDistrictClick }: KeralaMapProps) {
  const initialCenter: [number, number] = [10.8505, 76.2711];
  const [zoomLevel, setZoomLevel] = useState(8);
  const { resolvedTheme } = useTheme();

  const selectedVenue = venues.find(v => v.id === selectedVenueId) || null;

  // Pre-calculate stats
  const { totalLive, totalAvailable } = useMemo(() => {
    let live = 0;
    let avail = 0;
    venues.forEach(v => {
      const { status } = getWeddingStatus(v);
      if (status === 'live') live++;
      else avail++;
    });
    return { totalLive: live, totalAvailable: avail };
  }, [venues]);

  const districtStats = useMemo(() => {
    const stats: Record<string, { lat: number; lng: number; count: number; live: number; avail: number }> = {};
    
    venues.forEach(v => {
      const { status } = getWeddingStatus(v);
      if (!stats[v.district]) {
        stats[v.district] = { lat: 0, lng: 0, count: 0, live: 0, avail: 0 };
      }
      
      stats[v.district].lat += v.latitude;
      stats[v.district].lng += v.longitude;
      stats[v.district].count++;
      
      if (status === 'live') stats[v.district].live++;
      else stats[v.district].avail++;
    });

    // Calculate averages
    Object.keys(stats).forEach(d => {
      stats[d].lat /= stats[d].count;
      stats[d].lng /= stats[d].count;
    });

    return stats;
  }, [venues]);

  const createSummaryIcon = (title: string, venuesCount: number, liveCount: number, availCount: number, isDistrict: boolean = false) => {
    const html = `
      <div class="bg-gray-900/95 backdrop-blur-md border border-gray-700 p-3 rounded-xl shadow-2xl whitespace-nowrap min-w-[160px] transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-105 hover:border-teal-500 cursor-pointer">
        <h3 class="text-white font-semibold text-[13px] tracking-wide border-b border-gray-700 pb-2 mb-2 flex items-center justify-between">
          ${title}
          ${isDistrict ? '<span class="text-[10px] text-gray-500 font-normal">Click to view</span>' : ''}
        </h3>
        <div class="space-y-1.5 text-xs">
          <div class="flex justify-between gap-4"><span class="text-gray-400">Total Venues:</span> <span class="text-white font-medium">${venuesCount}</span></div>
          <div class="flex justify-between gap-4"><span class="text-emerald-400">Program Venue:</span> <span class="text-white font-medium">${liveCount}</span></div>
          <div class="flex justify-between gap-4"><span class="text-gray-400">Available:</span> <span class="text-white font-medium">${availCount}</span></div>
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-summary-marker',
      iconSize: [0, 0], 
      iconAnchor: [0, 0] 
    });
  };

  return (
    <div className="w-full h-full relative z-0 bg-gray-100 dark:bg-[#0a0a0a]">
      <MapContainer 
        center={initialCenter} 
        zoom={8} 
        style={{ height: '100%', width: '100%', background: 'transparent' }}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">Carto</a> | Data &copy; <a href="https://osm.org">OpenStreetMap</a>'
          url={resolvedTheme === 'light' 
            ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" 
            : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"}
        />
        
        <MapController selectedVenue={selectedVenue} districtStats={districtStats} />
        <ZoomTracker onZoomChange={setZoomLevel} />

        {zoomLevel <= 7 && (
          <Marker 
            position={initialCenter}
            icon={createSummaryIcon('Kerala Summary', venues.length, totalLive, totalAvailable, false)}
          />
        )}

        {zoomLevel > 7 && (
          Object.entries(districtStats).map(([district, stat]) => (
            <Marker 
              key={district}
              position={[stat.lat, stat.lng]}
              icon={createSummaryIcon(district, stat.count, stat.live, stat.avail, true)}
              eventHandlers={{
                click: () => onDistrictClick(district),
              }}
            />
          ))
        )}


      </MapContainer>
    </div>
  );
}
