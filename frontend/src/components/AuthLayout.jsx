import React from 'react';
import FeatureItem from './FeatureItem';
import { Truck, Route, Shield, BarChart3 } from 'lucide-react';

export default function AuthLayout({ children }) {
  const features = [
    {
      icon: Truck,
      title: 'Fleet Manager',
      description: 'Manage fleet assets, vehicle health, and scheduling.',
    },
    {
      icon: Route,
      title: 'Dispatcher',
      description: 'Optimize routes and manage daily trips in real-time.',
    },
    {
      icon: Shield,
      title: 'Safety Officer',
      description: 'Monitor driver behavior and ensure strict compliance.',
    },
    {
      icon: BarChart3,
      title: 'Financial Analyst',
      description: 'Track operational expenses, fuel costs, and ROI.',
    },
  ];

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden w-full flex flex-col md:flex-row bg-[#F8FAFC] font-sans selection:bg-[#F59E0B]/20">
      
      {/* Left Section: Branding & Features (Hidden on mobile) */}
      <section className="relative hidden md:flex md:w-[52%] lg:w-[55%] flex-col justify-between p-10 lg:p-14 overflow-hidden bg-slate-100 border-r border-slate-200/40">
        {/* Background Image - moved lower to center bottom 75% to keep header area clear */}
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-300"
          style={{ backgroundImage: `url('/images/auth-bg.png')`, backgroundPosition: 'center 75%' }}
        />
        
        {/* White overlay reduced opacity to keep image visible but make text readable */}
        <div className="absolute inset-0 bg-white/15 pointer-events-none" />
        
        {/* Inner Content */}
        <div className="relative z-10 flex flex-col h-full justify-between items-start">
          
          {/* Middle: Content moved higher (pt-4 mb-auto) with increased spacing */}
          <div className="pt-4 mb-auto text-left w-full max-w-[420px]">
            {/* Hero Text */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-[40px] font-bold text-[#0F172A] tracking-tight leading-[1.15] animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                One Platform.<br />
                <span className="text-[#F59E0B]">
                  Complete Fleet Control.
                </span>
              </h1>
              <p className="text-sm text-[#475569] leading-relaxed font-medium animate-[fadeIn_1s_ease-out_0.2s_forwards] opacity-0">
                Manage vehicles, drivers, trips, maintenance, and operational expenses from one intelligent, unified platform.
              </p>
            </div>

            {/* Feature Stagger List - Spacing 24px (space-y-6) */}
            <div className="mt-8 space-y-6">
              {features.map((feature, index) => (
                <FeatureItem
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Bottom: Copyright */}
          <div className="text-left text-xs text-slate-500 font-semibold tracking-wide pt-4 border-t border-slate-200/60 w-full mt-8">
            &copy; {new Date().getFullYear()} TransitOps. All rights reserved.
          </div>
        </div>
      </section>

      {/* Right Section: Interactive Login Card */}
      <main className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 md:p-14 lg:p-20 relative bg-[#F8FAFC] md:overflow-y-auto">
        {/* Fade-in Container for the Form */}
        <div className="w-full flex justify-center items-center animate-[fadeIn_0.7s_ease-out_forwards]">
          {children}
        </div>
      </main>

    </div>
  );
}
