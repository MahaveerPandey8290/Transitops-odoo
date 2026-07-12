import React from 'react';

export default function FeatureItem({ icon: Icon, title, description, index = 0 }) {
  // Stagger delays for entrance animation
  const animationDelays = [
    'delay-[100ms]',
    'delay-[200ms]',
    'delay-[300ms]',
    'delay-[400ms]',
  ];

  const delayClass = animationDelays[index % animationDelays.length];

  return (
    <div
      className={`w-full max-w-[420px] flex items-center gap-3.5 p-3.5 bg-white/65 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] hover:bg-white/80 transition-all duration-300 group opacity-0 translate-y-4 animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] ${delayClass}`}
    >
      {/* Circular Soft Background Icon */}
      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 group-hover:bg-[#F59E0B]/10 group-hover:text-[#F59E0B] transition-all duration-300 shadow-sm">
        <Icon size={18} className="stroke-[2]" />
      </div>

      {/* Content (Single-Line Description) */}
      <div className="text-left overflow-hidden">
        <h4 className="text-sm font-bold text-[#0F172A] leading-tight">
          {title}
        </h4>
        <p className="text-xs text-[#475569] mt-0.5 font-medium truncate leading-tight">
          {description}
        </p>
      </div>
    </div>
  );
}
