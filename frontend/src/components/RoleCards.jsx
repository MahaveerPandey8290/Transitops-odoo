import React from 'react';
import { Shield, Truck, Route, Users, ShieldAlert, BadgeCent } from 'lucide-react';

export default function RoleCards() {
  const roles = [
    {
      title: 'Fleet Manager',
      scope: ['Vehicle Registry', 'Maintenance Schedules', 'Asset Appraisals'],
      color: 'border-[#F59E0B]/20 text-[#F59E0B] bg-[#F59E0B]/5',
      icon: Truck
    },
    {
      title: 'Dispatcher',
      scope: ['Trip Management', 'Real-time GPS Tracking', 'Driver Dispatch Allocation'],
      color: 'border-[#3B82F6]/20 text-[#3B82F6] bg-[#3B82F6]/5',
      icon: Route
    },
    {
      title: 'Safety Officer',
      scope: ['Driver Registry', 'Safety Scores Evaluator', 'License compliance alerts'],
      color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5',
      icon: Users
    },
    {
      title: 'Financial Analyst',
      scope: ['Fuel Refills', 'Expense Limits', 'Financial Reports & ROI'],
      color: 'border-purple-500/20 text-purple-400 bg-purple-500/5',
      icon: BadgeCent
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in text-left">
      {roles.map((r, idx) => {
        const Icon = r.icon;
        return (
          <div 
            key={idx}
            className={`border rounded-2xl p-4.5 space-y-3.5 hover:-translate-y-1 transition-all duration-300 ${r.color}`}
          >
            <div className="flex items-center gap-2">
              <Icon size={16} className="stroke-[2.5]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-white">{r.title}</h4>
            </div>

            <ul className="space-y-1.5 text-[11px] font-semibold text-[#9CA3AF]">
              {r.scope.map((s, sIdx) => (
                <li key={sIdx} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-current" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
