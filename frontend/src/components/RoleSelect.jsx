import React from 'react';
import { Shield, ChevronDown } from 'lucide-react';

export default function RoleSelect({ value, onChange, error, disabled }) {
  const roles = [
    'Fleet Manager',
    'Dispatcher',
    'Safety Officer',
    'Financial Analyst'
  ];

  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor="role" className="block text-sm font-medium text-slate-700">
        Select Your Role
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Shield size={18} />
        </div>
        <select
          id="role"
          name="role"
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full h-[52px] pl-10 pr-10 bg-white border ${
            error ? 'border-red-400 focus:ring-red-100' : 'border-[#E2E8F0] focus:border-[#F59E0B] focus:ring-[#F59E0B]/10'
          } rounded-[14px] text-sm text-[#0F172A] font-medium outline-none focus:ring-4 transition-all duration-200 appearance-none cursor-pointer disabled:opacity-60`}
        >
          <option value="" disabled hidden>Choose your role</option>
          {roles.map((role) => (
            <option key={role} value={role} className="text-[#0F172A]">
              {role}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && <p className="text-xs text-red-500 font-medium mt-1">{error}</p>}
    </div>
  );
}
