'use client';

import dynamic from 'next/dynamic';
import { VenueWithWeddings } from '@/lib/weddingStatus';


const KeralaMap = dynamic(() => import('./KeralaMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-950 flex flex-col items-center justify-center text-gray-500 font-medium">
      <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      Loading Map Data...
    </div>
  )
});

interface MapWrapperProps {
  venues: VenueWithWeddings[];
  selectedVenueId: string | null;
  onMarkerClick: (id: string) => void;
}

export default function MapWrapper({ venues, selectedVenueId, onMarkerClick }: MapWrapperProps) {
  return (
    <KeralaMap 
      venues={venues} 
      selectedVenueId={selectedVenueId}
      onMarkerClick={onMarkerClick}
    />
  );
}
