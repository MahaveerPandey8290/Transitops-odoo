import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Eye, Edit2, Wrench, History, Trash2, ArrowUpDown } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function VehicleTable({ 
  vehicles, 
  onView, 
  onEdit, 
  onMaintenance, 
  onDelete, 
  onSort,
  sortConfig
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    if (activeMenuId === id) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(id);
    }
  };

  const handleAction = (actionFn, vehicle, e) => {
    e.stopPropagation();
    setActiveMenuId(null);
    actionFn(vehicle);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    if (onSort) onSort(key, direction);
  };

  const formatCost = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const formatOdometer = (val) => {
    return new Intl.NumberFormat('en-US').format(val) + ' mi';
  };

  return (
    <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-5 text-left animate-fade-in relative">
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#2B3038] text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
              <th onClick={() => requestSort('regNumber')} className="pb-3.5 pl-2 text-left cursor-pointer hover:text-white transition-colors">
                <span className="flex items-center gap-1.5">
                  Registration No. <ArrowUpDown size={12} />
                </span>
              </th>
              <th onClick={() => requestSort('name')} className="pb-3.5 text-left cursor-pointer hover:text-white transition-colors">
                <span className="flex items-center gap-1.5">
                  Vehicle Name <ArrowUpDown size={12} />
                </span>
              </th>
              <th className="pb-3.5 text-left">Type</th>
              <th className="pb-3.5 text-left">Capacity</th>
              <th onClick={() => requestSort('odometer')} className="pb-3.5 text-left cursor-pointer hover:text-white transition-colors">
                <span className="flex items-center gap-1.5">
                  Odometer <ArrowUpDown size={12} />
                </span>
              </th>
              <th className="pb-3.5 text-left">Cost</th>
              <th className="pb-3.5 text-left">Status</th>
              <th className="pb-3.5 text-left">Driver</th>
              <th className="pb-3.5 text-left">Last Service</th>
              <th className="pb-3.5 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2B3038]/50 text-xs font-semibold text-white">
            {vehicles.map((vh) => (
              <tr 
                key={vh.id} 
                onClick={() => onView(vh)}
                className="hover:bg-[#0F1115]/50 transition-colors group cursor-pointer"
              >
                {/* Reg Number */}
                <td className="py-4 pl-2 font-mono text-[#F59E0B] font-bold">{vh.regNumber}</td>
                
                {/* Vehicle Name / Model */}
                <td className="py-4">
                  <div>
                    <h5 className="font-bold text-white group-hover:text-[#F59E0B] transition-colors">{vh.name}</h5>
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">{vh.model}</p>
                  </div>
                </td>
                
                {/* Vehicle Type */}
                <td className="py-4 text-[#E2E8F0]">{vh.type}</td>
                
                {/* Capacity */}
                <td className="py-4 text-[#9CA3AF]">{vh.capacity} lbs</td>
                
                {/* Odometer */}
                <td className="py-4 font-mono font-bold text-white">{formatOdometer(vh.odometer)}</td>
                
                {/* Acquisition Cost */}
                <td className="py-4 font-mono font-bold text-[#E2E8F0]">{formatCost(vh.cost)}</td>
                
                {/* Status Badge */}
                <td className="py-4">
                  <StatusBadge status={vh.status} />
                </td>
                
                {/* Assigned Driver */}
                <td className="py-4 font-medium text-white">{vh.driver || <span className="text-[#9CA3AF]">Unassigned</span>}</td>
                
                {/* Last Service Date */}
                <td className="py-4 font-medium text-[#9CA3AF]">{vh.lastService}</td>
                
                {/* Actions Dot Menu */}
                <td className="py-4 text-right pr-2 relative">
                  <button 
                    onClick={(e) => toggleMenu(vh.id, e)}
                    className="w-8 h-8 rounded-lg hover:bg-[#0F1115] border border-transparent hover:border-[#2B3038] text-[#9CA3AF] hover:text-white flex items-center justify-center transition-all ml-auto cursor-pointer"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {/* Dropdown Menu Container */}
                  {activeMenuId === vh.id && (
                    <div 
                      ref={menuRef}
                      className="absolute right-2.5 top-12 z-40 w-48 bg-[#171A21] border border-[#2B3038] rounded-xl shadow-2xl p-1.5 text-left animate-fade-in font-semibold"
                    >
                      <button
                        onClick={(e) => handleAction(onView, vh, e)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white hover:bg-[#0F1115] hover:text-[#F59E0B] transition-all cursor-pointer"
                      >
                        <Eye size={14} className="text-[#3B82F6]" />
                        <span>View Details</span>
                      </button>

                      <button
                        onClick={(e) => handleAction(onEdit, vh, e)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white hover:bg-[#0F1115] hover:text-[#22C55E] transition-all cursor-pointer"
                      >
                        <Edit2 size={14} className="text-[#22C55E]" />
                        <span>Edit Vehicle</span>
                      </button>

                      <button
                        onClick={(e) => handleAction(onMaintenance, vh, e)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white hover:bg-[#0F1115] hover:text-[#F59E0B] transition-all cursor-pointer"
                      >
                        <Wrench size={14} className="text-[#F59E0B]" />
                        <span>Schedule Maintenance</span>
                      </button>

                      <button
                        onClick={(e) => handleAction(() => console.log('View history:', vh.id), vh, e)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white hover:bg-[#0F1115] hover:text-[#3B82F6] transition-all cursor-pointer"
                      >
                        <History size={14} className="text-indigo-400" />
                        <span>View Trip History</span>
                      </button>

                      <div className="h-px bg-[#2B3038] my-1" />

                      <button
                        onClick={(e) => handleAction(onDelete, vh, e)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#EF4444] hover:bg-red-500/10 transition-all cursor-pointer"
                      >
                        <Trash2 size={14} />
                        <span>Delete Vehicle</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
