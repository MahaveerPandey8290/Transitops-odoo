import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Eye, Edit2, ShieldAlert, CheckCircle, Navigation, Trash2, ArrowUpDown } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { getStoredUser } from '../api/client';

// WRITE access: Fleet Manager + Safety Officer
// VIEW-ONLY access: Dispatcher can see list but cannot edit/suspend/delete
export default function DriverTable({ 
  drivers, 
  onView, 
  onEdit, 
  onAssignTrip, 
  onSuspend, 
  onReactivate, 
  onDelete, 
  onSort,
  sortConfig
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);
  const user = getStoredUser();
  const canWrite = user?.role === 'FLEET_MANAGER' || user?.role === 'SAFETY_OFFICER';

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
    setActiveMenuId(prev => (prev === id ? null : id));
  };

  const handleAction = (actionFn, driver, e) => {
    e.stopPropagation();
    setActiveMenuId(null);
    actionFn(driver);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    if (onSort) onSort(key, direction);
  };

  const getSafetyColor = (score) => {
    if (score >= 90) return '#22C55E';
    if (score >= 80) return '#F59E0B';
    return '#EF4444';
  };

  const renderSafetyProgress = (score) => {
    const radius = 10;
    const circ = 2 * Math.PI * radius;
    const strokeDashoffset = circ - (score / 100) * circ;
    const color = getSafetyColor(score);
    return (
      <div className="flex items-center gap-2">
        <div className="relative w-7 h-7 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-95" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r={radius} fill="transparent" stroke="#2B3038" strokeWidth="2.5" />
            <circle cx="12" cy="12" r={radius} fill="transparent" stroke={color} strokeWidth="2.5"
              strokeDasharray={circ} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-extrabold text-white font-mono">{score}</span>
        </div>
        <span className="text-[11px] font-bold" style={{ color }}>
          {score >= 90 ? 'Excellent' : score >= 80 ? 'Good' : 'Needs Work'}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-5 text-left animate-fade-in relative">
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#2B3038] text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
              <th onClick={() => requestSort('name')} className="pb-3.5 pl-2 text-left cursor-pointer hover:text-white transition-colors">
                <span className="flex items-center gap-1.5">Driver <ArrowUpDown size={12} /></span>
              </th>
              <th className="pb-3.5 text-left">License Number</th>
              <th className="pb-3.5 text-left">Category</th>
              <th onClick={() => requestSort('licenseExpiry')} className="pb-3.5 text-left cursor-pointer hover:text-white transition-colors">
                <span className="flex items-center gap-1.5">License Expiry <ArrowUpDown size={12} /></span>
              </th>
              <th className="pb-3.5 text-left">Phone</th>
              <th className="pb-3.5 text-left">Assigned Vehicle</th>
              <th className="pb-3.5 text-left">Trips Done %</th>
              <th onClick={() => requestSort('safetyScore')} className="pb-3.5 text-left cursor-pointer hover:text-white transition-colors">
                <span className="flex items-center gap-1.5">Safety Rating <ArrowUpDown size={12} /></span>
              </th>
              <th className="pb-3.5 text-left">Status</th>
              <th className="pb-3.5 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2B3038]/50 text-xs font-semibold text-white">
            {drivers.map((drv) => (
              <tr key={drv.id} onClick={() => onView(drv)}
                className="hover:bg-[#0F1115]/50 transition-colors group cursor-pointer">
                {/* Driver Identity */}
                <td className="py-4 pl-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={drv.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                      alt={drv.name}
                      className="w-9 h-9 rounded-xl object-cover border border-[#2B3038]"
                    />
                    <div>
                      <h5 className="font-bold text-white group-hover:text-[#F59E0B] transition-colors">{drv.name}</h5>
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5 font-mono">{drv.empId}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 font-mono text-[#E2E8F0] uppercase tracking-wider">{drv.licenseNumber}</td>
                <td className="py-4 text-[#9CA3AF]">{drv.licenseCategory}</td>
                <td className="py-4 font-mono text-[#E2E8F0]">{drv.licenseExpiry}</td>
                <td className="py-4 text-[#9CA3AF]">{drv.phone}</td>
                <td className="py-4 text-white font-mono">
                  {drv.assignedVehicle
                    ? <span className="text-[#F59E0B] font-bold">{drv.assignedVehicle}</span>
                    : <span className="text-[#9CA3AF]">Unassigned</span>}
                </td>
                <td className="py-4 font-mono text-right pr-6">
                  <div className="w-16">
                    <div className="flex justify-between items-center mb-1 text-[10px] text-[#9CA3AF]">
                      <span>Rate:</span>
                      <span className="text-white font-bold">{drv.tripCompletionRate}%</span>
                    </div>
                    <div className="h-1 bg-[#0F1115] rounded-full overflow-hidden border border-[#2B3038]/50">
                      <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: `${drv.tripCompletionRate}%` }} />
                    </div>
                  </div>
                </td>
                <td className="py-4">{renderSafetyProgress(drv.safetyScore)}</td>
                <td className="py-4"><StatusBadge status={drv.status} /></td>

                {/* Actions Dot Menu */}
                <td className="py-4 text-right pr-2 relative">
                  <button
                    onClick={(e) => toggleMenu(drv.id, e)}
                    className="w-8 h-8 rounded-lg hover:bg-[#0F1115] border border-transparent hover:border-[#2B3038] text-[#9CA3AF] hover:text-white flex items-center justify-center transition-all ml-auto cursor-pointer"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {activeMenuId === drv.id && (
                    <div
                      ref={menuRef}
                      className="absolute right-2.5 top-12 z-40 w-48 bg-[#171A21] border border-[#2B3038] rounded-xl shadow-2xl p-1.5 text-left animate-fade-in font-semibold"
                    >
                      {/* View — all roles can see */}
                      <button onClick={(e) => handleAction(onView, drv, e)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white hover:bg-[#0F1115] hover:text-[#F59E0B] transition-all cursor-pointer">
                        <Eye size={14} className="text-[#3B82F6]" />
                        <span>View Profile</span>
                      </button>

                      {/* Write actions — Fleet Manager + Safety Officer only */}
                      {canWrite && (
                        <>
                          <button onClick={(e) => handleAction(onEdit, drv, e)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white hover:bg-[#0F1115] hover:text-[#22C55E] transition-all cursor-pointer">
                            <Edit2 size={14} className="text-[#22C55E]" />
                            <span>Edit Driver</span>
                          </button>

                          <button onClick={(e) => handleAction(onAssignTrip, drv, e)}
                            disabled={drv.status !== 'Available'}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white hover:bg-[#0F1115] hover:text-[#F59E0B] transition-all cursor-pointer disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-white">
                            <Navigation size={14} className="text-[#F59E0B]" />
                            <span>Assign Trip</span>
                          </button>

                          {drv.status !== 'Suspended' ? (
                            <button onClick={(e) => handleAction(onSuspend, drv, e)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#EF4444] hover:bg-red-500/10 transition-all cursor-pointer">
                              <ShieldAlert size={14} />
                              <span>Suspend Driver</span>
                            </button>
                          ) : (
                            <button onClick={(e) => handleAction(onReactivate, drv, e)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#22C55E] hover:bg-emerald-500/10 transition-all cursor-pointer">
                              <CheckCircle size={14} />
                              <span>Reactivate Driver</span>
                            </button>
                          )}

                          <div className="h-px bg-[#2B3038] my-1" />
                          <button onClick={(e) => handleAction(onDelete, drv, e)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#EF4444] hover:bg-red-500/10 transition-all cursor-pointer">
                            <Trash2 size={14} />
                            <span>Delete Driver</span>
                          </button>
                        </>
                      )}
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
