import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = false }) => {
  const [imgError, setImgError] = useState(false);

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Brand Icon Emblem */}
      <div className={`relative ${iconSizes[size]} rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-gradient-to-br from-cyan-600 via-indigo-600 to-violet-700 p-0.5 shrink-0 transition-transform group-hover:scale-105 duration-200`}>
        {!imgError ? (
          <img
            src="/src/assets/images/brand_ai_symbol_1790714825614.jpg"
            alt="ALL IN ONE Emblem"
            className="w-full h-full object-cover rounded-[10px]"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-cyan-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
        )}
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <span className={`font-extrabold tracking-tight text-slate-900 dark:text-white ${textSizes[size]}`}>
          ALL <span className="text-cyan-600 dark:text-cyan-400 font-black">IN</span> ONE
        </span>
        {showTagline && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400 tracking-wide font-medium mt-0.5">
            Discover the Right AI for Everything
          </span>
        )}
      </div>
    </div>
  );
};
