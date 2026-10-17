'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BackgroundEffects from '@/components/BackgroundEffects';
import HeroSearch from '@/components/HeroSearch';
import AppResultCard from '@/components/AppResultCard';
import DownloadModal from '@/components/DownloadModal';
import QrModal from '@/components/QrModal';
import HowItWorksModal from '@/components/HowItWorksModal';
import GPlayBackendModal from '@/components/GPlayBackendModal';
import ContactModal from '@/components/ContactModal';
import SearchHistory from '@/components/SearchHistory';
import NavigationBreadcrumb from '@/components/NavigationBreadcrumb';
import MobileBottomNav from '@/components/MobileBottomNav';
import { AppDetails, ApkVariant, DeviceSpecs, SearchHistoryItem, SourceId } from '@/lib/types';
import { detectClientDevice } from '@/lib/device-detector';
import { AlertCircle, Cpu, Sparkles, Smartphone, RotateCcw, Home, ArrowRight, ArrowLeft } from 'lucide-react';

const DEFAULT_SPECS: DeviceSpecs = {
  arch: 'arm64-v8a',
  androidVersion: 'Android 14 (API 34)',
  apiLevel: 34,
  dpi: '480',
  detectedModel: 'Galaxy S24 / Pixel 8 (ARM64)',
  isAutoDetected: false,
};

