import React from 'react';
import { Route, Truck, UserPlus, Fuel } from 'lucide-react';

export default function QuickActions({ onCreateTrip, onRegisterVehicle, onAddDriver, onFuelEntry }) {
  const actions = [
    {
      label: 'Create Trip',
      description: 'Dispatch a new trip',
      icon: Route,
      color: 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20 hover:border-[#3B82F6]/50',
      action: onCreateTrip
    },
    {
      label: 'Register Vehicle',
      description: 'Add asset to the fleet',
      icon: Truck,
      color: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20 hover:border-[#22C55E]/50',
      action: onRegisterVehicle
    },
    {
      label: 'Add Driver',
      description: 'Onboard a new driver',
      icon: UserPlus,
      color: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20 hover:border-[#F59E0B]/50',
      action: onAddDriver
    },
    {
      label: 'Fuel Entry',
      description: 'Log refuel transaction',
      icon: Fuel,
      color: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20 hover:border-[#EF4444]/50',
      action: onFuelEntry
    }
  ];

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl flex flex-col h-full animate-fade-in text-left">
      <div>
        <h3 className="text-base font-bold text-white mb-1">Quick Actions</h3>
        <p className="text-xs text-[#9CA3AF] font-semibold mb-5">Speed operations with key commands.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              onClick={act.action}
              className={`flex flex-col items-center justify-center p-3 text-center border rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 group cursor-pointer ${act.color}`}
            >
              <div className="w-9 h-9 rounded-full bg-[#0F1115]/50 flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110">
                <Icon size={18} className="stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">{act.label}</span>
              <span className="text-[9px] text-[#9CA3AF] mt-1 font-medium hidden sm:inline-block leading-none">{act.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
