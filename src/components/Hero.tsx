import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { Search, Sparkles, X, ArrowRight, Compass } from 'lucide-react';

export const Hero: React.FC = () => {
  const {
    t,
    language,
    searchQuery,
    setSearchQuery,
    navigateTo,
    setSelectedCategory,
  } = useApp();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    navigateTo('tools');
  };

  const handleClear = () => {
    setLocalSearch('');
    setSearchQuery('');
  };

  const quickSearchTags = language === 'bn' 
    ? [
        { label: 'ছবি তৈরি', query: 'ছবি' },
        { label: 'চ্যাটবট', query: 'চ্যাট' },
        { label: 'কোডিং', query: 'কোডিং' },
        { label: 'ভিডিও', query: 'ভিডিও' },
        { label: 'লেখালেখি', query: 'লেখা' },
        { label: 'ChatGPT', query: 'ChatGPT' },
      ]
    : [
        { label: 'Image Gen', query: 'image' },
        { label: 'ChatGPT', query: 'chatgpt' },
        { label: 'Coding', query: 'coding' },
        { label: 'Video', query: 'video' },
        { label: 'Writing', query: 'writing' },
        { label: 'Voice', query: 'voice' },
      ];

  const handleTagClick = (query: string) => {
    setLocalSearch(query);
    setSearchQuery(query);
    navigateTo('tools');
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Background with Generated Neural Network and Controlled Scrim */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <img
          src="/src/assets/images/hero_ai_network_1790714599351.jpg"
          alt=""
          className="w-full h-full object-cover object-center opacity-15 dark:opacity-25 filter blur-[0.5px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/95 to-white dark:from-slate-950/70 dark:via-slate-950/95 dark:to-slate-950" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle Category Pill or Editorial Kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200/60 dark:border-cyan-800/60 text-cyan-700 dark:text-cyan-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          <span>{language === 'bn' ? 'বিশ্বের সেরা AI ডিরেক্টরি' : 'The Comprehensive AI Tools Directory'}</span>
        </div>

        {/* Large Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] text-balance max-w-4xl mx-auto">
          {t('heroTitle')}
        </h1>

        {/* Subheading */}
        <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed text-balance">
          {t('heroSubtitle')}
        </p>

        {/* Real-time Large Search Bar */}
        <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center shadow-lg shadow-slate-200/50 dark:shadow-none rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus-within:border-cyan-500 dark:focus-within:border-cyan-400 focus-within:ring-3 focus-within:ring-cyan-500/20 transition-all p-1.5"
          >
            <div className="pl-3.5 pr-2 text-slate-400 dark:text-slate-500">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={localSearch}
              onChange={e => {
                setLocalSearch(e.target.value);
                setSearchQuery(e.target.value);
              }}
              placeholder={t('searchPlaceholder')}
              className="w-full py-2.5 sm:py-3 pr-8 text-sm sm:text-base bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
            />

            {localSearch && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 sm:py-3 bg-slate-900 hover:bg-slate-800 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-semibold text-sm rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>{language === 'bn' ? 'খুঁজুন' : 'Search'}</span>
            </button>
          </form>

          {/* Quick Filter Search Suggestions */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">{language === 'bn' ? 'জনপ্রিয় অনুসন্ধান:' : 'Trending:'}</span>
            {quickSearchTags.map(tag => (
              <button
                key={tag.query}
                type="button"
                onClick={() => handleTagClick(tag.query)}
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 hover:bg-cyan-50 dark:hover:bg-cyan-950 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              navigateTo('tools');
            }}
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold shadow-md shadow-cyan-600/20 hover:shadow-cyan-600/30 transition-all flex items-center gap-2 group"
          >
            <span>{t('ctaExplore')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => navigateTo('categories')}
            className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-sm font-semibold transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            <span>{t('ctaCategories')}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
