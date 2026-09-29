import React from 'react';
import { useApp } from '../context/AppContext.js';
import { 
  Layers, MessageSquare, Image, Video, Music, PenTool, 
  Code, Palette, GraduationCap, CheckSquare, Search, 
  Layout, TrendingUp, Mic, Globe, Box, Cpu, Folder, ArrowRight
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="w-5 h-5 text-cyan-500" />,
  Image: <Image className="w-5 h-5 text-indigo-500" />,
  Video: <Video className="w-5 h-5 text-rose-500" />,
  Music: <Music className="w-5 h-5 text-amber-500" />,
  PenTool: <PenTool className="w-5 h-5 text-emerald-500" />,
  Code: <Code className="w-5 h-5 text-blue-500" />,
  Palette: <Palette className="w-5 h-5 text-fuchsia-500" />,
  GraduationCap: <GraduationCap className="w-5 h-5 text-purple-500" />,
  CheckSquare: <CheckSquare className="w-5 h-5 text-teal-500" />,
  Search: <Search className="w-5 h-5 text-sky-500" />,
  Layout: <Layout className="w-5 h-5 text-orange-500" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-emerald-500" />,
  Mic: <Mic className="w-5 h-5 text-red-500" />,
  Globe: <Globe className="w-5 h-5 text-cyan-600" />,
  Box: <Box className="w-5 h-5 text-violet-500" />,
  Cpu: <Cpu className="w-5 h-5 text-slate-500" />,
};

export const CategoriesView: React.FC = () => {
  const { categories, tools, language, t, setSelectedCategory, navigateTo } = useApp();

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    navigateTo('tools');
  };

  return (
    <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('navCategories')}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          {language === 'bn' 
            ? 'আপনার প্রয়োজনীয় কাজের জন্য নির্দিষ্ট ক্যাটাগরি বেছে নিন'
            : 'Explore AI tools organized across creative, engineering, and enterprise workflows'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories
          .filter(c => c.active)
          .map(category => {
            const catName = language === 'bn' && category.name_bn ? category.name_bn : category.name_en;
            const catDesc = language === 'bn' && category.description_bn ? category.description_bn : category.description_en;
            const count = tools.filter(t => t.category_id === category.id && t.active).length;
            const icon = ICON_MAP[category.icon] || <Folder className="w-5 h-5 text-cyan-500" />;

            return (
              <div
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
                      {icon}
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {count} {language === 'bn' ? 'টুল' : 'tools'}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {catName}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {catDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                  <span>{language === 'bn' ? 'টুলস দেখুন' : 'Explore'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
