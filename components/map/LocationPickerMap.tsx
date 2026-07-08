'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapEvents({ onPositionChange }: { onPositionChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapController({ position }: { position: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(position, map.getZoom(), {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }, [position, map]);

  return null;
}

interface LocationPickerMapProps {
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
}

export default function LocationPickerMap({ position, onPositionChange }: LocationPickerMapProps) {
  return (
    <div className="w-full h-full relative z-0 bg-[#0a0a0a] rounded-lg overflow-hidden border border-white/10">
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">Carto</a> | Data &copy; <a href="https://osm.org">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapController position={position} />
        <MapEvents onPositionChange={onPositionChange} />

        <Marker 
          position={position}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const pos = marker.getLatLng();
              onPositionChange(pos.lat, pos.lng);
            }
          }}
        />
      </MapContainer>
    </div>
  );
}
