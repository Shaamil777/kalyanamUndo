'use client';

import { useState } from 'react';
import { X, Heart, Calendar, Clock, Utensils, UserCircle2 } from 'lucide-react';
import { createWedding } from '@/actions/wedding';
import { useRouter } from 'next/navigation';

interface AddWeddingModalProps {
  venueId: string;
  onClose: () => void;
}

export default function AddWeddingModal({ venueId, onClose }: AddWeddingModalProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const dateStr = formData.get('date') as string;
    const startTimeStr = formData.get('startTime') as string;
    const endTimeStr = formData.get('endTime') as string;

    const selectedDate = new Date(dateStr);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() < today.getTime()) {
      alert("Date cannot be in the past.");
      return;
    }

    if (selectedDate.getTime() === today.getTime()) {
      const nowTime = new Date().toTimeString().split(' ')[0].substring(0, 5); // HH:MM
      if (startTimeStr < nowTime) {
        alert("Start time cannot be in the past.");
        return;
      }
    }

    if (endTimeStr && endTimeStr <= startTimeStr) {
      alert("End time must be after the start time.");
      return;
    }

    setLoading(true);
    formData.append('venueId', venueId);

    try {
      await createWedding(formData);
      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Failed to save wedding');
    } finally {
      setLoading(false);
    }
  }

  // Get today's date in YYYY-MM-DD format for the min attribute
  const todayFormatted = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-[1002] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-800/80 rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-10 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full p-2"
        >
          <X size={18} />
        </button>
        
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-teal-200 dark:border-teal-500/20">
              <Heart className="w-6 h-6 text-teal-500 fill-teal-500/20" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Wedding</h2>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">Schedule a new ceremony at this venue</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Bride's Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <UserCircle2 size={18} className="text-gray-400" />
                  </div>
                  <input type="text" name="brideName" required className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder="Fathima" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Groom's Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <UserCircle2 size={18} className="text-gray-400" />
                  </div>
                  <input type="text" name="groomName" required className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder="Aslam" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input type="date" name="date" min={todayFormatted} required className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all [color-scheme:light] dark:[color-scheme:dark]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Start Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Clock size={18} className="text-gray-400" />
                  </div>
                  <input type="time" name="startTime" required className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all [color-scheme:light] dark:[color-scheme:dark]" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">End Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Clock size={18} className="text-gray-400" />
                  </div>
                  <input type="time" name="endTime" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all [color-scheme:light] dark:[color-scheme:dark]" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Food (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Utensils size={18} className="text-gray-400" />
                </div>
                <input type="text" name="food" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder="e.g. Biriyani, Sadhya" />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-300 flex justify-center items-center active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Save Wedding"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
