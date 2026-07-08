import { VenueWithWeddings, getWeddingStatus } from '@/lib/weddingStatus';
import { Search, MapPin } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  venues: VenueWithWeddings[];
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectVenue: (id: string) => void;
}

const DISTRICTS = [
  'All', 'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 
  'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 
  'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
];

export default function Sidebar({
  venues,
  selectedDistrict,
  setSelectedDistrict,
  searchQuery,
  setSearchQuery,
  onSelectVenue
}: SidebarProps) {

  const live: VenueWithWeddings[] = [];
  const upcoming: VenueWithWeddings[] = [];
  const none: VenueWithWeddings[] = [];

  venues.forEach(venue => {
    const { status } = getWeddingStatus(venue);
    if (status === 'live') live.push(venue);
    else if (status === 'upcoming') upcoming.push(venue);
    else none.push(venue);
  });

  const renderSection = (title: string, list: VenueWithWeddings[], colorClass: string) => {
    if (list.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 flex items-center gap-2">
          <span className={clsx('w-2 h-2 rounded-full', colorClass)}></span>
          {title} ({list.length})
        </h3>
        <div className="space-y-2">
          {list.map(venue => (
            <button
              key={venue.id}
              onClick={() => onSelectVenue(venue.id)}
              className="w-full text-left bg-gray-900/50 hover:bg-gray-800 p-3 rounded-xl border border-gray-800 transition-colors duration-200 group flex items-start gap-3"
            >
              <div className={clsx('mt-1 shrink-0 p-1.5 rounded-full', colorClass.replace('bg-', 'bg-opacity-20 text-'))}>
                <MapPin size={14} className={colorClass.replace('bg-', 'text-')} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{venue.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{venue.district}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 h-full bg-[#0a0a0a] border-r border-gray-800 flex flex-col z-10 relative">
      <div className="p-4 border-b border-gray-800 space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-400 mb-1.5 block">District</label>
          <select 
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-sm text-gray-200 rounded-lg px-3 py-2 outline-none focus:border-rose-500/50 transition-colors appearance-none"
          >
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={14} className="text-gray-500" />
          </div>
          <input 
            type="text"
            placeholder="Search convention centres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-sm text-gray-200 rounded-lg pl-9 pr-3 py-2 outline-none focus:border-rose-500/50 transition-colors placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {renderSection('Live Weddings', live, 'bg-emerald-500')}
        {renderSection('Upcoming Weddings', upcoming, 'bg-amber-400')}
        {renderSection('No Wedding Added', none, 'bg-gray-600')}
        
        {venues.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-10">
            No venues found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
