import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Loader2, Route } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Accepts real trips fetched by Dashboard.jsx via /api/trips
export default function RecentTripsTable({ trips = [], loading = false }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.max(1, Math.ceil(trips.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = trips.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusBadge = (status) => {
    const map = {
      COMPLETED: <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold bg-[#22C55E]/10 text-[#22C55E]"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />Completed</span>,
      DISPATCHED: <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold bg-[#3B82F6]/10 text-[#3B82F6]"><span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />Dispatched</span>,
      DRAFT:      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold bg-slate-500/10 text-[#9CA3AF]"><span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" />Draft</span>,
      CANCELLED:  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold bg-[#EF4444]/10 text-[#EF4444]"><span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />Cancelled</span>,
    };
    return map[status] ?? <span className="text-xs text-[#9CA3AF]">{status}</span>;
  };

  return (
    <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl flex flex-col h-full animate-fade-in text-left overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#2B3038] flex items-center justify-between">
        <h3 className="text-base font-bold text-white">Recent Trips</h3>
        <button onClick={() => navigate('/trip-dispatcher')}
          className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] flex items-center gap-1 transition-all cursor-pointer">
          <span>View All Trips</span><ExternalLink size={12} />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 text-[#9CA3AF] py-12">
          <Loader2 size={18} className="animate-spin" /><span className="text-sm">Loading trips...</span>
        </div>
      ) : trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Route size={28} className="text-[#2B3038] mb-3" />
          <p className="text-sm text-[#9CA3AF] font-medium">No trips yet.</p>
          <p className="text-xs text-[#9CA3AF] mt-1">Dispatch your first trip to see it here.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-[#2B3038] bg-[#121419]/20">
                  <th className="px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">Trip ID</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">Vehicle</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">Driver</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">Destination</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B3038]/60">
                {currentItems.map((trip) => (
                  <tr key={trip.id} className="hover:bg-[#121419]/30 transition-colors duration-150 group">
                    <td className="px-5 py-3.5 text-sm font-bold text-white group-hover:text-[#F59E0B] transition-colors font-mono">
                      {trip.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-[#E2E8F0]">
                      {trip.vehicle?.registrationNumber ?? '—'}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-[#E2E8F0]">
                      {trip.driver?.name ?? '—'}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-[#9CA3AF] max-w-[150px] truncate" title={trip.destination}>
                      {trip.destination ?? '—'}
                    </td>
                    <td className="px-5 py-3.5 text-sm">{getStatusBadge(trip.status)}</td>
                    <td className="px-5 py-3.5 text-xs font-mono font-semibold text-[#9CA3AF]">
                      {new Date(trip.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-[#2B3038] flex items-center justify-between gap-4 mt-auto">
            <span className="text-xs font-semibold text-[#9CA3AF]">
              Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, trips.length)} of {trips.length}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg bg-[#0F1115] border border-[#2B3038] flex items-center justify-center text-[#9CA3AF] hover:text-white disabled:opacity-40 cursor-pointer">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === page ? 'bg-[#F59E0B] text-white' : 'bg-[#0F1115] border border-[#2B3038] text-[#9CA3AF] hover:text-white'}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg bg-[#0F1115] border border-[#2B3038] flex items-center justify-center text-[#9CA3AF] hover:text-white disabled:opacity-40 cursor-pointer">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
