import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Check, Save } from 'lucide-react';

export default function SystemPreferences({ defaultValues, onSave }) {
  const [preferences, setPreferences] = useState(defaultValues || {
    emailNotifications: true,
    smsAlerts: false,
    autoAssignDriver: true,
    maintenanceReminder: true,
    darkTheme: true,
    analyticsEnabled: true,
    auditLogsEnabled: true,
    autoBackup: false
  });

  const togglePreference = (key) => {
    const newVal = !preferences[key];
    setPreferences(prev => ({ ...prev, [key]: newVal }));
  };

  const handleSave = () => {
    if (onSave) onSave(preferences);
  };

  const switchItems = [
    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send daily fleet operation digest and critical updates.' },
    { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Deliver instant SMS messages to drivers for dispatched trips.' },
    { key: 'autoAssignDriver', label: 'Auto Assign Driver', desc: 'Automatically match nearest available drivers to new trips.' },
    { key: 'maintenanceReminder', label: 'Maintenance Reminders', desc: 'Alert fleet managers 15 days before maintenance schedule.' },
    { key: 'darkTheme', label: 'Dark Mode Interface', desc: 'Enable professional dark theme templates.' },
    { key: 'analyticsEnabled', label: 'Analytics Tracking', desc: 'Gather operational efficiency metrics for analytics reports.' },
    { key: 'auditLogsEnabled', label: 'Enable Audit Logs', desc: 'Track all administrative and security actions.' },
    { key: 'autoBackup', label: 'Auto Backup Database', desc: 'Perform automated nightly database backup and compression.' }
  ];

  return (
    <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-5 text-left animate-fade-in space-y-4">
      <div className="flex items-center gap-2.5 mb-2 border-b border-[#2B3038] pb-3">
        <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center">
          <ToggleRight size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white leading-none">System Preferences</h4>
          <p className="text-[10px] text-[#9CA3AF] mt-1 font-semibold">Toggles for background automations and styling settings.</p>
        </div>
      </div>

      <div className="space-y-4">
        {switchItems.map((item) => {
          const isActive = preferences[item.key];
          return (
            <div 
              key={item.key} 
              onClick={() => togglePreference(item.key)}
              className="flex items-center justify-between gap-4 p-3 bg-[#0F1115] border border-[#2B3038]/50 hover:border-[#2B3038] rounded-xl transition-all cursor-pointer select-none"
            >
              <div className="space-y-0.5 text-left">
                <span className="text-xs font-bold text-white block">{item.label}</span>
                <span className="text-[10px] text-[#9CA3AF] font-semibold block leading-relaxed">{item.desc}</span>
              </div>

              {/* Custom Switch Toggle button */}
              <div className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer ${
                isActive ? 'bg-[#22C55E]' : 'bg-[#2B3038]'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 flex items-center justify-center ${
                  isActive ? 'translate-x-4' : 'translate-x-0'
                }`}>
                  {isActive && <Check size={10} className="text-[#22C55E] stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-[#2B3038]/50">
        <button
          onClick={handleSave}
          className="px-5 h-10 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/10 hover:-translate-y-0.5"
        >
          <Save size={14} />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
}
