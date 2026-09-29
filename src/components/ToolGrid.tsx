import React from 'react';
import { useApp } from '../context/AppContext.js';
import { ToolCard } from './ToolCard.js';
import { AdPlaceholder } from './AdPlaceholder.js';
import { Filter, ArrowUpDown, X, Search, Sparkles, Layers } from 'lucide-react';

export const ToolGrid: React.FC = () => {
  const {
    tools,
    categories,
    loading,
    error,
    language,
    t,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedFilter,
    setSelectedFilter,
    selectedPricing,
    setSelectedPricing,
    sortBy,
    setSortBy,
    resetFilters,
  } = useApp();

  // Active category display name
  const currentCategory = categories.find(c => c.id === selectedCategory);
  const currentCategoryTitle = selectedCategory === 'all'
    ? t('allCategories')
    : currentCategory
    ? (language === 'bn' && currentCategory.name_bn ? currentCategory.name_bn : currentCategory.name_en)
    : selectedCategory;

  // Filter and sort active public tools
  const filteredTools = tools.filter(tool => {
    // Only active tools for public visitors
    if (!tool.active) return false;

    // Category filter
    if (selectedCategory !== 'all' && tool.category_id !== selectedCategory) {
      return false;
    }

    // Status filter
    if (selectedFilter === 'featured' && !tool.featured) return false;
    if (selectedFilter === 'popular' && !tool.popular) return false;
    if (selectedFilter === 'sponsored' && !tool.sponsored) return false;

    // Pricing filter
    if (selectedPricing !== 'all' && tool.pricing_type.toLowerCase() !== selectedPricing.toLowerCase()) {
      return false;
    }

    // Search query (English, Bengali, tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const cat = categories.find(c => c.id === tool.category_id);
      const catText = cat ? `${cat.name_en} ${cat.name_bn || ''}`.toLowerCase() : '';

      const matchName = tool.name_en.toLowerCase().includes(q) || (tool.name_bn && tool.name_bn.toLowerCase().includes(q));
      const matchShort = tool.short_description_en.toLowerCase().includes(q) || (tool.short_description_bn && tool.short_description_bn.toLowerCase().includes(q));
      const matchFull = tool.full_description_en?.toLowerCase().includes(q) || (tool.full_description_bn && tool.full_description_bn.toLowerCase().includes(q));
      const matchTags = tool.tags?.some(tag => tag.toLowerCase().includes(q));
      const matchCat = catText.includes(q);

      if (!matchName && !matchShort && !matchFull && !matchTags && !matchCat) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  const sortedTools = [...filteredTools].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      return a.name_en.localeCompare(b.name_en);
    }
    if (sortBy === 'popular') {
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    }
    // default: newest
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedFilter !== 'all' || 
    selectedPricing !== 'all' || 
    Boolean(searchQuery.trim());

  return (
    <section id="tools-section" className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Controls Bar: Category Title, Filter Badges, Sort Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentCategoryTitle}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 tabular-nums">
              {sortedTools.length}
            </span>
          </div>

          {searchQuery && (
            <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
              <span>{language === 'bn' ? 'অনুসন্ধান ফলাফল:' : 'Results for:'}</span>
              <span className="font-semibold text-cyan-600 dark:text-cyan-400">"{searchQuery}"</span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Filter Pills / Segmented Controls & Sort */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Status Filter Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200/80 dark:border-slate-800">
            {(['all', 'featured', 'popular', 'sponsored'] as const).map(filterKey => {
              const labelMap: Record<string, string> = {
                all: t('filterAll'),
                featured: t('filterFeatured'),
                popular: t('filterPopular'),
                sponsored: t('filterSponsored'),
              };
              const isActive = selectedFilter === filterKey;
              return (
                <button
                  key={filterKey}
                  onClick={() => setSelectedFilter(filterKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {labelMap[filterKey]}
                </button>
              );
            })}
          </div>

          {/* Pricing Model Dropdown */}
          <select
            value={selectedPricing}
            onChange={e => setSelectedPricing(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">{t('pricingAll')}</option>
            <option value="free">{t('pricingFree')}</option>
            <option value="freemium">{t('pricingFreemium')}</option>
            <option value="paid">{t('pricingPaid')}</option>
            <option value="free trial">{t('pricingFreeTrial')}</option>
          </select>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="newest">{t('sortNewest')}</option>
              <option value="alphabetical">{t('sortAlphabetical')}</option>
              <option value="popular">{t('sortPopular')}</option>
            </select>
          </div>

          {/* Clear Filters Button if any active */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-500 hover:text-rose-600 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              {t('clearFilters')}
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs sm:text-sm text-slate-400">{t('loadingTools')}</p>
        </div>
      ) : sortedTools.length === 0 ? (
        /* Empty State with Friendly Messages */
        <div className="py-20 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 p-8 space-y-3 max-w-md mx-auto">
          <Search className="w-10 h-10 text-slate-400 mx-auto stroke-[1.5]" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t('noToolsFound')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t('noToolsHint')}
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="mt-3 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
            >
              {t('clearFilters')}
            </button>
          )}
        </div>
      ) : (
        /* Responsive Grid of Cards with In-Between Ad Placement */
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedTools.map((tool, index) => (
              <React.Fragment key={tool.id}>
                <ToolCard tool={tool} />
                {/* Reserved Native Monetization Ad Space between cards after card #6 */}
                {index === 5 && (
                  <div className="col-span-full">
                    <AdPlaceholder zone="feed" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
