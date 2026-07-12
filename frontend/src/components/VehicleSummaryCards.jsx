import React from 'react';
import { Truck, CheckCircle, Navigation, Wrench } from 'lucide-react';

export default function VehicleSummaryCards({ stats }) {
  const cards = [
    {
      title: 'Total Vehicles',
      value: stats.total || 53,
      trend: '+2 new this month',
      color: 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20',
      icon: Truck,
    },
    {
      title: 'Available',
      value: stats.available || 42,
      trend: 'Optimal (79%)',
      color: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20',
      icon: CheckCircle,
    },
    {
      title: 'On Active Trip',
      value: stats.onTrip || 8,
      trend: '15% dispatch load',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      icon: Navigation,
    },
    {
      title: 'In Maintenance',
      value: stats.maintenance || 3,
      trend: '-1 since yesterday',
      color: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20',
      icon: Wrench,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx}
            className="bg-[#171A21] border border-[#2B3038] p-4 rounded-2xl flex items-center justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group text-left"
          >
            <div className="space-y-1 overflow-hidden">
              <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">{card.title}</span>
              <h3 className="text-2xl font-extrabold text-white leading-tight font-mono">{card.value}</h3>
              <p className="text-[9px] text-[#9CA3AF] font-bold truncate">{card.trend}</p>
            </div>

            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${card.color}`}>
              <Icon size={20} className="stroke-[2]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
