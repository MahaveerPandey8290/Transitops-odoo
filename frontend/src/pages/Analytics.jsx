import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { reportsApi, getStoredUser } from "../api/client";
import { BarChart3, TrendingUp, Fuel, Truck, Download, Loader2 } from "lucide-react";
import TripPerformanceChart from "../components/analytics/TripPerformanceChart";
import FuelConsumptionChart from "../components/analytics/FuelConsumptionChart";
import VehicleUtilizationChart from "../components/analytics/VehicleUtilizationChart";

export default function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const user = getStoredUser();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      // All four report endpoints in parallel
      const [utilRes, costRes, roiRes, fuelRes] = await Promise.all([
        reportsApi.fleetUtilization(),
        reportsApi.operationalCost(),
        reportsApi.vehicleRoi(),
        reportsApi.fuelEfficiency(),
      ]);
      setData({
        utilization: utilRes.data,
        cost: costRes.data,
        roi: roiRes.data,
        fuel: fuelRes.data,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Derive stat card values from live report data
  const stats = data ? [
    {
      title: 'Total Trips',
      value: String(data.utilization?.totalTrips ?? '—'),
      icon: Truck,
      change: `${data.utilization?.completionRate?.toFixed(1) ?? '—'}% completion`,
      positive: true,
    },
    {
      title: 'Fuel Expense',
      value: data.cost?.totalFuelCost != null
        ? `₹${Number(data.cost.totalFuelCost).toLocaleString('en-IN')}`
        : '—',
      icon: Fuel,
      change: `${data.fuel?.avgKmPerLiter?.toFixed(1) ?? '—'} km/L avg`,
      positive: true,
    },
    {
      title: 'Maintenance Cost',
      value: data.cost?.totalMaintenanceCost != null
        ? `₹${Number(data.cost.totalMaintenanceCost).toLocaleString('en-IN')}`
        : '—',
      icon: BarChart3,
      change: `${data.cost?.openMaintenanceLogs ?? '—'} open logs`,
      positive: false,
    },
    {
      title: 'Fleet Utilization',
      value: data.utilization?.utilizationRate != null
        ? `${Number(data.utilization.utilizationRate).toFixed(1)}%`
        : '—',
      icon: TrendingUp,
      change: `${data.utilization?.vehiclesOnTrip ?? '—'} on trip now`,
      positive: true,
    },
  ] : [];

  return (
    <div className="h-screen w-screen bg-[#0F1115] text-white flex font-sans antialiased overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Analytics & Reports</h1>
              <p className="text-sm text-[#9CA3AF] mt-1.5 font-medium">Monitor fleet performance and operational insights from live data.</p>
            </div>
            <button onClick={() => window.open('/api/reports/export.csv', '_blank')}
              className="h-11 px-5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#F59E0B]/10 hover:-translate-y-0.5">
              <Download size={16} /><span>Export CSV</span>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40 gap-2 text-[#9CA3AF]">
              <Loader2 size={22} className="animate-spin" />
              <span className="text-sm font-medium">Loading analytics...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error} — {user?.role !== 'FLEET_MANAGER' && user?.role !== 'FINANCIAL_ANALYST' && 'Analytics access requires Fleet Manager or Financial Analyst role.'}
            </div>
          ) : (
            <>
              {/* Live Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((item, i) => (
                  <div key={i} className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl text-left">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-[#9CA3AF] font-bold">{item.title}</p>
                        <h2 className="text-2xl font-extrabold text-white mt-1">{item.value}</h2>
                      </div>
                      <div className="p-2 bg-[#F59E0B]/10 rounded-lg text-[#F59E0B]">
                        <item.icon size={20} />
                      </div>
                    </div>
                    <p className={`mt-4 text-xs font-bold ${item.positive ? 'text-emerald-500' : 'text-amber-400'}`}>
                      {item.change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Vehicle ROI table */}
              {data.roi?.length > 0 && (
                <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-6 text-left">
                  <h2 className="text-sm font-bold text-white mb-4">Vehicle ROI</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-semibold">
                      <thead>
                        <tr className="border-b border-[#2B3038] text-[#9CA3AF] text-left">
                          <th className="pb-3 pr-4">Vehicle</th>
                          <th className="pb-3 px-4">Revenue</th>
                          <th className="pb-3 px-4">Fuel Cost</th>
                          <th className="pb-3 px-4">Maint. Cost</th>
                          <th className="pb-3 pl-4">Net Profit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2B3038]/50">
                        {data.roi.map(r => (
                          <tr key={r.vehicleId} className="text-white hover:bg-[#121419]/30">
                            <td className="py-3 pr-4 font-bold">{r.registrationNumber}</td>
                            <td className="py-3 px-4 text-[#22C55E]">₹{Number(r.totalRevenue).toLocaleString('en-IN')}</td>
                            <td className="py-3 px-4 text-[#F59E0B]">₹{Number(r.totalFuelCost).toLocaleString('en-IN')}</td>
                            <td className="py-3 px-4 text-amber-400">₹{Number(r.totalMaintenanceCost).toLocaleString('en-IN')}</td>
                            <td className={`py-3 pl-4 font-bold ${Number(r.netProfit) >= 0 ? 'text-[#22C55E]' : 'text-red-400'}`}>
                              ₹{Number(r.netProfit).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Charts always rendered (they use their own static/mock data as fallback) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TripPerformanceChart />
            <FuelConsumptionChart />
            <VehicleUtilizationChart />
          </div>
        </main>
      </div>
    </div>
  );
}