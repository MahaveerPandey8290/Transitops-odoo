import React from 'react';
import { X, Edit2, Phone, ShieldAlert, Award, FileText, Compass, BadgeCheck, Download } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function DriverDrawer({ isOpen, onClose, driver, onEdit }) {
  if (!isOpen || !driver) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      />

      {/* Side drawer panel */}
      <div className="fixed top-0 right-0 z-50 h-screen w-full sm:w-[480px] bg-[#15181E] border-l border-[#2B3038] shadow-2xl flex flex-col justify-between transition-transform duration-300 animate-[fadeInRight_0.3s_ease-out_forwards] text-left">
        
        {/* Header Section */}
        <div className="p-5 border-b border-[#2B3038] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#F59E0B] font-mono tracking-widest uppercase">Operator Profile</span>
            <h3 className="text-base font-extrabold text-white mt-0.5">{driver.empId}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(driver)}
              className="w-8 h-8 rounded-lg hover:bg-[#0F1115] border border-[#2B3038] hover:border-[#22C55E]/50 text-[#9CA3AF] hover:text-[#22C55E] flex items-center justify-center transition-all cursor-pointer"
              title="Edit Driver"
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
          
          {/* Avatar and Identity Hero banner */}
          <div className="flex items-center gap-4 bg-[#0F1115] border border-[#2B3038] p-4 rounded-2xl relative">
            <img 
              src={driver.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} 
              alt={driver.name} 
              className="w-16 h-16 rounded-2xl object-cover border border-[#2B3038]"
            />
            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-white">{driver.name}</h4>
              <p className="text-xs text-[#9CA3AF] font-semibold flex items-center gap-1">
                <BadgeCheck size={14} className="text-[#3B82F6]" /> {driver.yearsExperience || 6} Years Experience
              </p>
              <div className="mt-1">
                <StatusBadge status={driver.status} />
              </div>
            </div>
            <div className="absolute top-4 right-4 flex flex-col items-center justify-center bg-[#171A21] border border-[#2B3038] w-12 h-12 rounded-xl">
              <span className="text-[10px] text-[#9CA3AF] font-bold uppercase leading-none mb-0.5">Rating</span>
              <span className="text-xs font-mono font-black text-[#22C55E]">{driver.safetyScore}%</span>
            </div>
          </div>

          {/* Core Personal Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#2B3038] pb-1.5">Employment & Contact</h4>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-[10px] text-[#9CA3AF] block font-bold uppercase tracking-wider">Phone Number</span>
                <span className="text-white mt-1 block flex items-center gap-1.5">
                  <Phone size={12} className="text-[#9CA3AF]" /> {driver.phone}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] block font-bold uppercase tracking-wider">Email Address</span>
                <span className="text-white mt-1 block truncate">{driver.email || `${driver.name.toLowerCase().replace(' ', '')}@transitops.com`}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] block font-bold uppercase tracking-wider">Blood Group</span>
                <span className="text-rose-400 mt-1 block font-mono font-black">{driver.bloodGroup || 'O+'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] block font-bold uppercase tracking-wider">Emergency Contact</span>
                <span className="text-white mt-1 block">{driver.emergencyContact || 'Jane Aurelius (Spouse) - 98290184'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-[#9CA3AF] block font-bold uppercase tracking-wider">Residential Address</span>
                <span className="text-white mt-1 block leading-relaxed">{driver.address || '404 Logistics Boulevard, Sector 12, Jaipur, Rajasthan'}</span>
              </div>
            </div>
          </div>

          {/* License compliance specifications */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#2B3038] pb-1.5">Driving License Data</h4>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-[10px] text-[#9CA3AF] block font-bold uppercase tracking-wider">License Registration</span>
                <span className="text-white mt-1 block font-mono uppercase tracking-wider">{driver.licenseNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] block font-bold uppercase tracking-wider">License Category</span>
                <span className="text-white mt-1 block">{driver.licenseCategory}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] block font-bold uppercase tracking-wider">Issue Date</span>
                <span className="text-[#9CA3AF] mt-1 block font-mono">{driver.issueDate || '2020-05-10'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] block font-bold uppercase tracking-wider">Expiry Date</span>
                <span className={`mt-1 block font-mono font-bold ${
                  new Date(driver.licenseExpiry) < new Date() ? 'text-[#EF4444]' : 'text-white'
                }`}>{driver.licenseExpiry}</span>
              </div>
            </div>
          </div>

          {/* Operational Metrics stats */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#2B3038] pb-1.5">Workload & Operations</h4>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-[10px] text-[#9CA3AF] block font-bold uppercase tracking-wider">Assigned Truck</span>
                <span className="text-[#F59E0B] mt-1 block font-mono font-bold">{driver.assignedVehicle || 'Unassigned'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] block font-bold uppercase tracking-wider">Current Active Trip</span>
                <span className="text-[#3B82F6] mt-1 block">{driver.status === 'On Trip' ? 'TRIP-892 (In-Transit)' : 'No Active Job'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] block font-bold uppercase tracking-wider">Completed Trips</span>
                <span className="text-[#22C55E] mt-1 block font-mono font-bold">{driver.completedTrips || 120}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9CA3AF] block font-bold uppercase tracking-wider">Cancelled/Failed Trips</span>
                <span className="text-[#EF4444] mt-1 block font-mono font-bold">{driver.cancelledTrips || 2}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-[#9CA3AF] block font-bold uppercase tracking-wider">Total Mileage Covered</span>
                <span className="text-white mt-1 block font-mono font-black flex items-center gap-1.5">
                  <Compass size={14} className="text-[#3B82F6]" /> {new Intl.NumberFormat('en-US').format(driver.totalDistance || 85400)} miles
                </span>
              </div>
            </div>
          </div>

          {/* Document list & Download action */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#2B3038] pb-1.5">Compliance Documents</h4>
            <div className="grid grid-cols-2 gap-3">
              <a 
                href="#dl" 
                onClick={(e) => { e.preventDefault(); alert('Downloading Driving License PDF...'); }}
                className="p-2.5 bg-[#0F1115] hover:bg-[#0F1115]/80 border border-[#2B3038] rounded-xl flex items-center gap-2 text-[10px] font-bold text-white hover:text-[#F59E0B] transition-colors"
              >
                <FileText size={16} className="text-[#3B82F6]" />
                <span className="truncate">Driving_License.pdf</span>
              </a>
              <a 
                href="#medical" 
                onClick={(e) => { e.preventDefault(); alert('Downloading Medical Fitness Certificate...'); }}
                className="p-2.5 bg-[#0F1115] hover:bg-[#0F1115]/80 border border-[#2B3038] rounded-xl flex items-center gap-2 text-[10px] font-bold text-white hover:text-[#F59E0B] transition-colors"
              >
                <FileText size={16} className="text-[#22C55E]" />
                <span className="truncate">Medical_Cert.pdf</span>
              </a>
              <a 
                href="#insurance" 
                onClick={(e) => { e.preventDefault(); alert('Downloading Operator Insurance Certificate...'); }}
                className="p-2.5 bg-[#0F1115] hover:bg-[#0F1115]/80 border border-[#2B3038] rounded-xl flex items-center gap-2 text-[10px] font-bold text-white hover:text-[#F59E0B] transition-colors"
              >
                <FileText size={16} className="text-indigo-400" />
                <span className="truncate">Insurance.pdf</span>
              </a>
              <a 
                href="#aadhar" 
                onClick={(e) => { e.preventDefault(); alert('Downloading National ID Verification...'); }}
                className="p-2.5 bg-[#0F1115] hover:bg-[#0F1115]/80 border border-[#2B3038] rounded-xl flex items-center gap-2 text-[10px] font-bold text-white hover:text-[#F59E0B] transition-colors"
              >
                <FileText size={16} className="text-amber-400" />
                <span className="truncate">ID_Aadhar.pdf</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#2B3038] bg-[#0F1115] flex gap-3">
          <button
            onClick={() => onEdit(driver)}
            className="flex-1 h-11 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <Edit2 size={14} />
            <span>Edit Operator Profile</span>
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
