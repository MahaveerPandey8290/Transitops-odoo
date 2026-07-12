import React from 'react';
import { ShieldAlert, CheckCircle, Eye, XCircle } from 'lucide-react';

export default function PermissionMatrix({ matrixData, onChangePermission }) {
  const columns = [
    { key: 'role', label: 'Role Profile' },
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'fleet', label: 'Fleet' },
    { key: 'drivers', label: 'Drivers' },
    { key: 'trips', label: 'Trips' },
    { key: 'maintenance', label: 'Maintenance' },
    { key: 'fuel', label: 'Fuel' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'settings', label: 'Settings' }
  ];

  // Helper to render colored badge
  const renderPermissionBadge = (val) => {
    if (val === 'Full') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 text-[10px] font-extrabold cursor-pointer select-none transition-transform active:scale-95">
          <CheckCircle size={10} className="stroke-[2.5]" />
          <span>Full Access</span>
        </span>
      );
    }
    if (val === 'View') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 text-[10px] font-extrabold cursor-pointer select-none transition-transform active:scale-95">
          <Eye size={10} className="stroke-[2.5]" />
          <span>View Only</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#9CA3AF]/10 text-[#9CA3AF] border border-[#9CA3AF]/20 text-[10px] font-extrabold cursor-pointer select-none transition-transform active:scale-95">
        <XCircle size={10} className="stroke-[2.5]" />
        <span>No Access</span>
      </span>
    );
  };

  const handleCellClick = (roleKey, moduleKey, currentVal) => {
    // Cycle: Full -> View -> None -> Full
    let nextVal = 'None';
    if (currentVal === 'Full') nextVal = 'View';
    else if (currentVal === 'View') nextVal = 'None';
    else nextVal = 'Full';

    if (onChangePermission) {
      onChangePermission(roleKey, moduleKey, nextVal);
    }
  };

  return (
    <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-5 text-left animate-fade-in space-y-4">
      <div className="flex items-center gap-2.5 mb-2 border-b border-[#2B3038] pb-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
          <ShieldAlert size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white leading-none">Role Permission Matrix</h4>
          <p className="text-[10px] text-[#9CA3AF] mt-1 font-semibold">Interactive matrix. Click cells to cycle permission levels.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#2B3038] bg-[#0F1115]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#2B3038] bg-[#15181E] text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
              {columns.map(col => (
                <th key={col.key} className="p-3.5 text-left">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2B3038]/50 text-xs font-semibold text-white">
            {matrixData.map((row) => (
              <tr key={row.id} className="hover:bg-[#15181E]/40 transition-colors">
                {/* Role Label */}
                <td className="p-3.5">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-white text-xs">{row.role}</span>
                    <span className="text-[9px] text-[#9CA3AF] mt-0.5 font-mono">{row.code}</span>
                  </div>
                </td>

                {/* Dashboard */}
                <td className="p-3.5" onClick={() => handleCellClick(row.id, 'dashboard', row.dashboard)}>
                  {renderPermissionBadge(row.dashboard)}
                </td>

                {/* Fleet */}
                <td className="p-3.5" onClick={() => handleCellClick(row.id, 'fleet', row.fleet)}>
                  {renderPermissionBadge(row.fleet)}
                </td>

                {/* Drivers */}
                <td className="p-3.5" onClick={() => handleCellClick(row.id, 'drivers', row.drivers)}>
                  {renderPermissionBadge(row.drivers)}
                </td>

                {/* Trips */}
                <td className="p-3.5" onClick={() => handleCellClick(row.id, 'trips', row.trips)}>
                  {renderPermissionBadge(row.trips)}
                </td>

                {/* Maintenance */}
                <td className="p-3.5" onClick={() => handleCellClick(row.id, 'maintenance', row.maintenance)}>
                  {renderPermissionBadge(row.maintenance)}
                </td>

                {/* Fuel */}
                <td className="p-3.5" onClick={() => handleCellClick(row.id, 'fuel', row.fuel)}>
                  {renderPermissionBadge(row.fuel)}
                </td>

                {/* Analytics */}
                <td className="p-3.5" onClick={() => handleCellClick(row.id, 'analytics', row.analytics)}>
                  {renderPermissionBadge(row.analytics)}
                </td>

                {/* Settings */}
                <td className="p-3.5" onClick={() => handleCellClick(row.id, 'settings', row.settings)}>
                  {renderPermissionBadge(row.settings)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
