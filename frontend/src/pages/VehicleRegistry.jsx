import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import VehicleSummaryCards from '../components/VehicleSummaryCards';
import VehicleFilters from '../components/VehicleFilters';
import VehicleTable from '../components/VehicleTable';
import VehicleDrawer from '../components/VehicleDrawer';
import VehicleModal from '../components/VehicleModal';
import BusinessRulesCard from '../components/BusinessRulesCard';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { Truck, Plus, Trash2, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { vehicleApi, getStoredUser } from '../api/client';

// Map backend field names → UI field names used throughout this page
function mapVehicle(v) {
  return {
    id: v.id,
    regNumber: v.registrationNumber,
    name: `${v.make} ${v.model}`,
    make: v.make,
    model: v.model,
    type: v.type,
    year: v.year,
    capacity: Number(v.maxLoadCapacityKg),
    odometer: Number(v.currentOdometerKm ?? 0),
    status: { AVAILABLE: 'Available', ON_TRIP: 'On Trip', IN_SHOP: 'Maintenance', RETIRED: 'Retired' }[v.status] ?? v.status,
    region: v.region,
    purchaseCost: Number(v.purchaseCost ?? 0),
  };
}

export default function VehicleRegistry() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const user = getStoredUser();
  const canWrite = user?.role === 'FLEET_MANAGER';

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  const [filters, setFilters] = useState({ search: '', vehicleType: 'all', status: 'all', region: 'all' });
  const [sortConfig, setSortConfig] = useState({ key: 'regNumber', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    setApiError('');
    try {
      const res = await vehicleApi.list({ limit: 100 });
      setVehicles((res.data?.vehicles ?? []).map(mapVehicle));
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadVehicles(); }, [loadVehicles]);

  useEffect(() => {
    if (location.state?.openRegisterModal && canWrite) {
      setIsModalOpen(true);
      setEditVehicle(null);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, canWrite]);

  // Filter + sort on the client side (data is already paginated from backend for large sets
  // but for this scale we fetch all and filter locally for instant search response)
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((vh) => {
        const matchesSearch =
          vh.regNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
          vh.name.toLowerCase().includes(filters.search.toLowerCase());
        const matchesType = filters.vehicleType === 'all' || vh.type === filters.vehicleType;
        const matchesStatus = filters.status === 'all' || vh.status === filters.status;
        const matchesRegion = filters.region === 'all' || vh.region === filters.region;
        return matchesSearch && matchesType && matchesStatus && matchesRegion;
      })
      .sort((a, b) => {
        const { key, direction } = sortConfig;
        let valA = a[key]; let valB = b[key];
        if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
        if (valA < valB) return direction === 'ascending' ? -1 : 1;
        if (valA > valB) return direction === 'ascending' ? 1 : -1;
        return 0;
      });
  }, [vehicles, filters, sortConfig]);

  const totalPages = Math.ceil(filteredVehicles.length / pageSize);
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVehicles.slice(start, start + pageSize);
  }, [filteredVehicles, currentPage, pageSize]);

  const statsSummary = useMemo(() => ({
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'Available').length,
    onTrip: vehicles.filter(v => v.status === 'On Trip').length,
    maintenance: vehicles.filter(v => v.status === 'Maintenance').length,
  }), [vehicles]);

  const insights = useMemo(() => {
    if (!vehicles.length) return { avgOdo: 0, oldestName: 'N/A', newestName: 'N/A' };
    const avgOdo = Math.round(vehicles.reduce((s, v) => s + v.odometer, 0) / vehicles.length);
    return { avgOdo, oldestName: vehicles[vehicles.length - 1]?.name ?? 'N/A', newestName: vehicles[0]?.name ?? 'N/A' };
  }, [vehicles]);

  const pieData = useMemo(() => [
    { name: 'Available', value: statsSummary.available, color: '#22C55E' },
    { name: 'On Trip', value: statsSummary.onTrip, color: '#3B82F6' },
    { name: 'Maint.', value: statsSummary.maintenance, color: '#F59E0B' },
    { name: 'Retired', value: vehicles.filter(v => v.status === 'Retired').length, color: '#EF4444' },
  ].filter(d => d.value > 0), [statsSummary, vehicles]);

  const typeCounts = useMemo(() => {
    const counts = { TRUCK: 0, VAN: 0, BUS: 0, SEDAN: 0, MOTORCYCLE: 0 };
    vehicles.forEach(v => { if (counts[v.type] !== undefined) counts[v.type]++; });
    return counts;
  }, [vehicles]);

  // ── CRUD handlers ────────────────────────────────────────────────────────────

  const handleSaveVehicle = async (formData) => {
    try {
      if (formData.id) {
        await vehicleApi.update(formData.id, {
          make: formData.make, model: formData.model, year: formData.year,
          type: formData.type, region: formData.region,
          maxLoadCapacityKg: formData.capacity, status: formData.status,
        });
        showToast(`Vehicle ${formData.regNumber} updated successfully!`);
      } else {
        await vehicleApi.create({
          registrationNumber: formData.regNumber,
          make: formData.make, model: formData.model, year: formData.year,
          type: formData.type, region: formData.region,
          maxLoadCapacityKg: formData.capacity,
          purchaseCost: formData.purchaseCost ?? 0,
        });
        showToast(`Vehicle ${formData.regNumber} registered successfully!`);
      }
      await loadVehicles();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    try {
      await vehicleApi.delete(deleteConfirmationId);
      showToast('Vehicle deleted successfully.');
      await loadVehicles();
    } catch (err) {
      showToast(`Cannot delete: ${err.message}`);
    }
    setDeleteConfirmationId(null);
    setIsDrawerOpen(false);
  };

  const handleScheduleMaintenance = async (vh) => {
    try {
      await vehicleApi.update(vh.id, { status: 'IN_SHOP' });
      showToast(`Maintenance scheduled for ${vh.regNumber}!`);
      await loadVehicles();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0F1115] text-white flex font-sans selection:bg-[#F59E0B]/20 antialiased overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        {toast && (
          <div className="fixed top-20 right-6 z-50 p-4 bg-[#171A21] border border-[#2B3038] text-white text-xs font-bold rounded-xl shadow-2xl flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#22C55E]" />
            <span>{toast}</span>
          </div>
        )}

        {deleteConfirmationId !== null && (
          <>
            <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirmationId(null)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-[#15181E] border border-[#2B3038] rounded-xl p-5 max-w-sm w-full text-left shadow-2xl">
                <div className="flex items-center gap-3 text-red-400">
                  <AlertTriangle size={20} />
                  <h4 className="font-bold text-white text-sm">Delete Fleet Asset?</h4>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-2 font-medium leading-relaxed">
                  This action is permanent and will remove all corresponding operational history.
                </p>
                <div className="flex items-center justify-end gap-3 mt-5 text-xs font-bold">
                  <button onClick={() => setDeleteConfirmationId(null)}
                    className="px-4 py-2 border border-[#2B3038] bg-[#0F1115] text-[#9CA3AF] hover:text-white rounded-lg cursor-pointer">Cancel</button>
                  <button onClick={confirmDelete}
                    className="px-4 py-2 bg-[#EF4444] hover:bg-red-600 text-white rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-500/10">
                    <Trash2 size={14} /><span>Delete Asset</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">Vehicle Registry</h1>
              <p className="text-sm text-[#9CA3AF] mt-1.5 font-medium">Manage, monitor and organize all fleet vehicles.</p>
            </div>
            {canWrite && (
              <button onClick={() => { setEditVehicle(null); setIsModalOpen(true); }}
                className="h-11 px-5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#F59E0B]/10 hover:-translate-y-0.5 active:scale-95 self-start sm:self-auto">
                <Plus size={16} /><span>Register Vehicle</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40 gap-2 text-[#9CA3AF]">
              <Loader2 size={22} className="animate-spin" /><span className="text-sm font-medium">Loading fleet data...</span>
            </div>
          ) : apiError ? (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm">{apiError}</div>
          ) : (
            <>
              <VehicleSummaryCards stats={statsSummary} />
              <VehicleFilters onFilterChange={(f) => { setFilters(f); setCurrentPage(1); }}
                onRefresh={loadVehicles} onExportPDF={() => window.print()} />

              {filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
                  <div className="xl:col-span-3 space-y-5">
                    <VehicleTable vehicles={paginatedVehicles}
                      onView={(vh) => { setSelectedVehicle(vh); setIsDrawerOpen(true); }}
                      onEdit={(vh) => { setEditVehicle(vh); setIsModalOpen(true); setIsDrawerOpen(false); }}
                      onMaintenance={handleScheduleMaintenance}
                      onDelete={(vh) => setDeleteConfirmationId(vh.id)}
                      onSort={(key, dir) => setSortConfig({ key, direction: dir })}
                      sortConfig={sortConfig} />
                    <Pagination currentPage={currentPage} totalPages={totalPages}
                      totalItems={filteredVehicles.length} pageSize={pageSize}
                      onPageChange={setCurrentPage}
                      onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }} />
                  </div>

                  <div className="xl:col-span-1 space-y-5">
                    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl text-left space-y-5">
                      <div>
                        <h4 className="text-sm font-bold text-white">Quick Insights</h4>
                        <p className="text-[10px] text-[#9CA3AF] mt-1 font-semibold">Real-time fleet analytics.</p>
                      </div>
                      {pieData.length > 0 && (
                        <div className="h-28 flex items-center justify-between border-b border-[#2B3038] pb-4">
                          <div className="w-1/2 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={2} dataKey="value">
                                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                              </Pie></PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="w-1/2 flex flex-col gap-1 justify-center">
                            {pieData.map((d, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[9px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                                <span className="text-[#9CA3AF]">{d.name}:</span>
                                <span className="text-white ml-auto font-mono">{d.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        {Object.entries(typeCounts).map(([type, count]) => (
                          <div key={type} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-semibold text-white">
                              <span>{type}</span><span className="font-mono">{count}</span>
                            </div>
                            <div className="h-1.5 bg-[#0F1115] rounded-full overflow-hidden border border-[#2B3038]/30">
                              <div className="h-full bg-[#F59E0B] rounded-full transition-all duration-500"
                                style={{ width: `${vehicles.length > 0 ? (count / vehicles.length) * 100 : 0}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2.5 text-[11px] font-semibold">
                        <div className="flex justify-between">
                          <span className="text-[#9CA3AF]">Avg Odometer</span>
                          <span className="text-white font-mono">{new Intl.NumberFormat('en-IN').format(insights.avgOdo)} km</span>
                        </div>
                      </div>
                    </div>
                    <BusinessRulesCard />
                  </div>
                </div>
              ) : <EmptyState onRegister={() => { setEditVehicle(null); setIsModalOpen(true); }} />}
            </>
          )}
        </main>
      </div>

      <VehicleDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}
        vehicle={selectedVehicle} onEdit={(vh) => { setEditVehicle(vh); setIsModalOpen(true); setIsDrawerOpen(false); }} />
      <VehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        vehicle={editVehicle} onSave={handleSaveVehicle} existingVehicles={vehicles} />
    </div>
  );
}
