import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import FilterBar from '../components/FilterBar';
import DashboardHeader from '../components/DashboardHeader';
import KPICard from '../components/KPICard';
import RecentTripsTable from '../components/RecentTripsTable';
import VehicleStatusCard from '../components/VehicleStatusCard';
import QuickActions from '../components/QuickActions';
import ActivityTimeline, { TodayDispatches, MaintenanceAlerts } from '../components/ActivityTimeline';
import AnalyticsCharts from '../components/AnalyticsCharts';

import { 
  Truck, 
  CheckCircle, 
  Wrench, 
  Users, 
  Clock, 
  Gauge 
} from 'lucide-react';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [actionAlert, setActionAlert] = useState(null);

  const kpis = [
    { title: 'Total Vehicles', value: '53', trend: '+5%', trendType: 'up', icon: Truck, iconBg: 'bg-[#3B82F6]/10 text-[#3B82F6]' },
    { title: 'Available Vehicles', value: '42', trend: 'Optimal', trendType: 'neutral', icon: CheckCircle, iconBg: 'bg-[#22C55E]/10 text-[#22C55E]' },
    { title: 'Vehicles In Maint.', value: '05', trend: '-2%', trendType: 'down', icon: Wrench, iconBg: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
    { title: 'Drivers On Duty', value: '18', trend: 'Active', trendType: 'neutral', icon: Users, iconBg: 'bg-indigo-500/10 text-indigo-400' },
    { title: 'Pending Trips', value: '04', trend: 'Scheduled', trendType: 'neutral', icon: Clock, iconBg: 'bg-amber-500/10 text-amber-400' },
    { title: 'Fleet Utilization', value: '81%', trend: '+3%', trendType: 'up', icon: Gauge, iconBg: 'bg-[#F59E0B]/10 text-[#F59E0B]' }
  ];

  const triggerAction = (actionName) => {
    setActionAlert(`Action Triggered: "${actionName}" (Simulated Interface Dialog Opened)`);
    setTimeout(() => setActionAlert(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-white flex font-sans selection:bg-[#F59E0B]/20 antialiased overflow-x-hidden">
      {/* 1. Left Persistent Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* 2. Right Viewport Section */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Action Dialog Notification */}
        {actionAlert && (
          <div className="fixed top-20 right-6 z-50 p-4 bg-[#171A21] border border-[#2B3038] text-[#F59E0B] text-xs font-bold rounded-xl shadow-2xl animate-[fadeInRight_0.4s_ease-out_forwards] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-ping" />
            <span>{actionAlert}</span>
          </div>
        )}

        {/* Scrollable Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
          
          {/* Header */}
          <DashboardHeader />

          {/* Filter Bar */}
          <FilterBar 
            onFilterChange={(filters) => console.log('Filters modified:', filters)}
            onRefresh={() => triggerAction('Refresh Database')}
            onExport={() => triggerAction('Export Fleet CSV')}
          />

          {/* KPI Stat Cards Grid */}
          <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {kpis.map((kpi, idx) => (
              <KPICard 
                key={idx}
                title={kpi.title}
                value={kpi.value}
                trend={kpi.trend}
                trendType={kpi.trendType}
                icon={kpi.icon}
                iconBgColor={kpi.iconBg}
              />
            ))}
          </section>

          {/* Second Row: Table & Status Card */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Left 2/3: Recent Trips Table */}
            <div className="xl:col-span-2">
              <RecentTripsTable />
            </div>
            {/* Right 1/3: Vehicle Status Circulars */}
            <div className="xl:col-span-1">
              <VehicleStatusCard />
            </div>
          </section>

          {/* Third Row: Timeline, Maintenance Alerts & Actions */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <TodayDispatches />
            <MaintenanceAlerts />
            <QuickActions 
              onCreateTrip={() => triggerAction('Create Dispatch Trip')}
              onRegisterVehicle={() => triggerAction('Register New Fleet Asset')}
              onAddDriver={() => triggerAction('Onboard New Driver Profile')}
              onFuelEntry={() => triggerAction('Log Fuel Dispensation transaction')}
            />
          </section>

          {/* Fourth Row: Analytics Charts */}
          <section className="space-y-4">
            <div className="flex items-center justify-between text-left">
              <h3 className="text-base font-bold text-white">Fleet Analytics</h3>
              <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wide">Last 7 Days</span>
            </div>
            <AnalyticsCharts />
          </section>

          {/* Fifth Row: Activity Timeline */}
          <ActivityTimeline />

        </main>
      </div>
    </div>
  );
}
