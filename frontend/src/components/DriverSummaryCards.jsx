import React from 'react';
import { Users, CheckCircle, Navigation, Coffee, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function DriverSummaryCards({ stats }) {
  const cards = [
    {
      title: 'Total Drivers',
      value: stats.total || 0,
      trend: '+4 new this month',
      color: 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20',
      icon: Users,
    },
    {
      title: 'Available',
      value: stats.available || 0,
      trend: 'Ready for dispatch',
      color: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20',
      icon: CheckCircle,
    },
    {
      title: 'On Trip',
      value: stats.onTrip || 0,
      trend: 'Active on road',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      icon: Navigation,
    },
    {
      title: 'Off Duty',
      value: stats.offDuty || 0,
      trend: 'Scheduled rest',
      color: 'text-[#9CA3AF] bg-[#9CA3AF]/10 border-[#9CA3AF]/20',
      icon: Coffee,
    },
    {
      title: 'Lic. Expiring Soon',
      value: stats.expiringSoon || 0,
      trend: 'Next 30 days alert',
      color: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20',
      icon: AlertTriangle,
    },
    {
      title: 'Suspended Drivers',
      value: stats.suspended || 0,
      trend: 'Requires review',
      color: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20',
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx}
            className="bg-[#171A21] border border-[#2B3038] p-4 rounded-2xl flex flex-col justify-between gap-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group text-left"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider">{card.title}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${card.color}`}>
                <Icon size={16} className="stroke-[2]" />
              </div>
            </div>

            <div className="space-y-0.5">
              <h3 className="text-xl font-extrabold text-white font-mono">{card.value}</h3>
              <p className="text-[9px] text-[#9CA3AF] font-bold truncate">{card.trend}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
