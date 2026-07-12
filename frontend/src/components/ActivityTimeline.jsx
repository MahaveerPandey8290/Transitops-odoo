import React from 'react';
import { 
  ArrowUpRight, 
  PlusCircle, 
  Wrench, 
  Fuel, 
  UserCheck, 
  AlertTriangle,
  Clock,
  ShieldAlert,
  CalendarDays
} from 'lucide-react';

/* ==========================================
   WIDGET 1: Today's Dispatches Timeline (Named Export)
   ========================================== */
export function TodayDispatches() {
  const dispatches = [
    { time: '08:30 AM', vehicle: 'VOL-822 (Heavy)', driver: 'Marcus Aurelius', destination: 'Chicago Hub', status: 'In Transit' },
    { time: '09:15 AM', vehicle: 'VAN-301 (Van)', driver: 'Sarah Connor', destination: 'New York Depot', status: 'Delivering' },
    { time: '10:00 AM', vehicle: 'REF-104 (Reefer)', driver: 'James Miller', destination: 'Boston Warehouse', status: 'Departed' },
  ];

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl h-full flex flex-col justify-between text-left animate-fade-in">
      <div>
        <h3 className="text-base font-bold text-white mb-1">Today's Dispatches</h3>
        <p className="text-xs text-[#9CA3AF] font-semibold mb-5">Timeline of dispatches sent out today.</p>
      </div>

      <div className="space-y-4 flex-1">
        {dispatches.map((disp, idx) => (
          <div key={idx} className="flex gap-3 items-start relative group">
            {/* Timeline Line */}
            {idx !== dispatches.length - 1 && (
              <span className="absolute left-[15px] top-[26px] bottom-[-22px] w-0.5 bg-[#2B3038] group-hover:bg-[#F59E0B]/30 transition-colors" />
            )}

            {/* Time Stamp circle badge */}
            <div className="w-8 h-8 rounded-lg bg-[#0F1115] border border-[#2B3038] flex items-center justify-center flex-shrink-0 text-[#9CA3AF] group-hover:border-[#F59E0B]/50 transition-all font-mono text-[9px] font-bold">
              <Clock size={10} className="text-[#3B82F6] mr-0.5" />
            </div>

            {/* Content Details */}
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-white group-hover:text-[#F59E0B] transition-colors">{disp.vehicle}</span>
                <span className="text-[10px] font-semibold text-[#9CA3AF]">{disp.time}</span>
              </div>
              <p className="text-[#9CA3AF] font-medium mt-0.5">
                Driver: <span className="text-white">{disp.driver}</span> &bull; Dest: <span className="text-white">{disp.destination}</span>
              </p>
              <div className="mt-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] font-bold text-[9px] uppercase tracking-wide">
                  {disp.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   WIDGET 2: Maintenance Alerts (Named Export)
   ========================================== */
export function MaintenanceAlerts() {
  const alerts = [
    { type: 'overdue', vehicle: 'VOL-910 (Heavy)', issue: 'Brake Pad Replacement', due: '3 days ago', badge: 'bg-[#EF4444]/10 text-[#EF4444]', icon: ShieldAlert },
    { type: 'due', vehicle: 'VAN-205 (Van)', issue: 'Engine Tuning', due: 'Today', badge: 'bg-[#F59E0B]/10 text-[#F59E0B]', icon: AlertTriangle },
    { type: 'upcoming', vehicle: 'REF-402 (Reefer)', issue: 'Routine Oil Change', due: 'In 4 days', badge: 'bg-[#3B82F6]/10 text-[#3B82F6]', icon: CalendarDays }
  ];

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl h-full flex flex-col justify-between text-left animate-fade-in">
      <div>
        <h3 className="text-base font-bold text-white mb-1">Maintenance Alerts</h3>
        <p className="text-xs text-[#9CA3AF] font-semibold mb-5">Urgent fleet health updates.</p>
      </div>

      <div className="space-y-3.5 flex-1">
        {alerts.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center justify-between p-2.5 bg-[#0F1115] border border-[#2B3038] rounded-xl hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.badge}`}>
                  <Icon size={16} />
                </div>
                <div className="text-xs overflow-hidden">
                  <h5 className="font-bold text-white truncate">{item.vehicle}</h5>
                  <p className="text-[#9CA3AF] font-medium mt-0.5 truncate">{item.issue}</p>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap ${item.badge}`}>
                {item.due}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================
   WIDGET 3: Recent Activity Log (Default Export)
   ========================================== */
export default function ActivityTimeline() {
  const activities = [
    { type: 'trip', title: 'Trip TR-2089 Dispatched', desc: 'Driver Marcus Aurelius is en route to Chicago Hub.', time: '10 mins ago', icon: ArrowUpRight, color: 'bg-[#3B82F6]/10 text-[#3B82F6]' },
    { type: 'vehicle', title: 'New Vehicle Registered', desc: 'Flatbed Trailer (FLT-942) added to West Region.', time: '1 hour ago', icon: PlusCircle, color: 'bg-[#22C55E]/10 text-[#22C55E]' },
    { type: 'maintenance', title: 'Maintenance Completed', desc: 'VOL-822 brake servicing logged successfully.', time: '3 hours ago', icon: Wrench, color: 'bg-emerald-500/10 text-emerald-500' },
    { type: 'fuel', title: 'Fuel Logged', desc: '$145 refuel logged for VAN-301 in New York.', time: '5 hours ago', icon: Fuel, color: 'bg-[#EF4444]/10 text-[#EF4444]' },
    { type: 'driver', title: 'Driver Profile Updated', desc: 'Diana Prince safety status updated to Class-A.', time: 'Yesterday', icon: UserCheck, color: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
  ];

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl text-left animate-fade-in">
      <div className="mb-6">
        <h3 className="text-base font-bold text-white mb-1">Recent Activity</h3>
        <p className="text-xs text-[#9CA3AF] font-semibold">Real-time log of system modifications and actions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {activities.map((act, idx) => {
          const Icon = act.icon;
          return (
            <div 
              key={idx} 
              className="p-3 bg-[#0F1115] border border-[#2B3038] rounded-xl hover:border-[#F59E0B]/30 transition-all duration-300 flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${act.color} group-hover:scale-105 transition-transform`}>
                  <Icon size={16} />
                </div>
                <span className="text-[9px] font-bold text-[#9CA3AF] font-mono whitespace-nowrap">{act.time}</span>
              </div>

              <div className="mt-2 text-left">
                <h5 className="text-xs font-bold text-white group-hover:text-[#F59E0B] transition-colors leading-tight">{act.title}</h5>
                <p className="text-[10px] text-[#9CA3AF] mt-1 font-medium leading-relaxed line-clamp-2">{act.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
