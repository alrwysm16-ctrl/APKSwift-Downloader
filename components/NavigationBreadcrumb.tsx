'use client';

import React from 'react';
import { Home, ArrowLeft, ArrowRight, RefreshCw, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { SourceId } from '@/lib/types';

interface NavigationBreadcrumbProps {
  appTitle?: string;
  onGoHome: () => void;
  onGoBack: () => void;
  onRetry: () => void;
  currentSource: SourceId;
  lang: 'ar' | 'en';
}

export default function NavigationBreadcrumb({
  appTitle,
  onGoHome,
  onGoBack,
  onRetry,
  currentSource,
  lang,
}: NavigationBreadcrumbProps) {
  const isAr = lang === 'ar';

  const sourceLabels: Record<SourceId, string> = {
    all: isAr ? 'جميع المصادر المتعددة' : 'Multi-Source Search',
    gplay: 'Google Play',
    apkpure: 'APKPure',
    uptodown: 'Uptodown',
    apkcombo: 'APKCombo',
    apkmirror: 'APKMirror',
    apkfab: 'APKFab',
    official: isAr ? 'المطور الرسمي' : 'Official Repo',
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-3 px-3 sm:px-4">
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 sm:p-4 rounded-2xl bg-[#0d1b33]/90 border border-slate-700/80 shadow-lg backdrop-blur-md">
        {/* Navigation Actions (Home & Back & Retry) with high touch target > 44px */}
        <div className="flex items-center gap-2">
          {/* Home Button */}
          <button
            onClick={onGoHome}
            className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
            title={isAr ? 'العودة إلى الصفحة الرئيسية' : 'Return to Homepage'}
          >
            <Home className="w-4 h-4 stroke-[2.5]" />
            <span>{isAr ? 'الرئيسية' : 'Home'}</span>
          </button>

          {/* Back Button */}
          <button
            onClick={onGoBack}
            className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            title={isAr ? 'رجوع للخطوة السابقة' : 'Go Back to Previous Step'}
          >
            {isAr ? <ArrowRight className="w-4 h-4 text-cyan-400" /> : <ArrowLeft className="w-4 h-4 text-cyan-400" />}
            <span>{isAr ? 'رجوع' : 'Back'}</span>
          </button>

          {/* Retry Button */}
          <button
            onClick={onRetry}
            className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-emerald-400 text-xs sm:text-sm flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
            title={isAr ? 'إعادة المحاولة / تحديث البيانات' : 'Retry / Refresh Data'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'تحديث' : 'Retry'}</span>
          </button>
        </div>

        {/* Breadcrumb Path & Active Source Badge */}
        <div className="flex items-center gap-2 text-xs text-slate-400 overflow-hidden">
          <span className="hidden md:flex items-center gap-1 truncate font-medium">
            <span className="hover:text-white cursor-pointer" onClick={onGoHome}>
              {isAr ? 'الرئيسية' : 'Home'}
            </span>
            {isAr ? <ChevronLeft className="w-3.5 h-3.5 text-slate-600" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
            <span className="text-slate-300 font-bold truncate max-w-[150px]">
              {appTitle || (isAr ? 'نتائج التحميل' : 'Results')}
            </span>
          </span>

          <span className="px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-medium text-[11px] flex items-center gap-1 shrink-0">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>{sourceLabels[currentSource]}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
