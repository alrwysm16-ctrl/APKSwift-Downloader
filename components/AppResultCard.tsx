'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Download,
  Star,
  CheckCircle,
  AlertTriangle,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  Layers,
  ExternalLink,
  Info,
  Home,
  ArrowRight,
  ArrowLeft,
  Globe2,
  Gamepad2,
  Sparkles,
  Server,
  Zap,
} from 'lucide-react';
import { AppDetails, ApkVariant, DeviceSpecs, SourceId } from '@/lib/types';

interface AppResultCardProps {
  app: AppDetails;
  deviceSpecs: DeviceSpecs;
  onInitiateDownload: (variant: ApkVariant) => void;
  onShowQr: (variant: ApkVariant) => void;
  onGoHome: () => void;
  onGoBack: () => void;
  lang: 'ar' | 'en';
}

const SOURCE_NAMES: Record<string, { ar: string; en: string }> = {
  all: { ar: 'جميع المصادر', en: 'All Sources' },
  uptodown: { ar: 'منصة Uptodown العربية', en: 'Uptodown' },
  gplay: { ar: 'Google Play', en: 'Google Play' },
  apkcube: { ar: 'APKCube', en: 'APKCube' },
  captaindroid: { ar: 'Captain Droid', en: 'Captain Droid' },
  igetapk: { ar: 'iGetAPK', en: 'iGetAPK' },
  apkpure: { ar: 'APKPure', en: 'APKPure' },
  apkcombo: { ar: 'APKCombo', en: 'APKCombo' },
  apkmirror: { ar: 'APKMirror', en: 'APKMirror' },
  apkfab: { ar: 'APKFab', en: 'APKFab' },
  apksupport: { ar: 'APKSupport', en: 'APKSupport' },
  apkmonk: { ar: 'APKMonk', en: 'APKMonk' },
  apkpremier: { ar: 'APK Premier', en: 'APK Premier' },
  apkgk: { ar: 'APKGK', en: 'APKGK' },
  apksos: { ar: 'APKSOS', en: 'APKSOS' },
  rawapk: { ar: 'RawAPK', en: 'RawAPK' },
  apkhere: { ar: 'ApkHere', en: 'ApkHere' },
  apkflea: { ar: 'APKFlea', en: 'APKFlea' },
  apklister: { ar: 'APKLister', en: 'APKLister' },
  official: { ar: 'المطور الرسمي', en: 'Official' },
};

