import React from 'react';
import { useForm } from 'react-hook-form';
import { Sliders } from 'lucide-react';

export default function GeneralSettingsCard({ defaultValues, onSave, onReset }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: defaultValues || {
      orgName: 'TransitOps Global',
      depotName: 'Jaipur HQ Terminal',
      currency: 'INR (₹)',
      distanceUnit: 'miles',
      timezone: 'GMT+05:30',
      language: 'English (US)',
      country: 'India',
      fleetCapacity: '150',
      defaultVehicleType: 'Heavy Duty Truck',
      maintenanceReminderDays: '15',
      defaultDriverStatus: 'Available'
    }
  });

  const onSubmitForm = (data) => {
    if (onSave) onSave(data);
  };

  const handleFormReset = () => {
    reset();
    if (onReset) onReset();
  };

  return (
    <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-5 text-left animate-fade-in space-y-4">
      <div className="flex items-center gap-2.5 mb-2 border-b border-[#2B3038] pb-3">
        <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center">
          <Sliders size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white leading-none">General Settings</h4>
          <p className="text-[10px] text-[#9CA3AF] mt-1 font-semibold">Global fleet variables and localization preferences.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Org Name */}
          <div>
            <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Organization Name</label>
            <input
              type="text"
              {...register('orgName', { required: 'Org name is required' })}
              className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all"
            />
            {errors.orgName && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.orgName.message}</p>}
          </div>

          {/* Depot Name */}
          <div>
            <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Primary Depot Terminal</label>
            <input
              type="text"
              {...register('depotName')}
              className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">System Currency</label>
            <select
              {...register('currency')}
              className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none cursor-pointer"
            >
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="INR (₹)">INR (₹)</option>
              <option value="GBP (£)">GBP (£)</option>
            </select>
          </div>

          {/* Distance Unit */}
          <div>
            <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Distance Unit</label>
            <select
              {...register('distanceUnit')}
              className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none cursor-pointer"
            >
              <option value="miles">Miles (mi)</option>
              <option value="kilometers">Kilometers (km)</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">System Timezone</label>
            <select
              {...register('timezone')}
              className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none cursor-pointer font-mono"
            >
              <option value="GMT-05:00">EST (GMT-05:00)</option>
              <option value="GMT+00:00">UTC (GMT+00:00)</option>
              <option value="GMT+05:30">IST (GMT+05:30)</option>
              <option value="GMT+08:00">SGT (GMT+08:00)</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Language</label>
            <select
              {...register('language')}
              className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none cursor-pointer"
            >
              <option value="English (US)">English (US)</option>
              <option value="Spanish (ES)">Spanish (ES)</option>
              <option value="Hindi (HI)">Hindi (HI)</option>
            </select>
          </div>

          {/* Fleet capacity limits */}
          <div>
            <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Fleet Limit capacity</label>
            <input
              type="number"
              {...register('fleetCapacity', { min: { value: 10, message: 'Minimum 10 assets required' } })}
              className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all font-mono"
            />
            {errors.fleetCapacity && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.fleetCapacity.message}</p>}
          </div>

          {/* Maintenance reminder range */}
          <div>
            <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Maintenance Alerts Threshold (Days)</label>
            <input
              type="number"
              {...register('maintenanceReminderDays')}
              className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all font-mono"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3.5 pt-3 border-t border-[#2B3038]/50">
          <button
            type="submit"
            className="px-5 h-10 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#F59E0B]/10 hover:-translate-y-0.5"
          >
            Save General
          </button>
          <button
            type="button"
            onClick={handleFormReset}
            className="px-4 h-10 bg-[#171A21] hover:bg-[#2B3038] border border-[#2B3038] text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
