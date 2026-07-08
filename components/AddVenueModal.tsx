'use client';

import { useState, useEffect, useRef } from 'react';
import { createVenue } from '@/actions/venue';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Search, MapPin } from 'lucide-react';

const LocationPickerMap = dynamic(() => import('./map/LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-900/50 flex flex-col items-center justify-center text-gray-500 font-medium rounded-lg border border-white/10">
      <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-2"></div>
      Loading Map...
    </div>
  )
});

const DEFAULT_CENTER: [number, number] = [10.8505, 76.2711];

export default function AddVenueModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [position, setPosition] = useState<[number, number]>(DEFAULT_CENTER);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', Kerala')}&limit=5`, {
          headers: {
            'Accept-Language': 'en'
          }
        });
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Geocoding failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 600);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    try {
      await createVenue(formData);
      setIsOpen(false);
      
      (e.target as HTMLFormElement).reset();
      setPosition(DEFAULT_CENTER);
      setSearchQuery('');
      setSearchResults([]);
      
      router.refresh();
    } catch (error) {
      console.error("Failed to add venue", error);
      alert("Failed to add venue. Please check the inputs.");
    } finally {
      setLoading(false);
    }
  }

  const handleSelectResult = (result: any) => {
    setPosition([parseFloat(result.lat), parseFloat(result.lon)]);
    setSearchResults([]);
    setSearchQuery(result.display_name.split(',')[0]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[1000] bg-rose-600 hover:bg-rose-500 text-white font-medium py-3 px-6 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 border border-rose-400/30 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Centre
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-4xl shadow-2xl relative animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row gap-6">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 bg-black/50 rounded-full p-1 md:hidden"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Add New Convention Centre
                </h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="hidden md:block text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form id="add-venue-form" onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="latitude" value={position[0]} />
                <input type="hidden" name="longitude" value={position[1]} />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-gray-500"
                    placeholder="e.g. Grand Al-Safa Auditorium"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">District</label>
                  <input 
                    type="text" 
                    name="district" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-gray-500"
                    placeholder="e.g. Malappuram"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Address (Optional)</label>
                  <textarea 
                    name="address" 
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-gray-500 resize-none custom-scrollbar"
                    placeholder="e.g. Near NH Bypass, Calicut Road"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex justify-center items-center"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "Save Convention Centre"
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="flex-1 flex flex-col min-h-[300px] md:min-h-0 bg-gray-950/50 rounded-xl p-4 border border-white/5">
              <label className="block text-sm font-medium text-gray-300 mb-2 flex justify-between items-center">
                <span>Location on Map</span>
                <span className="text-xs text-gray-500 font-normal">Click or drag to fine-tune</span>
              </label>

              <div className="relative mb-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {isSearching ? (
                     <div className="w-4 h-4 border-2 border-gray-500 border-t-gray-300 rounded-full animate-spin"></div>
                  ) : (
                    <Search size={16} className="text-gray-500" />
                  )}
                </div>
                <input 
                  type="text"
                  placeholder="Search location (e.g. Angamaly, Ernakulam)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 text-sm text-gray-200 rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-rose-500/50 transition-colors placeholder:text-gray-600"
                />

                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden z-[2000] max-h-48 overflow-y-auto custom-scrollbar">
                    {searchResults.map((res: any, idx: number) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectResult(res)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors border-b border-gray-800/50 last:border-0 flex items-start gap-2"
                      >
                        <MapPin size={14} className="mt-0.5 shrink-0 text-gray-500" />
                        <span className="line-clamp-2">{res.display_name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 rounded-lg overflow-hidden relative">
                <LocationPickerMap 
                  position={position} 
                  onPositionChange={(lat, lng) => setPosition([lat, lng])} 
                />
              </div>
              
              <div className="mt-3 text-xs text-center text-gray-500 flex justify-center items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                Coordinates saved automatically
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

