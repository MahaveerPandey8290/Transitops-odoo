import React from 'react';
import { useForm } from 'react-hook-form';
import { ShieldAlert, Check } from 'lucide-react';

export default function SecuritySettings({ defaultValues, onSave }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: defaultValues || {
      passwordExpiry: '90',
      sessionTimeout: '30',
      maxLoginAttempts: '5',
      twoFactorEnabled: true,
      loginAlerts: true
    }
  });

  const twoFactor = watch('twoFactorEnabled');
  const alerts = watch('loginAlerts');

  const onSubmitForm = (data) => {
    if (onSave) onSave(data);
  };

  return (
    <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-5 text-left animate-fade-in space-y-4">
      <div className="flex items-center gap-2.5 mb-2 border-b border-[#2B3038] pb-3">
        <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
          <ShieldAlert size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white leading-none">Security Policy</h4>
          <p className="text-[10px] text-[#9CA3AF] mt-1 font-semibold">Brute-force protection, multi-factor settings and sessions.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        
        {/* Pass Expiry */}
        <div>
          <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Password Expiration Interval</label>
          <select
            {...register('passwordExpiry')}
            className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none cursor-pointer"
          >
            <option value="30">30 Days</option>
            <option value="60">60 Days</option>
            <option value="90">90 Days</option>
            <option value="180">Never Expire</option>
          </select>
        </div>

        {/* Session Timeout */}
        <div>
          <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Idle Session Expiry Timeout</label>
          <select
            {...register('sessionTimeout')}
            className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none cursor-pointer"
          >
            <option value="15">15 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="60">60 Minutes</option>
            <option value="120">2 Hours</option>
          </select>
        </div>

        {/* Max Login Attempts */}
        <div>
          <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Brute Force Lockout Limit *</label>
          <input
            type="number"
            {...register('maxLoginAttempts', { 
              required: 'Brute-force limit is required',
              min: { value: 3, message: 'Minimum 3 attempts' },
              max: { value: 10, message: 'Maximum 10 attempts' }
            })}
            className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all font-mono"
          />
          {errors.maxLoginAttempts && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.maxLoginAttempts.message}</p>}
        </div>

        {/* Two Factor Switch */}
        <div 
          onClick={() => setValue('twoFactorEnabled', !twoFactor)}
          className="flex items-center justify-between p-3 bg-[#0F1115] border border-[#2B3038]/50 hover:border-[#2B3038] rounded-xl cursor-pointer transition-all select-none"
        >
          <div className="space-y-0.5 text-left">
            <span className="text-xs font-bold text-white block">Multi-Factor Authentication (2FA)</span>
            <span className="text-[10px] text-[#9CA3AF] font-semibold block">Require email OTP challenge on every login.</span>
          </div>
          <div className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer ${
            twoFactor ? 'bg-[#22C55E]' : 'bg-[#2B3038]'
          }`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 flex items-center justify-center ${
              twoFactor ? 'translate-x-4' : 'translate-x-0'
            }`}>
              {twoFactor && <Check size={10} className="text-[#22C55E] stroke-[3]" />}
            </div>
          </div>
        </div>

        {/* Login Alerts Switch */}
        <div 
          onClick={() => setValue('loginAlerts', !alerts)}
          className="flex items-center justify-between p-3 bg-[#0F1115] border border-[#2B3038]/50 hover:border-[#2B3038] rounded-xl cursor-pointer transition-all select-none"
        >
          <div className="space-y-0.5 text-left">
            <span className="text-xs font-bold text-white block">Suspicious Login Notifications</span>
            <span className="text-[10px] text-[#9CA3AF] font-semibold block">Alert team via email on logins from new devices.</span>
          </div>
          <div className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer ${
            alerts ? 'bg-[#22C55E]' : 'bg-[#2B3038]'
          }`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 flex items-center justify-center ${
              alerts ? 'translate-x-4' : 'translate-x-0'
            }`}>
              {alerts && <Check size={10} className="text-[#22C55E] stroke-[3]" />}
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="pt-3 border-t border-[#2B3038]/50">
          <button
            type="submit"
            className="px-5 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-500/10 hover:-translate-y-0.5"
          >
            Update Security
          </button>
        </div>
      </form>
    </div>
  );
}
