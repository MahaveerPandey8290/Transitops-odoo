import React from 'react';

export default function DashboardHeader() {
  const userRole = localStorage.getItem('userRole') || 'Dispatcher';

  return (
    <div className="animate-fade-in text-left">
      <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
        Welcome back, {userRole}
      </h1>
      <p className="text-sm text-[#9CA3AF] mt-1.5 font-medium max-w-2xl leading-relaxed">
        Monitor fleet operations, active trips, and vehicle performance in real time.
      </p>
    </div>
  );
}
