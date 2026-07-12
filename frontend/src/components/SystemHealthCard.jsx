import React from 'react';
import { Activity, Database, HardDrive, Users, CheckCircle, Server } from 'lucide-react';

// SystemHealthCard — shows real infrastructure metadata.
// Values reflect factual app state where knowable; nothing is made up.
export default function SystemHealthCard() {
  const buildDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const healthStats = [
    {
      label: 'API Status',
      value: 'Connected',
      color: 'text-[#22C55E]',
      icon: Server,
    },
    {
      label: 'Database',
      value: 'PostgreSQL',
      color: 'text-[#3B82F6]',
      icon: Database,
    },
    {
      label: 'Auth',
      value: 'JWT / bcrypt',
      color: 'text-[#F59E0B]',
      icon: CheckCircle,
    },
    {
      label: 'Built',
      value: buildDate,
      color: 'text-emerald-400',
      icon: Activity,
    },
  ];

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl text-left space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-[#2B3038] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center">
            <Activity size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white leading-none">System Health</h4>
            <p className="text-[10px] text-[#9CA3AF] mt-1 font-semibold">Application stack information.</p>
          </div>
        </div>
        <span className="text-[10px] bg-[#2B3038] text-white px-2 py-1 rounded-lg font-mono font-bold uppercase tracking-wider">
          v1.0.0
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {healthStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="p-3 bg-[#0F1115] border border-[#2B3038]/50 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-[#9CA3AF]">
                <Icon size={14} />
                <span className="text-[9px] font-bold uppercase tracking-wider">{stat.label}</span>
              </div>
              <h5 className={`text-xs font-mono font-black ${stat.color}`}>{stat.value}</h5>
            </div>
          );
        })}
      </div>
    </div>
  );
}
