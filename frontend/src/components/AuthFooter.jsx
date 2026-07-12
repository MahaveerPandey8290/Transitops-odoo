import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthFooter({ text, linkText, linkTo }) {
  return (
    <div className="w-full">
      {/* Divider */}
      <div className="relative flex py-4 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400">or</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      {/* Redirect Link */}
      <div className="text-center text-sm font-medium text-slate-500">
        {text}{' '}
        <Link 
          to={linkTo} 
          className="text-[#F59E0B] hover:text-[#D97706] hover:underline font-bold transition-colors ml-1"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
}
