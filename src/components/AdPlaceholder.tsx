import React from 'react';
import { useApp } from '../context/AppContext.js';

interface AdPlaceholderProps {
  zone: 'header' | 'homepage' | 'feed' | 'details' | 'footer';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ zone, className = '' }) => {
  const { settings, t } = useApp();

  // If ads are disabled in admin settings, do not render
  if (settings && !settings.ad_placeholders_enabled) {
    return null;
  }

  const zoneConfigs = {
    header: {
      height: 'h-16 md:h-20',
      label: 'Header Ad Area · 728x90 Banner Space',
      containerClass: 'max-w-5xl mx-auto my-3',
    },
    homepage: {
      height: 'h-24 md:h-28',
      label: 'Homepage Marquee Ad Area · 970x250 or Responsive',
      containerClass: 'max-w-6xl mx-auto my-8',
    },
    feed: {
      height: 'h-28 md:h-32',
      label: 'Native Directory Ad Area · In-feed Sponsored Placement',
      containerClass: 'w-full my-6',
    },
    details: {
      height: 'h-28 md:h-36',
      label: 'AI Details Sidebar/Inline Ad Area · 300x250 Medium Rectangle',
      containerClass: 'w-full my-5',
    },
    footer: {
      height: 'h-20 md:h-24',
      label: 'Footer Ad Area · Leaderboard Slot',
      containerClass: 'max-w-5xl mx-auto mt-12 mb-6',
    },
  };

  const config = zoneConfigs[zone];

  return (
    <div className={`px-4 ${config.containerClass} ${className}`}>
      <div
        className={`w-full ${config.height} rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/50 flex flex-col items-center justify-center p-3 text-center transition-colors`}
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-200/80 dark:bg-slate-800 px-2 py-0.5 rounded">
            {t('advertisement')}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            {config.label}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-600 mt-1">
          {t('adPlaceholderNotice')}
        </p>
      </div>
    </div>
  );
};
