import React, { useState } from 'react';
import { Search, RotateCw, FileText, X } from 'lucide-react';

export default function DriverFilters({ onFilterChange, onRefresh, onExportPDF }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [licenseStatus, setLicenseStatus] = useState('all');
  const [safetyScore, setSafetyScore] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearchChange = (val) => {
    setSearch(val);
    triggerFilterChange(val, category, status, licenseStatus, safetyScore);
  };

  const handleSelectChange = (name, val) => {
    let s = search, cat = category, st = status, ls = licenseStatus, ss = safetyScore;
    if (name === 'category') {
      setCategory(val);
      cat = val;
    } else if (name === 'status') {
      setStatus(val);
      st = val;
    } else if (name === 'licenseStatus') {
      setLicenseStatus(val);
      ls = val;
    } else if (name === 'safetyScore') {
      setSafetyScore(val);
      ss = val;
    }
    triggerFilterChange(s, cat, st, ls, ss);
  };

  const triggerFilterChange = (s, cat, st, ls, ss) => {
    if (onFilterChange) {
      onFilterChange({
        search: s,
        category: cat,
        status: st,
        licenseStatus: ls,
        safetyScore: ss
      });
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('all');
    setStatus('all');
    setLicenseStatus('all');
    setSafetyScore('all');
    if (onFilterChange) {
      onFilterChange({
        search: '',
        category: 'all',
        status: 'all',
        licenseStatus: 'all',
        safetyScore: 'all'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder="Search Name, License, Phone..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full h-11 pl-9 pr-4 bg-[#0F1115] border border-[#2B3038] rounded-xl text-xs font-semibold placeholder-[#9CA3AF] text-white outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 transition-all"
          />
        </div>

        {/* License Category */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => handleSelectChange('category', e.target.value)}
            className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] rounded-xl text-xs font-semibold text-white outline-none focus:border-[#F59E0B] cursor-pointer appearance-none"
          >
            <option value="all">Category: All</option>
            <option value="LMV">LMV (Light Motor)</option>
            <option value="HMV">HMV (Heavy Motor)</option>
            <option value="Trailer">Trailer License</option>
          </select>
        </div>

        {/* Status */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => handleSelectChange('status', e.target.value)}
            className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] rounded-xl text-xs font-semibold text-white outline-none focus:border-[#F59E0B] cursor-pointer appearance-none"
          >
            <option value="all">Status: All</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Active Trip</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        {/* License Status */}
        <div className="relative">
          <select
            value={licenseStatus}
            onChange={(e) => handleSelectChange('licenseStatus', e.target.value)}
            className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] rounded-xl text-xs font-semibold text-white outline-none focus:border-[#F59E0B] cursor-pointer appearance-none"
          >
            <option value="all">License: All Statuses</option>
            <option value="Valid">Valid License</option>
            <option value="Expiring">Expiring (30 days)</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        {/* Safety Score */}
        <div className="relative">
          <select
            value={safetyScore}
            onChange={(e) => handleSelectChange('safetyScore', e.target.value)}
            className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] rounded-xl text-xs font-semibold text-white outline-none focus:border-[#F59E0B] cursor-pointer appearance-none"
          >
            <option value="all">Safety Rating: All</option>
            <option value="Excellent">Excellent (90%+)</option>
            <option value="Good">Good (80-89%)</option>
            <option value="Average">Average (70-79%)</option>
            <option value="Poor">Poor (Below 70%)</option>
          </select>
        </div>
      </div>

      {/* Footer controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handleClearFilters}
          className="text-xs font-bold text-[#9CA3AF] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer px-2 py-1.5 rounded-lg hover:bg-[#0F1115]"
        >
          <X size={14} />
          <span>Clear Filters</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="h-10 px-4 bg-[#0F1115] hover:bg-[#2B3038]/50 border border-[#2B3038] rounded-xl text-xs font-semibold text-[#9CA3AF] hover:text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            <RotateCw size={14} className={isRefreshing ? 'animate-spin text-[#F59E0B]' : ''} />
            <span>Refresh</span>
          </button>

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
