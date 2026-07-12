import React from 'react';
import { Plus } from 'lucide-react';

export default function EmptyState({ 
  onAction, 
  onRegister,
  title = "No Items Found", 
  description = "No entries matching your search criteria were found.",
  buttonText = "Add Item",
  icon: Icon
}) {
  const triggerClick = onAction || onRegister;

  return (
    <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-12 text-center flex flex-col items-center justify-center animate-fade-in my-6">
      <div className="w-20 h-20 rounded-full bg-[#15181E] border border-[#2B3038] flex items-center justify-center mb-5 text-[#9CA3AF] shadow-inner">
        {Icon && <Icon size={36} className="stroke-[1.5]" />}
      </div>

      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-xs text-[#9CA3AF] font-semibold max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {triggerClick && (
        <button
          onClick={triggerClick}
          className="h-11 px-6 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#F59E0B]/10 hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={16} />
          <span>{buttonText}</span>
        </button>
      )}
    </div>
  );
}
