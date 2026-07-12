import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import AuthFooter from './AuthFooter';
import { authApi, storeAuth } from '../api/client';

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) tempErrors.email = 'Email address is required';
    else if (!emailRegex.test(formData.email)) tempErrors.email = 'Please enter a valid email address';
    if (!formData.password) tempErrors.password = 'Password is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError('');

    try {
      const res = await authApi.login(formData.email, formData.password);
      // res.data = { token, user }
      storeAuth(res.data.token, res.data.user);
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      // Surface the backend's exact message (wrong password, account locked, etc.)
      setApiError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
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

      {/* API Error Banner */}
      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-700 text-sm font-medium animate-fade-in">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Success Banner */}
      {isSuccess && (
        <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm text-center animate-fade-in font-medium">
          Successfully authenticated! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail size={18} />
            </div>
            <input
              id="email" type="email" name="email"
              value={formData.email} onChange={handleChange} disabled={isLoading}
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
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} />
            </div>
            <input
              id="password" type={showPassword ? 'text' : 'password'} name="password"
              value={formData.password} onChange={handleChange} disabled={isLoading}
              placeholder="••••••••"
              className={`w-full h-[52px] pl-10 pr-10 bg-white border ${
                errors.password ? 'border-red-300 focus:ring-red-100' : 'border-[#E2E8F0] focus:border-[#F59E0B] focus:ring-[#F59E0B]/10'
              } rounded-[14px] text-sm placeholder-slate-400 text-[#0F172A] font-medium outline-none focus:ring-4 transition-all duration-200 disabled:opacity-60`}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0F172A] focus:outline-none transition-colors duration-200 disabled:opacity-60">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 font-medium mt-1">{errors.password}</p>}
        </div>

        {/* Hint for demo */}
        <p className="text-[11px] text-slate-400 font-medium text-left">
          Demo accounts: fleet@transitsops.dev / dispatch@transitsops.dev / safety@transitsops.dev / finance@transitsops.dev — all passwords: &lt;Role&gt;@2026!
        </p>

        {/* Submit */}
        <div className="pt-2">
          <button type="submit" disabled={isLoading || isSuccess}
            className="w-full h-[50px] relative bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white font-semibold rounded-[14px] shadow-sm hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-[2px] active:translate-y-0 transition-all duration-200 disabled:opacity-75 disabled:pointer-events-none flex items-center justify-center gap-2">
            {isLoading ? (
              <><Loader2 size={18} className="animate-spin" /><span>Verifying credentials...</span></>
            ) : (
              <span>Sign In to Platform</span>
            )}
          </button>
        </div>
      </form>

      <AuthFooter text="Don't have an account?" linkText="Create Account" linkTo="/signup" />
    </div>
  );
}
