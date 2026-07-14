'use client';

import { useState } from 'react';
import { VenueWithWeddings, getWeddingStatus } from '@/lib/weddingStatus';
import { MapPin, Navigation, Calendar, Clock, Utensils, X, Plus, Trash2, Edit2 } from 'lucide-react';
import AddWeddingModal from '../wedding/AddWeddingModal';
import EditVenueModal from './EditVenueModal';
import { deleteWedding } from '@/actions/wedding';
import { deleteVenue } from '@/actions/venue';
import { useRouter } from 'next/navigation';

interface VenueModalProps {
  venue: VenueWithWeddings;
  onClose: () => void;
  currentUserId: string | null;
}

export default function VenueModal({ venue, onClose, currentUserId }: VenueModalProps) {
  const { status, activeWedding } = getWeddingStatus(venue);
  const [showAddWedding, setShowAddWedding] = useState(false);
  const [showEditVenue, setShowEditVenue] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingVenue, setIsDeletingVenue] = useState(false);
  const router = useRouter();

  const handleAddProgram = () => {
    if (!currentUserId) {
      router.push('/login');
      return;
    }
    setShowAddWedding(true);
  };

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

  const handleDeleteVenue = async () => {
    if (!confirm('Are you sure you want to delete this venue? All programs in this venue will also be deleted.')) {
      return;
    }
    setIsDeletingVenue(true);
    try {
      await deleteVenue(venue.id);
      onClose(); // Close the modal since the venue is gone
    } catch (error) {
      console.error(error);
      alert('Failed to delete venue');
    } finally {
      setIsDeletingVenue(false);
    }
  };

  return (
    <>
      <div className="absolute right-6 top-6 bottom-6 w-96 bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-800/80 rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)] flex flex-col z-[1001] animate-in slide-in-from-right-8 duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-200 dark:border-gray-800/60 relative bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-[#151515] dark:to-[#111] backdrop-blur-md">
          <div className="absolute top-6 right-6 flex gap-2">
            {currentUserId === venue.userId && (
              <>
                <button 
                  onClick={() => setShowEditVenue(true)}
                  className="p-2 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  title="Edit Venue"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={handleDeleteVenue}
                  disabled={isDeletingVenue}
                  className="p-2 bg-gray-100 dark:bg-gray-800/50 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                  title="Delete Venue"
                >
                  {isDeletingVenue ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div> : <Trash2 size={16} />}
                </button>
              </>
            )}
            <button 
              onClick={onClose}
              className="p-2 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white pr-24 leading-tight mb-2">{venue.name}</h2>
          <div className="flex items-center gap-2 mt-3 text-[13px] font-medium text-gray-500 dark:text-gray-400">
            <MapPin size={16} className="text-teal-500" />
            {venue.district}
          </div>
          {venue.address && (
            <p className="text-[13px] text-gray-400 mt-1 pl-6 leading-relaxed">{venue.address}</p>
          )}

          <div className="flex gap-3 mt-6">
            {venue.googleMapsUrl && (
              <a 
                href={venue.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#252525] text-gray-900 dark:text-white font-semibold py-2.5 px-4 rounded-xl transition-all text-sm border border-transparent dark:border-gray-800/50 shadow-sm active:scale-95"
              >
                <MapPin size={16} />
                View Map
              </a>
            )}
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${venue.name}, ${venue.address ? venue.address + ', ' : ''}${venue.city ? venue.city + ', ' : ''}${venue.district}`)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all text-sm shadow-lg shadow-blue-500/25 active:scale-95"
            >
              <Navigation size={16} />
              Directions
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar bg-[#fcfcfc] dark:bg-transparent">
          {(() => {
            const activeWeddings = venue.weddings?.filter(wedding => {
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
            }) || [];

            return activeWeddings.length > 0 ? (
              <div className="space-y-8">
                {activeWeddings.map((wedding) => {
                  const now = new Date();
                  const isToday = wedding.date.toDateString() === now.toDateString();
                  
                  const start = new Date(wedding.startTime);
                  const end = wedding.endTime ? new Date(wedding.endTime) : null;
                  
                  const nowTimeStr = now.toTimeString().split(' ')[0];
                  const startTimeStr = start.toTimeString().split(' ')[0];
                  const endTimeStr = end ? end.toTimeString().split(' ')[0] : '23:59:59';
                  
                  const isLive = isToday && nowTimeStr >= startTimeStr && nowTimeStr <= endTimeStr;

                  return (
                    <div key={wedding.id} className="space-y-5 pb-8 border-b border-gray-100 dark:border-gray-800/60 last:border-0 last:pb-0 relative group">
                      <div className="flex justify-between items-start">
                        {isLive ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Now
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            Upcoming
                          </div>
                        )}
                        
                        {currentUserId === wedding.userId && (
                          <button
                            onClick={async () => {
                              if (isDeleting) return;
                              setIsDeleting(true);
                              try {
                                await deleteWedding(wedding.id);
                              } catch (error) {
                                console.error(error);
                                alert('Failed to delete program');
                              } finally {
                                setIsDeleting(false);
                              }
                            }}
                            disabled={isDeleting}
                            className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 dark:bg-[#1a1a1a] dark:hover:bg-red-900/20 p-2 rounded-xl transition-all disabled:opacity-50 opacity-0 group-hover:opacity-100 border border-transparent dark:border-gray-800/50"
                            title="Remove Program"
                          >
                            {isDeleting ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div> : <Trash2 size={16} />}
                          </button>
                        )}
                      </div>

                      <div className="text-center py-6 bg-white dark:bg-[#151515] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-teal-400 opacity-50"></div>
                        <div className="text-2xl font-light text-teal-500 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">{wedding.brideName}</span>
                          <span className="text-teal-300 mx-3 font-serif italic">&amp;</span>
                          <span className="font-medium text-gray-900 dark:text-white">{wedding.groomName}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 uppercase tracking-[0.2em] font-bold mt-2">
                          Wedding Ceremony
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#151515] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/80 shadow-sm">
                          <div className="p-2 bg-teal-50 dark:bg-teal-500/10 rounded-lg">
                            <Calendar size={18} className="text-teal-500" />
                          </div>
                          <span className="text-[15px] font-medium">{wedding.date.toDateString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#151515] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/80 shadow-sm">
                          <div className="p-2 bg-teal-50 dark:bg-teal-500/10 rounded-lg">
                            <Clock size={18} className="text-teal-500" />
                          </div>
                          <span className="text-[15px] font-medium">
                            {new Date(wedding.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            {wedding.endTime && ` - ${new Date(wedding.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                          </span>
                        </div>

                        {wedding.food && (
                          <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#151515] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/80 shadow-sm">
                            <div className="p-2 bg-teal-50 dark:bg-teal-500/10 rounded-lg">
                              <Utensils size={18} className="text-teal-500" />
                            </div>
                            <span className="text-[15px] font-medium">{wedding.food}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              
              <button 
                onClick={handleAddProgram}
                className="w-full mt-6 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#252525] text-gray-900 dark:text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 border border-transparent dark:border-gray-800/50 shadow-sm active:scale-95"
              >
                <Plus size={18} />
                Add Another Program
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-5 py-12">
              <div className="w-20 h-20 bg-gray-50 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-2 border border-gray-100 dark:border-gray-800/50 shadow-inner">
                <Calendar size={32} className="text-gray-300 dark:text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Programs</h3>
                <p className="text-[13px] text-gray-500 mt-2 max-w-[200px] mx-auto leading-relaxed">There are currently no weddings scheduled at this venue.</p>
              </div>
              <button 
                onClick={handleAddProgram}
                className="mt-6 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center gap-2 active:scale-95"
              >
                <Plus size={18} />
                Add Program
              </button>
            </div>
          )
        })()}
        </div>
      </div>

      {showAddWedding && (
        <AddWeddingModal venueId={venue.id} onClose={() => setShowAddWedding(false)} />
      )}
      
      {showEditVenue && (
        <EditVenueModal venue={venue} onClose={() => setShowEditVenue(false)} />
      )}
    </>
  );
}
