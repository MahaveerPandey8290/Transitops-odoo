import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import GeneralSettingsCard from '../components/GeneralSettingsCard';
import OrganizationCard from '../components/OrganizationCard';
import SystemPreferences from '../components/SystemPreferences';
import SecuritySettings from '../components/SecuritySettings';
import PermissionMatrix from '../components/PermissionMatrix';
import RoleCards from '../components/RoleCards';
import AuditTimeline from '../components/AuditTimeline';
import NotificationSettings from '../components/NotificationSettings';
import SystemHealthCard from '../components/SystemHealthCard';
import SettingsBusinessRulesCard from '../components/SettingsBusinessRulesCard';
import { Settings as SettingsIcon, AlertTriangle, CheckCircle2, Users, Loader2, ShieldCheck } from 'lucide-react';
import { userApi, getStoredUser } from '../api/client';

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const currentUser = getStoredUser();
  const isFleetManager = currentUser?.role === 'FLEET_MANAGER';

  // ── Users tab state (Fleet Manager only) ───────────────────────────────────
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [rolePatching, setRolePatching] = useState(null); // userId being patched

  // ── Permission matrix (local UI state, no backend endpoint needed) ─────────
  const [matrix, setMatrix] = useState([
    { id: 1, role: 'Fleet Manager',    code: 'ROLE_FLEET_MGR',    dashboard: 'Full', fleet: 'Full', drivers: 'View', trips: 'View', maintenance: 'Full', fuel: 'View',  analytics: 'Full', settings: 'Full' },
    { id: 2, role: 'Dispatcher',       code: 'ROLE_DISPATCHER',   dashboard: 'Full', fleet: 'View', drivers: 'None', trips: 'Full', maintenance: 'View', fuel: 'None',  analytics: 'None', settings: 'None' },
    { id: 3, role: 'Safety Officer',   code: 'ROLE_SAFETY_OFF',   dashboard: 'Full', fleet: 'None', drivers: 'Full', trips: 'View', maintenance: 'Full', fuel: 'None',  analytics: 'None', settings: 'None' },
    { id: 4, role: 'Financial Analyst',code: 'ROLE_FIN_ANALYST',  dashboard: 'Full', fleet: 'View', drivers: 'None', trips: 'None', maintenance: 'View', fuel: 'Full',  analytics: 'Full', settings: 'None' },
  ]);

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Load users (FM only)
  const loadUsers = useCallback(async () => {
    if (!isFleetManager) return;
    setUsersLoading(true);
    try {
      const res = await userApi.list();
      setUsers(res.data?.users ?? res.data ?? []);
    } catch (err) {
      showToast(`Users load error: ${err.message}`);
    } finally {
      setUsersLoading(false);
    }
  }, [isFleetManager]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleRoleChange = async (userId, newRole) => {
    setRolePatching(userId);
    try {
      await userApi.updateRole(userId, newRole);
      showToast('Role updated successfully!');
      await loadUsers();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setRolePatching(null);
    }
  };

  const handlePermissionChange = (roleId, moduleKey, nextVal) => {
    setMatrix(prev => prev.map(row => row.id === roleId ? { ...row, [moduleKey]: nextVal } : row));
    showToast('Permission matrix updated locally.');
  };

  const handleConfirmSave = () => {
    setShowSaveConfirm(false);
    showToast('Configuration saved successfully!');
  };

  const handleReset = () => showToast('Settings reverted to defaults.');

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
        
        {/* Top Navigation */}
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Global Toast Alerts */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 p-4 bg-[#171A21] border border-[#2B3038] text-white text-xs font-bold rounded-xl shadow-2xl animate-[fadeInRight_0.4s_ease-out_forwards] flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#22C55E]" />
            <span>{toast}</span>
          </div>
        )}

        {/* Save Confirmation Dialog Modal */}
        {showSaveConfirm && (
          <>
            <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setShowSaveConfirm(false)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-[#15181E] border border-[#2B3038] rounded-xl p-5 max-w-sm w-full text-left shadow-2xl animate-fade-in">
                <div className="flex items-center gap-3 text-[#F59E0B]">
                  <AlertTriangle size={20} />
                  <h4 className="font-bold text-white text-sm">Save Modifications?</h4>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-2 font-medium leading-relaxed">
                  Are you sure you want to write these modifications to the database? System configurations and session timings will be updated immediately.
                </p>
                <div className="flex items-center justify-end gap-3 mt-5 text-xs font-bold">
                  <button 
                    onClick={() => setShowSaveConfirm(false)}
                    className="px-4 py-2 border border-[#2B3038] hover:border-slate-700 bg-[#0F1115] text-[#9CA3AF] hover:text-white rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmSave}
                    className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg cursor-pointer shadow-md shadow-[#F59E0B]/10"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Dynamic Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2B3038]/50 pb-5">
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">Settings</h1>
              <p className="text-sm text-[#9CA3AF] mt-1.5 font-medium max-w-2xl leading-relaxed">Configure organization settings, fleet preferences and user permissions.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleReset} className="h-10 px-4 bg-[#171A21] hover:bg-[#2B3038] border border-[#2B3038] text-[#9CA3AF] hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer">Reset</button>
              <button onClick={handleConfirmSave} className="h-10 px-5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#F59E0B]/10 hover:-translate-y-0.5">Save Changes</button>
            </div>
          </div>

          {/* ── Users Management (Fleet Manager only) ────────────────────── */}
          {isFleetManager && (
            <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-6 text-left">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#F59E0B]" />
                  <h2 className="text-sm font-bold text-white">User Management</h2>
                </div>
                <button onClick={loadUsers} className="text-xs text-[#9CA3AF] hover:text-white font-semibold">↻ Refresh</button>
              </div>

              {usersLoading ? (
                <div className="flex items-center gap-2 text-[#9CA3AF] text-sm py-4">
                  <Loader2 size={16} className="animate-spin" /><span>Loading users...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-semibold">
                    <thead>
                      <tr className="border-b border-[#2B3038] text-[#9CA3AF] text-left">
                        <th className="pb-3 pr-4">Name</th>
                        <th className="pb-3 px-4">Email</th>
                        <th className="pb-3 px-4">Current Role</th>
                        <th className="pb-3 pl-4">Change Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2B3038]/50">
                      {users.map(u => (
                        <tr key={u.id} className="text-white hover:bg-[#121419]/30 transition-colors">
                          <td className="py-3 pr-4 font-bold">{u.name}</td>
                          <td className="py-3 px-4 text-[#9CA3AF]">{u.email}</td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                              {u.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 pl-4">
                            {u.id === currentUser?.id ? (
                              <span className="text-[#9CA3AF] text-[10px]">You</span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <select
                                  defaultValue={u.role}
                                  onChange={e => handleRoleChange(u.id, e.target.value)}
                                  disabled={rolePatching === u.id}
                                  className="h-8 px-3 border border-[#2B3038] bg-[#0F1115] text-white rounded-lg text-[10px] font-bold outline-none focus:border-[#F59E0B] cursor-pointer disabled:opacity-50">
                                  <option value="FLEET_MANAGER">Fleet Manager</option>
                                  <option value="DISPATCHER">Dispatcher</option>
                                  <option value="SAFETY_OFFICER">Safety Officer</option>
                                  <option value="FINANCIAL_ANALYST">Financial Analyst</option>
                                </select>
                                {rolePatching === u.id && <Loader2 size={12} className="animate-spin text-[#F59E0B]" />}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && <p className="text-[#9CA3AF] text-xs text-center py-6">No users found.</p>}
                </div>
              )}
            </div>
          )}

          {/* Split Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column: Forms */}
            <div className="space-y-6">
              <GeneralSettingsCard onSave={() => setShowSaveConfirm(true)} onReset={handleReset} />
              <OrganizationCard    onSave={() => setShowSaveConfirm(true)} onReset={handleReset} />
              <SystemPreferences  onSave={() => showToast('Preferences saved!')} />
              <SecuritySettings   onSave={() => showToast('Security policy applied.')} />
            </div>

            {/* Right Column: RBAC & Telemetry widgets */}
            <div className="space-y-6">
              
              {/* Permission Matrix grid */}
              <PermissionMatrix 
                matrixData={matrix} 
                onChangePermission={handlePermissionChange} 
              />

              {/* Role Cards list */}
              <RoleCards />

              {/* Security Alerts / Audit logs timeline */}
              <AuditTimeline />

              {/* Alert notifications toggles */}
              <NotificationSettings 
                onSave={(alerts) => {
                  showToast('Email alert preferences updated.');
                }} 
              />

              {/* System telemetry grid details */}
              <SystemHealthCard />

              {/* RBAC constraints description card */}
              <SettingsBusinessRulesCard />
            </div>

          </div>

        </main>
      </div>

    </div>
  );
}
