import React, { useEffect, useState } from 'react';

export default function VehicleStatusCard() {
  const statusData = [
    { label: 'Available', count: 42, color: 'bg-[#22C55E]', textCol: 'text-[#22C55E]' },
    { label: 'On Active Trip', count: 8, color: 'bg-[#3B82F6]', textCol: 'text-[#3B82F6]' },
    { label: 'In Shop (Maintenance)', count: 3, color: 'bg-[#F59E0B]', textCol: 'text-[#F59E0B]' },
    { label: 'Retired / Inactive', count: 2, color: 'bg-[#EF4444]', textCol: 'text-[#EF4444]' }
  ];

  const total = statusData.reduce((acc, curr) => acc + curr.count, 0);

  // Animation trigger
  const [animatedWidths, setAnimatedWidths] = useState(statusData.map(() => 0));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidths(statusData.map(item => (item.count / total) * 100));
    }, 150);
    return () => clearTimeout(timer);
  }, [total]);

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl flex flex-col justify-between h-full animate-fade-in text-left">
      <div>
        <h3 className="text-base font-bold text-white mb-1">Vehicle Status</h3>
        <p className="text-xs text-[#9CA3AF] font-semibold mb-6">Real-time fleet operational distribution.</p>
      </div>

      <div className="space-y-5">
        {statusData.map((item, idx) => {
          const pct = ((item.count / total) * 100).toFixed(1);
          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#E2E8F0]">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`${item.textCol}`}>{item.count}</span>
                  <span className="text-[#9CA3AF]/40">|</span>
                  <span className="text-[#9CA3AF] font-mono">{pct}%</span>
                </div>
              </div>
              
              {/* Progress track */}
              <div className="w-full h-2.5 bg-[#0F1115] rounded-full overflow-hidden border border-[#2B3038]/50">
                <div 
                  className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${animatedWidths[idx]}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Total Metric */}
      <div className="mt-6 pt-4 border-t border-[#2B3038]/60 flex items-center justify-between">
        <span className="text-xs font-bold text-[#9CA3AF]">Total Fleet Assets</span>
        <span className="text-sm font-extrabold text-white">{total} Vehicles</span>
      </div>
    </div>
  );
}
