import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import FuelStats from "../components/FuelStats";
import FuelTable from "../components/FuelTable";

const FuelManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#0F1115] text-white flex font-sans selection:bg-[#F59E0B]/20 antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content shell */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Dynamic Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Fuel Management
              </h1>
              <p className="text-sm text-[#9CA3AF] mt-1.5 font-medium max-w-2xl leading-relaxed">
                Track vehicle fuel consumption and expenses
              </p>
            </div>

            <button
              className="h-11 px-5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#F59E0B]/10 hover:-translate-y-0.5"
            >
              <span>+ Add Fuel Entry</span>
            </button>
          </div>

          {/* Stats Cards */}
          <FuelStats />

          {/* Fuel Table */}
          <div className="mt-2">
            <FuelTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FuelManagement;