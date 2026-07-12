import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import MaintenanceForm from "../components/MaintenanceForm";
import ServiceLogTable from "../components/ServiceLogTable";

export default function Maintenance() {
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
                Maintenance
              </h1>
              <p className="text-sm text-[#9CA3AF] mt-1.5 font-medium max-w-2xl leading-relaxed">
                Schedule vehicle maintenance and track service history.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
            {/* Left Column: Form */}
            <div className="lg:col-span-1">
              <MaintenanceForm />
            </div>

            {/* Right Column: Table */}
            <div className="lg:col-span-2">
              <ServiceLogTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}