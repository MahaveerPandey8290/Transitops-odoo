import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield, Loader2, ChevronDown } from 'lucide-react';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '', // Set default empty value to show the role placeholder
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const roles = [
    'Fleet Manager',
    'Dispatcher',
    'Safety Officer',
    'Financial Analyst'
  ];

  const validate = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      tempErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) {
      tempErrors.role = 'Please select your role';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      
      // Simulate API Call
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
        // Reset success state after a brief moment or redirect
        setTimeout(() => setIsSuccess(false), 3000);
      }, 1800);
    }
  };

  return (
    <div className="w-full max-w-[420px] bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E2E8F0] p-8 transition-all duration-350 hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)] animate-fade-in">
      
      {/* Top Lock Icon & Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-10 h-10 rounded-full bg-[#1E3A8A]/5 border border-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A] mb-3">
          <Lock size={16} className="stroke-[2.5]" />
        </div>
        <h2 className="text-[32px] font-bold text-[#0F172A] tracking-tight leading-none">Welcome Back</h2>
        <p className="text-base font-medium text-slate-500 mt-2">Sign in to continue to TransitOps</p>
      </div>

      {isSuccess && (
        <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm text-center animate-fade-in-up font-medium">
          Successfully authenticated! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Role Select Field */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="role" className="block text-sm font-medium text-slate-700">
            Select Your Role
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Shield size={18} />
            </div>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full h-[52px] pl-10 pr-10 bg-white border ${
                errors.role ? 'border-red-400 focus:ring-red-100' : 'border-[#E2E8F0] focus:border-[#F59E0B] focus:ring-[#F59E0B]/10'
              } rounded-[14px] text-sm text-[#0F172A] font-medium outline-none focus:ring-4 transition-all duration-200 appearance-none cursor-pointer disabled:opacity-60`}
            >
              <option value="" disabled hidden>Choose your role</option>
              {roles.map((role) => (
                <option key={role} value={role} className="text-[#0F172A]">
                  {role}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <ChevronDown size={16} />
            </div>
          </div>
          {errors.role && <p className="text-xs text-red-500 font-medium mt-1">{errors.role}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail size={18} />
            </div>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="name@company.com"
              className={`w-full h-[52px] pl-10 pr-4 bg-white border ${
                errors.email ? 'border-red-300 focus:ring-red-100' : 'border-[#E2E8F0] focus:border-[#F59E0B] focus:ring-[#F59E0B]/10'
              } rounded-[14px] text-sm placeholder-slate-400 text-[#0F172A] font-medium outline-none focus:ring-4 transition-all duration-200 disabled:opacity-60`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 font-medium mt-1">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <a
              href="#forgot-password"
              className="text-xs font-semibold text-[#1E3A8A] hover:text-[#F59E0B] transition-colors duration-200"
            >
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="••••••••"
              className={`w-full h-[52px] pl-10 pr-10 bg-white border ${
                errors.password ? 'border-red-300 focus:ring-red-100' : 'border-[#E2E8F0] focus:border-[#F59E0B] focus:ring-[#F59E0B]/10'
              } rounded-[14px] text-sm placeholder-slate-400 text-[#0F172A] font-medium outline-none focus:ring-4 transition-all duration-200 disabled:opacity-60`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0F172A] focus:outline-none transition-colors duration-200 disabled:opacity-60"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 font-medium mt-1">{errors.password}</p>}
        </div>

        {/* Remember Me */}
        <div className="flex items-center text-left pt-1">
          <input
            id="rememberMe"
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            disabled={isLoading}
            className="w-4 h-4 rounded border-[#E2E8F0] text-[#F59E0B] focus:ring-[#F59E0B] focus:ring-offset-0 transition-colors duration-200 cursor-pointer disabled:opacity-60"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm font-medium text-slate-500 select-none cursor-pointer disabled:opacity-60">
            Remember this device
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[50px] relative bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white font-semibold rounded-[14px] shadow-sm hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-[2px] active:translate-y-0 transition-all duration-200 disabled:opacity-75 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Sign In to Platform</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
