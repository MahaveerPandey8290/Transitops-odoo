import React, { useState } from 'react';
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
import { Settings as SettingsIcon, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 1. Core State: Permission Matrix data rows
  const [matrix, setMatrix] = useState([
    { id: 1, role: 'Fleet Manager', code: 'ROLE_FLEET_MGR', dashboard: 'Full', fleet: 'Full', drivers: 'View', trips: 'View', maintenance: 'Full', fuel: 'View', analytics: 'Full', settings: 'View' },
    { id: 2, role: 'Dispatcher', code: 'ROLE_DISPATCHER', dashboard: 'Full', fleet: 'View', drivers: 'View', trips: 'Full', maintenance: 'None', fuel: 'None', analytics: 'View', settings: 'None' },
    { id: 3, role: 'Safety Officer', code: 'ROLE_SAFETY_OFF', dashboard: 'Full', fleet: 'View', drivers: 'Full', trips: 'View', maintenance: 'View', fuel: 'None', analytics: 'View', settings: 'None' },
    { id: 4, role: 'Financial Analyst', code: 'ROLE_FIN_ANALYST', dashboard: 'Full', fleet: 'None', drivers: 'None', trips: 'None', maintenance: 'None', fuel: 'Full', analytics: 'Full', settings: 'None' }
  ]);

  // 2. Active Interactivity UI States
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handlePermissionChange = (roleId, moduleKey, nextVal) => {
    setMatrix(prev => prev.map(row => {
      if (row.id === roleId) {
        return { ...row, [moduleKey]: nextVal };
      }
      return row;
    }));
    showToast('Permission matrix updated locally.');
  };

  const handleGeneralSave = (data) => {
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = () => {
    setShowSaveConfirm(false);
    showToast('All configuration modifications saved successfully!');
  };

  const handleReset = () => {
    showToast('Settings reverted back to default values.');
  };

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
              <p className="text-xs md:text-sm text-[#9CA3AF] mt-1 font-medium">Configure organization settings, fleet preferences and user permissions.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="h-10 px-4.5 bg-[#171A21] hover:bg-[#2B3038] border border-[#2B3038] text-[#9CA3AF] hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={handleConfirmSave}
                className="h-10 px-5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#F59E0B]/10 hover:-translate-y-0.5"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Split Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column: Forms */}
            <div className="space-y-6">
              
              {/* General Settings form */}
              <GeneralSettingsCard 
                onSave={handleGeneralSave} 
                onReset={handleReset} 
              />

              {/* Corporate Organization profile form */}
              <OrganizationCard 
                onSave={handleGeneralSave} 
                onReset={handleReset} 
              />

              {/* Preferences toggles */}
              <SystemPreferences 
                onSave={(prefs) => {
                  showToast('Preferences saved successfully!');
                }} 
              />

              {/* Security parameters */}
              <SecuritySettings 
                onSave={(sec) => {
                  showToast('Security policy settings applied.');
                }} 
              />
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
