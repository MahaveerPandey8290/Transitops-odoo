import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function KPICard({ 
  icon: Icon, 
  title, 
  value, 
  trend, 
  trendType = 'neutral', // 'up' | 'down' | 'neutral'
  iconBgColor = 'bg-[#1E3A8A]/10 text-[#3B82F6]' 
}) {
  return (
    <div className="bg-[#171A21] border border-[#2B3038] p-5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:border-[#2B3038]/80 hover:-translate-y-1 group flex flex-col justify-between text-left">
      <div className="flex items-center justify-between gap-4">
        {/* Title */}
        <span className="text-xs font-semibold text-[#9CA3AF] tracking-wide uppercase">
          {title}
        </span>

        {/* Icon wrapper */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 duration-200 ${iconBgColor}`}>
          <Icon size={18} className="stroke-[2.2]" />
        </div>
      </div>

      <div className="flex items-end justify-between mt-4">
        {/* Large Value */}
        <span className="text-3xl font-extrabold text-white tracking-tight leading-none">
          {value}
        </span>

        {/* Trend Indicator */}
        {trend && (
          <div className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold ${
            trendType === 'up' 
              ? 'bg-emerald-500/10 text-[#22C55E]' 
              : trendType === 'down' 
              ? 'bg-red-500/10 text-[#EF4444]' 
              : 'bg-slate-500/10 text-[#9CA3AF]'
          }`}>
            {trendType === 'up' ? (
              <ArrowUpRight size={12} className="stroke-[2.5]" />
            ) : trendType === 'down' ? (
              <ArrowDownRight size={12} className="stroke-[2.5]" />
            ) : null}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}
