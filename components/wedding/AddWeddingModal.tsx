'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AddWeddingModalProps {
  venueId: string;
  onClose: () => void;
}

export default function AddWeddingModal({ venueId, onClose }: AddWeddingModalProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      onClose();
      window.location.reload();
    }, 1000);
  }

  return (
    <div className="fixed inset-0 z-[1002] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Add New Wedding
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bride's Name</label>
              <input type="text" name="brideName" required className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder="e.g. Fathima" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Groom's Name</label>
              <input type="text" name="groomName" required className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder="e.g. Aslam" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input type="date" required className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
              <input type="time" required className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
              <input type="time" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Food (Optional)</label>
            <input type="text" name="food" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder="e.g. Biriyani, Sadhya" />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex justify-center items-center"
            >
              {loading ? "Saving..." : "Save Wedding"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
