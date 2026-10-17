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
  FileCheck,
  Layers,
  ExternalLink,
  Info,
  Maximize2,
} from 'lucide-react';
import { AppDetails, ApkVariant, DeviceSpecs } from '@/lib/types';

interface AppResultCardProps {
  app: AppDetails;
  deviceSpecs: DeviceSpecs;
  onInitiateDownload: (variant: ApkVariant) => void;
  onShowQr: (variant: ApkVariant) => void;
  lang: 'ar' | 'en';
}

export default function AppResultCard({
  app,
  deviceSpecs,
  onInitiateDownload,
  onShowQr,
  lang,
}: AppResultCardProps) {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'downloads' | 'about' | 'security'>('downloads');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formatFilter, setFormatFilter] = useState<'all' | 'apk' | 'xapk'>('all');

  const handleCopyLink = (variant: ApkVariant) => {
    const fullUrl = variant.downloadUrl.startsWith('http')
      ? variant.downloadUrl
      : `${window.location.origin}${variant.downloadUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(variant.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const filteredVariants = app.variants.filter((v) => {
    if (formatFilter === 'apk') return v.format === 'APK';
    if (formatFilter === 'xapk') return v.format === 'XAPK' || v.format === 'Split APKs';
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto my-8 bg-[#0a1426]/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-xl transition-all">
      {/* App Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="flex items-start gap-4 sm:gap-6">
          {/* App Icon */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700/60 shadow-lg shrink-0">
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
          <div className="flex flex-col text-right rtl:text-right ltr:text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white">{app.title}</h2>
              {app.isPaid ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  {isAr ? `مدفوع (${app.price})` : `Paid (${app.price})`}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {isAr ? 'مجاني وموثوق' : 'Free & Verified'}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-cyan-400 font-medium mt-0.5">{app.developer}</p>
            <p className="text-xs text-slate-400 font-mono mt-1 select-all">{app.packageId}</p>

            {/* Quick Metrics Badges */}
            <div className="flex items-center flex-wrap gap-3 mt-3 text-xs text-slate-300">
              <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{app.rating}</span>
                <span className="text-slate-500">({app.ratingsCount})</span>
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
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>{isAr ? 'صفحة التطبيق في Google Play' : 'View on Google Play'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </a>
        </div>
      </div>

      {/* Device Compatibility Status Banner */}
      <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-right rtl:text-right ltr:text-left">
            <p className="text-sm font-bold text-white">
              {isAr
                ? `مطابقة المواصفات مع جهازك: ${deviceSpecs.arch}`
                : `Device Match: ${deviceSpecs.arch}`}
            </p>
            <p className="text-xs text-slate-400">
              {isAr
                ? `النظام المستهدف: ${deviceSpecs.androidVersion} | الكثافة: ${deviceSpecs.dpi}dpi`
                : `Target: ${deviceSpecs.androidVersion} | Density: ${deviceSpecs.dpi}dpi`}
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          {isAr ? 'متوافق بنسبة 100%' : '100% Compatible'}
        </span>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-5">
        <button
          onClick={() => setActiveTab('downloads')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'downloads'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {isAr ? 'ملفات التحميل المتوفرة' : 'Available Downloads'} ({filteredVariants.length})
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'about'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {isAr ? 'الوصف ولقطات الشاشة' : 'Screenshots & Info'}
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {isAr ? 'فحص الأمان وبصمة SHA-256' : 'Security & Hashes'}
        </button>
      </div>

      {/* Tab 1: Downloads */}
      {activeTab === 'downloads' && (
        <div className="space-y-4">
          {/* Format Filter Badges */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>{isAr ? 'تصفية حسب الصيغة:' : 'Filter format:'}</span>
            <div className="flex items-center gap-1.5">
              {(['all', 'apk', 'xapk'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormatFilter(fmt)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                    formatFilter === fmt
                      ? 'bg-slate-700 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {fmt === 'all' ? (isAr ? 'الكل' : 'All') : fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Variants List */}
          <div className="grid grid-cols-1 gap-3.5">
            {filteredVariants.map((variant) => (
              <div
                key={variant.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Variant Info */}
                <div className="flex flex-col text-right rtl:text-right ltr:text-left space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-black font-mono ${
                        variant.format === 'XAPK'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {variant.format}
                    </span>

                    <span className="text-sm font-bold text-white font-mono">
                      v{variant.version} ({variant.architecture})
                    </span>

                    {variant.isCompatible && (
                      <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {isAr ? 'متوافق مع جهازك' : 'Compatible with your device'}
                      </span>
                    )}
                  </div>

                  {/* Secondary metadata */}
                  <div className="flex items-center flex-wrap gap-3 text-xs text-slate-400">
                    <span>
                      {isAr ? 'الحجم:' : 'Size:'}{' '}
                      <strong className="text-slate-200">{variant.fileSize}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      {isAr ? 'الحد الأدنى للنظام:' : 'Min OS:'}{' '}
                      <strong className="text-slate-200">{variant.minAndroid}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      {isAr ? 'المصدر:' : 'Source:'}{' '}
                      <span className="text-cyan-400">{variant.source}</span>
                    </span>
                  </div>

                  {variant.splits && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-purple-400" />
                      <span>
                        {isAr
                          ? `حزمة مدمجة تتضمن (${variant.splits.join(' + ')})`
                          : `Split bundle includes (${variant.splits.join(' + ')})`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions: Download Button, QR, Copy */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                  {/* QR Code */}
                  <button
                    onClick={() => onShowQr(variant)}
                    title={isAr ? 'مسح رمز QR للهاتف' : 'Scan QR on Mobile'}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={() => handleCopyLink(variant)}
                    title={isAr ? 'نسخ رابط التحميل' : 'Copy Download Link'}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  >
                    {copiedId === variant.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {/* Primary Download Button */}
                  <button
                    onClick={() => onInitiateDownload(variant)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>{isAr ? 'تحميل مباشر' : 'Download Now'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: About & Screenshots */}
      {activeTab === 'about' && (
        <div className="space-y-6 text-right rtl:text-right ltr:text-left">
          {/* Screenshots preview */}
          {app.screenshots && app.screenshots.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white mb-3">
                {isAr ? 'لقطات من التطبيق' : 'App Screenshots'}
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
              {isAr ? 'عن هذا التطبيق' : 'About this App'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              {app.description}
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Security & SHA-256 */}
      {activeTab === 'security' && (
        <div className="space-y-4 text-right rtl:text-right ltr:text-left text-xs">
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">
                {isAr ? 'فحص سلامة وأصالة الملفات' : 'Cryptographic Integrity Check'}
              </h4>
              <p className="text-slate-300 mt-1 leading-relaxed">
                {isAr
                  ? 'تم التحقق من بصمات التجزئة الرقمية SHA-256 ومطابقتها للتأكد من عدم التلاعب بالملفات أو تعديلها. يمكنك مقارنة البصمة بعد التنزيل عبر أداة sha256sum على جهازك.'
                  : 'Files are validated against official checksum signatures to ensure authenticity.'}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3 font-mono">
            <div className="text-slate-400 font-bold font-sans">
              {isAr ? 'بصمات التجزئة الرسمية لكل معمارية:' : 'Variant SHA-256 Checksums:'}
            </div>
            {app.variants.map((v) => (
              <div key={v.id} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center justify-between text-slate-300 font-sans mb-1 text-xs">
                  <span className="font-bold text-cyan-400">
                    {v.architecture} ({v.format})
                  </span>
                  <span className="text-slate-500">{v.fileSize}</span>
                </div>
                <div className="text-[11px] text-emerald-400 break-all select-all font-mono">
                  {v.sha256}
                </div>
              </div>
            ))}
          </div>

          {/* Google Play Terms Notice */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {isAr
                ? 'ملاحظة قانونية وأمنية: هذه المنصة تحترم شروط وأحكام Google Play وتتعامل حصراً مع التطبيقات المجانية والموزعة رسمياً. لا يتم فك الحماية عن التطبيقات المدفوعة، ويتم توفير الملفات الأصلية دون تعديل.'
                : 'Legal & Security Notice: This service respects Google Play terms, distributing only free, legitimately available packages without bypassing DRM or licensing.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
