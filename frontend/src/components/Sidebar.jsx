import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Route, 
  Wrench, 
  Fuel, 
  BarChart3, 
  Settings, 
  LogOut, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ 
  isOpen, 
  onClose, 
  isCollapsed, 
  onToggleCollapse 
}) {
  const navigate = useNavigate();
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'Fleet', icon: Truck },
    { name: 'Drivers', icon: Users },
    { name: 'Trips', icon: Route },
    { name: 'Maintenance', icon: Wrench },
    { name: 'Fuel & Expenses', icon: Fuel },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-[#15181E] border-r border-[#2B3038] flex flex-col justify-between transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${
          isCollapsed ? 'w-20' : 'w-[260px]'
        }`}
      >
        {/* Top Branding Section */}
        <div className="p-5 border-b border-[#2B3038] flex items-center justify-between relative">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Minimalist stylized logo */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#F59E0B]/10">
              <Route size={16} className="text-white stroke-[2.5]" />
            </div>
            
            {!isCollapsed && (
              <div className="flex flex-col text-left animate-fade-in">
                <span className="text-base font-bold text-white tracking-tight leading-none">
                  Transit<span className="text-[#F59E0B]">Ops</span>
                </span>
                <span className="text-[8px] font-semibold text-[#9CA3AF] tracking-wider uppercase mt-1 leading-none">
                  Smart Operations
                </span>
              </div>
            )}
          </div>

          {/* Mobile Drawer Close Button */}
          <button 
            onClick={onClose}
            className="md:hidden text-[#9CA3AF] hover:text-white p-1 hover:bg-[#171A21] rounded-lg transition-colors"
          >
            <X size={18} />
          </button>

          {/* Desktop Collapse Toggle Handle */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#171A21] border border-[#2B3038] rounded-full items-center justify-center text-[#9CA3AF] hover:text-white shadow-lg hover:border-[#F59E0B]/50 transition-all"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto space-y-1 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                  item.active 
                    ? 'bg-[#F59E0B] text-white font-bold shadow-md shadow-[#F59E0B]/15' 
                    : 'text-[#9CA3AF] hover:text-white hover:bg-[#171A21]'
                }`}
              >
                {/* Left Active indicator bar */}
                {item.active && (
                  <div className="absolute left-0 top-1/3 bottom-1/3 w-1 bg-white rounded-r-full" />
                )}

                <Icon 
                  size={20} 
                  className={`flex-shrink-0 transition-transform group-hover:scale-105 duration-200 ${
                    item.active ? 'text-white' : 'text-[#9CA3AF] group-hover:text-white'
                  }`} 
                />

                {!isCollapsed && (
                  <span className="text-sm font-semibold tracking-wide text-left flex-1 animate-fade-in truncate">
                    {item.name}
                  </span>
                )}

                {/* Collapsed Hover Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-16 px-2.5 py-1.5 rounded-lg bg-[#171A21] text-xs font-semibold text-white border border-[#2B3038] shadow-lg opacity-0 translate-x-3 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all z-50">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer Section */}
        <div className="p-4 border-t border-[#2B3038] bg-[#121419]/30 flex flex-col gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Avatar container */}
            <div className="relative flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                alt="Alex Carter" 
                className="w-10 h-10 rounded-xl object-cover border border-[#2B3038]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22C55E] border-2 border-[#15181E] rounded-full animate-pulse" />
            </div>

            {!isCollapsed && (
              <div className="flex-1 text-left animate-fade-in overflow-hidden">
                <h5 className="text-xs font-bold text-white truncate leading-tight">Alex Carter</h5>
                <p className="text-[10px] font-semibold text-[#9CA3AF] tracking-wide mt-0.5 leading-none">Dispatcher</p>
              </div>
            )}
          </div>

          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl border border-[#2B3038] hover:border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-semibold text-xs ${
              isCollapsed ? 'p-0 h-10' : ''
            }`}
            title="Log Out"
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
