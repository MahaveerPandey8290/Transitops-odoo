import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function SafetyInsights({ drivers }) {
  // 1. License status count
  const licenseStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let valid = 0, expiring = 0, expired = 0;
    
    drivers.forEach(d => {
      const expDate = new Date(d.licenseExpiry);
      const diffTime = expDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) expired++;
      else if (diffDays <= 30) expiring++;
      else valid++;
    });
    
    return { valid, expiring, expired };
  }, [drivers]);

  // 2. Safety rating distribution
  const safetyStats = useMemo(() => {
    let excellent = 0, good = 0, average = 0, poor = 0;
    
    drivers.forEach(d => {
      const s = d.safetyScore;
      if (s >= 90) excellent++;
      else if (s >= 80) good++;
      else if (s >= 70) average++;
      else poor++;
    });
    
    return { excellent, good, average, poor };
  }, [drivers]);

  // Pie chart data structure for Safety Rating
  const pieData = useMemo(() => {
    return [
      { name: 'Excellent (90%+)', value: safetyStats.excellent, color: '#22C55E' },
      { name: 'Good (80-89%)', value: safetyStats.good, color: '#F59E0B' },
      { name: 'Average (70-79%)', value: safetyStats.average, color: '#3B82F6' },
      { name: 'Poor (<70%)', value: safetyStats.poor, color: '#EF4444' }
    ].filter(d => d.value > 0);
  }, [safetyStats]);

  // Drivers status metrics
  const tripCount = drivers.filter(d => d.status === 'On Trip').length;
  const availableCount = drivers.filter(d => d.status === 'Available').length;
  const suspendedCount = drivers.filter(d => d.status === 'Suspended').length;

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl text-left space-y-5 animate-fade-in">
      <div>
        <h4 className="text-sm font-bold text-white leading-none">Safety & Compliance</h4>
        <p className="text-[10px] text-[#9CA3AF] mt-1 font-semibold font-sans">Operator evaluation analytics.</p>
      </div>

      {/* Donut Chart: Safety Rating */}
      {pieData.length > 0 ? (
        <div className="h-28 flex items-center justify-between border-b border-[#2B3038] pb-4">
          <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 flex flex-col gap-1.5 justify-center">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[9px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-[#9CA3AF] truncate max-w-[80px]">{d.name.split(' ')[0]}:</span>
                <span className="text-white ml-auto font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-20 flex items-center justify-center border-b border-[#2B3038] pb-4 text-xs text-[#9CA3AF]">
          No ratings available
        </div>
      )}

      {/* License compliance lists */}
      <div className="space-y-3 border-b border-[#2B3038] pb-4 text-[11px] font-semibold">
        <span className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider block">License Status</span>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[#9CA3AF] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> Valid Licenses
            </span>
            <span className="text-white font-mono">{licenseStats.valid}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#9CA3AF] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /> Expiring soon (30d)
            </span>
            <span className="text-white font-mono">{licenseStats.expiring}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#9CA3AF] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" /> Expired Licenses
            </span>
            <span className="text-white font-mono">{licenseStats.expired}</span>
          </div>
        </div>
      </div>

      {/* Operational stats */}
      <div className="space-y-2 text-[11px] font-semibold">
        <span className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider block">Duty Allocation</span>
        <div className="flex justify-between">
          <span className="text-[#9CA3AF]">Drivers on Active Trips</span>
          <span className="text-white font-mono">{tripCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#9CA3AF]">Available for Dispatch</span>
          <span className="text-white font-mono">{availableCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#9CA3AF]">Suspended Operators</span>
          <span className="text-white font-mono text-red-400">{suspendedCount}</span>
        </div>
      </div>
    </div>
  );
}
