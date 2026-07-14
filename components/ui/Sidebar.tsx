import { VenueWithWeddings, getWeddingStatus } from '@/lib/weddingStatus';
import { Search, MapPin, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
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
  const { theme, setTheme } = useTheme();

  const live: VenueWithWeddings[] = [];
  const none: VenueWithWeddings[] = [];

  venues.forEach(venue => {
    const { status } = getWeddingStatus(venue);
    if (status === 'live') live.push(venue);
    else none.push(venue);
  });

  const renderSection = (title: string, list: VenueWithWeddings[], colorClass: string, bgGlowClass: string) => {
    if (list.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold mb-4 flex items-center gap-2 pl-1">
          <span className={clsx('w-2 h-2 rounded-full shadow-[0_0_8px]', bgGlowClass)}></span>
          {title} <span className="opacity-60 ml-1">({list.length})</span>
        </h3>
        <div className="space-y-3">
          {list.map(venue => (
            <button
              key={venue.id}
              onClick={() => onSelectVenue(venue.id)}
              className="w-full text-left bg-white dark:bg-[#151515] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 group flex items-start shadow-sm hover:shadow-md dark:shadow-none"
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white truncate transition-colors">
                  {venue.name}
                </h4>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 truncate font-medium">
                  {venue.district}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-[340px] h-full bg-[#fcfcfc] dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-gray-800 flex flex-col z-10 relative shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800/60 bg-white/50 dark:bg-black/20 backdrop-blur-md">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 tracking-wide">
          Convention Centres
        </h2>
        
        <div className="space-y-4">
          <div className="relative">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 block ml-1">District Filter</label>
            <select 
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer"
            >
              {DISTRICTS.map(d => <option key={d} value={d} className="bg-white dark:bg-[#111]">{d}</option>)}
            </select>
            <div className="absolute bottom-3 right-4 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input 
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-900 dark:text-white rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-600"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#f8f9fa] dark:bg-transparent">
        {renderSection('Live Now', live, 'bg-emerald-500', 'shadow-emerald-500/50 bg-emerald-500')}
        {renderSection('Upcoming / None', none, 'bg-gray-400 dark:bg-gray-600', 'shadow-gray-400/50 bg-gray-400 dark:bg-gray-600')}
        
        {venues.length === 0 && (
          <div className="text-center text-gray-500 flex flex-col items-center justify-center h-40">
            <Search size={32} className="text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-sm font-medium">No venues found</p>
            <p className="text-xs mt-1 text-gray-400">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-gray-200 dark:border-gray-800/60 flex justify-between items-center bg-white/50 dark:bg-black/20 backdrop-blur-md">
        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Appearance</span>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#252525] hover:text-gray-900 dark:hover:text-white transition-all shadow-sm border border-transparent dark:border-gray-800/50 active:scale-95"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span className="text-[11px] font-bold uppercase tracking-wider">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </div>
  );
}
