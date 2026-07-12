import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import {
  BarChart3,
  TrendingUp,
  Fuel,
  Truck,
  Calendar,
  Download,
} from "lucide-react";
import TripPerformanceChart from "../components/analytics/TripPerformanceChart";
import FuelConsumptionChart from "../components/analytics/FuelConsumptionChart";
import VehicleUtilizationChart from "../components/analytics/VehicleUtilizationChart";

const Analytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const stats = [
    {
      title: "Total Trips",
      value: "1,250",
      icon: Truck,
      change: "+12%",
    },
    {
      title: "Fuel Expense",
      value: "₹2.4L",
      icon: Fuel,
      change: "+8%",
    },
    {
      title: "Maintenance Cost",
      value: "₹85K",
      icon: BarChart3,
      change: "-5%",
    },
    {
      title: "Vehicle Utilization",
      value: "92%",
      icon: TrendingUp,
      change: "+15%",
    },
  ];

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
                Analytics & Reports
              </h1>
              <p className="text-sm text-[#9CA3AF] mt-1.5 font-medium max-w-2xl leading-relaxed">
                Monitor fleet performance and operational insights
              </p>
            </div>

            <button
              className="h-11 px-5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#F59E0B]/10 hover:-translate-y-0.5"
            >
              <Download size={16} />
              <span>Export Report</span>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-[#171A21] border border-[#2B3038] p-4 rounded-xl flex gap-4 text-left">
            <button className="flex items-center gap-2 border border-[#2B3038] hover:border-slate-700 bg-[#0F1115] text-[#9CA3AF] hover:text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer">
              <Calendar size={14} />
              <span>This Month</span>
            </button>

            <select className="border border-[#2B3038] bg-[#0F1115] text-white rounded-lg px-4 text-xs font-bold outline-none cursor-pointer">
              <option>All Vehicles</option>
              <option>RJ14 AB1234</option>
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl text-left"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-[#9CA3AF] font-bold">{item.title}</p>
                      <h2 className="text-2xl font-extrabold text-white mt-1">{item.value}</h2>
                    </div>
                    <div className="p-2 bg-[#F59E0B]/10 rounded-lg text-[#F59E0B]">
                      <Icon size={20} />
                    </div>
                  </div>
                  <p className="text-emerald-500 mt-4 text-xs font-bold">{item.change} since last month</p>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
            <TripPerformanceChart />
            <FuelConsumptionChart />
            <VehicleUtilizationChart />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;