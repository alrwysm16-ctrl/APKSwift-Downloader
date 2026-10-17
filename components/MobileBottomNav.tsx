'use client';

import React from 'react';
import { Home, ArrowRight, ArrowLeft, Layers, Settings2, ArrowUp } from 'lucide-react';

interface MobileBottomNavProps {
  onGoHome: () => void;
  onGoBack: () => void;
  onToggleSpecs: () => void;
  onOpenSources: () => void;
  hasActiveResult: boolean;
  lang: 'ar' | 'en';
}

export default function MobileBottomNav({
  onGoHome,
  onGoBack,
  onToggleSpecs,
  onOpenSources,
  hasActiveResult,
  lang,
}: MobileBottomNavProps) {
  const isAr = lang === 'ar';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070c18]/95 border-t border-slate-800/90 backdrop-blur-lg px-2 py-1.5 shadow-2xl safe-area-pb"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home Button */}
        <button
          onClick={onGoHome}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-300 hover:text-emerald-400 active:text-emerald-400 min-w-[56px] min-h-[48px] transition-colors"
        >
          <Home className="w-5 h-5 text-emerald-400 mb-0.5" />
          <span className="text-[10px] font-bold">{isAr ? 'الرئيسية' : 'Home'}</span>
        </button>

        {/* Back Button (Active when viewing result) */}
        {hasActiveResult && (
          <button
            onClick={onGoBack}
            className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-300 hover:text-cyan-400 active:text-cyan-400 min-w-[56px] min-h-[48px] transition-colors"
          >
            {isAr ? <ArrowRight className="w-5 h-5 text-cyan-400 mb-0.5" /> : <ArrowLeft className="w-5 h-5 text-cyan-400 mb-0.5" />}
            <span className="text-[10px] font-bold">{isAr ? 'رجوع' : 'Back'}</span>
          </button>
        )}

        {/* Sources button */}
        <button
          onClick={onOpenSources}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-300 hover:text-purple-400 active:text-purple-400 min-w-[56px] min-h-[48px] transition-colors"
        >
          <Layers className="w-5 h-5 text-purple-400 mb-0.5" />
          <span className="text-[10px] font-bold">{isAr ? 'المصادر' : 'Sources'}</span>
        </button>

        {/* Device Customization Specs */}
        <button
          onClick={onToggleSpecs}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-300 hover:text-orange-400 active:text-orange-400 min-w-[56px] min-h-[48px] transition-colors"
        >
          <Settings2 className="w-5 h-5 text-orange-400 mb-0.5" />
          <span className="text-[10px] font-bold">{isAr ? 'المواصفات' : 'Specs'}</span>
        </button>

        {/* Scroll To Top */}
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white active:text-white min-w-[56px] min-h-[48px] transition-colors"
        >
          <ArrowUp className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">{isAr ? 'أعلى' : 'Top'}</span>
        </button>
      </div>
    </nav>
  );
}
