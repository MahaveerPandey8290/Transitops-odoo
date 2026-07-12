import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { tripApi, vehicleApi, driverApi, getStoredUser } from "../api/client";
import { Plus, CheckCircle2, Loader2, AlertTriangle, Send, XCircle, Flag } from "lucide-react";

const STATUS_COLORS = {
  DRAFT:      { text: 'text-[#9CA3AF]',  bg: 'bg-[#9CA3AF]/10',  border: 'border-[#9CA3AF]/20',  label: 'Draft' },
  DISPATCHED: { text: 'text-[#3B82F6]',  bg: 'bg-[#3B82F6]/10',  border: 'border-[#3B82F6]/20',  label: 'Dispatched' },
  COMPLETED:  { text: 'text-[#22C55E]',  bg: 'bg-[#22C55E]/10',  border: 'border-[#22C55E]/20',  label: 'Completed' },
  CANCELLED:  { text: 'text-[#EF4444]',  bg: 'bg-[#EF4444]/10',  border: 'border-[#EF4444]/20',  label: 'Cancelled' },
};

export default function TripDispatcher() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const user = getStoredUser();
  // Fleet Manager has full trip access; Dispatcher runs day-to-day ops; Safety Officer view-only
  const canWrite = user?.role === 'FLEET_MANAGER' || user?.role === 'DISPATCHER';

  // ── Data ──────────────────────────────────────────────────────────────────
  const [trips, setTrips] = useState([]);
  const [availVehicles, setAvailVehicles] = useState([]);
  const [availDrivers, setAvailDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // tripId being acted on
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const loadTrips = useCallback(async () => {
    setLoading(true);
    try {
      const [tripsRes, vRes, dRes] = await Promise.all([
        tripApi.list({ limit: 50 }),
        vehicleApi.available(),
        driverApi.available(),
      ]);
      setTrips(tripsRes.data?.trips ?? []);
      setAvailVehicles(vRes.data ?? []);
      setAvailDrivers(dRes.data ?? []);
    } catch (err) {
      showToast(`Load error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTrips(); }, [loadTrips]);

  // ── New Trip form ─────────────────────────────────────────────────────────
  const emptyForm = {
    vehicleId: '', driverId: '', origin: '', destination: '',
    cargoWeightKg: '', plannedDistanceKm: '', revenue: '',
    scheduledAt: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
  };
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [creating, setCreating] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errs = {};
    if (!form.vehicleId)         errs.vehicleId = 'Select a vehicle';
    if (!form.driverId)          errs.driverId = 'Select a driver';
    if (!form.origin.trim())     errs.origin = 'Origin required';
    if (!form.destination.trim()) errs.destination = 'Destination required';
    if (!form.cargoWeightKg || Number(form.cargoWeightKg) <= 0) errs.cargoWeightKg = 'Enter cargo weight';
    if (!form.plannedDistanceKm || Number(form.plannedDistanceKm) <= 0) errs.plannedDistanceKm = 'Enter distance';
    if (!form.revenue || Number(form.revenue) <= 0) errs.revenue = 'Enter revenue';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    setCreating(true);
    try {
      await tripApi.create({
        vehicleId: form.vehicleId,
        driverId: form.driverId,
        origin: form.origin,
        destination: form.destination,
        cargoWeightKg: Number(form.cargoWeightKg),
        plannedDistanceKm: Number(form.plannedDistanceKm),
        revenue: Number(form.revenue),
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      });
      showToast('Trip created!');
      setForm(emptyForm);
      await loadTrips();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  // ── Trip lifecycle actions ─────────────────────────────────────────────────
  const handleDispatch = async (tripId) => {
    setActionLoading(tripId);
    try { await tripApi.dispatch(tripId); await loadTrips(); showToast('Trip dispatched!'); }
    catch (err) { showToast(`Error: ${err.message}`); }
    finally { setActionLoading(null); }
  };

  const handleComplete = async (tripId) => {
    setActionLoading(tripId);
    try {
      // Complete requires odometer and fuel data — we use minimal defaults for quick demo
      await tripApi.complete(tripId, { actualDistanceKm: 0, fuelUsedLiters: 0 });
      await loadTrips(); showToast('Trip completed!');
    } catch (err) { showToast(`Error: ${err.message}`); }
    finally { setActionLoading(null); }
  };

  const handleCancel = async (tripId) => {
    setActionLoading(tripId);
    try { await tripApi.cancel(tripId); await loadTrips(); showToast('Trip cancelled.'); }
    catch (err) { showToast(`Error: ${err.message}`); }
    finally { setActionLoading(null); }
  };

  return (
    <div className="h-screen w-screen bg-[#0F1115] text-white flex font-sans antialiased overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        {toast && (
          <div className="fixed top-20 right-6 z-50 p-4 bg-[#171A21] border border-[#2B3038] text-white text-xs font-bold rounded-xl shadow-2xl flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#22C55E]" /><span>{toast}</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
          {/* Header */}
          <div className="text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Trip Dispatcher</h1>
            <p className="text-sm text-[#9CA3AF] mt-1.5 font-medium">
              Create, dispatch, and manage trips in real-time.
              {!canWrite && <span className="ml-2 text-amber-400 font-semibold">⚠ View-only — no write access for your role.</span>}
            </p>
          </div>

          {/* Create Trip Form — Dispatcher only */}
          {canWrite && (
            <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-6 text-left">
              <h2 className="text-base font-bold text-white mb-5">Dispatch New Trip</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Vehicle */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Vehicle *</label>
                  <select name="vehicleId" value={form.vehicleId} onChange={handleFormChange}
                    className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors cursor-pointer">
                    <option value="">Select Vehicle</option>
                    {availVehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.registrationNumber} — {v.make} {v.model}</option>
                    ))}
                  </select>
                  {formErrors.vehicleId && <p className="text-[10px] text-red-400">{formErrors.vehicleId}</p>}
                </div>

                {/* Driver */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Driver *</label>
                  <select name="driverId" value={form.driverId} onChange={handleFormChange}
                    className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors cursor-pointer">
                    <option value="">Select Driver</option>
                    {availDrivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name} — {d.licenseCategory}</option>
                    ))}
                  </select>
                  {formErrors.driverId && <p className="text-[10px] text-red-400">{formErrors.driverId}</p>}
                </div>

                {/* Origin */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Origin *</label>
                  <input type="text" name="origin" value={form.origin} onChange={handleFormChange}
                    placeholder="e.g. Jaipur Depot"
                    className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors" />
                  {formErrors.origin && <p className="text-[10px] text-red-400">{formErrors.origin}</p>}
                </div>

                {/* Destination */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Destination *</label>
                  <input type="text" name="destination" value={form.destination} onChange={handleFormChange}
                    placeholder="e.g. Mumbai Hub"
                    className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors" />
                  {formErrors.destination && <p className="text-[10px] text-red-400">{formErrors.destination}</p>}
                </div>

                {/* Cargo Weight */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Cargo Weight (kg) *</label>
                  <input type="number" name="cargoWeightKg" value={form.cargoWeightKg} onChange={handleFormChange}
                    placeholder="e.g. 5000"
                    className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors" />
                  {formErrors.cargoWeightKg && <p className="text-[10px] text-red-400">{formErrors.cargoWeightKg}</p>}
                </div>

                {/* Distance */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Distance (km) *</label>
                  <input type="number" name="plannedDistanceKm" value={form.plannedDistanceKm} onChange={handleFormChange}
                    placeholder="e.g. 450"
                    className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors" />
                  {formErrors.plannedDistanceKm && <p className="text-[10px] text-red-400">{formErrors.plannedDistanceKm}</p>}
                </div>

                {/* Revenue */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Revenue (₹) *</label>
                  <input type="number" name="revenue" value={form.revenue} onChange={handleFormChange}
                    placeholder="e.g. 12000"
                    className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors" />
                  {formErrors.revenue && <p className="text-[10px] text-red-400">{formErrors.revenue}</p>}
                </div>

                {/* Scheduled At */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Scheduled At</label>
                  <input type="datetime-local" name="scheduledAt" value={form.scheduledAt} onChange={handleFormChange}
                    className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors" />
                </div>
              </div>

              <button onClick={handleCreate} disabled={creating}
                className="mt-6 h-11 px-6 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-[#F59E0B]/10 hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-60">
                {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                <span>{creating ? 'Creating...' : 'Create Trip'}</span>
              </button>
            </div>
          )}

          {/* Trips Table */}
          <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-6 text-left">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white">All Trips</h2>
              <button onClick={loadTrips} className="text-xs text-[#9CA3AF] hover:text-white transition-colors font-semibold">
                ↻ Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-32 gap-2 text-[#9CA3AF]">
                <Loader2 size={20} className="animate-spin" /><span className="text-sm">Loading trips...</span>
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-12 text-[#9CA3AF] text-sm font-medium">No trips yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-[#2B3038] text-[#9CA3AF] text-left">
                      <th className="pb-3 pr-4">Origin → Destination</th>
                      <th className="pb-3 px-4">Vehicle</th>
                      <th className="pb-3 px-4">Driver</th>
                      <th className="pb-3 px-4">Distance</th>
                      <th className="pb-3 px-4">Revenue</th>
                      <th className="pb-3 px-4">Status</th>
                      {canWrite && <th className="pb-3 pl-4">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B3038]/50">
                    {trips.map((trip) => {
                      const sc = STATUS_COLORS[trip.status] ?? STATUS_COLORS.DRAFT;
                      const isActing = actionLoading === trip.id;
                      return (
                        <tr key={trip.id} className="text-white hover:bg-[#121419]/30 transition-colors">
                          <td className="py-4 pr-4">
                            <div>{trip.origin}</div>
                            <div className="text-[#9CA3AF] text-[10px]">→ {trip.destination}</div>
                          </td>
                          <td className="py-4 px-4 text-[#9CA3AF]">{trip.vehicle?.registrationNumber ?? '—'}</td>
                          <td className="py-4 px-4 text-[#9CA3AF]">{trip.driver?.name ?? '—'}</td>
                          <td className="py-4 px-4">{trip.plannedDistanceKm} km</td>
                          <td className="py-4 px-4">₹{Number(trip.revenue).toLocaleString('en-IN')}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>
                              {sc.label}
                            </span>
                          </td>
                          {canWrite && (
                            <td className="py-4 pl-4">
                              <div className="flex items-center gap-2">
                                {trip.status === 'DRAFT' && (
                                  <button onClick={() => handleDispatch(trip.id)} disabled={isActing}
                                    title="Dispatch" className="p-1.5 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 transition-colors disabled:opacity-40">
                                    {isActing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                  </button>
                                )}
                                {trip.status === 'DISPATCHED' && (
                                  <button onClick={() => handleComplete(trip.id)} disabled={isActing}
                                    title="Complete" className="p-1.5 rounded-lg bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20 transition-colors disabled:opacity-40">
                                    {isActing ? <Loader2 size={14} className="animate-spin" /> : <Flag size={14} />}
                                  </button>
                                )}
                                {(trip.status === 'DRAFT' || trip.status === 'DISPATCHED') && (
                                  <button onClick={() => handleCancel(trip.id)} disabled={isActing}
                                    title="Cancel" className="p-1.5 rounded-lg bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 transition-colors disabled:opacity-40">
                                    {isActing ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}