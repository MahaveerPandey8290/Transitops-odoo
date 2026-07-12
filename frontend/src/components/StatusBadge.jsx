import React from 'react';

export default function StatusBadge({ status }) {
  const styles = {
    // Vehicles & Drivers
    'Available': 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    'On Trip': 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
    'Maintenance': 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    'Retired': 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
    
    // Drivers specific
    'Off Duty': 'bg-[#9CA3AF]/10 text-[#9CA3AF] border-[#9CA3AF]/20',
    'Suspended': 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
    'Expired License': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Valid': 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    'Expiring': 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    'Expired': 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
  };

  const currentStyle = styles[status] || 'bg-[#9CA3AF]/10 text-[#9CA3AF] border-[#9CA3AF]/20';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${currentStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {status}
    </span>
  );
}
