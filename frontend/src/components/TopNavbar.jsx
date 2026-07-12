import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, Sun, Moon } from 'lucide-react';

export default function TopNavbar({ onMenuClick }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  const userRole = localStorage.getItem('userRole') || 'Dispatcher';

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0F1115]/90 backdrop-blur-md border-b border-[#2B3038] px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Menu Toggle (Mobile/Tablet) & Global Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onMenuClick}
          className="md:hidden text-[#9CA3AF] hover:text-white p-1.5 hover:bg-[#171A21] rounded-lg transition-colors border border-[#2B3038] flex-shrink-0"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search vehicles, drivers, trips..."
            className="w-full h-10 pl-10 pr-4 bg-[#171A21] border border-[#2B3038] rounded-xl text-sm placeholder-[#9CA3AF] text-white outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right: Notifications, Theme Toggle, Role, Avatar */}
      <div className="flex items-center gap-4 flex-shrink-0">
        
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="text-[#9CA3AF] hover:text-white p-2 hover:bg-[#171A21] rounded-xl border border-[#2B3038] transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>



        {/* User Info (Desktop only) */}
        <div className="hidden md:flex flex-col text-right">
          <span className="text-xs font-bold text-white">Alex Carter</span>
          <span className="text-[10px] font-semibold text-[#9CA3AF] tracking-wide mt-0.5 uppercase">{userRole}</span>
        </div>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#2B3038] flex-shrink-0 cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="Alex Carter"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
