import React from 'react';
import { 
  Building2, 
  Sun, 
  Moon, 
  Share2, 
  Download, 
  Code, 
  Users, 
  Calendar as CalendarIcon, 
  Video, 
  MapPin, 
  FileText, 
  Wrench, 
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  Globe,
  Scale
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language, TRANSLATIONS } from '../utils/translations';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenApkModal: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onOpenApkModal,
  language,
  setLanguage,
}) => {
  const { isInstallable, install } = usePWAInstall();
  const t = TRANSLATIONS[language];

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'feed', label: t.navFeed, icon: MessageCircle },
    { id: 'laws', label: t.navLaws, icon: Scale },
    { id: 'members', label: t.navMembers, icon: Users },
    { id: 'security', label: t.navSecurity, icon: ShieldCheck },
    { id: 'technical', label: t.navTechnical, icon: Wrench },
    { id: 'content', label: t.navContent, icon: Video },
    { id: 'calendar', label: t.navCalendar, icon: CalendarIcon },
    { id: 'notes', label: t.navNotes, icon: FileText },
    { id: 'map', label: t.navMap, icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Required Developer Identification Banner (Top) */}
      <div className="bg-gradient-to-r from-emerald-800 via-blue-900 to-amber-900 text-white text-xs px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <Code className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          <span className="font-semibold text-emerald-200">{t.devTitle}</span>
          <span className="font-bold underline decoration-emerald-400 decoration-2 underline-offset-2">Adan Deeq Abdirahman Issa</span>
          <span className="text-emerald-100 font-mono hidden md:inline">· {t.devHotline} +252 61 157 1310 / +254 722 123 678</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-[11px] text-emerald-100">
          <a
            href="https://wa.me/252611571310?text=Assalamu%20Alaikum%20Adan%20Deeq,%20I%20have%20an%20update/report%20for%20the%20Cali%20Saleebaan%20App:"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-emerald-600/80 hover:bg-emerald-500 text-white px-2 py-0.5 rounded text-[11px] font-semibold transition"
          >
            <span>{t.notifyDev}</span>
          </a>
          <button 
            onClick={onOpenApkModal}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded text-[11px] font-medium transition"
          >
            <Share2 className="w-3 h-3" />
            <span>{t.installApk}</span>
          </button>
        </div>
      </div>

      {/* Main Top Bar (Standard 3-Zone Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 md:gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 via-blue-800 to-amber-800 p-0.5 shadow-md flex items-center justify-center text-white">
            <Building2 className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-extrabold tracking-tight text-slate-900 dark:text-white uppercase leading-none whitespace-nowrap">
              {t.appName}
            </h1>
            <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide leading-tight whitespace-nowrap">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Language Toggle / Install APK / Dark Mode) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Somali / English Toggle Button for Elders */}
          <button
            onClick={() => setLanguage(language === 'so' ? 'en' : 'so')}
            className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs"
            title="Beddel Luqadda (Switch Language)"
          >
            <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{language === 'so' ? '🇸🇴 Soomaali' : '🇬🇧 English'}</span>
          </button>

          {isInstallable && (
            <button
              onClick={install}
              className="hidden sm:flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.installApk}</span>
            </button>
          )}

          <button
            onClick={onOpenApkModal}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition whitespace-nowrap"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp APK</span>
            <span className="sm:hidden">Share</span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="xl:hidden border-t border-slate-100 dark:border-slate-800/80 px-2 overflow-x-auto scrollbar-none flex items-center gap-1 py-1.5 bg-slate-50/50 dark:bg-slate-950/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
