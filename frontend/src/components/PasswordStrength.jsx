import React from 'react';

export default function PasswordStrength({ password, validations }) {
  // validations is an object: { hasMinLength, hasAlphanumeric, hasSpecial }
  const score = Object.values(validations).filter(Boolean).length;

  let strengthLabel = 'Weak';
  let strengthColor = 'bg-red-500';
  let widthClass = 'w-1/3';

  if (score === 2) {
    strengthLabel = 'Medium';
    strengthColor = 'bg-amber-500';
    widthClass = 'w-2/3';
  } else if (score === 3) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-500';
    widthClass = 'w-full';
  }

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2 text-left animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          Password Strength:
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
          score <= 1 ? 'text-red-500 bg-red-50' : score === 2 ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'
        }`}>
          {strengthLabel}
        </span>
      </div>

      {/* Strength Bar */}
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-300 ${strengthColor} ${widthClass}`} />
      </div>

      {/* Live Checklists */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3 gap-y-1 text-[11px] font-medium mt-1">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full transition-colors ${validations.hasMinLength ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          <span className={validations.hasMinLength ? 'text-slate-700 font-semibold' : 'text-slate-400'}>Min 8 characters</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full transition-colors ${validations.hasAlphanumeric ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          <span className={validations.hasAlphanumeric ? 'text-slate-700 font-semibold' : 'text-slate-400'}>Alphanumeric (A-Z, 0-9)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full transition-colors ${validations.hasSpecial ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          <span className={validations.hasSpecial ? 'text-slate-700 font-semibold' : 'text-slate-400'}>Special character</span>
        </div>
      </div>
    </div>
  );
}
