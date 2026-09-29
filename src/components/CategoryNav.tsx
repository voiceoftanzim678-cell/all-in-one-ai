import React from 'react';
import { useApp } from '../context/AppContext.js';
import { 
  Layers, MessageSquare, Image, Video, Music, PenTool, 
  Code, Palette, GraduationCap, CheckSquare, Search, 
  Layout, TrendingUp, Mic, Globe, Box, Cpu, Folder
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="w-4 h-4" />,
  Image: <Image className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  Music: <Music className="w-4 h-4" />,
  PenTool: <PenTool className="w-4 h-4" />,
  Code: <Code className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
  CheckSquare: <CheckSquare className="w-4 h-4" />,
  Search: <Search className="w-4 h-4" />,
  Layout: <Layout className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  Mic: <Mic className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
  Box: <Box className="w-4 h-4" />,
  Cpu: <Cpu className="w-4 h-4" />,
};

export const CategoryNav: React.FC = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    language,
    t,
  } = useApp();

  return (
    <div className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          {/* "All Categories" tab */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('allCategories')}</span>
          </button>

          {/* Active Categories from Backend Database */}
          {categories
            .filter(c => c.active)
            .map(cat => {
              const isActive = selectedCategory === cat.id;
              const catName = (language === 'bn' && cat.name_bn) ? cat.name_bn : cat.name_en;
              const icon = ICON_MAP[cat.icon] || <Folder className="w-3.5 h-3.5" />;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 font-semibold shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/80'
                  }`}
                >
                  <span className="opacity-80">{icon}</span>
                  <span>{catName}</span>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};
