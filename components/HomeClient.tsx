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

  const mapVenues = venues.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()));

  let programmedCount = 0;
  filteredVenues.forEach(v => {
    const hasActiveWedding = v.weddings?.some(wedding => {
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weddingDate = new Date(wedding.date);
      weddingDate.setHours(0, 0, 0, 0);
      
      if (weddingDate.getTime() < today.getTime()) return false;
      
      if (weddingDate.getTime() === today.getTime()) {
        const end = wedding.endTime ? new Date(wedding.endTime) : null;
        const nowTimeStr = now.toTimeString().split(' ')[0];
        const endTimeStr = end ? end.toTimeString().split(' ')[0] : '23:59:59';
        if (nowTimeStr > endTimeStr) return false;
      }
      return true;
    });

    if (hasActiveWedding) {
      programmedCount++;
    }
  });

  const selectedVenue = venues.find(v => v.id === selectedVenueId) || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-gray-950 text-black dark:text-white">
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
          venues={mapVenues} 
          selectedVenueId={selectedVenueId}
          onMarkerClick={(id) => setSelectedVenueId(id)}
          onDistrictClick={(district) => setSelectedDistrict(district)}
        />
        
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none flex flex-col items-center">
          <div className="bg-white/90 dark:bg-[#111]/80 backdrop-blur-xl border border-white/20 dark:border-gray-800/80 px-6 py-2.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-6">
            <div className="flex items-center">
              <img src="/images/logo.png" alt="Kalyanam Undo" className="h-14 w-auto object-contain" />
            </div>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-800"></div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold mb-0.5">Total Venues</span>
                <span className="text-gray-900 dark:text-white text-sm font-bold leading-none">{filteredVenues.length}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest text-teal-600 dark:text-teal-600 font-bold mb-0.5">Scheduled</span>
                <span className="text-teal-600 dark:text-teal-400 text-sm font-bold leading-none">{programmedCount}</span>
              </div>
            </div>
          </div>
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
