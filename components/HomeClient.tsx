'use client';

import { useState } from 'react';
import { VenueWithWeddings, getWeddingStatus } from '@/lib/weddingStatus';
import Sidebar from './ui/Sidebar';
import MapWrapper from './map/MapWrapper';
import VenueModal from './VenueModal';

export default function HomeClient({ venues }: { venues: VenueWithWeddings[] }) {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

  const filteredVenues = venues.filter(v => {
    const matchesDistrict = selectedDistrict === 'All' || v.district === selectedDistrict;
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  const selectedVenue = venues.find(v => v.id === selectedVenueId) || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-white">
      <Sidebar 
        venues={filteredVenues}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectVenue={(id) => setSelectedVenueId(id)}
      />

      <div className="flex-1 relative">
        <MapWrapper 
          venues={filteredVenues} 
          selectedVenueId={selectedVenueId}
          onMarkerClick={(id) => setSelectedVenueId(id)}
        />
        
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
          <h1 className="text-white/90 text-2xl font-semibold tracking-wide drop-shadow-md bg-black/40 px-6 py-2 rounded-full backdrop-blur-md border border-white/10">
            Kalyanam
          </h1>
          <p className="text-white/50 text-xs text-center mt-1 bg-black/50 rounded-full px-2">
            {filteredVenues.length} venues found
          </p>
        </div>
      </div>

      {selectedVenue && (
        <VenueModal 
          venue={selectedVenue} 
          onClose={() => setSelectedVenueId(null)} 
        />
      )}
    </div>
  );
}
