import React from 'react';
import { useApp } from '../context/AppContext.js';
import { ArrowLeft, Shield, FileText, AlertCircle } from 'lucide-react';

interface LegalPagesProps {
  type: 'privacy' | 'terms' | 'disclaimer';
}

export const LegalPages: React.FC<LegalPagesProps> = ({ type }) => {
  const { language, t, settings, navigateTo } = useApp();

  const titles = {
    privacy: t('privacyPolicy'),
    terms: t('termsOfService'),
    disclaimer: t('disclaimer'),
  };

  const icons = {
    privacy: <Shield className="w-6 h-6 text-cyan-500" />,
    terms: <FileText className="w-6 h-6 text-indigo-500" />,
    disclaimer: <AlertCircle className="w-6 h-6 text-amber-500" />,
  };

  let content = '';
  if (type === 'privacy') {
    content = language === 'bn' 
      ? (settings?.privacy_policy_bn || settings?.privacy_policy_en || '') 
      : (settings?.privacy_policy_en || '');
  } else if (type === 'terms') {
    content = language === 'bn' 
      ? (settings?.terms_of_service_bn || settings?.terms_of_service_en || '') 
      : (settings?.terms_of_service_en || '');
  } else {
    content = language === 'bn' 
      ? (settings?.disclaimer_bn || settings?.disclaimer_en || '') 
      : (settings?.disclaimer_en || '');
  }

  return (
    <div className="py-12 md:py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigateTo('home')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('backToTools')}</span>
      </button>

      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
            {icons[type]}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {titles[type]}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'bn' ? 'সর্বশেষ হালনাগাদ: ২০২৬' : 'Last Updated: 2026'}
            </p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-4">
          <p className="whitespace-pre-line">{content}</p>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            {language === 'bn'
              ? 'এই পাতার বিষয়বস্তু অ্যাডমিন প্যানেল সেটিংস থেকে ওয়েবসাইট মালিক দ্বারা পরিবর্তনযোগ্য।'
              : 'The terms and policy notices above can be edited anytime from the ALL IN ONE Admin Panel.'}
          </div>
        </div>
      </div>
    </div>
  );
};
