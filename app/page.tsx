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
import { AppDetails, ApkVariant, DeviceSpecs, SearchHistoryItem } from '@/lib/types';
import { detectClientDevice } from '@/lib/device-detector';
import { AlertCircle, ShieldAlert, Cpu, Sparkles, Smartphone, CheckCircle2 } from 'lucide-react';

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

  const handleSearch = async (query: string, specs: DeviceSpecs) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/app-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: query, deviceSpecs: specs }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || (lang === 'ar' ? 'تعذر جلب التطبيق' : 'Failed to retrieve app'));
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

  const handleClearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('apk_search_history');
    } catch {}
  };

  const isAr = lang === 'ar';

  return (
    <div className={`min-h-screen flex flex-col justify-between ${isOledMode ? 'bg-black' : 'bg-[#070c18]'}`}>
      <BackgroundEffects />

      {/* Top Header matching image */}
      <Header
        onOpenHowItWorks={() => setShowHowItWorks(true)}
        onOpenContact={() => setShowContact(true)}
        onOpenBackendSettings={() => setShowBackendSettings(true)}
        isOledMode={isOledMode}
        onToggleOled={handleToggleOled}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6">
        {/* Hero & Search matching prompt image */}
        <HeroSearch
          onSearch={handleSearch}
          isLoading={isLoading}
          deviceSpecs={deviceSpecs}
          onUpdateSpecs={setDeviceSpecs}
          lang={lang}
        />

        {/* Error notification if any */}
        {error && (
          <div className="max-w-3xl mx-auto my-4 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-sm flex items-start gap-3 shadow-xl animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-right rtl:text-right ltr:text-left flex-1">
              <strong className="block font-bold mb-1">
                {isAr ? 'تنبيه أثناء معالجة الطلب:' : 'Error processing request:'}
              </strong>
              <p className="leading-relaxed">{error}</p>
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
              lang={lang}
            />
          </div>
        )}

        {/* Recent Search History - rendered client-side only to prevent hydration mismatch */}
        {isClient && searchHistory.length > 0 && (
          <SearchHistory
            history={searchHistory}
            onSelect={(pkgId) => handleSearch(pkgId, deviceSpecs)}
            onClear={handleClearHistory}
            lang={lang}
          />
        )}

        {/* Feature Highlights Grid */}
        <section className="my-12 grid grid-cols-1 md:grid-cols-3 gap-5">
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
              {isAr ? 'حزم XAPK و Split APKs الأصلية' : 'Authentic APK & XAPK Packages'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'تحميل الحزم الكاملة بما فيها ملفات OBB والتقسيمات، مع فحص بصمات التجزئة SHA-256 لضمان سلامة الملف.'
                : 'Download complete bundles with OBB and split assets, verified against cryptographic SHA-256 signatures.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#091326]/70 border border-slate-800/80 text-right rtl:text-right ltr:text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {isAr ? 'تحميل مباشر أو مسح رمز QR' : 'Direct or QR Mobile Download'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'تنزيل فوري عالي السرعة على جهازك، أو مسح رمز QR عبر كاميرا هاتفك لتثبيت التطبيق مباشرة.'
                : 'High-speed downloads or scan instant QR codes directly on your mobile device.'}
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#060b17] py-8 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right rtl:sm:text-right ltr:sm:text-left">
          <div>
            <p className="text-slate-300 font-bold">
              APK Downloader &copy; 2026 — {isAr ? 'منصة تحميل ملفات Google Play' : 'Google Play APK Platform'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {isAr
                ? 'مستوحى ومبني بالتكامل مع مرجع alltechdev/gplay-apk-downloader المفتوح المصدر.'
                : 'Built with reference and integration to open-source alltechdev/gplay-apk-downloader.'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
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

      {/* Modals */}
      {activeDownloadVariant && currentApp && (
        <DownloadModal
          app={currentApp}
          variant={activeDownloadVariant}
          onClose={() => setActiveDownloadVariant(null)}
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
