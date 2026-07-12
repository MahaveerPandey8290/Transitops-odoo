import React from "react";
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
  ChevronRight,
  Send,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getStoredUser, clearAuth } from "../api/client";

// ── Role → allowed route paths ────────────────────────────────────────────────
// This is the single source of truth for navigation access.
// App.jsx PrivateRoute reads from the same map for route-level guards.
export const ROLE_ROUTES = {
  FLEET_MANAGER:     ['/dashboard', '/fleet', '/drivers', '/trip-dispatcher', '/maintenance', '/fuel-management', '/analytics', '/settings'],
  DISPATCHER:        ['/dashboard', '/fleet', '/trip-dispatcher'],
  SAFETY_OFFICER:    ['/dashboard', '/fleet', '/drivers', '/maintenance', '/trip-dispatcher'],
  FINANCIAL_ANALYST: ['/dashboard', '/fleet', '/fuel-management', '/analytics'],
};

// All possible nav items in display order
const ALL_NAV_ITEMS = [
  { name: "Dashboard",       icon: LayoutDashboard, path: "/dashboard"        },
  { name: "Fleet",           icon: Truck,           path: "/fleet"            },
  { name: "Drivers",         icon: Users,           path: "/drivers"          },
  { name: "Trip Dispatcher", icon: Send,            path: "/trip-dispatcher"  },
  { name: "Maintenance",     icon: Wrench,          path: "/maintenance"      },
  { name: "Fuel & Expenses", icon: Fuel,            path: "/fuel-management"  },
  { name: "Analytics",       icon: BarChart3,       path: "/analytics"        },
  { name: "Settings",        icon: Settings,        path: "/settings"         },
];

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();

  // Show only the routes this role is allowed to visit
  const allowedPaths = ROLE_ROUTES[user?.role] ?? ROLE_ROUTES['DISPATCHER'];
  const navItems = ALL_NAV_ITEMS.filter(item => allowedPaths.includes(item.path));

  const handleNavigation = (path) => {
    navigate(path);
    if (isOpen && onClose) onClose();
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-screen bg-[#15181E] border-r border-[#2B3038]
          flex flex-col justify-between
          transition-all duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-[260px]'}
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-[#2B3038] flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center">
              <Route size={16} className="text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-white font-bold">
                  Transit<span className="text-[#F59E0B]">Ops</span>
                </h1>
                <p className="text-[8px] text-gray-400 uppercase tracking-widest">Smart Operations</p>
              </div>
            )}
          </div>

          {/* Collapse toggle — desktop */}
          <button onClick={onToggleCollapse}
            className="hidden md:flex absolute -right-3 w-7 h-7 rounded-full bg-[#171A21] border border-[#2B3038] items-center justify-center text-gray-400 hover:text-white transition-colors">
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Close — mobile */}
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Role badge */}
        {!isCollapsed && user && (
          <div className="px-4 py-3 border-b border-[#2B3038]/50">
            <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider mb-0.5">Signed in as</p>
            <p className="text-xs text-white font-bold truncate">{user.name}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 uppercase tracking-wide">
              {user.role?.replace(/_/g, ' ')}
            </span>
          </div>
        )}

        {/* Navigation — only routes the role can access */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button key={item.name} onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative
                  ${active
                    ? 'bg-[#F59E0B] text-white shadow-md shadow-[#F59E0B]/20'
                    : 'text-[#9CA3AF] hover:bg-[#171A21] hover:text-white'
                  }
                `}
              >
                {active && (
                  <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />
                )}
                <Icon size={20} />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#2B3038]">
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#2B3038] text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-200">
            <LogOut size={16} />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}