import React, { useState } from 'react';
import { Search, RotateCw, FileText, X } from 'lucide-react';

export default function VehicleFilters({ onFilterChange, onRefresh, onExportPDF }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleType, setVehicleType] = useState('all');
  const [status, setStatus] = useState('all');
  const [region, setRegion] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    triggerFilterChange(val, vehicleType, status, region);
  };

  const handleSelectChange = (name, val) => {
    if (name === 'vehicleType') {
      setVehicleType(val);
      triggerFilterChange(searchTerm, val, status, region);
    } else if (name === 'status') {
      setStatus(val);
      triggerFilterChange(searchTerm, vehicleType, val, region);
    } else if (name === 'region') {
      setRegion(val);
      triggerFilterChange(searchTerm, vehicleType, status, val);
    }
  };

  const triggerFilterChange = (s, vt, st, rg) => {
    if (onFilterChange) {
      onFilterChange({
        search: s,
        vehicleType: vt,
        status: st,
        region: rg
      });
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setVehicleType('all');
    setStatus('all');
    setRegion('all');
    if (onFilterChange) {
      onFilterChange({
        search: '',
        vehicleType: 'all',
        status: 'all',
        region: 'all'
      });
    }
  };

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-4 space-y-4 animate-fade-in text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Text Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder="Search Registration, Name, Model..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full h-11 pl-9 pr-4 bg-[#0F1115] border border-[#2B3038] rounded-xl text-xs font-semibold placeholder-[#9CA3AF] text-white outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 transition-all"
          />
        </div>

        {/* Vehicle Type Dropdown */}
        <div className="relative">
          <select
            value={vehicleType}
            onChange={(e) => handleSelectChange('vehicleType', e.target.value)}
            className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] rounded-xl text-xs font-semibold text-white outline-none focus:border-[#F59E0B] cursor-pointer appearance-none"
          >
            <option value="all">Type: All Types</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Mini Truck">Mini Truck</option>
            <option value="Trailer">Trailer</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => handleSelectChange('status', e.target.value)}
            className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] rounded-xl text-xs font-semibold text-white outline-none focus:border-[#F59E0B] cursor-pointer appearance-none"
          >
            <option value="all">Status: All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Active Trip</option>
            <option value="Maintenance">In Maintenance</option>
            <option value="Retired">Retired</option>
          </select>
        </div>

        {/* Region Dropdown */}
        <div className="relative">
          <select
            value={region}
            onChange={(e) => handleSelectChange('region', e.target.value)}
            className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] rounded-xl text-xs font-semibold text-white outline-none focus:border-[#F59E0B] cursor-pointer appearance-none"
          >
            <option value="all">Region: All Zones</option>
            <option value="North Zone">North Zone</option>
            <option value="South Zone">South Zone</option>
            <option value="East Zone">East Zone</option>
            <option value="West Zone">West Zone</option>
          </select>
        </div>
      </div>

      {/* Button Controls Group */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handleClearFilters}
          className="text-xs font-bold text-[#9CA3AF] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer px-2 py-1.5 rounded-lg hover:bg-[#0F1115]"
        >
          <X size={14} />
          <span>Clear Filters</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Refresh */}
          <button
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="h-10 px-4 bg-[#0F1115] hover:bg-[#2B3038]/50 border border-[#2B3038] rounded-xl text-xs font-semibold text-[#9CA3AF] hover:text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            <RotateCw size={14} className={isRefreshing ? 'animate-spin text-[#F59E0B]' : ''} />
            <span>Refresh</span>
          </button>

          {/* Export PDF */}
          <button
            onClick={onExportPDF}
            className="h-10 px-4 bg-[#0F1115] hover:bg-[#2B3038]/50 border border-[#2B3038] rounded-xl text-xs font-semibold text-[#9CA3AF] hover:text-white flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileText size={14} className="text-[#3B82F6]" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
