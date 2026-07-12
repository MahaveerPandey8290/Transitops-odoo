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
import { Truck, CheckCircle, Wrench, Users, Clock, Gauge, Loader2 } from 'lucide-react';
import { reportsApi, tripApi, vehicleApi, maintenanceApi } from '../api/client';

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [actionAlert, setActionAlert] = useState(null);

  // Live data state
  const [kpiData, setKpiData] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // All four feeds in parallel — dashboard is the one page that needs the full picture
        const [kpiRes, tripsRes, vehiclesRes, maintRes] = await Promise.all([
          reportsApi.kpis(),
          tripApi.list({ limit: 20 }),         // recent trips for table
          vehicleApi.list({ limit: 200 }),      // all vehicles for status card
          maintenanceApi.list({ limit: 50 }),   // open logs for alerts
        ]);
        setKpiData(kpiRes.data);
        setRecentTrips(tripsRes.data?.trips ?? []);
        setVehicles(vehiclesRes.data?.vehicles ?? []);
        setMaintenanceLogs(maintRes.data?.logs ?? []);
      } catch (err) {
        console.error('Dashboard load error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Build KPI card definitions from live data
  const kpis = kpiData ? [
    { title: 'Total Vehicles',    value: String(kpiData.vehicles.active),          trend: 'Fleet',       trendType: 'neutral', icon: Truck,        iconBg: 'bg-[#3B82F6]/10 text-[#3B82F6]' },
    { title: 'Available Vehicles',value: String(kpiData.vehicles.available),        trend: 'Ready',       trendType: 'up',      icon: CheckCircle,  iconBg: 'bg-[#22C55E]/10 text-[#22C55E]' },
    { title: 'In Maintenance',    value: String(kpiData.vehicles.inMaintenance),    trend: 'In Shop',     trendType: 'down',    icon: Wrench,       iconBg: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
    { title: 'Drivers On Duty',   value: String(kpiData.drivers.onDuty),            trend: 'Active',      trendType: 'neutral', icon: Users,        iconBg: 'bg-indigo-500/10 text-indigo-400' },
    { title: 'Active Trips',      value: String(kpiData.trips.active),              trend: 'Dispatched',  trendType: 'neutral', icon: Clock,        iconBg: 'bg-amber-500/10 text-amber-400' },
    {
      title: 'Fleet Utilization',
      value: `${kpiData.fleetUtilizationPct}%`,
      trend: kpiData.fleetUtilizationPct > 70 ? 'Optimal' : 'Low',
      trendType: kpiData.fleetUtilizationPct > 70 ? 'up' : 'neutral',
      icon: Gauge,
      iconBg: 'bg-[#F59E0B]/10 text-[#F59E0B]',
    },
  ] : [];

  const triggerAction = (label) => {
    setActionAlert(`Action Triggered: "${label}"`);
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
            onRefresh={() => triggerAction('Refresh')}
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

          {/* Recent Trips table + Vehicle Status distribution */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2">
              <RecentTripsTable trips={recentTrips} loading={loading} />
            </div>
            <div className="xl:col-span-1">
              <VehicleStatusCard vehicles={vehicles} loading={loading} />
            </div>
          </section>

          {/* Today's dispatches | Maintenance alerts | Quick actions */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <TodayDispatches trips={recentTrips} loading={loading} />
            <MaintenanceAlerts maintenanceLogs={maintenanceLogs} loading={loading} />
            <QuickActions
              onCreateTrip={() => navigate('/trip-dispatcher')}
              onRegisterVehicle={() => navigate('/fleet', { state: { openRegisterModal: true } })}
              onAddDriver={() => navigate('/drivers', { state: { openAddDriverModal: true } })}
              onFuelEntry={() => navigate('/fuel-management')}
            />
          </section>

          {/* Recent Activity — derived from real trips + maintenance logs */}
          <ActivityTimeline trips={recentTrips} maintenanceLogs={maintenanceLogs} loading={loading} />
        </main>
      </div>
    </div>
  );
}
