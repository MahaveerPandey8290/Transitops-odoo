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
  CalendarDays,
  Loader2
} from 'lucide-react';

/* ==========================================
   WIDGET 1: Today's Dispatches Timeline
   Props: trips (array from API) | loading
   ========================================== */
export function TodayDispatches({ trips = [], loading = false }) {
  // Filter to dispatched trips only — these are the "today's active runs"
  const dispatched = trips.filter(t => t.status === 'DISPATCHED').slice(0, 5);

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl h-full flex flex-col text-left animate-fade-in">
      <div className="mb-5">
        <h3 className="text-base font-bold text-white mb-1">Today's Dispatches</h3>
        <p className="text-xs text-[#9CA3AF] font-semibold">Active trips currently in transit.</p>
      </div>

      <div className="space-y-4 flex-1">
        {loading ? (
          <div className="flex items-center gap-2 text-[#9CA3AF] text-xs py-4">
            <Loader2 size={14} className="animate-spin" /><span>Loading dispatches...</span>
          </div>
        ) : dispatched.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock size={24} className="text-[#2B3038] mb-2" />
            <p className="text-xs text-[#9CA3AF] font-medium">No active dispatches right now.</p>
          </div>
        ) : (
          dispatched.map((trip, idx) => (
            <div key={trip.id} className="flex gap-3 items-start relative group">
              {idx !== dispatched.length - 1 && (
                <span className="absolute left-[15px] top-[26px] bottom-[-22px] w-0.5 bg-[#2B3038] group-hover:bg-[#F59E0B]/30 transition-colors" />
              )}
              <div className="w-8 h-8 rounded-lg bg-[#0F1115] border border-[#2B3038] flex items-center justify-center flex-shrink-0 group-hover:border-[#F59E0B]/50 transition-all">
                <Clock size={10} className="text-[#3B82F6]" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-white group-hover:text-[#F59E0B] transition-colors">
                    {trip.vehicle?.registrationNumber ?? '—'}
                  </span>
                  <span className="text-[10px] font-semibold text-[#9CA3AF]">
                    {new Date(trip.startTime ?? trip.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[#9CA3AF] font-medium mt-0.5">
                  Driver: <span className="text-white">{trip.driver?.name ?? '—'}</span>
                  {trip.destination ? <> &bull; Dest: <span className="text-white">{trip.destination}</span></> : null}
                </p>
                <div className="mt-1">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] font-bold text-[9px] uppercase tracking-wide">
                    In Transit
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ==========================================
   WIDGET 2: Maintenance Alerts
   Props: maintenanceLogs (array from API) | loading
   ========================================== */
export function MaintenanceAlerts({ maintenanceLogs = [], loading = false }) {
  // Show open logs only, sorted by oldest first (most urgent)
  const openLogs = maintenanceLogs
    .filter(l => l.status === 'OPEN')
    .slice(0, 4);

  const getStyle = (idx) => {
    const styles = [
      { badge: 'bg-[#EF4444]/10 text-[#EF4444]', icon: ShieldAlert },
      { badge: 'bg-[#F59E0B]/10 text-[#F59E0B]', icon: AlertTriangle },
      { badge: 'bg-[#3B82F6]/10 text-[#3B82F6]', icon: CalendarDays },
      { badge: 'bg-[#9CA3AF]/10 text-[#9CA3AF]',  icon: Wrench },
    ];
    return styles[idx % styles.length];
  };

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl h-full flex flex-col text-left animate-fade-in">
      <div className="mb-5">
        <h3 className="text-base font-bold text-white mb-1">Maintenance Alerts</h3>
        <p className="text-xs text-[#9CA3AF] font-semibold">Open maintenance logs requiring attention.</p>
      </div>

      <div className="space-y-3.5 flex-1">
        {loading ? (
          <div className="flex items-center gap-2 text-[#9CA3AF] text-xs py-4">
            <Loader2 size={14} className="animate-spin" /><span>Loading alerts...</span>
          </div>
        ) : openLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ShieldAlert size={24} className="text-[#2B3038] mb-2" />
            <p className="text-xs text-[#9CA3AF] font-medium">No open maintenance alerts. Fleet is healthy.</p>
          </div>
        ) : (
          openLogs.map((log, idx) => {
            const { badge, icon: Icon } = getStyle(idx);
            const daysOpen = Math.floor((Date.now() - new Date(log.createdAt)) / 86400000);
            const dueLabel = daysOpen === 0 ? 'Today' : daysOpen === 1 ? '1 day ago' : `${daysOpen} days ago`;
            return (
              <div key={log.id} className="flex items-center justify-between p-2.5 bg-[#0F1115] border border-[#2B3038] rounded-xl hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${badge}`}>
                    <Icon size={16} />
                  </div>
                  <div className="text-xs overflow-hidden">
                    <h5 className="font-bold text-white truncate">{log.vehicle?.registrationNumber ?? '—'}</h5>
                    <p className="text-[#9CA3AF] font-medium mt-0.5 truncate">{log.description}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap ${badge}`}>
                  {dueLabel}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ==========================================
   WIDGET 3: Recent Activity Log (Default Export)
   Props: trips (array) | maintenanceLogs (array) | loading
   Derives events from real data, no hardcoded list
   ========================================== */
export default function ActivityTimeline({ trips = [], maintenanceLogs = [], loading = false }) {
  // Synthesise activity events from real API data
  const events = [
    ...trips.slice(0, 3).map(t => ({
      type: 'trip',
      title: `Trip ${t.id?.slice(0, 8).toUpperCase()} ${t.status === 'DISPATCHED' ? 'Dispatched' : t.status}`,
      desc: t.driver?.name
        ? `Driver ${t.driver.name} is handling this trip.`
        : 'Trip record updated.',
      time: new Date(t.updatedAt ?? t.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      icon: ArrowUpRight,
      color: 'bg-[#3B82F6]/10 text-[#3B82F6]',
    })),
    ...maintenanceLogs.slice(0, 2).map(l => ({
      type: 'maintenance',
      title: `Maintenance ${l.status === 'CLOSED' ? 'Completed' : 'Logged'}`,
      desc: `${l.vehicle?.registrationNumber ?? 'Vehicle'}: ${l.description}`,
      time: new Date(l.updatedAt ?? l.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      icon: Wrench,
      color: 'bg-emerald-500/10 text-emerald-500',
    })),
  ].slice(0, 5);

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl text-left animate-fade-in">
      <div className="mb-6">
        <h3 className="text-base font-bold text-white mb-1">Recent Activity</h3>
        <p className="text-xs text-[#9CA3AF] font-semibold">Live log of system actions.</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[#9CA3AF] text-xs py-4">
          <Loader2 size={14} className="animate-spin" /><span>Loading activity...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs text-[#9CA3AF]">No recent activity. Create trips and maintenance logs to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {events.map((act, idx) => {
            const Icon = act.icon;
            return (
              <div key={idx}
                className="p-3 bg-[#0F1115] border border-[#2B3038] rounded-xl hover:border-[#F59E0B]/30 transition-all duration-300 flex flex-col justify-between gap-3 group">
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
      )}
    </div>
  );
}
