import React from 'react';
import { useApp } from '../context/AppContext.js';
import { Sparkles, Compass, CheckCircle2, Shield, ArrowRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { language, t, navigateTo } = useApp();

  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('aboutTitle')}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          {t('tagline')}
        </p>
      </div>

      {/* Main Core About Copy (Exact Required Text) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'bn' ? 'আমাদের মূল উদ্দেশ্য' : 'Our Primary Mission'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'bn' ? 'স্বচ্ছ ও নির্ভরযোগ্য AI ডিরেক্টরি' : 'Transparent & Verified Directory'}
            </p>
          </div>
        </div>

        {/* Exact Required Quotation / Statement */}
        <blockquote className="border-l-4 border-cyan-500 pl-4 py-1 text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic bg-slate-50/50 dark:bg-slate-800/30 rounded-r-xl pr-3">
          {language === 'bn'
            ? '“ALL IN ONE এমন একটি AI directory যেখানে বিভিন্ন ধরনের দরকারি AI tool এক জায়গা থেকে খুঁজে পাওয়া যায়।”'
            : '“ALL IN ONE is a directory designed to help people discover useful AI tools from one convenient place.”'}
        </blockquote>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {language === 'bn'
            ? 'কৃত্রিম বুদ্ধিমত্তা বর্তমান বিশ্বে নিত্যনতুন সম্ভাবনা তৈরি করছে। কিন্তু প্রতিনিয়ত শত শত নতুন AI প্ল্যাটফর্ম আসার কারণে কোনটি নির্ভরযোগ্য এবং কোন কাজের জন্য কোনটি সেরা তা নির্বাচন করা কঠিন। ALL IN ONE-এর মাধ্যমে আমরা প্রতিটি টুলের অফিসিয়াল ওয়েবসাইট লিংক, প্রধান সুবিধাসমূহ এবং মূল্যতালিকা সংক্রান্ত তথ্য একত্রিত করে উপস্থাপন করি যাতে ব্যবহারকারী খুব দ্রুত সঠিক সিদ্ধান্ত নিতে পারেন।'
            : 'Artificial intelligence is rapidly transforming workflows across creative, engineering, and business disciplines. However, finding the right tool amidst hundreds of releases can be daunting. ALL IN ONE categorizes verified AI platforms, checks official URLs, and presents clear pricing and capability details without bias.'}
        </p>

        {/* Feature List */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {language === 'bn' ? 'ভেরিফাইড অফিসিয়াল লিংক' : 'Verified Official URLs'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'bn' ? 'কোনো বিভ্রান্তিকর বা ভুয়া লিংক নয়।' : 'Never fake or invented external destinations.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Compass className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {language === 'bn' ? 'সহজ ক্যাটাগরি ও ফিল্টার' : 'Intuitive Taxonomy'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'bn' ? 'চ্যাট, ছবি, কোডিং, ভিডিও সহজে ফিল্টার করুন।' : 'Find specific tools for any workflow in seconds.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {language === 'bn' ? 'দ্বিভাষিক সুবিধা' : 'English & Bengali'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'bn' ? 'ইংরেজি ও বাংলা উভয় ভাষায় পূর্ণ তথ্য।' : 'Seamless localized experience across both languages.'}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 text-center sm:text-left">
          <button
            onClick={() => navigateTo('tools')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-cyan-500 hover:bg-slate-800 dark:hover:bg-cyan-400 text-white dark:text-slate-950 text-xs font-semibold transition-all"
          >
            <span>{t('ctaExplore')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
