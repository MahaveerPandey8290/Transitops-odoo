import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Loader2, AlertCircle } from 'lucide-react';
import AuthFooter from './AuthFooter';
import PasswordStrength from './PasswordStrength';
import { authApi, storeAuth } from '../api/client';

export default function SignupForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordValidations = useMemo(() => {
    const pwd = formData.password;
    return {
      hasMinLength: pwd.length >= 8,
      hasAlphanumeric: /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd),
      hasSpecial: /[^a-zA-Z0-9]/.test(pwd),
    };
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim()) tempErrors.name = 'Full name is required';
    if (!formData.email) tempErrors.email = 'Email address is required';
    else if (!emailRegex.test(formData.email)) tempErrors.email = 'Please enter a valid email address';
    if (!formData.role) tempErrors.role = 'Please select your role';
    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else {
      const { hasMinLength, hasAlphanumeric, hasSpecial } = passwordValidations;
      if (!hasMinLength || !hasAlphanumeric || !hasSpecial) tempErrors.password = 'Password must meet all requirements';
    }
    if (!formData.confirmPassword) tempErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setApiError('');
    try {
      const res = await authApi.register(formData.name, formData.email, formData.password, formData.role);
      storeAuth(res.data.token, res.data.user);
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E2E8F0] px-8 py-5 transition-all duration-350 hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)] animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-4">
        <h2 className="text-[32px] font-bold text-[#0F172A] tracking-tight leading-none">Create Account</h2>
        <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
          Register your TransitOps account to access the Fleet Management System.
        </p>
      </div>

      {/* API Error Banner */}
      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-700 text-sm font-medium">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {isSuccess && (
        <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm text-center animate-fade-in-up font-medium">
          Account created successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        {/* Name Field */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User size={16} />
            </div>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="John Doe"
              className={`w-full h-[52px] pl-10 pr-4 bg-white border ${
                errors.name ? 'border-red-300 focus:ring-red-100' : 'border-[#E2E8F0] focus:border-[#F59E0B] focus:ring-[#F59E0B]/10'
              } rounded-[14px] text-sm placeholder-slate-400 text-[#0F172A] font-medium outline-none focus:ring-4 transition-all duration-200 disabled:opacity-60`}
            />
          </div>
          {errors.name && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Email Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail size={16} />
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
          {errors.email && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.email}</p>}
        </div>

        {/* Role Dropdown */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="role" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Role *
          </label>
          <div className="relative">
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full h-[52px] pl-4 pr-10 bg-white border appearance-none ${
                errors.role ? 'border-red-300 focus:ring-red-100' : 'border-[#E2E8F0] focus:border-[#F59E0B] focus:ring-[#F59E0B]/10'
              } rounded-[14px] text-sm text-[#0F172A] font-medium outline-none focus:ring-4 transition-all duration-200 cursor-pointer disabled:opacity-60`}
            >
              <option value="">Select your role...</option>
              <option value="FLEET_MANAGER">Fleet Manager</option>
              <option value="DISPATCHER">Dispatcher</option>
              <option value="SAFETY_OFFICER">Safety Officer</option>
              <option value="FINANCIAL_ANALYST">Financial Analyst</option>
            </select>
            {/* Chevron icon */}
            <div className="pointer-events-none absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          {errors.role && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.role}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={16} />
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
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0F172A] focus:outline-none transition-colors duration-200"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <PasswordStrength password={formData.password} validations={passwordValidations} />
          {errors.password && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Confirm Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={16} />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="••••••••"
              className={`w-full h-[52px] pl-10 pr-10 bg-white border ${
                errors.confirmPassword ? 'border-red-300 focus:ring-red-100' : 'border-[#E2E8F0] focus:border-[#F59E0B] focus:ring-[#F59E0B]/10'
              } rounded-[14px] text-sm placeholder-slate-400 text-[#0F172A] font-medium outline-none focus:ring-4 transition-all duration-200 disabled:opacity-60`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0F172A] focus:outline-none transition-colors duration-200"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[50px] relative bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white font-semibold rounded-[14px] shadow-sm hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-[2px] active:translate-y-0 transition-all duration-200 disabled:opacity-75 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </div>
      </form>

      {/* Redirect Footer */}
      <AuthFooter
        text="Already have an account?"
        linkText="Sign In"
        linkTo="/login"
      />
    </div>
  );
}
