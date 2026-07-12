import React from 'react';
import { AlertTriangle, Clock, ShieldAlert, Check } from 'lucide-react';

export default function LicenseAlerts({ drivers, onViewProfile, onRenew }) {
  // Filter for drivers whose license is expiring soon or expired
  const alertDrivers = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return drivers
      .map(drv => {
        const expDate = new Date(drv.licenseExpiry);
        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { ...drv, diffDays };
      })
      .filter(drv => drv.diffDays <= 30)
      .sort((a, b) => a.diffDays - b.diffDays);
  }, [drivers]);

  if (alertDrivers.length === 0) {
    return (
      <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl text-left animate-fade-in">
        <div className="flex items-center gap-2 text-[#22C55E]">
          <Check size={18} />
          <h4 className="text-sm font-bold text-white leading-none">License Compliance</h4>
        </div>
        <p className="text-[10px] text-[#9CA3AF] mt-2 font-semibold leading-relaxed">
          All active operator licenses are valid. No renewals required in the next 30 days.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl text-left space-y-4 animate-fade-in">
      <div>
        <h4 className="text-sm font-bold text-white leading-none">License Alerts</h4>
        <p className="text-[10px] text-[#9CA3AF] mt-1 font-semibold">Required renewals (next 30 days).</p>
      </div>

      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
        {alertDrivers.map((drv) => {
          const isExpired = drv.diffDays <= 0;
          
          return (
            <div 
              key={drv.id} 
              className={`p-3 border rounded-xl flex items-center justify-between gap-3 text-xs ${
                isExpired 
                  ? 'bg-red-500/5 border-red-500/20' 
                  : drv.diffDays <= 7 
                    ? 'bg-amber-500/5 border-amber-500/20' 
                    : 'bg-[#0F1115] border-[#2B3038]'
              }`}
            >
              <div className="space-y-1 overflow-hidden">
                <span className="font-bold text-white block truncate">{drv.name}</span>
                <span className="text-[9px] text-[#9CA3AF] block font-mono">{drv.licenseNumber}</span>
                
                {isExpired ? (
                  <span className="text-[9px] font-bold text-[#EF4444] flex items-center gap-1">
                    <ShieldAlert size={10} /> Expired {Math.abs(drv.diffDays)} days ago
                  </span>
                ) : (
                  <span className={`text-[9px] font-bold flex items-center gap-1 ${
                    drv.diffDays <= 7 ? 'text-[#F59E0B]' : 'text-[#9CA3AF]'
                  }`}>
                    <Clock size={10} /> Expires in {drv.diffDays} days
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => onViewProfile(drv)}
                  className="px-2 py-1 bg-[#171A21] border border-[#2B3038] hover:border-slate-700 text-white rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                >
                  View
                </button>
                <button
                  onClick={() => onRenew(drv)}
                  className="px-2 py-1 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                >
                  Renew
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
