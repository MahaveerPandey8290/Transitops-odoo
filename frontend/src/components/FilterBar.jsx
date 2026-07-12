import React, { useState } from 'react';
import { RotateCw, Download, ChevronDown } from 'lucide-react';

export default function FilterBar({ onFilterChange, onRefresh, onExport }) {
  const [filters, setFilters] = useState({
    vehicleType: 'all',
    status: 'all',
    region: 'all',
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    if (onFilterChange) onFilterChange(updatedFilters);
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 animate-fade-in">
      {/* Select Filters Group */}
      <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-3">
        {/* Vehicle Type Filter */}
        <div className="relative flex-1">
          <select
            name="vehicleType"
            value={filters.vehicleType}
            onChange={handleSelectChange}
            className="w-full h-11 pl-4 pr-10 bg-[#0F1115] border border-[#2B3038] rounded-xl text-xs font-semibold text-white outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 transition-all appearance-none cursor-pointer"
          >
            <option value="all">Vehicle Type: All Types</option>
            <option value="heavy-truck">Heavy Duty Truck</option>
            <option value="delivery-van">Delivery Van</option>
            <option value="reefer">Reefer (Refrigerated)</option>
            <option value="flatbed">Flatbed Trailer</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative flex-1">
          <select
            name="status"
            value={filters.status}
            onChange={handleSelectChange}
            className="w-full h-11 pl-4 pr-10 bg-[#0F1115] border border-[#2B3038] rounded-xl text-xs font-semibold text-white outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 transition-all appearance-none cursor-pointer"
          >
            <option value="all">Status: All Statuses</option>
            <option value="available">Available</option>
            <option value="on-trip">On Active Trip</option>
            <option value="maintenance">In Maintenance</option>
            <option value="inactive">Retired/Inactive</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Region Filter */}
        <div className="relative flex-1">
          <select
            name="region"
            value={filters.region}
            onChange={handleSelectChange}
            className="w-full h-11 pl-4 pr-10 bg-[#0F1115] border border-[#2B3038] rounded-xl text-xs font-semibold text-white outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 transition-all appearance-none cursor-pointer"
          >
            <option value="all">Region: All Regions</option>
            <option value="north">North Zone</option>
            <option value="south">South Zone</option>
            <option value="east">East Zone</option>
            <option value="west">West Zone</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Actions (Refresh, Export) Group */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        {/* Refresh Button */}
        <button
          onClick={triggerRefresh}
          disabled={isRefreshing}
          className="h-11 px-4 bg-[#0F1115] hover:bg-[#171A21] border border-[#2B3038] rounded-xl text-xs font-semibold text-[#9CA3AF] hover:text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
        >
          <RotateCw size={14} className={`${isRefreshing ? 'animate-spin text-[#F59E0B]' : ''}`} />
          <span>Refresh</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="h-11 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#F59E0B]/10"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}
