import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function BusinessRulesCard() {
  const rules = [
    'Registration Number must be unique and valid.',
    'Retired vehicles cannot be dispatched or assigned to new routes.',
    'Vehicles under maintenance cannot be assigned to active trips.',
    'Cargo cargo load weight cannot exceed maximum vehicle capacity.'
  ];

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl text-left animate-fade-in">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center">
          <ShieldCheck size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white leading-tight">Registry Business Rules</h4>
          <p className="text-[10px] text-[#9CA3AF] font-semibold">Strict validation constraints.</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {rules.map((rule, idx) => (
          <div key={idx} className="flex gap-2.5 items-start p-2.5 bg-[#0F1115] border border-[#2B3038] rounded-xl">
            <Info size={14} className="text-[#3B82F6] flex-shrink-0 mt-0.5" />
            <span className="text-[11px] font-semibold text-[#E2E8F0] leading-relaxed">{rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
