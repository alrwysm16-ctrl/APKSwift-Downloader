'use client';

import React, { useState } from 'react';
import { Smartphone, Moon, Sun, Server, HelpCircle, Mail, Globe, Home, MoreVertical, X } from 'lucide-react';

interface HeaderProps {
  onGoHome: () => void;
  onOpenHowItWorks: () => void;
  onOpenContact: () => void;
  onOpenBackendSettings: () => void;
  isOledMode: boolean;
  onToggleOled: () => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
}

export default function Header({
  onGoHome,
  onOpenHowItWorks,
  onOpenContact,
  onOpenBackendSettings,
  isOledMode,
  onToggleOled,
  lang,
  onToggleLang,
}: HeaderProps) {
  const isAr = lang === 'ar';
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="w-full max-w-[100vw] overflow-x-hidden border-b border-slate-800/80 bg-[#070c18]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Title with 1-click Home navigation */}
        <div
          onClick={onGoHome}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0"
          title={isAr ? 'العودة للصفحة الرئيسية' : 'Return to Home'}
        >
          <div className="relative flex items-center justify-center">
            {/* Green rounded badge matching image */}
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0b162c] rounded-[10px] flex flex-col items-center justify-center p-0.5 sm:p-1 border border-emerald-400/30">
                <span className="text-[7px] sm:text-[9px] font-black text-emerald-400 tracking-wider">APK</span>
                <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 stroke-[2.5]" />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-1">
              APK <span className="text-emerald-400 font-sans">Downloader</span>
            </span>
            <span className="text-[9px] text-slate-400 hidden md:inline">
              {isAr ? 'تنزيل ألعاب وتطبيقات Google Play مباشرة' : 'Direct & Verified GPlay Mirror'}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Items */}
        <nav className="hidden md:flex items-center gap-2 sm:gap-3">
          <button
            onClick={onGoHome}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-800/90 text-emerald-300 border border-emerald-500/40 shadow-sm transition-all hover:bg-slate-700/80 active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Home className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            <span>{isAr ? 'الرئيسية' : 'Home'}</span>
          </button>

          <button
            onClick={onOpenHowItWorks}
            className="min-h-[40px] px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>{isAr ? 'كيف يعمل؟' : 'How it works?'}</span>
          </button>

          <button
            onClick={onOpenContact}
            className="min-h-[40px] px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Mail className="w-4 h-4 text-slate-400" />
            <span>{isAr ? 'اتصل بنا' : 'Contact'}</span>
          </button>

          <div className="h-5 w-px bg-slate-700 mx-0.5" />

          <button
            onClick={onOpenBackendSettings}
            title={isAr ? 'إعدادات ربط سيرفر gplay-apk-downloader' : 'GPlay Backend Setup'}
            className="min-h-[40px] min-w-[40px] p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800/70 transition-all border border-transparent hover:border-slate-700 flex items-center justify-center cursor-pointer"
          >
            <Server className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleOled}
            title={isOledMode ? 'الوضع الليلي العادي' : 'وضع الشاشات السوداء OLED'}
            className={`min-h-[40px] min-w-[40px] p-2 rounded-xl transition-all border flex items-center justify-center cursor-pointer ${
              isOledMode
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/70 border-transparent hover:border-slate-700'
            }`}
          >
            {isOledMode ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleLang}
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
            className="min-h-[40px] px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all border border-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAr ? 'EN' : 'عربي'}</span>
          </button>
        </nav>

        {/* Mobile Compact Navigation - Fits strictly on all phone screens */}
        <div className="flex md:hidden items-center gap-1.5">
          {/* Mobile Home Button */}
          <button
            onClick={onGoHome}
            className="min-h-[38px] px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800/90 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 active:scale-95 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'الرئيسية' : 'Home'}</span>
          </button>

          {/* Quick OLED Mode toggle */}
          <button
            onClick={onToggleOled}
            className={`min-h-[38px] min-w-[38px] p-1.5 rounded-xl transition-all border flex items-center justify-center cursor-pointer ${
              isOledMode
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900 border-slate-800'
            }`}
          >
            {isOledMode ? <Moon className="w-3.5 h-3.5 text-emerald-400" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* Quick Language toggle */}
          <button
            onClick={onToggleLang}
            className="min-h-[38px] px-2 py-1.5 rounded-xl text-[11px] font-bold text-slate-300 bg-slate-900 border border-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>{isAr ? 'EN' : 'ع'}</span>
          </button>

          {/* Mobile More Options Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="min-h-[38px] min-w-[38px] p-1.5 rounded-xl text-slate-300 bg-slate-900 border border-slate-800 flex items-center justify-center cursor-pointer active:scale-95"
            aria-label="More options"
          >
            {showMobileMenu ? <X className="w-4 h-4 text-rose-400" /> : <MoreVertical className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu for Secondary Actions */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-slate-800 bg-[#091326] px-4 py-3 space-y-2 animate-fadeIn shadow-2xl">
          <button
            onClick={() => {
              onOpenHowItWorks();
              setShowMobileMenu(false);
            }}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-800 flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>{isAr ? 'كيف يعمل محمل APK؟' : 'How it works?'}</span>
          </button>

          <button
            onClick={() => {
              onOpenContact();
              setShowMobileMenu(false);
            }}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-800 flex items-center gap-2"
          >
            <Mail className="w-4 h-4 text-slate-400" />
            <span>{isAr ? 'اتصل بنا والدعم الفني' : 'Contact Support'}</span>
          </button>

          <button
            onClick={() => {
              onOpenBackendSettings();
              setShowMobileMenu(false);
            }}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-800 flex items-center gap-2"
          >
            <Server className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'إعدادات ربط سيرفر gplay-apk-downloader' : 'Backend Settings'}</span>
          </button>
        </div>
      )}
    </header>
  );
}
