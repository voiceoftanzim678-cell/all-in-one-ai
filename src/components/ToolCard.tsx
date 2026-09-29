import React, { useState } from 'react';
import { AiTool } from '../types.js';
import { useApp } from '../context/AppContext.js';
import { ExternalLink, Sparkles, Flame, CheckCircle, ShieldCheck, Tag } from 'lucide-react';

interface ToolCardProps {
  tool: AiTool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { language, t, categories, setSelectedTool } = useApp();
  const [logoError, setLogoError] = useState(false);

  // Category name resolution
  const category = categories.find(c => c.id === tool.category_id);
  const categoryName = category
    ? (language === 'bn' && category.name_bn ? category.name_bn : category.name_en)
    : tool.category_id;

  // Tool name & descriptions with bilingual fallback
  const toolName = (language === 'bn' && tool.name_bn) ? tool.name_bn : tool.name_en;
  const shortDescription = (language === 'bn' && tool.short_description_bn)
    ? tool.short_description_bn
    : tool.short_description_en;

  // Safe external URL verification
  const isSafeUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleVisitWebsite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!tool.website_url || !isSafeUrl(tool.website_url)) {
      alert('Invalid or unverified URL.');
      return;
    }
    window.open(tool.website_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      onClick={() => setSelectedTool(tool)}
      className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 hover:shadow-lg hover:shadow-slate-200/40 dark:hover:shadow-none transition-all duration-200 cursor-pointer"
    >
      <div>
        {/* Top Header: Logo + Metadata Badges */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            {/* Logo with Resilient Fallback */}
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 p-2 flex items-center justify-center shrink-0 overflow-hidden">
              {!logoError && tool.logo_url ? (
                <img
                  src={tool.logo_url}
                  alt={`${tool.name_en} logo`}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                  loading="lazy"
                />
              ) : (
                <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                  {tool.name_en.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            {/* Name + Clean Category Metadata */}
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                {toolName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {categoryName}
              </p>
            </div>
          </div>

          {/* Pricing & Special Indicators (Clean unboxed style or small discrete tag) */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {tool.pricing_type}
            </span>

            {tool.sponsored && (
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase">
                {t('badgeSponsored')}
              </span>
            )}
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {shortDescription}
        </p>

        {/* Unboxed Metadata & Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mb-4 font-mono">
            {tool.featured && (
              <span className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-semibold font-sans">
                <Sparkles className="w-3 h-3" />
                {t('badgeFeatured')}
                <span className="text-slate-300 dark:text-slate-700">·</span>
              </span>
            )}
            {tool.popular && (
              <span className="inline-flex items-center gap-1 text-rose-500 dark:text-rose-400 font-semibold font-sans">
                <Flame className="w-3 h-3" />
                {t('badgePopular')}
                <span className="text-slate-300 dark:text-slate-700">·</span>
              </span>
            )}
            {tool.tags.slice(0, 3).map((tag, idx) => (
              <React.Fragment key={tag}>
                <span>#{tag}</span>
                {idx < Math.min(tool.tags.length, 3) - 1 && (
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons: "View Details" & "Visit Website" */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedTool(tool)}
          className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors text-center"
        >
          {t('viewDetails')}
        </button>

        <button
          type="button"
          onClick={handleVisitWebsite}
          className="py-2 px-3 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
          title={`Visit ${tool.name_en} official website`}
        >
          <span>{t('visitWebsite')}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
