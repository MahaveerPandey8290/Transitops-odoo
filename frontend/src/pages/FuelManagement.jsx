import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { fuelApi, vehicleApi, getStoredUser } from "../api/client";
import { Fuel, Plus, CheckCircle2, Loader2, X, Receipt } from "lucide-react";

const EXPENSE_CATEGORIES = ['TOLL', 'PARKING', 'FINE', 'REPAIR', 'OTHER'];

export default function FuelManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const user = getStoredUser();
  const canWrite = user?.role === 'FINANCIAL_ANALYST';

  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('fuel');
  const [showForm, setShowForm] = useState(false);

  const emptyFuel = { vehicleId: '', liters: '', pricePerLiter: '', odometer: '' };
  const emptyExp  = { category: 'TOLL', amount: '', description: '', occurredAt: new Date().toISOString().slice(0, 10) };
  const [fuelForm, setFuelForm] = useState(emptyFuel);
  const [expForm, setExpForm] = useState(emptyExp);
  const [creating, setCreating] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [fl, ex, vRes] = await Promise.all([
        fuelApi.listFuelLogs({ limit: 50 }),
        fuelApi.listExpenses({ limit: 50 }),
        vehicleApi.list({ limit: 100 }),
      ]);
      setFuelLogs(fl.data?.fuelLogs ?? []);
      setExpenses(ex.data?.expenses ?? []);
      setVehicles(vRes.data?.vehicles ?? []);
    } catch (err) {
      showToast(`Load error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleFuelSubmit = async () => {
    if (!fuelForm.vehicleId || !fuelForm.liters || !fuelForm.pricePerLiter) {
      showToast('Vehicle, liters and price are required.'); return;
    }
    setCreating(true);
    try {
      await fuelApi.createFuelLog({
        vehicleId: fuelForm.vehicleId,
        liters: Number(fuelForm.liters),
        pricePerLiter: Number(fuelForm.pricePerLiter),
        odometer: fuelForm.odometer ? Number(fuelForm.odometer) : undefined,
      });
      showToast('Fuel log added!');
      setFuelForm(emptyFuel);
      setShowForm(false);
      await load();
    } catch (err) { showToast(`Error: ${err.message}`); }
    finally { setCreating(false); }
  };

  const handleExpSubmit = async () => {
    if (!expForm.amount || !expForm.description.trim()) {
      showToast('Amount and description required.'); return;
    }
    setCreating(true);
    try {
      await fuelApi.createExpense({
        category: expForm.category,
        amount: Number(expForm.amount),
        description: expForm.description,
        occurredAt: new Date(expForm.occurredAt).toISOString(),
      });
      showToast('Expense logged!');
      setExpForm(emptyExp);
      setShowForm(false);
      await load();
    } catch (err) { showToast(`Error: ${err.message}`); }
    finally { setCreating(false); }
  };

  // Summary stats
  const totalFuelCost = fuelLogs.reduce((s, l) => s + Number(l.totalCost ?? 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount ?? 0), 0);
  const totalLiters   = fuelLogs.reduce((s, l) => s + Number(l.liters ?? 0), 0);

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
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Fuel & Expenses</h1>
              <p className="text-sm text-[#9CA3AF] mt-1.5 font-medium">Track vehicle fuel consumption and operational expenses.</p>
            </div>
            {canWrite && (
              <button onClick={() => setShowForm(!showForm)}
                className="h-11 px-5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#F59E0B]/10 hover:-translate-y-0.5">
                {showForm ? <><X size={16} /><span>Cancel</span></> : <><Plus size={16} /><span>Add Entry</span></>}
              </button>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Fuel Cost', value: `₹${totalFuelCost.toLocaleString('en-IN')}`, icon: Fuel, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
              { label: 'Total Liters', value: `${totalLiters.toFixed(1)} L`, icon: Fuel, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10' },
              { label: 'Other Expenses', value: `₹${totalExpenses.toLocaleString('en-IN')}`, icon: Receipt, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
            ].map((c, i) => (
              <div key={i} className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl flex items-center gap-4">
                <div className={`p-3 rounded-xl ${c.bg}`}><c.icon size={20} className={c.color} /></div>
                <div>
                  <p className="text-xs text-[#9CA3AF] font-bold">{c.label}</p>
                  <p className="text-xl font-extrabold text-white mt-0.5">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Create Form */}
          {showForm && canWrite && (
            <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-6 text-left">
              {/* Form type toggle */}
              <div className="flex gap-3 mb-5">
                <button onClick={() => setActiveTab('fuel')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'fuel' ? 'bg-[#F59E0B] text-white' : 'bg-[#0F1115] text-[#9CA3AF] border border-[#2B3038]'}`}>
                  Fuel Log
                </button>
                <button onClick={() => setActiveTab('expense')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'expense' ? 'bg-[#F59E0B] text-white' : 'bg-[#0F1115] text-[#9CA3AF] border border-[#2B3038]'}`}>
                  Expense
                </button>
              </div>

              {activeTab === 'fuel' ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Vehicle *</label>
                    <select value={fuelForm.vehicleId} onChange={e => setFuelForm(p => ({ ...p, vehicleId: e.target.value }))}
                      className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] cursor-pointer">
                      <option value="">Select Vehicle</option>
                      {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Liters *</label>
                    <input type="number" value={fuelForm.liters} onChange={e => setFuelForm(p => ({ ...p, liters: e.target.value }))}
                      placeholder="e.g. 60"
                      className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Price/Liter *</label>
                    <input type="number" value={fuelForm.pricePerLiter} onChange={e => setFuelForm(p => ({ ...p, pricePerLiter: e.target.value }))}
                      placeholder="e.g. 97.5"
                      className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Odometer (km)</label>
                    <input type="number" value={fuelForm.odometer} onChange={e => setFuelForm(p => ({ ...p, odometer: e.target.value }))}
                      placeholder="e.g. 25000"
                      className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B]" />
                  </div>
                  <button onClick={handleFuelSubmit} disabled={creating}
                    className="md:col-span-4 h-10 px-6 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60">
                    {creating ? <Loader2 size={14} className="animate-spin" /> : <Fuel size={14} />}
                    <span>{creating ? 'Saving...' : 'Log Fuel Fill'}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Category *</label>
                    <select value={expForm.category} onChange={e => setExpForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B] cursor-pointer">
                      {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Amount (₹) *</label>
                    <input type="number" value={expForm.amount} onChange={e => setExpForm(p => ({ ...p, amount: e.target.value }))}
                      placeholder="e.g. 500"
                      className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Description *</label>
                    <input type="text" value={expForm.description} onChange={e => setExpForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="e.g. NH8 toll booth"
                      className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Date *</label>
                    <input type="date" value={expForm.occurredAt} onChange={e => setExpForm(p => ({ ...p, occurredAt: e.target.value }))}
                      className="w-full h-11 px-4 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-xs font-semibold outline-none focus:border-[#F59E0B]" />
                  </div>
                  <button onClick={handleExpSubmit} disabled={creating}
                    className="md:col-span-4 h-10 px-6 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60">
                    {creating ? <Loader2 size={14} className="animate-spin" /> : <Receipt size={14} />}
                    <span>{creating ? 'Saving...' : 'Log Expense'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-3 border-b border-[#2B3038] pb-0">
            {[['fuel', 'Fuel Logs'], ['expense', 'Expenses']].map(([tab, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 text-xs font-bold transition-colors border-b-2 ${activeTab === tab ? 'border-[#F59E0B] text-[#F59E0B]' : 'border-transparent text-[#9CA3AF] hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Data Table */}
          <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-6 text-left">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white">{activeTab === 'fuel' ? 'Fuel Fill History' : 'Expense Records'}</h2>
              <button onClick={load} className="text-xs text-[#9CA3AF] hover:text-white font-semibold">↻ Refresh</button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-32 gap-2 text-[#9CA3AF]">
                <Loader2 size={20} className="animate-spin" /><span className="text-sm">Loading...</span>
              </div>
            ) : activeTab === 'fuel' ? (
              fuelLogs.length === 0 ? (
                <div className="text-center py-10 text-[#9CA3AF] text-sm">No fuel logs yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-semibold">
                    <thead>
                      <tr className="border-b border-[#2B3038] text-[#9CA3AF] text-left">
                        <th className="pb-3 pr-4">Vehicle</th>
                        <th className="pb-3 px-4">Liters</th>
                        <th className="pb-3 px-4">Price/L</th>
                        <th className="pb-3 px-4">Total Cost</th>
                        <th className="pb-3 pl-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2B3038]/50">
                      {fuelLogs.map(log => (
                        <tr key={log.id} className="text-white hover:bg-[#121419]/30 transition-colors">
                          <td className="py-3 pr-4">{log.vehicle?.registrationNumber ?? '—'}</td>
                          <td className="py-3 px-4">{Number(log.liters).toFixed(1)} L</td>
                          <td className="py-3 px-4">₹{Number(log.pricePerLiter).toFixed(2)}</td>
                          <td className="py-3 px-4 text-[#F59E0B] font-bold">₹{Number(log.totalCost ?? 0).toLocaleString('en-IN')}</td>
                          <td className="py-3 pl-4 text-[#9CA3AF]">{new Date(log.createdAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              expenses.length === 0 ? (
                <div className="text-center py-10 text-[#9CA3AF] text-sm">No expenses yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-semibold">
                    <thead>
                      <tr className="border-b border-[#2B3038] text-[#9CA3AF] text-left">
                        <th className="pb-3 pr-4">Category</th>
                        <th className="pb-3 px-4">Description</th>
                        <th className="pb-3 px-4">Amount</th>
                        <th className="pb-3 pl-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2B3038]/50">
                      {expenses.map(exp => (
                        <tr key={exp.id} className="text-white hover:bg-[#121419]/30 transition-colors">
                          <td className="py-3 pr-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#9CA3AF]/10 text-[#9CA3AF] border border-[#9CA3AF]/20">{exp.category}</span>
                          </td>
                          <td className="py-3 px-4 text-[#9CA3AF]">{exp.description}</td>
                          <td className="py-3 px-4 text-[#22C55E] font-bold">₹{Number(exp.amount).toLocaleString('en-IN')}</td>
                          <td className="py-3 pl-4 text-[#9CA3AF]">{new Date(exp.occurredAt ?? exp.createdAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}