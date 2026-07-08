'use client';

import { useState } from 'react';
import { VenueWithWeddings, getWeddingStatus } from '@/lib/weddingStatus';
import { MapPin, Navigation, Calendar, Clock, Utensils, X, Plus, Trash2 } from 'lucide-react';
import AddWeddingModal from './wedding/AddWeddingModal';
import { deleteWedding } from '@/actions/wedding';

interface VenueModalProps {
  venue: VenueWithWeddings;
  onClose: () => void;
}

export default function VenueModal({ venue, onClose }: VenueModalProps) {
  const { status, activeWedding } = getWeddingStatus(venue);
  const [showAddWedding, setShowAddWedding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!activeWedding || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteWedding(activeWedding.id);
      // Let the page revalidate or close the modal? 
      // The page will revalidate and update the UI automatically.
    } catch (error) {
      console.error(error);
      alert('Failed to delete program');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="absolute right-6 top-6 bottom-6 w-96 bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col z-[1001] animate-in slide-in-from-right-8 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white pr-10">{venue.name}</h2>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin size={14} />
            {venue.district}
          </div>
          {venue.address && (
            <p className="text-sm text-gray-500 mt-2">{venue.address}</p>
          )}

          {venue.googleMapsUrl && (
            <a 
              href={venue.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-rose-500 hover:text-rose-400 transition-colors"
            >
              <Navigation size={14} />
              Open in Google Maps
            </a>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeWedding ? (
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-medium border text-white bg-opacity-20"
                style={{
                  backgroundColor: status === 'live' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                  borderColor: status === 'live' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(251, 191, 36, 0.4)',
                  color: status === 'live' ? '#34d399' : '#fbbf24'
                }}
              >
                {status === 'live' ? 'Live Now' : ''}
              </div>

              <div className="text-center space-y-2 py-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="text-2xl font-light text-rose-500">
                  {activeWedding.brideName}
                  <span className="text-gray-600 mx-3">&amp;</span>
                  {activeWedding.groomName}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-widest font-medium">
                  Wedding
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/30 p-3 rounded-lg border border-gray-200 dark:border-gray-800/50">
                  <Calendar size={18} className="text-rose-500" />
                  <span className="text-sm">{activeWedding.date.toDateString()}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/30 p-3 rounded-lg border border-gray-200 dark:border-gray-800/50">
                  <Clock size={18} className="text-rose-500" />
                  <span className="text-sm">
                    {new Date(activeWedding.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    {activeWedding.endTime && ` - ${new Date(activeWedding.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                  </span>
                </div>

                {activeWedding.food && (
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/30 p-3 rounded-lg border border-gray-200 dark:border-gray-800/50">
                    <Utensils size={18} className="text-rose-500" />
                    <span className="text-sm">{activeWedding.food}</span>
                  </div>
                )}
                
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-red-900/40 hover:bg-red-900/60 text-red-400 py-3 rounded-lg border border-red-900/50 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Remove Program
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-10">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-2">
                <Calendar size={24} className="text-gray-400 dark:text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-300">No Active Weddings</h3>
                <p className="text-sm text-gray-500 mt-1">There are currently no weddings scheduled at this venue.</p>
              </div>
              <button 
                onClick={() => setShowAddWedding(true)}
                className="mt-4 bg-rose-600 hover:bg-rose-500 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Wedding
              </button>
            </div>
          )}
        </div>
      </div>

      {showAddWedding && (
        <AddWeddingModal venueId={venue.id} onClose={() => setShowAddWedding(false)} />
      )}
    </>
  );
}