function useIsClient() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function HomePage() {
  const isClient = useIsClient();
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [isOledMode, setIsOledMode] = useState(false);

  // Search input and source state kept across steps
  const [inputUrl, setInputUrl] = useState('');
  const [selectedSource, setSelectedSource] = useState<SourceId>('all');

  const [deviceSpecs, setDeviceSpecs] = useState<DeviceSpecs>(DEFAULT_SPECS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentApp, setCurrentApp] = useState<AppDetails | null>(null);

  // Modals state
  const [activeDownloadVariant, setActiveDownloadVariant] = useState<ApkVariant | null>(null);
  const [activeQrVariant, setActiveQrVariant] = useState<ApkVariant | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showBackendSettings, setShowBackendSettings] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Search history state - identical on SSR and client initial mount
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  // Safely hydrate client-only values (device specs, search history) after mounting
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedHistory = localStorage.getItem('apk_search_history');
        if (savedHistory) {
          setSearchHistory(JSON.parse(savedHistory));
        }
      } catch {
        // ignore
      }
      const detected = detectClientDevice();
      setDeviceSpecs(detected);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleOled = () => {
    setIsOledMode(!isOledMode);
    if (!isOledMode) {
      document.body.classList.add('oled-mode');
    } else {
      document.body.classList.remove('oled-mode');
    }
  };

  const handleToggleLang = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
  };

  const handleSearch = async (
    query: string,
    specs: DeviceSpecs = deviceSpecs,
    source: SourceId = selectedSource
  ) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setInputUrl(query);

    try {
      const res = await fetch('/api/app-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: query, deviceSpecs: specs, source }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error ||
            (lang === 'ar'
              ? 'تعذر جلب التطبيق أو اللعبة من المصادر المحددة'
              : 'Failed to retrieve application/game from selected sources')
        );
      }

      const app: AppDetails = data.appDetails;
      setCurrentApp(app);

      // Save to search history
      const newHistoryItem: SearchHistoryItem = {
        packageId: app.packageId,
        title: app.title,
        icon: app.icon,
        version: app.version,
        timestamp: Date.now(),
      };

      setSearchHistory((prev) => {
        const filtered = prev.filter((item) => item.packageId !== app.packageId);
        const updated = [newHistoryItem, ...filtered].slice(0, 10);
        try {
          localStorage.setItem('apk_search_history', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // Smooth scroll to result
      setTimeout(() => {
        const el = document.getElementById('app-result-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع أثناء معالجة الطلب');
      setCurrentApp(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Home navigation: resets result view without losing user input in the box
  const handleGoHome = () => {
    setCurrentApp(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back navigation: step back smoothly
  const handleGoBack = () => {
    if (activeDownloadVariant) {
      setActiveDownloadVariant(null);
    } else if (currentApp) {
      setCurrentApp(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Retry search
  const handleRetry = () => {
    if (inputUrl) {
      handleSearch(inputUrl, deviceSpecs, selectedSource);
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('apk_search_history');
    } catch {}
  };

  const isAr = lang === 'ar';

  return (
    <div
      className={`min-h-screen w-full max-w-[100vw] overflow-x-hidden flex flex-col justify-between pb-24 md:pb-0 relative ${
        isOledMode ? 'bg-black' : 'bg-[#070c18]'
      }`}
    >
      <BackgroundEffects />

      {/* Top Header matching image */}
      <Header
        onGoHome={handleGoHome}
        onOpenHowItWorks={() => setShowHowItWorks(true)}
        onOpenContact={() => setShowContact(true)}
        onOpenBackendSettings={() => setShowBackendSettings(true)}
        isOledMode={isOledMode}
        onToggleOled={handleToggleOled}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full sm:max-w-6xl mx-auto px-2.5 sm:px-6 overflow-hidden">
        {/* Navigation Breadcrumb bar with Home and Back buttons when an app is viewed */}
        {currentApp && (
          <NavigationBreadcrumb
            appTitle={currentApp.title}
            onGoHome={handleGoHome}
            onGoBack={handleGoBack}
            onRetry={handleRetry}
            currentSource={selectedSource}
            lang={lang}
          />
        )}

        {/* Hero & Search matching prompt image */}
        <HeroSearch
          onSearch={handleSearch}
          isLoading={isLoading}
          deviceSpecs={deviceSpecs}
          onUpdateSpecs={setDeviceSpecs}
          selectedSource={selectedSource}
          onSelectSource={setSelectedSource}
          inputUrl={inputUrl}
          onInputUrlChange={setInputUrl}
          lang={lang}
        />

        {/* Error notification if any with Retry button */}
        {error && (
          <div className="max-w-3xl mx-auto my-4 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl animate-fadeIn">
            <div className="flex items-start gap-3 text-right rtl:text-right ltr:text-left flex-1">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">
                  {isAr ? 'تنبيه أثناء معالجة الطلب:' : 'Error processing request:'}
                </strong>
                <p className="leading-relaxed text-xs sm:text-sm">{error}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={handleRetry}
                className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
              </button>

              <button
                onClick={handleGoHome}
                className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Result Section */}
        {currentApp && (
          <div id="app-result-section" className="animate-fadeIn">
            <AppResultCard
              app={currentApp}
              deviceSpecs={deviceSpecs}
              onInitiateDownload={(variant) => setActiveDownloadVariant(variant)}
              onShowQr={(variant) => setActiveQrVariant(variant)}
              onGoHome={handleGoHome}
              onGoBack={handleGoBack}
              lang={lang}
            />
          </div>
        )}

        {/* Recent Search History - rendered client-side only to prevent hydration mismatch */}
        {isClient && searchHistory.length > 0 && (
          <SearchHistory
            history={searchHistory}
            onSelect={(pkgId) => handleSearch(pkgId, deviceSpecs, selectedSource)}
            onClear={handleClearHistory}
            lang={lang}
          />
        )}

        {/* Feature Highlights Grid */}
        <section className="my-10 sm:my-14 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div className="p-5 rounded-2xl bg-[#091326]/70 border border-slate-800/80 text-right rtl:text-right ltr:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {isAr ? 'تخصيص المعمارية ومطابقة الجهاز' : 'CPU Architecture Matching'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'فحص فوري ودعم شامل لمعماريات ARM64-v8a و armeabi-v7a و x86_64 مع كشف تلقائي لمواصفات جهازك.'
                : 'Instant checks and full support for ARM64-v8a, armeabi-v7a, and x86_64 with automated device detection.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#091326]/70 border border-slate-800/80 text-right rtl:text-right ltr:text-left">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {isAr ? 'تعدد المصادر: APKPure, Uptodown, APKCombo' : 'Multi-Source Repositories'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'تنزيل مباشر موثوق عبر كبرى المنصات العالمية (APKPure, Uptodown, APKCombo, APKFab, APKMirror) مع التحقق الأمني.'
                : 'Direct downloads across global repositories (APKPure, Uptodown, APKCombo, APKFab, APKMirror) with verification.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#091326]/70 border border-slate-800/80 text-right rtl:text-right ltr:text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {isAr ? 'تصميم متوافق مع هواتف أندرويد' : 'Mobile-First Android UX'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'واجهة لمسية متجاوبة وسريعة، مع أزرار رجوع ورئيسية دائمة وشريط تنقل سفلي مخصص للهواتف الذكية.'
                : 'Touch-friendly interface with persistent Home/Back buttons and an Android mobile bottom bar.'}
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#060b17] py-8 text-xs text-slate-400 mb-14 md:mb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right rtl:sm:text-right ltr:sm:text-left">
          <div>
            <p className="text-slate-300 font-bold">
              APK Downloader &copy; 2026 — {isAr ? 'منصة تحميل ألعاب وتطبيقات Google Play والمصادر المعتمدة' : 'Multi-Source APK Platform'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {isAr
                ? 'يدعم APKPure و Uptodown و APKCombo و APKMirror و APKFab، ومستوحى من alltechdev/gplay-apk-downloader.'
                : 'Supports APKPure, Uptodown, APKCombo, APKMirror, APKFab, and alltechdev/gplay-apk-downloader.'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={handleGoHome}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </button>
            <span>•</span>
            <button
              onClick={() => setShowHowItWorks(true)}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {isAr ? 'كيف يعمل؟' : 'How it works?'}
            </button>
            <span>•</span>
            <button
              onClick={() => setShowBackendSettings(true)}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              {isAr ? 'إعدادات السيرفر' : 'Server Setup'}
            </button>
            <span>•</span>
            <button
              onClick={() => setShowContact(true)}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              {isAr ? 'اتصل بنا' : 'Contact'}
            </button>
          </div>
        </div>
      </footer>

      {/* Fixed Mobile Bottom Bar for touch-friendly navigation on Android phones */}
      <MobileBottomNav
        onGoHome={handleGoHome}
        onGoBack={handleGoBack}
        onToggleSpecs={() => {
          const el = document.getElementById('app-result-section') || document.body;
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        onOpenSources={() => {
          window.scrollTo({ top: 180, behavior: 'smooth' });
        }}
        hasActiveResult={!!currentApp}
        lang={lang}
      />

      {/* Modals */}
      {activeDownloadVariant && currentApp && (
        <DownloadModal
          app={currentApp}
          variant={activeDownloadVariant}
          onClose={() => setActiveDownloadVariant(null)}
          onGoHome={handleGoHome}
          lang={lang}
        />
      )}

      {activeQrVariant && currentApp && (
        <QrModal
          app={currentApp}
          variant={activeQrVariant}
          onClose={() => setActiveQrVariant(null)}
          lang={lang}
        />
      )}

      {showHowItWorks && (
        <HowItWorksModal onClose={() => setShowHowItWorks(false)} lang={lang} />
      )}

      {showBackendSettings && (
        <GPlayBackendModal onClose={() => setShowBackendSettings(false)} lang={lang} />
      )}

      {showContact && (
        <ContactModal onClose={() => setShowContact(false)} lang={lang} />
      )}
    </div>
  );
}
