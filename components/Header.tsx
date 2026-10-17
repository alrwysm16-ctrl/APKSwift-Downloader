'use client';

import React from 'react';
import { Smartphone, Moon, Sun, Server, HelpCircle, Mail, Globe } from 'lucide-react';

interface HeaderProps {
  onOpenHowItWorks: () => void;
  onOpenContact: () => void;
  onOpenBackendSettings: () => void;
  isOledMode: boolean;
  onToggleOled: () => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
}

export default function Header({
  onOpenHowItWorks,
  onOpenContact,
  onOpenBackendSettings,
  isOledMode,
  onToggleOled,
  lang,
  onToggleLang,
}: HeaderProps) {
  const isAr = lang === 'ar';

  return (
    <header className="w-full border-b border-slate-800/80 bg-[#070c18]/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            {/* Green rounded badge matching image */}
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 p-[1.5px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0b162c] rounded-[10px] flex flex-col items-center justify-center p-1 border border-emerald-400/30">
                <span className="text-[9px] font-black text-emerald-400 tracking-wider">APK</span>
                <Smartphone className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-1.5">
              APK <span className="text-emerald-400 font-sans">Downloader</span>
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              {isAr ? 'تنزيل مباشر وآمن من Google Play' : 'Direct & Verified GPlay Mirror'}
            </span>
          </div>
        </div>

        {/* Right: Navigation items matching the screenshot */}
        <nav className="flex items-center gap-2 sm:gap-3">
          {/* Active Home Tab */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800/90 text-emerald-300 border border-emerald-500/30 shadow-sm transition-all hover:bg-slate-700/80"
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </button>

          {/* How it works */}
          <button
            onClick={onOpenHowItWorks}
            className="px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">{isAr ? 'كيف يعمل؟' : 'How it works?'}</span>
          </button>

          {/* Contact */}
          <button
            onClick={onOpenContact}
            className="px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
          >
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">{isAr ? 'اتصل بنا' : 'Contact'}</span>
          </button>

          {/* Vertical divider */}
          <div className="h-5 w-px bg-slate-700 mx-1 hidden sm:block" />

          {/* GPlay Backend integration */}
          <button
            onClick={onOpenBackendSettings}
            title={isAr ? 'إعدادات ربط سيرفر gplay-apk-downloader' : 'GPlay Downloader Backend Setup'}
            className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800/70 transition-all border border-transparent hover:border-slate-700"
          >
            <Server className="w-4 h-4" />
          </button>

          {/* Eye-friendly OLED Night Mode */}
          <button
            onClick={onToggleOled}
            title={isOledMode ? 'الوضع الليلي العادي' : 'وضع الشاشات السوداء OLED المريح للعين'}
            className={`p-2 rounded-xl transition-all border ${
              isOledMode
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/70 border-transparent hover:border-slate-700'
            }`}
          >
            {isOledMode ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Language toggle */}
          <button
            onClick={onToggleLang}
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
            className="p-2 px-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all border border-slate-800 flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAr ? 'EN' : 'عربي'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
