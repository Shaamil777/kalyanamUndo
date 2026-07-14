'use client';

import { useState } from 'react';
import { createVenue } from '@/actions/venue';
import { useRouter } from 'next/navigation';
import { MapPin, Building2, Link2, Map, X, Sparkles, Plus } from 'lucide-react';

const KERALA_DISTRICTS = [
  "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod",
  "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad",
  "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"
];

const DISTRICT_CITIES: Record<string, string[]> = {
  "Alappuzha": ["Alappuzha", "Cherthala", "Kayamkulam", "Mavelikkara", "Chengannur", "Ambalappuzha", "Haripad"],
  "Ernakulam": ["Kochi", "Ernakulam", "Aluva", "Kakkanad", "Edappally", "Kothamangalam", "Muvattupuzha", "Perumbavoor", "Angamaly", "Kalamassery", "North Paravur"],
  "Idukki": ["Thodupuzha", "Munnar", "Kattappana", "Adimali", "Nedumkandam", "Peermade"],
  "Kannur": ["Kannur", "Thalassery", "Payyanur", "Taliparamba", "Iritty", "Mattanur", "Koothuparamba"],
  "Kasaragod": ["Kasaragod", "Kanhangad", "Nileshwar", "Uppala", "Manjeshwar", "Cheruvathur"],
  "Kollam": ["Kollam", "Punalur", "Karunagappally", "Kottarakkara", "Paravur", "Pathanapuram", "Sasthamkotta"],
  "Kottayam": ["Kottayam", "Pala", "Changanassery", "Vaikom", "Ettumanoor", "Kanjirappally", "Erattupetta"],
  "Kozhikode": ["Kozhikode", "Vadakara", "Koyilandy", "Thamarassery", "Ramanattukara", "Feroke", "Mukkom"],
  "Malappuram": ["Malappuram", "Manjeri", "Tirur", "Ponnani", "Perinthalmanna", "Kondotty", "Nilambur", "Tirurangadi", "Kottakkal", "Valanchery"],
  "Palakkad": ["Palakkad", "Shoranur", "Ottapalam", "Mannarkkad", "Chittur-Thathamangalam", "Pattambi", "Cherpulassery"],
  "Pathanamthitta": ["Pathanamthitta", "Thiruvalla", "Adoor", "Pandalam", "Ranni", "Mallappally", "Kozhencherry"],
  "Thiruvananthapuram": ["Thiruvananthapuram", "Neyyattinkara", "Attingal", "Varkala", "Nedumangad", "Kattakkada", "Kilimanoor"],
  "Thrissur": ["Thrissur", "Chalakudy", "Guruvayur", "Kodungallur", "Kunnamkulam", "Irinjalakuda", "Wadakkanchery", "Chavakkad"],
  "Wayanad": ["Kalpetta", "Sulthan Bathery", "Mananthavady", "Meenangadi", "Vythiri", "Panamaram"]
};

export default function AddVenueModal({ currentUserId }: { currentUserId: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const router = useRouter();

  const handleOpen = () => {
    if (!currentUserId) {
      router.push('/login');
      return;
    }
    setIsOpen(true);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    try {
      await createVenue(formData);
      setIsOpen(false);
      
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (error) {
      console.error("Failed to add venue", error);
      alert("Failed to add venue. Please check the inputs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-8 right-8 z-[1000] bg-teal-600 hover:bg-teal-500 text-white font-medium py-3.5 px-7 rounded-full shadow-[0_8px_30px_rgba(20,184,166,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 border border-white/10 flex items-center gap-2"
      >
        <Plus size={20} />
        Add Venue
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-800/80 rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-10 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full p-2"
            >
              <X size={18} />
            </button>
            
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-teal-200 dark:border-teal-500/20">
                  <Sparkles className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Convention Centre</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Register a new venue for events</p>
                </div>
              </div>

              <form id="add-venue-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      name="name" 
                      required
                      className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="e.g. Grand Al-Safa Auditorium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">District</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Map size={18} className="text-gray-400" />
                      </div>
                      <select 
                        name="district" 
                        required
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all cursor-pointer appearance-none"
                      >
                        <option value="" disabled className="bg-white dark:bg-[#111] text-gray-900 dark:text-white">Select District</option>
                        {KERALA_DISTRICTS.map(district => (
                          <option key={district} value={district} className="bg-white dark:bg-[#111] text-gray-900 dark:text-white">{district}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">City/Town</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        name="city" 
                        required
                        list="city-options"
                        disabled={!selectedDistrict}
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={selectedDistrict ? "Search city..." : "Wait..."}
                      />
                      <datalist id="city-options">
                        {selectedDistrict && DISTRICT_CITIES[selectedDistrict]?.map(city => (
                          <option key={city} value={city} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Google Maps Link</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Link2 size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="url" 
                      name="googleMapsUrl" 
                      required
                      className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="https://maps.app.goo.gl/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Address (Optional)</label>
                  <textarea 
                    name="address" 
                    rows={2}
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none custom-scrollbar"
                    placeholder="Near NH Bypass, Calicut Road..."
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3.5 px-4 rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-300 flex justify-center items-center active:scale-[0.98]"
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
          </div>
        </div>
      )}
    </>
  );
}