export default function AppResultCard({
  app,
  deviceSpecs,
  onInitiateDownload,
  onShowQr,
  onGoHome,
  onGoBack,
  lang,
}: AppResultCardProps) {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'downloads' | 'sources' | 'about' | 'security'>('downloads');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formatFilter, setFormatFilter] = useState<'all' | 'apk' | 'xapk'>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceId | 'all'>('all');

  const [customDownloadUrl, setCustomDownloadUrl] = useState(app.originalDownloadUrl || app.variants[0]?.downloadUrl || '');
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  const handleInitiateDownload = (variant: ApkVariant) => {
    const targetUrl = customDownloadUrl || app.originalDownloadUrl || variant.downloadUrl;
    onInitiateDownload({
      ...variant,
      downloadUrl: targetUrl,
    });
  };

  const availableSourceIds = React.useMemo(() => {
    const list: SourceId[] = [];
    app.variants.forEach((v) => {
      if (v.sourceId && !list.includes(v.sourceId)) {
        list.push(v.sourceId);
      }
    });
    return list;
  }, [app.variants]);

  const handleCopyLink = (variant: ApkVariant) => {
    const fullUrl = variant.downloadUrl.startsWith('http')
      ? variant.downloadUrl
      : `${window.location.origin}${variant.downloadUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(variant.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const filteredVariants = app.variants.filter((v) => {
    if (formatFilter === 'apk' && v.format !== 'APK') return false;
    if (formatFilter === 'xapk' && v.format !== 'XAPK' && v.format !== 'Split APKs') return false;
    if (sourceFilter !== 'all' && v.sourceId !== sourceFilter) return false;
    return true;
  });

  return (
    <div className="w-full max-w-full sm:max-w-4xl mx-auto my-3 sm:my-8 bg-[#0a1426]/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-8 shadow-2xl backdrop-blur-xl transition-all overflow-hidden">
      {/* Top Mobile/Desktop Action Bar: Home and Back Button */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          {/* Home Button */}
          <button
            onClick={onGoHome}
            className="min-h-[42px] px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4 stroke-[2.5]" />
            <span>{isAr ? 'الرئيسية' : 'Home'}</span>
          </button>

          {/* Back Button */}
          <button
            onClick={onGoBack}
            className="min-h-[42px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
          >
            {isAr ? <ArrowRight className="w-4 h-4 text-cyan-400" /> : <ArrowLeft className="w-4 h-4 text-cyan-400" />}
            <span>{isAr ? 'رجوع للبحث' : 'Back to Search'}</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 hidden sm:block">
          {isAr ? 'تم استخراج البيانات بنجاح' : 'Package Details Loaded'}
        </div>
      </div>

      {/* App Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-slate-800/80">
        <div className="flex items-start gap-3 sm:gap-6 w-full sm:w-auto">
          {/* App Icon */}
          <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700/60 shadow-lg shrink-0">
            <Image
              src={app.icon || 'https://picsum.photos/seed/apkapp/200/200'}
              alt={app.title}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
              unoptimized
            />
          </div>

          {/* Title & Metadata */}
          <div className="flex flex-col text-right rtl:text-right ltr:text-left flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-2xl font-black text-white leading-snug">{app.title}</h2>
              {app.isPaid ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  {isAr ? `مدفوع (${app.price})` : `Paid (${app.price})`}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>{isAr ? 'مجاني وموثوق' : 'Free & Verified'}</span>
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-cyan-400 font-medium mt-0.5">{app.developer}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-1 select-all break-all">{app.packageId}</p>

            {/* Quick Metrics Badges */}
            <div className="flex items-center flex-wrap gap-2 sm:gap-3 mt-3 text-xs text-slate-300">
              <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{app.rating}</span>
                <span className="text-slate-500 text-[10px]">({app.ratingsCount})</span>
              </span>

              <span className="bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700 text-slate-300">
                {app.category}
              </span>

              <span className="bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700 text-emerald-300">
                {isAr ? `التحميلات: ${app.downloadsCount}` : `${app.downloadsCount} Downloads`}
              </span>
            </div>
          </div>
        </div>

        {/* External Link to Google Play */}
        <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-end">
          <a
            href={app.googlePlayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>{isAr ? 'صفحة Google Play' : 'View on Google Play'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </a>
        </div>
      </div>

      {/* Admin Field: Original Download URL */}
      <div className="my-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-300 font-bold">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Globe2 className="w-4 h-4" />
            <span>{isAr ? 'رابط التحميل الأصلي (Admin Original Download URL):' : 'Original Download URL:'}</span>
          </span>
          <button
            onClick={() => setIsEditingUrl(!isEditingUrl)}
            className="text-emerald-400 hover:underline text-[11px] cursor-pointer"
          >
            {isEditingUrl ? (isAr ? 'حفظ' : 'Save') : (isAr ? 'تعديل الرابط' : 'Edit URL')}
          </button>
        </div>
        {isEditingUrl ? (
          <div className="flex gap-2 pt-1">
            <input
              type="url"
              value={customDownloadUrl}
              onChange={(e) => setCustomDownloadUrl(e.target.value)}
              placeholder="https://ar.uptodown.com/android/..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
            />
            <button
              onClick={() => setIsEditingUrl(false)}
              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              {isAr ? 'تطبيق' : 'Apply'}
            </button>
          </div>
        ) : (
          <p className="font-mono text-slate-400 truncate text-[11px] select-all">
            {customDownloadUrl || app.originalDownloadUrl || app.variants[0]?.downloadUrl}
          </p>
        )}
      </div>

      {/* Device Compatibility Status Banner */}
      <div className="my-4 sm:my-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-right rtl:text-right ltr:text-left">
            <p className="text-xs sm:text-sm font-bold text-white">
              {isAr
                ? `مطابقة المواصفات مع جهازك: ${deviceSpecs.arch}`
                : `Device Match: ${deviceSpecs.arch}`}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400">
              {isAr
                ? `النظام: ${deviceSpecs.androidVersion} | الكثافة: ${deviceSpecs.dpi}dpi`
                : `Target: ${deviceSpecs.androidVersion} | Density: ${deviceSpecs.dpi}dpi`}
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          {isAr ? 'متوافق 100%' : '100% Compatible'}
        </span>
      </div>

      {/* Tabs Header - Touch Friendly with horizontal scroll on mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-800 pb-2 mb-4 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('downloads')}
          className={`min-h-[42px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'downloads'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {isAr ? 'ملفات التحميل' : 'Downloads'} ({filteredVariants.length})
        </button>

        <button
          onClick={() => setActiveTab('sources')}
          className={`min-h-[42px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'sources'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>{isAr ? 'المصادر المتاحة' : 'Available Sources'}</span>
          <span className="px-1.5 py-0.2 rounded-md bg-cyan-900/60 text-cyan-200 text-[10px]">
            {app.availableSources.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`min-h-[42px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'about'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {isAr ? 'الوصف والصور' : 'Screenshots & Info'}
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`min-h-[42px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {isAr ? 'الأمان و SHA-256' : 'Security & Hashes'}
        </button>
      </div>

      {/* Tab 1: Downloads */}
      {activeTab === 'downloads' && (
        <div className="space-y-4">
          {/* Filters Bar: Format & Source Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400 pb-2">
            <div className="flex items-center gap-1.5">
              <span>{isAr ? 'الصيغة:' : 'Format:'}</span>
              {(['all', 'apk', 'xapk'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormatFilter(fmt)}
                  className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    formatFilter === fmt
                      ? 'bg-slate-700 text-cyan-300 border-cyan-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {fmt === 'all' ? (isAr ? 'الكل' : 'All') : fmt.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
              <span className="shrink-0">{isAr ? 'المصدر:' : 'Source:'}</span>
              <button
                key="all"
                onClick={() => setSourceFilter('all')}
                className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer shrink-0 ${
                  sourceFilter === 'all'
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {isAr ? 'جميع المصادر' : 'All'} ({app.variants.length})
              </button>
              {availableSourceIds.map((src) => {
                const count = app.variants.filter((v) => v.sourceId === src).length;
                const sourceMeta = SOURCE_NAMES[src];
                const label = sourceMeta ? (isAr ? sourceMeta.ar : sourceMeta.en) : src.toUpperCase();
                return (
                  <button
                    key={src}
                    onClick={() => setSourceFilter(src)}
                    className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer shrink-0 ${
                      sourceFilter === src
                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 font-bold shadow-sm shadow-emerald-500/30'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{label}</span>
                    <span className="text-[10px] opacity-75 font-normal ml-1 mr-1">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Variants List */}
          <div className="grid grid-cols-1 gap-3">
            {filteredVariants.map((variant) => (
              <div
                key={variant.id}
                className="p-3.5 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
              >
                {/* Variant Info */}
                <div className="flex flex-col text-right rtl:text-right ltr:text-left space-y-1.5 w-full sm:w-auto">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-black font-mono ${
                        variant.format === 'XAPK'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {variant.format}
                    </span>

                    <span className="text-xs sm:text-sm font-bold text-white font-mono">
                      v{variant.version} ({variant.architecture})
                    </span>

                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {variant.source}
                    </span>

                    {variant.isCompatible && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {isAr ? 'متوافق' : 'Compatible'}
                      </span>
                    )}
                  </div>

                  {/* Secondary metadata */}
                  <div className="flex items-center flex-wrap gap-2.5 text-xs text-slate-400">
                    <span>
                      {isAr ? 'الحجم:' : 'Size:'}{' '}
                      <strong className="text-slate-200">{variant.fileSize}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      {isAr ? 'النظام:' : 'OS:'}{' '}
                      <strong className="text-slate-200">{variant.minAndroid}</strong>
                    </span>
                  </div>

                  {variant.splits && (
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate max-w-sm">
                        {isAr
                          ? `حزمة مدمجة (${variant.splits.join(' + ')})`
                          : `Split bundle includes (${variant.splits.join(' + ')})`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions: Download Button, QR, Copy */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {/* QR Code */}
                  <button
                    onClick={() => onShowQr(variant)}
                    title={isAr ? 'مسح رمز QR للهاتف' : 'Scan QR on Mobile'}
                    className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={() => handleCopyLink(variant)}
                    title={isAr ? 'نسخ رابط التحميل' : 'Copy Download Link'}
                    className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    {copiedId === variant.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {/* Primary Download Button */}
                  <button
                    onClick={() => handleInitiateDownload(variant)}
                    className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>{isAr ? 'تحميل مباشر' : 'Download'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Available Multi-Sources (Uptodown, APKCube, Captain Droid, iGetAPK, Google Play, APKPure, etc.) */}
      {activeTab === 'sources' && (
        <div className="space-y-4 text-right rtl:text-right ltr:text-left">
          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200">
            <p className="font-bold mb-1 flex items-center gap-1.5 text-sm text-cyan-300">
              <Globe2 className="w-4 h-4" />
              <span>{isAr ? 'تكامل سيرفرات التحميل المباشر بدون إعلانات أو تسجيل دخول' : 'Direct Download Multi-Sources & Mirrors'}</span>
            </p>
            <p className="leading-relaxed opacity-90">
              {isAr
                ? 'جميع المصادر والمواقع أدناه تدعم التحميل المباشر الفوري لملف APK أو XAPK بدون الحاجة لدخول الموقع المصدر أو تسجيل دخول، حتى لو كانت اللعبة محظورة في منطقتك الجغرافية.'
                : 'All sources below stream real APK and XAPK packages directly without requiring login or visiting third-party sites.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {app.availableSources.map((source) => (
              <div
                key={source.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white text-sm">{isAr ? source.nameAr : source.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-slate-700">
                      {source.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{source.notes}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const v =
                        app.variants.find((item) => item.sourceId === source.id && item.format === 'APK') ||
                        app.variants.find((item) => item.sourceId === source.id) ||
                        app.variants[0];
                      handleInitiateDownload(v);
                    }}
                    className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{isAr ? `تحميل APK مباشر (${source.name})` : `Direct APK (${source.name})`}</span>
                  </button>

                  {app.variants.some((item) => item.sourceId === source.id && item.format === 'XAPK') && (
                    <button
                      type="button"
                      onClick={() => {
                        const v = app.variants.find((item) => item.sourceId === source.id && item.format === 'XAPK')!;
                        handleInitiateDownload(v);
                      }}
                      className="min-h-[40px] px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-purple-500/20"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{isAr ? 'حزمة XAPK' : 'XAPK'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSourceFilter(source.id);
                      setActiveTab('downloads');
                    }}
                    title={isAr ? 'عرض ملفات هذا المصدر' : 'View all files from this source'}
                    className="min-h-[40px] px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs flex items-center justify-center border border-slate-700 cursor-pointer active:scale-95"
                  >
                    <span>{isAr ? 'الملفات' : 'Files'}</span>
                  </button>

                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={isAr ? 'عرض المصدر الأصلي' : 'View Source'}
                    className="min-h-[40px] min-w-[40px] p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: About & Screenshots */}
      {activeTab === 'about' && (
        <div className="space-y-6 text-right rtl:text-right ltr:text-left">
          {/* Screenshots preview */}
          {app.screenshots && app.screenshots.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white mb-3">
                {isAr ? 'لقطات من اللعبة / التطبيق' : 'Screenshots'}
              </h3>
              <div className="flex items-center gap-3 overflow-x-auto pb-3">
                {app.screenshots.map((src, i) => (
                  <div
                    key={i}
                    className="relative w-44 h-80 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0"
                  >
                    <Image
                      src={src}
                      alt={`Screenshot ${i + 1}`}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-white mb-2">
              {isAr ? 'عن هذا التطبيق / اللعبة' : 'About this Game/App'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              {app.description}
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Security & SHA-256 */}
      {activeTab === 'security' && (
        <div className="space-y-4 text-right rtl:text-right ltr:text-left text-xs">
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">
                {isAr ? 'فحص سلامة وأصالة الملفات والتوقيع الرقمي' : 'Cryptographic Integrity Check'}
              </h4>
              <p className="text-slate-300 mt-1 leading-relaxed">
                {isAr
                  ? 'تم التحقق من بصمات التجزئة الرقمية SHA-256 ومطابقتها للتأكد من عدم التلاعب بالملفات أو تعديلها. يمكنك مقارنة البصمة بعد التنزيل عبر أداة sha256sum.'
                  : 'Files are validated against official checksum signatures to ensure authenticity.'}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3 font-mono">
            <div className="text-slate-400 font-bold font-sans">
              {isAr ? 'بصمات التجزئة الرسمية لكل معمارية ومصدر:' : 'Variant SHA-256 Checksums:'}
            </div>
            {app.variants.map((v) => (
              <div key={v.id} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center justify-between text-slate-300 font-sans mb-1 text-xs">
                  <span className="font-bold text-cyan-400">
                    {v.architecture} ({v.format}) — {v.source}
                  </span>
                  <span className="text-slate-500">{v.fileSize}</span>
                </div>
                <div className="text-[11px] text-emerald-400 break-all select-all font-mono">
                  {v.sha256}
                </div>
              </div>
            ))}
          </div>

          {/* Policy Notice */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {isAr
                ? 'ملاحظة قانونية وأمنية: هذه المنصة تحترم حقوق الملكية الفكرية وشروط المتاجر. لا يتم فك الحماية عن الألعاب أو التطبيقات المدفوعة، ولا يتم تجاوز أي ترخيص رقمي.'
                : 'Legal Notice: This platform strictly respects copyright and store terms. Paid apps and games are not unlocked or decrypted.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
