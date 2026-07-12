import React from 'react';
import { ShieldAlert, AlertCircle } from 'lucide-react';

export default function SettingsBusinessRulesCard() {
  const rules = [
    { role: 'Fleet Manager', rule: 'Full CRUD control over vehicles and maintenance tasks.' },
    { role: 'Dispatcher', rule: 'Strictly restricted to trip assignment and allocation routing.' },
    { role: 'Safety Officer', rule: 'Full CRUD control over drivers and safety logs.' },
    { role: 'Financial Analyst', rule: 'Restricted to viewing reports, fuel transactions and expense entries.' },
    { role: 'System settings', rule: 'Only authorized System Administrators can edit configurations.' }
  ];

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl text-left animate-fade-in">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
          <ShieldAlert size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white leading-none">RBAC Rules</h4>
          <p className="text-[10px] text-[#9CA3AF] mt-1 font-semibold font-sans">Role restrictions and assignment boundaries.</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {rules.map((item, idx) => (
          <div key={idx} className="p-3 bg-[#0F1115] border border-[#2B3038] rounded-xl flex gap-2.5 items-start">
            <AlertCircle size={14} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <div className="text-[11px] font-semibold text-white leading-relaxed">
              <span className="text-[#F59E0B] font-extrabold uppercase tracking-wide mr-1">{item.role}:</span>
              <span className="text-[#9CA3AF]">{item.rule}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
