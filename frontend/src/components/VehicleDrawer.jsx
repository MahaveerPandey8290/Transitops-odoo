import React from 'react';
import { X, Edit2, ShieldAlert, FileText, Calendar, Wrench, Fuel, Gauge } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function VehicleDrawer({ isOpen, onClose, vehicle, onEdit }) {
  if (!isOpen || !vehicle) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      />

      {/* Slide-out Drawer Panel */}
      <div className="fixed top-0 right-0 z-50 h-screen w-full sm:w-[480px] bg-[#15181E] border-l border-[#2B3038] shadow-2xl flex flex-col justify-between transition-transform duration-300 animate-[fadeInRight_0.3s_ease-out_forwards] text-left">
        
        {/* Header Section */}
        <div className="p-5 border-b border-[#2B3038] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#F59E0B] font-mono tracking-widest uppercase">Asset Profile</span>
            <h3 className="text-base font-extrabold text-white mt-0.5">{vehicle.regNumber}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(vehicle)}
              className="w-8 h-8 rounded-lg hover:bg-[#0F1115] border border-[#2B3038] hover:border-[#22C55E]/50 text-[#9CA3AF] hover:text-[#22C55E] flex items-center justify-center transition-all cursor-pointer"
              title="Edit Vehicle"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-[#0F1115] border border-[#2B3038] text-[#9CA3AF] hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
          {/* Vehicle Image Placeholder */}
          <div className="w-full h-44 rounded-2xl bg-[#0F1115] border border-[#2B3038] overflow-hidden relative flex items-center justify-center group">
            {vehicle.imageUrl ? (
              <img 
                src={vehicle.imageUrl} 
                alt={vehicle.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#9CA3AF]">
                <FileText size={48} className="stroke-[1.2]" />
                <span className="text-[10px] font-bold mt-2 uppercase tracking-wide">No Image Uploaded</span>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <StatusBadge status={vehicle.status} />
            </div>
          </div>

          {/* Core Specs Grid */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#2B3038] pb-1.5">Asset Specifications</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-[#9CA3AF] font-semibold block">Vehicle Name</span>
                <span className="text-xs font-bold text-white mt-1 block">{vehicle.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] font-semibold block">Model Code</span>
                <span className="text-xs font-bold text-white mt-1 block font-mono">{vehicle.model}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] font-semibold block">Vehicle Type</span>
                <span className="text-xs font-bold text-white mt-1 block">{vehicle.type}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] font-semibold block">Cargo Capacity</span>
                <span className="text-xs font-bold text-white mt-1 block">{vehicle.capacity} lbs</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] font-semibold block">Fuel Configuration</span>
                <span className="text-xs font-bold text-white mt-1 block flex items-center gap-1.5">
                  <Fuel size={12} className="text-red-400" /> {vehicle.fuelType || 'Diesel'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] font-semibold block">Current Odometer</span>
                <span className="text-xs font-bold text-white mt-1 block flex items-center gap-1.5 font-mono">
                  <Gauge size={12} className="text-[#3B82F6]" /> {new Intl.NumberFormat('en-US').format(vehicle.odometer)} mi
                </span>
              </div>
            </div>
          </div>

          {/* Registration & Registry codes */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#2B3038] pb-1.5">Identity Documents</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-[#9CA3AF] font-semibold block">VIN Code</span>
                <span className="text-xs font-bold text-white mt-1 block font-mono uppercase tracking-wider">{vehicle.vin || 'VIN82947194017'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] font-semibold block">Engine Number</span>
                <span className="text-xs font-bold text-white mt-1 block font-mono uppercase tracking-wider">{vehicle.engineNumber || 'ENG-01948'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] font-semibold block">Acquisition Cost</span>
                <span className="text-xs font-bold text-white mt-1 block font-mono text-[#22C55E]">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(vehicle.cost || 85000)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] font-semibold block">Purchase Date</span>
                <span className="text-xs font-bold text-[#E2E8F0] mt-1 block flex items-center gap-1.5">
                  <Calendar size={12} className="text-[#9CA3AF]" /> {vehicle.purchaseDate || '2024-03-12'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-[#9CA3AF] font-semibold block">Insurance Policy Expiry</span>
                <span className="text-xs font-bold mt-1 block flex items-center gap-2 text-rose-400">
                  <ShieldAlert size={14} /> {vehicle.insuranceExpiry || '2027-08-30'}
                </span>
              </div>
            </div>
          </div>

          {/* Assignment & Service Status */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#2B3038] pb-1.5">Assigned Operations</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-[#9CA3AF] font-semibold block">Current Active Driver</span>
                <span className="text-xs font-bold text-white mt-1 block">{vehicle.driver || 'Unassigned'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] font-semibold block">Last Scheduled Service</span>
                <span className="text-xs font-bold text-white mt-1 block flex items-center gap-1.5">
                  <Wrench size={12} className="text-[#F59E0B]" /> {vehicle.lastService}
                </span>
              </div>
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#2B3038] pb-1.5">Documents</h4>
            <div className="grid grid-cols-2 gap-3.5">
              <a 
                href="#download-rc" 
                onClick={(e) => { e.preventDefault(); alert('Downloading Registration Certificate (RC) PDF...'); }}
                className="p-2.5 bg-[#0F1115] hover:bg-[#0F1115]/80 border border-[#2B3038] rounded-xl flex items-center gap-2 text-[10px] font-bold text-white hover:text-[#F59E0B] transition-colors"
              >
                <FileText size={16} className="text-[#3B82F6]" />
                <span className="truncate">RC_Certificate.pdf</span>
              </a>
              <a 
                href="#download-insurance" 
                onClick={(e) => { e.preventDefault(); alert('Downloading Insurance Policy PDF...'); }}
                className="p-2.5 bg-[#0F1115] hover:bg-[#0F1115]/80 border border-[#2B3038] rounded-xl flex items-center gap-2 text-[10px] font-bold text-white hover:text-[#F59E0B] transition-colors"
              >
                <FileText size={16} className="text-[#22C55E]" />
                <span className="truncate">Insurance_Policy.pdf</span>
              </a>
            </div>
          </div>

          {/* Service History Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#2B3038] pb-1.5">Recent Service History</h4>
            <div className="space-y-3 pl-2.5 border-l border-[#2B3038]">
              <div className="relative pl-4">
                <span className="absolute -left-[14.5px] top-1 w-2 h-2 rounded-full bg-[#22C55E]" />
                <span className="text-[10px] font-bold text-[#9CA3AF] block font-mono">2026-05-10</span>
                <span className="text-xs font-bold text-white">Engine Overhaul & Oil Filter Renewal</span>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5 font-medium">Logged at 112,450 mi. Cost: $480.00</p>
              </div>
              <div className="relative pl-4">
                <span className="absolute -left-[14.5px] top-1 w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="text-[10px] font-bold text-[#9CA3AF] block font-mono">2026-02-14</span>
                <span className="text-xs font-bold text-white">Wheel alignment & Braking pads renewal</span>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5 font-medium">Logged at 104,210 mi. Cost: $1,250.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#2B3038] bg-[#0F1115] flex gap-3">
          <button
            onClick={() => onEdit(vehicle)}
            className="flex-1 h-11 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <Edit2 size={14} />
            <span>Edit Asset Profile</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 h-11 bg-[#171A21] hover:bg-[#2B3038] border border-[#2B3038] text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
