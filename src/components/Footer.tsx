import React from 'react';
import { useApp } from '../context/AppContext.js';
import { Logo } from './Logo.js';
import { AdPlaceholder } from './AdPlaceholder.js';
import { Twitter, Github, Linkedin, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t, navigateTo, settings } = useApp();

  const currentYear = new Date().getFullYear();
  const footerText = language === 'bn' 
    ? (settings?.footer_text_bn || '© ALL IN ONE. সর্বস্বত্ব সংরক্ষিত।')
    : (settings?.footer_text_en || '© ALL IN ONE. All rights reserved.');

  const description = language === 'bn'
    ? (settings?.description_bn || t('footerDescription'))
    : (settings?.description_en || t('footerDescription'));

  const socialLinks = settings?.social_links || {};

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      {/* Footer Ad Area */}
      <AdPlaceholder zone="footer" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100 dark:border-slate-800/80">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <button
              onClick={() => navigateTo('home')}
              className="text-left focus:outline-none"
            >
              <Logo size="md" showTagline />
            </button>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              {description}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {t('navHome')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('tools')}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {t('navTools')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('categories')}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {t('navCategories')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {t('navAbout')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {t('navContact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Pages & Admin */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {t('legal')}
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => navigateTo('privacy')}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {t('privacyPolicy')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('terms')}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {t('termsOfService')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('disclaimer')}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {t('disclaimer')}
                </button>
              </li>
              <li className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => navigateTo('admin')}
                  className="inline-flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t('adminPortal')}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p>{footerText}</p>
          <p className="text-[11px] font-mono text-slate-400">
            {language === 'bn' ? 'অল ইন ওয়ান · ভেরিফাইড এআই ডিরেক্টরি' : 'ALL IN ONE · Verified AI Ecosystem'}
          </p>
        </div>
      </div>
    </footer>
  );
};
