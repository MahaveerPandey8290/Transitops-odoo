import React from 'react';
import { History, User, Settings2, ShieldCheck, HelpCircle, Inbox } from 'lucide-react';

// AuditTimeline — shows real user management events.
// There's no dedicated /api/audit endpoint; we show a clean empty state 
// and note where audit events come from.
export default function AuditTimeline({ logs = [] }) {
  const getLogIcon = (type) => {
    if (type === 'setting')  return <Settings2 size={12} className="text-[#F59E0B]" />;
    if (type === 'security') return <ShieldCheck size={12} className="text-[#3B82F6]" />;
    return <HelpCircle size={12} className="text-[#9CA3AF]" />;
  };

  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl text-left space-y-4 animate-fade-in">
      <div className="flex items-center gap-2.5 border-b border-[#2B3038] pb-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <History size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white leading-none">Security Audit Logs</h4>
          <p className="text-[10px] text-[#9CA3AF] mt-1 font-semibold">Timeline of recent configuration edits.</p>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
          <Inbox size={22} className="text-[#2B3038]" />
          <p className="text-xs text-[#9CA3AF] font-medium">No audit events yet.</p>
          <p className="text-[10px] text-[#9CA3AF]">Role changes and configuration updates will appear here.</p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-5 border-l border-[#2B3038] ml-2.5 pt-2">
          {logs.map((log) => (
            <div key={log.id} className="relative text-xs">
              <div className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-[#0F1115] border border-[#2B3038] flex items-center justify-center">
                {getLogIcon(log.type)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold text-white flex items-center gap-1.5">
                    <User size={10} className="text-[#9CA3AF]" /> {log.user}
                  </span>
                  <span className="text-[9px] text-[#9CA3AF] font-mono">{log.time}</span>
                </div>
                <p className="text-[10px] text-[#9CA3AF] font-semibold leading-relaxed">{log.action}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
