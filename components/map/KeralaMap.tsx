'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { VenueWithWeddings, getWeddingStatus } from '@/lib/weddingStatus';

function MapController({ selectedVenue }: { selectedVenue: VenueWithWeddings | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedVenue) {
      map.flyTo([selectedVenue.latitude, selectedVenue.longitude], 14, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [selectedVenue, map]);

  return null;
}

interface KeralaMapProps {
  venues: VenueWithWeddings[];
  selectedVenueId: string | null;
  onMarkerClick: (id: string) => void;
}

export default function KeralaMap({ venues, selectedVenueId, onMarkerClick }: KeralaMapProps) {
  const initialCenter: [number, number] = [10.8505, 76.2711];

  const selectedVenue = venues.find(v => v.id === selectedVenueId) || null;

  return (
    <div className="w-full h-full relative z-0 bg-[#0a0a0a]">
      <MapContainer 
        center={initialCenter} 
        zoom={8} 
        style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">Carto</a> | Data &copy; <a href="https://osm.org">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapController selectedVenue={selectedVenue} />

        {venues.map((venue) => {
          const { status } = getWeddingStatus(venue);
          
          let color = '#4b5563';
          if (status === 'live') color = '#10b981';
          else if (status === 'upcoming') color = '#fbbf24';

          return (
            <CircleMarker 
              key={venue.id}
              center={[venue.latitude, venue.longitude]}
              pathOptions={{ 
                color: color, 
                fillColor: color, 
                fillOpacity: 0.8, 
                weight: selectedVenueId === venue.id ? 4 : 1.5 
              }}
              radius={selectedVenueId === venue.id ? 10 : 6}
              eventHandlers={{
                click: () => onMarkerClick(venue.id),
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
