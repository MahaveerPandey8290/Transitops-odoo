import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CloudSun } from 'lucide-react';

export default function DashboardHeader() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-fade-in text-left">
      {/* Left Column: Greeting */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
          Welcome back, Dispatcher 👋
        </h1>
        <p className="text-sm text-[#9CA3AF] mt-1.5 font-medium max-w-2xl leading-relaxed">
          Monitor fleet operations, active trips, and vehicle performance in real time.
        </p>
      </div>

      {/* Right Column: Live Time, Date, and Weather Chips */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date Chip */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#171A21] border border-[#2B3038] rounded-xl text-xs font-semibold text-white">
          <Calendar size={14} className="text-[#F59E0B]" />
          <span>{formatDate(time)}</span>
        </div>

        {/* Live Clock Chip */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#171A21] border border-[#2B3038] rounded-xl text-xs font-semibold text-white">
          <Clock size={14} className="text-[#3B82F6]" />
          <span className="font-mono">{formatTime(time)}</span>
        </div>

        {/* Weather Chip */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#171A21] border border-[#2B3038] rounded-xl text-xs font-semibold text-white">
          <CloudSun size={14} className="text-amber-400" />
          <span>76°F / Sunny</span>
        </div>
      </div>
    </div>
  );
}
