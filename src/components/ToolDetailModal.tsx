import React, { useState } from 'react';
import { AiTool } from '../types.js';
import { useApp } from '../context/AppContext.js';
import { AdPlaceholder } from './AdPlaceholder.js';
import { 
  X, ExternalLink, ArrowLeft, Check, Sparkles, Flame, 
  Globe, Tag, Layers, Share2, ShieldCheck, DollarSign
} from 'lucide-react';

interface ToolDetailModalProps {
  tool: AiTool;
  onClose: () => void;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({ tool, onClose }) => {
  const { language, t, categories, tools, setSelectedTool } = useApp();
  const [logoError, setLogoError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Category
  const category = categories.find(c => c.id === tool.category_id);
  const categoryName = category
    ? (language === 'bn' && category.name_bn ? category.name_bn : category.name_en)
    : tool.category_id;

  // Name & descriptions
  const toolName = (language === 'bn' && tool.name_bn) ? tool.name_bn : tool.name_en;
  const fullDescription = (language === 'bn' && tool.full_description_bn)
    ? tool.full_description_bn
    : tool.full_description_en;
  
  const features = (language === 'bn' && tool.features_bn && tool.features_bn.length > 0)
    ? tool.features_bn
    : tool.features_en || [];

  // Related tools from the same category
  const relatedTools = tools
    .filter(t => t.id !== tool.id && t.category_id === tool.category_id && t.active)
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + '?tool=' + tool.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleVisit = () => {
    window.open(tool.website_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Sticky Bar */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToTools')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              title={t('shareTool')}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              {copied && (
                <span className="absolute -bottom-8 right-0 text-[10px] bg-slate-900 text-white px-2 py-1 rounded shadow whitespace-nowrap">
                  {t('copiedLink')}
                </span>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-8 space-y-6">
          {/* Main Hero Header inside Modal */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              {/* Large Logo */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                {!logoError && tool.logo_url ? (
                  <img
                    src={tool.logo_url}
                    alt={`${tool.name_en} logo`}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
                    {tool.name_en.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {toolName}
                  </h2>
                  {tool.sponsored && (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {t('badgeSponsored')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                    {categoryName}
                  </span>
                  <span>·</span>
                  <span className="font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                    {tool.pricing_type}
                  </span>
                  {tool.featured && (
                    <>
                      <span>·</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-medium inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> {t('badgeFeatured')}
                      </span>
                    </>
                  )}
                  {tool.popular && (
                    <>
                      <span>·</span>
                      <span className="text-rose-500 font-medium inline-flex items-center gap-1">
                        <Flame className="w-3 h-3" /> {t('badgePopular')}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Visit Website Primary Action */}
            <button
              onClick={handleVisit}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm shadow-md shadow-cyan-600/20 hover:shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>{t('visitWebsite')}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Full Description */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              {language === 'bn' ? 'সম্পূর্ণ বিবরণ' : 'Overview & Description'}
            </h4>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-line">
              {fullDescription}
            </p>
          </div>

          {/* Key Features */}
          {features && features.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>{t('keyFeatures')}</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Official Website Info */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-xs text-slate-400 font-medium mb-1">{t('officialWebsite')}</div>
              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline truncate block"
              >
                {tool.website_url.replace(/^https?:\/\//, '')}
              </a>
            </div>

            {/* Supported Languages */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-xs text-slate-400 font-medium mb-1">{t('supportedLanguages')}</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {tool.languages && tool.languages.length > 0 ? tool.languages.join(', ') : 'Multilingual, English'}
              </div>
            </div>

            {/* Pricing Model */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-xs text-slate-400 font-medium mb-1">{t('pricingModel')}</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                {tool.pricing_type}
              </div>
            </div>
          </div>

          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                {language === 'bn' ? 'ট্যাগসমূহ' : 'Tags & Keywords'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tool.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dedicated Ad Area in Details View */}
          <AdPlaceholder zone="details" className="!px-0" />

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                {t('relatedTools')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedTools.map(rel => (
                  <button
                    key={rel.id}
                    onClick={() => setSelectedTool(rel)}
                    className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 bg-white dark:bg-slate-900/60 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-cyan-600 shrink-0">
                      {rel.name_en.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {language === 'bn' && rel.name_bn ? rel.name_bn : rel.name_en}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{rel.pricing_type}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
