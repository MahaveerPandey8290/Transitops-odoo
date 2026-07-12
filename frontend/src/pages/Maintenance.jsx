import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { maintenanceApi, vehicleApi, getStoredUser } from "../api/client";
import { Wrench, Plus, CheckCircle, CheckCircle2, Loader2, X } from "lucide-react";

const STATUS = {
  OPEN:   { label: 'Open',   text: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/20' },
  CLOSED: { label: 'Closed', text: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10', border: 'border-[#22C55E]/20' },
};

export default function Maintenance() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const user = getStoredUser();
  const canWrite = user?.role === 'FLEET_MANAGER' || user?.role === 'SAFETY_OFFICER';

  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ vehicleId: '', description: '', cost: '' });
  const [creating, setCreating] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [logsRes, vRes] = await Promise.all([
        maintenanceApi.list({ limit: 50 }),
        vehicleApi.list({ limit: 100 }),
      ]);
      setLogs(logsRes.data?.logs ?? []);
      setVehicles(vRes.data?.vehicles ?? []);
    } catch (err) {
      showToast(`Load error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!form.vehicleId || !form.description.trim()) {
      showToast('Vehicle and description are required.'); return;
    }
    setCreating(true);
    try {
      await maintenanceApi.create({
        vehicleId: form.vehicleId,
        description: form.description,
        cost: form.cost ? Number(form.cost) : undefined,
      });
      showToast('Maintenance log created!');
      setForm({ vehicleId: '', description: '', cost: '' });
      setShowForm(false);
      await load();
    } catch (err) { showToast(`Error: ${err.message}`); }
    finally { setCreating(false); }
  };

  const handleClose = async (id) => {
    try { await maintenanceApi.close(id); await load(); showToast('Log closed.'); }
    catch (err) { showToast(`Error: ${err.message}`); }
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Maintenance</h1>
              <p className="text-sm text-[#9CA3AF] mt-1.5 font-medium">Schedule vehicle maintenance and track service history.</p>
            </div>
            {canWrite && (
              <button onClick={() => setShowForm(!showForm)}
                className="h-11 px-5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#F59E0B]/10 hover:-translate-y-0.5">
                {showForm ? <><X size={16} /><span>Cancel</span></> : <><Plus size={16} /><span>Log Maintenance</span></>}
              </button>
            )}
          </div>

          {/* Create Form */}
          {showForm && canWrite && (
            <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-6 text-left">
              <h2 className="text-sm font-bold text-white mb-4">New Maintenance Log</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Vehicle *</label>
                  <select value={form.vehicleId} onChange={e => setForm(p => ({ ...p, vehicleId: e.target.value }))}
                    className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors cursor-pointer">
                    <option value="">Select Vehicle</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber} — {v.make} {v.model}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Description *</label>
                  <input type="text" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="e.g. Engine oil change, brake inspection"
                    className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Estimated Cost (₹)</label>
                  <input type="number" value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))}
                    placeholder="e.g. 5000"
                    className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] transition-colors" />
                </div>
              </div>
              <button onClick={handleCreate} disabled={creating}
                className="mt-5 h-10 px-6 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60">
                {creating ? <Loader2 size={14} className="animate-spin" /> : <Wrench size={14} />}
                <span>{creating ? 'Saving...' : 'Save Log'}</span>
              </button>
            </div>
          )}

          {/* Maintenance Logs Table */}
          <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-6 text-left">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white">Service Logs</h2>
              <button onClick={load} className="text-xs text-[#9CA3AF] hover:text-white font-semibold">↻ Refresh</button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-32 gap-2 text-[#9CA3AF]">
                <Loader2 size={20} className="animate-spin" /><span className="text-sm">Loading logs...</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12 text-[#9CA3AF] text-sm">No maintenance logs yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-[#2B3038] text-[#9CA3AF] text-left">
                      <th className="pb-3 pr-4">Vehicle</th>
                      <th className="pb-3 px-4">Description</th>
                      <th className="pb-3 px-4">Cost</th>
                      <th className="pb-3 px-4">Opened</th>
                      <th className="pb-3 px-4">Status</th>
                      {canWrite && <th className="pb-3 pl-4">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B3038]/50">
                    {logs.map(log => {
                      const sc = STATUS[log.status] ?? STATUS.OPEN;
                      return (
                        <tr key={log.id} className="text-white hover:bg-[#121419]/30 transition-colors">
                          <td className="py-4 pr-4">{log.vehicle?.registrationNumber ?? '—'}</td>
                          <td className="py-4 px-4 text-[#9CA3AF] max-w-[200px] truncate">{log.description}</td>
                          <td className="py-4 px-4">
                            {log.cost ? `₹${Number(log.cost).toLocaleString('en-IN')}` : '—'}
                          </td>
                          <td className="py-4 px-4 text-[#9CA3AF]">
                            {new Date(log.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>
                              {sc.label}
                            </span>
                          </td>
                          {canWrite && (
                            <td className="py-4 pl-4">
                              {log.status === 'OPEN' && (
                                <button onClick={() => handleClose(log.id)}
                                  title="Mark Closed"
                                  className="p-1.5 rounded-lg bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20 transition-colors">
                                  <CheckCircle size={14} />
                                </button>
                              )}
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