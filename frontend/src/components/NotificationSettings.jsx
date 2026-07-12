import React, { useState } from 'react';
import { Bell, Check, Save } from 'lucide-react';

export default function NotificationSettings({ defaultValues, onSave }) {
  const [alerts, setAlerts] = useState(defaultValues || {
    licenseExpiry: true,
    maintenanceDue: true,
    tripCompleted: false,
    vehicleRegistration: true,
    fuelThreshold: false,
    expenseLimit: true
  });

  const toggleAlert = (key) => {
    const newVal = !alerts[key];
    setAlerts(prev => ({ ...prev, [key]: newVal }));
  };

  const handleSave = () => {
    if (onSave) onSave(alerts);
  };

  const alertItems = [
    { key: 'licenseExpiry', label: 'License Expiry Alerts', desc: 'Warn team when a driver license is expiring in under 30 days.' },
    { key: 'maintenanceDue', label: 'Maintenance Due Warnings', desc: 'Remind depot team when a vehicle servicing milestone is reached.' },
    { key: 'tripCompleted', label: 'Trip Completed Updates', desc: 'Notify dispatcher whenever a trip delivery status changes to completed.' },
    { key: 'vehicleRegistration', label: 'Vehicle Registration Expiry', desc: 'Alert safety team before insurance or RC documents expire.' },
    { key: 'fuelThreshold', label: 'Low Fuel Warnings', desc: 'Alert dispatchers when fuel refills drop below 15% capacity.' },
    { key: 'expenseLimit', label: 'Fuel Expense Thresholds', desc: 'Notify safety managers when transaction limits exceed set caps.' }
  ];

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl text-left space-y-4 animate-fade-in">
      <div className="flex items-center gap-2.5 mb-2 border-b border-[#2B3038] pb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
          <Bell size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white leading-none">Email & Push Alerts</h4>
          <p className="text-[10px] text-[#9CA3AF] mt-1 font-semibold font-sans">Trigger options for system-wide warning logs.</p>
        </div>
      </div>

      <div className="space-y-3.5">
        {alertItems.map((item) => {
          const isActive = alerts[item.key];
          return (
            <div 
              key={item.key} 
              onClick={() => toggleAlert(item.key)}
              className="flex items-center justify-between gap-4 p-3 bg-[#0F1115] border border-[#2B3038]/50 hover:border-[#2B3038] rounded-xl transition-all cursor-pointer select-none"
            >
              <div className="space-y-0.5 text-left">
                <span className="text-xs font-bold text-white block">{item.label}</span>
                <span className="text-[10px] text-[#9CA3AF] font-semibold block leading-relaxed">{item.desc}</span>
              </div>

              {/* Toggle slider */}
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
          className="px-5 h-10 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/10 hover:-translate-y-0.5"
        >
          <Save size={14} />
          <span>Save Email Alerts</span>
        </button>
      </div>
    </div>
  );
}
