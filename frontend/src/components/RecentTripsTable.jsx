import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export default function RecentTripsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const mockTrips = [
    { id: 'TR-2089', vehicle: 'Heavy Truck (VOL-822)', driver: 'Marcus Aurelius', destination: 'Chicago Hub, IL', status: 'Dispatched', eta: '4h 12m' },
    { id: 'TR-2088', vehicle: 'Delivery Van (VAN-301)', driver: 'Sarah Connor', destination: 'New York Depot, NY', status: 'Completed', eta: 'Arrived' },
    { id: 'TR-2087', vehicle: 'Reefer Van (REF-104)', driver: 'James Miller', destination: 'Boston Warehouse, MA', status: 'Dispatched', eta: '1h 35m' },
    { id: 'TR-2086', vehicle: 'Flatbed (FLT-942)', driver: 'Tony Stark', destination: 'Los Angeles Depot, CA', status: 'Draft', eta: 'Scheduled' },
    { id: 'TR-2085', vehicle: 'Heavy Truck (VOL-901)', driver: 'Bruce Wayne', destination: 'Dallas Terminal, TX', status: 'Cancelled', eta: '--' },
    { id: 'TR-2084', vehicle: 'Delivery Van (VAN-412)', driver: 'Diana Prince', destination: 'Atlanta Terminal, GA', status: 'Completed', eta: 'Arrived' },
    { id: 'TR-2083', vehicle: 'Reefer Truck (REF-302)', driver: 'Peter Parker', destination: 'Miami Logistics Center, FL', status: 'Dispatched', eta: '5h 10m' },
  ];

  const totalPages = Math.ceil(mockTrips.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mockTrips.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold bg-[#22C55E]/10 text-[#22C55E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            Completed
          </span>
        );
      case 'Dispatched':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold bg-[#3B82F6]/10 text-[#3B82F6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
            Dispatched
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold bg-slate-500/10 text-[#9CA3AF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" />
            Draft
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold bg-[#EF4444]/10 text-[#EF4444]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl flex flex-col justify-between h-full animate-fade-in text-left overflow-hidden">
      
      {/* Table Header */}
      <div className="p-5 border-b border-[#2B3038] flex items-center justify-between">
        <h3 className="text-base font-bold text-white">Recent Trips</h3>
        <button className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] flex items-center gap-1 transition-all cursor-pointer">
          <span>View All Trips</span>
          <ExternalLink size={12} />
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-b border-[#2B3038] bg-[#121419]/20">
              <th className="px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">Trip ID</th>
              <th className="px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">Vehicle</th>
              <th className="px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">Driver</th>
              <th className="px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">Destination</th>
              <th className="px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">ETA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2B3038]/60">
            {currentItems.map((trip) => (
              <tr 
                key={trip.id}
                className="hover:bg-[#121419]/30 transition-colors duration-150 cursor-pointer group"
              >
                <td className="px-5 py-3.5 text-sm font-bold text-white group-hover:text-[#F59E0B] transition-colors">{trip.id}</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-[#E2E8F0]">{trip.vehicle}</td>
                <td className="px-5 py-3.5 text-sm font-medium text-[#E2E8F0]">{trip.driver}</td>
                <td className="px-5 py-3.5 text-sm font-medium text-[#9CA3AF] max-w-[150px] truncate" title={trip.destination}>{trip.destination}</td>
                <td className="px-5 py-3.5 text-sm">{getStatusBadge(trip.status)}</td>
                <td className="px-5 py-3.5 text-sm font-mono font-semibold text-[#E2E8F0]">{trip.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#2B3038] flex items-center justify-between gap-4 mt-auto">
        <span className="text-xs font-semibold text-[#9CA3AF]">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, mockTrips.length)} of {mockTrips.length} entries
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-lg bg-[#0F1115] border border-[#2B3038] flex items-center justify-center text-[#9CA3AF] hover:text-white disabled:opacity-50 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentPage === page 
                    ? 'bg-[#F59E0B] text-white shadow-sm shadow-[#F59E0B]/10' 
                    : 'bg-[#0F1115] border border-[#2B3038] text-[#9CA3AF] hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-lg bg-[#0F1115] border border-[#2B3038] flex items-center justify-center text-[#9CA3AF] hover:text-white disabled:opacity-50 transition-colors cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
