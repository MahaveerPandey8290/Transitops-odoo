import React from 'react';
import { getStoredUser } from '../api/client';

// Human-readable labels for backend role enums
const ROLE_LABELS = {
  FLEET_MANAGER:    'Fleet Manager',
  DISPATCHER:       'Dispatcher',
  SAFETY_OFFICER:   'Safety Officer',
  FINANCIAL_ANALYST:'Financial Analyst',
};

export default function DashboardHeader() {
  const user = getStoredUser(); // reads { id, name, role, email } from localStorage
  const displayName = user?.name ?? 'User';
  const roleLabel   = ROLE_LABELS[user?.role] ?? 'Operator';

  return (
    <div className="animate-fade-in text-left">
      <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
        Welcome back, {displayName}
      </h1>
      <p className="text-sm text-[#9CA3AF] mt-1.5 font-medium max-w-2xl leading-relaxed">
        Signed in as{' '}
        <span className="text-[#F59E0B] font-bold">{roleLabel}</span>
        {' '}— Monitor fleet operations, active trips, and vehicle performance in real time.
      </p>
    </div>
  );
}
