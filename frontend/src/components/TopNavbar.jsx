import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Sun, Moon, LogOut } from 'lucide-react';
import { getStoredUser, clearAuth } from '../api/client';

export default function TopNavbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const user = getStoredUser();

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login', { replace: true });
  };

  // Derive readable role label from backend enum
  const roleLabel = {
    FLEET_MANAGER: 'Fleet Manager',
    DISPATCHER: 'Dispatcher',
    SAFETY_OFFICER: 'Safety Officer',
    FINANCIAL_ANALYST: 'Financial Analyst',
  }[user?.role] ?? 'Operator';

  // Initials for the avatar fallback
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0F1115]/90 backdrop-blur-md border-b border-[#2B3038] px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Menu Toggle + Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button onClick={onMenuClick}
          className="md:hidden text-[#9CA3AF] hover:text-white p-1.5 hover:bg-[#171A21] rounded-lg transition-colors border border-[#2B3038] flex-shrink-0">
          <Menu size={20} />
        </button>

        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
            <Search size={16} />
          </div>
          <input type="text" placeholder="Search vehicles, drivers, trips..."
            className="w-full h-10 pl-10 pr-4 bg-[#171A21] border border-[#2B3038] rounded-xl text-sm placeholder-[#9CA3AF] text-white outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/10 transition-all duration-200" />
        </div>
      </div>

      {/* Right: Theme, Notifications, User, Logout */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="text-[#9CA3AF] hover:text-white p-2 hover:bg-[#171A21] rounded-xl border border-[#2B3038] transition-colors cursor-pointer">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User info */}
        <div className="hidden md:flex flex-col text-right">
          <span className="text-xs font-bold text-white">{user?.name ?? 'Unknown User'}</span>
          <span className="text-[10px] font-semibold text-[#F59E0B] tracking-wide mt-0.5 uppercase">{roleLabel}</span>
        </div>

        {/* Avatar (initials fallback — no hardcoded image) */}
        <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/20 border border-[#F59E0B]/30 flex items-center justify-center flex-shrink-0 cursor-pointer">
          <span className="text-[#F59E0B] text-xs font-bold">{initials}</span>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} title="Sign out"
          className="text-[#9CA3AF] hover:text-red-400 p-2 hover:bg-red-500/10 rounded-xl border border-[#2B3038] hover:border-red-500/20 transition-all duration-200 cursor-pointer">
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
