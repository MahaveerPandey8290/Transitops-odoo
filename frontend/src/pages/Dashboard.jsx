import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Truck, CheckCircle, Wrench, Users, Clock, Gauge, Loader2 } from 'lucide-react';
import { reportsApi, tripApi } from '../api/client';

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [actionAlert, setActionAlert] = useState(null);
  const [kpiData, setKpiData] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch KPIs and recent active trips on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [kpiRes, tripsRes] = await Promise.all([
          reportsApi.kpis(),
          tripApi.list({ status: 'DISPATCHED', limit: 5 }),
        ]);
        setKpiData(kpiRes.data);
        setRecentTrips(tripsRes.data?.trips ?? []);
      } catch (err) {
        console.error('Dashboard load error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Build KPI card definitions from live data
  const kpis = kpiData
    ? [
        { title: 'Total Vehicles', value: String(kpiData.vehicles.active), trend: 'Fleet', trendType: 'neutral', icon: Truck, iconBg: 'bg-[#3B82F6]/10 text-[#3B82F6]' },
        { title: 'Available Vehicles', value: String(kpiData.vehicles.available), trend: 'Ready', trendType: 'neutral', icon: CheckCircle, iconBg: 'bg-[#22C55E]/10 text-[#22C55E]' },
        { title: 'In Maintenance', value: String(kpiData.vehicles.inMaintenance), trend: 'In Shop', trendType: 'down', icon: Wrench, iconBg: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
        { title: 'Drivers On Duty', value: String(kpiData.drivers.onDuty), trend: 'Active', trendType: 'neutral', icon: Users, iconBg: 'bg-indigo-500/10 text-indigo-400' },
        { title: 'Active Trips', value: String(kpiData.trips.active), trend: 'Dispatched', trendType: 'neutral', icon: Clock, iconBg: 'bg-amber-500/10 text-amber-400' },
        { title: 'Fleet Utilization', value: `${kpiData.fleetUtilizationPct}%`, trend: kpiData.fleetUtilizationPct > 70 ? 'Optimal' : 'Low', trendType: kpiData.fleetUtilizationPct > 70 ? 'up' : 'neutral', icon: Gauge, iconBg: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
      ]
    : [];

  const triggerAction = (actionName) => {
    setActionAlert(`Action Triggered: "${actionName}"`);
    setTimeout(() => setActionAlert(null), 3500);
  };

  const handleExportPDF = () => {
    setActionAlert('Preparing PDF export...');
    setTimeout(() => window.print(), 600);
  };

  return (
    <div className="h-screen w-screen bg-[#0F1115] text-white flex font-sans selection:bg-[#F59E0B]/20 antialiased overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        {actionAlert && (
          <div className="fixed top-20 right-6 z-50 p-4 bg-[#171A21] border border-[#2B3038] text-[#F59E0B] text-xs font-bold rounded-xl shadow-2xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-ping" />
            <span>{actionAlert}</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
          <DashboardHeader />

          <FilterBar
            onFilterChange={(f) => console.log('Filters:', f)}
            onRefresh={() => triggerAction('Refresh Database')}
            onExport={handleExportPDF}
          />

          {/* KPI Cards */}
          {loading ? (
            <div className="flex items-center justify-center h-24 gap-2 text-[#9CA3AF]">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm font-medium">Loading live data...</span>
            </div>
          ) : (
            <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {kpis.map((kpi, idx) => (
                <KPICard key={idx} title={kpi.title} value={kpi.value} trend={kpi.trend}
                  trendType={kpi.trendType} icon={kpi.icon} iconBgColor={kpi.iconBg} />
              ))}
            </section>
          )}

          {/* Recent Trips + Vehicle Status */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2">
              <RecentTripsTable trips={recentTrips} />
            </div>
            <div className="xl:col-span-1">
              <VehicleStatusCard stats={kpiData?.vehicles} />
            </div>
          </section>

          {/* Timeline + Actions */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <TodayDispatches />
            <MaintenanceAlerts />
            <QuickActions
              onCreateTrip={() => navigate('/trip-dispatcher')}
              onRegisterVehicle={() => navigate('/fleet', { state: { openRegisterModal: true } })}
              onAddDriver={() => navigate('/drivers', { state: { openAddDriverModal: true } })}
              onFuelEntry={() => navigate('/fuel-management')}
            />
          </section>

          {/* Analytics Charts */}
          <section className="space-y-4">
            <div className="flex items-center justify-between text-left">
              <h3 className="text-base font-bold text-white">Fleet Analytics</h3>
              <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wide">Live Data</span>
            </div>
            <AnalyticsCharts />
          </section>

          <ActivityTimeline />
        </main>
      </div>
    </div>
  );
}
