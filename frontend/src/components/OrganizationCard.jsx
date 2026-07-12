import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Building2, Upload } from 'lucide-react';

export default function OrganizationCard({ defaultValues, onSave, onReset }) {
  const [logo, setLogo] = useState(defaultValues?.logo || '');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: defaultValues || {
      companyName: 'TransitOps Logistics Ltd.',
      email: 'operations@transitops.com',
      phone: '+91 141 2984012',
      website: 'www.transitops.com',
      address: 'Plot 104, IT Park, Mansarovar Industrial Area, Jaipur, Rajasthan',
      gstNumber: '08AAAAA1111A1Z1',
      businessRegNum: 'U60231RJ2026PLC09829'
    }
  });

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        setValue('logo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitForm = (data) => {
    if (onSave) onSave({ ...data, logo });
  };

  const handleFormReset = () => {
    reset();
    setLogo(defaultValues?.logo || '');
    if (onReset) onReset();
  };

  return (
    <div className="bg-[#171A21] border border-[#2B3038] rounded-2xl p-5 text-left animate-fade-in space-y-4">
      <div className="flex items-center gap-2.5 mb-2 border-b border-[#2B3038] pb-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
          <Building2 size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white leading-none">Organization Details</h4>
          <p className="text-[10px] text-[#9CA3AF] mt-1 font-semibold">Corporate identifiers and corporate identity files.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        {/* Logo and Identity */}
        <div className="flex items-center gap-4 bg-[#0F1115] border border-[#2B3038] p-3.5 rounded-2xl">
          <div className="w-14 h-14 bg-[#171A21] border border-[#2B3038] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
            {logo ? (
              <img src={logo} alt="Company Logo" className="w-full h-full object-cover" />
            ) : (
              <Building2 size={24} className="text-[#9CA3AF]" />
            )}
            <label 
              htmlFor="org-logo-input"
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] font-bold text-white cursor-pointer transition-opacity"
            >
              Upload
            </label>
            <input 
              type="file" 
              id="org-logo-input" 
              accept="image/*" 
              onChange={handleLogoUpload} 
              className="hidden" 
            />
          </div>
          <div className="text-left space-y-1">
            <h5 className="text-xs font-bold text-white">Company Logo</h5>
            <p className="text-[9px] text-[#9CA3AF] font-semibold leading-relaxed">Upload your official brand files. Formats: PNG, JPG, or SVG (Max 1MB).</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Name */}
          <div className="md:col-span-2">
            <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Company Name *</label>
            <input
              type="text"
              {...register('companyName', { required: 'Company Name is required' })}
              className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all"
            />
            {errors.companyName && <p className="text-[10px] text-red-400 mt-1 font-semibold">{errors.companyName.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Billing Email *</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all font-mono"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Contact Number *</label>
            <input
              type="text"
              {...register('phone')}
              className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all"
            />
          </div>

          {/* GST */}
          <div>
            <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">GST Registration Number</label>
            <input
              type="text"
              {...register('gstNumber')}
              placeholder="e.g. 08AAAAA1111A1Z1"
              className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all font-mono uppercase tracking-widest"
            />
          </div>

          {/* Business Reg */}
          <div>
            <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Corporate Identification Number (CIN)</label>
            <input
              type="text"
              {...register('businessRegNum')}
              className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all font-mono uppercase tracking-wider"
            />
          </div>

          {/* Website */}
          <div className="md:col-span-2">
            <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Website Domain</label>
            <input
              type="text"
              {...register('website')}
              className="w-full h-11 px-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all font-mono text-indigo-400"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="text-[10px] text-[#9CA3AF] font-bold block mb-1.5 uppercase tracking-wide">Registered Office Address</label>
            <textarea
              {...register('address')}
              rows={2}
              className="w-full p-4 bg-[#0F1115] border border-[#2B3038] focus:border-[#F59E0B] rounded-xl text-xs font-semibold text-white outline-none focus:ring-4 focus:ring-[#F59E0B]/10 transition-all resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3.5 pt-3 border-t border-[#2B3038]/50">
          <button
            type="submit"
            className="px-5 h-10 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-500/10 hover:-translate-y-0.5"
          >
            Save Corporate
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
