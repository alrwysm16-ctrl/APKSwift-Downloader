'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  Search,
  Settings2,
  ChevronDown,
  Cpu,
  Layers,
  FileBox,
  Smartphone,
  CheckCircle2,
  Sparkles,
  ClipboardPaste,
  X,
  Loader2,
} from 'lucide-react';
import { DeviceSpecs } from '@/lib/types';
import { detectClientDevice } from '@/lib/device-detector';

interface HeroSearchProps {
  onSearch: (url: string, specs: DeviceSpecs) => void;
  isLoading: boolean;
  deviceSpecs: DeviceSpecs;
  onUpdateSpecs: (specs: DeviceSpecs) => void;
  lang: 'ar' | 'en';
}

const POPULAR_APPS = [
  { name: 'WhatsApp', id: 'com.whatsapp', icon: '💬' },
  { name: 'Telegram', id: 'org.telegram.messenger', icon: '✈️' },
  { name: 'VLC Media Player', id: 'org.videolan.vlc', icon: '🎬' },
  { name: 'Brave Browser', id: 'com.brave.browser', icon: '🦁' },
  { name: 'Spotify Music', id: 'com.spotify.music', icon: '🎵' },
  { name: 'Duolingo', id: 'com.duolingo', icon: '🦉' },
];

export default function HeroSearch({
  onSearch,
  isLoading,
  deviceSpecs,
  onUpdateSpecs,
  lang,
}: HeroSearchProps) {
  const isAr = lang === 'ar';
  const [inputUrl, setInputUrl] = useState('');
  const [showCustomizer, setShowCustomizer] = useState(true);
  const [autoDetectNotice, setAutoDetectNotice] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) return;
    onSearch(inputUrl.trim(), deviceSpecs);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputUrl(text);
      }
    } catch {
      // clipboard permission denied
    }
  };

  const handleAutoDetect = () => {
    const detected = detectClientDevice();
    onUpdateSpecs({ ...detected, isAutoDetected: true });
    setAutoDetectNotice(
      isAr
        ? `تم الكشف بنجاح: ${detected.detectedModel} (${detected.arch} - ${detected.androidVersion})`
        : `Detected: ${detected.detectedModel} (${detected.arch} - ${detected.androidVersion})`
    );
    setTimeout(() => setAutoDetectNotice(null), 5000);
  };

  return (
    <section className="relative w-full pt-12 pb-10 flex flex-col items-center justify-center text-center px-4 sm:px-6">
      {/* Arabic Main Headline exactly matching image */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight">
        {isAr ? 'تحميل ملفات APK مباشرة وسريعة' : 'Direct & Fast APK Downloads'}
      </h1>

      {/* Subtitle matching image */}
      <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
        {isAr
          ? 'أدخل رابط التطبيق من متجر Google Play للحصول على ملف APK فوراً'
          : 'Enter the Google Play app link or package ID to get your authentic APK instantly'}
      </p>

      {/* Glowing Search Box matching the image precisely */}
      <div className="w-full max-w-3xl mt-8">
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col sm:flex-row items-center p-2 rounded-2xl sm:rounded-3xl bg-[#09152b]/90 border-2 border-emerald-400 glow-neon-green shadow-2xl transition-all duration-300 focus-within:border-emerald-300 focus-within:shadow-emerald-500/40"
        >
          {/* Action Button: in RTL, this is positioned on the left side (like screenshot) */}
          <button
            type="submit"
            disabled={isLoading || !inputUrl.trim()}
            className="w-full sm:w-auto order-2 sm:order-1 px-7 py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-400 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-base sm:text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
            ) : (
              <Download className="w-5 h-5 stroke-[2.8]" />
            )}
            <span>{isAr ? 'جلب ملف APK' : 'Fetch APK File'}</span>
          </button>

          {/* Input field */}
          <div className="relative w-full order-1 sm:order-2 flex items-center my-1 sm:my-0 px-3">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder={isAr ? 'ضع رابط التطبيق هنا... (Google Play URL)' : 'Paste Google Play URL or package name here...'}
              className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base outline-none px-2 py-3 font-medium text-right rtl:text-right ltr:text-left dir-auto"
              dir="auto"
            />

            {/* Quick Clear or Paste helper */}
            <div className="flex items-center gap-1 shrink-0">
              {inputUrl ? (
                <button
                  type="button"
                  onClick={() => setInputUrl('')}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePaste}
                  title={isAr ? 'لصق من الحافظة' : 'Paste from clipboard'}
                  className="p-2 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800/60 transition-colors flex items-center gap-1 text-xs"
                >
                  <ClipboardPaste className="w-4 h-4 text-emerald-400" />
                  <span className="hidden md:inline">{isAr ? 'لصق' : 'Paste'}</span>
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Quick Popular App Suggestions */}
        <div className="mt-3 flex items-center justify-center flex-wrap gap-2 text-xs text-slate-400">
          <span className="text-slate-500">{isAr ? 'تجربة سريعة:' : 'Quick test:'}</span>
          {POPULAR_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                setInputUrl(app.id);
                onSearch(app.id, deviceSpecs);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 transition-all flex items-center gap-1.5"
            >
              <span>{app.icon}</span>
              <span>{app.name}</span>
            </button>
          ))}
        </div>

        {/* Customization Button highlighted in orange/cyan box matching image */}
        <div className="mt-6 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setShowCustomizer(!showCustomizer)}
            className="group px-6 py-2.5 rounded-2xl bg-[#0e1d3a] border-2 border-orange-500/80 hover:border-orange-400 text-cyan-300 hover:text-cyan-200 font-bold text-base shadow-lg glow-orange flex items-center gap-2.5 transition-all duration-300 cursor-pointer"
          >
            <Settings2 className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform" />
            <span>{isAr ? 'تخصيص التحميل' : 'Customize Download'}</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                showCustomizer ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Auto-detect notification toast if fired */}
          {autoDetectNotice && (
            <div className="mt-3 px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{autoDetectNotice}</span>
            </div>
          )}

          {/* Dropdown controls matching the 3 cards in the screenshot */}
          {showCustomizer && (
            <div className="mt-4 w-full max-w-2xl bg-[#0d1b33]/90 border border-slate-700/60 rounded-2xl p-4 shadow-xl backdrop-blur-md grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Dropdown 1: Architecture */}
              <div className="flex flex-col text-right">
                <label className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    {isAr ? 'اختيار المعمارية' : 'CPU Architecture'}
                  </span>
                  <span className="text-[10px] text-emerald-400">{deviceSpecs.arch}</span>
                </label>
                <div className="relative">
                  <select
                    value={deviceSpecs.arch}
                    onChange={(e) =>
                      onUpdateSpecs({
                        ...deviceSpecs,
                        arch: e.target.value as DeviceSpecs['arch'],
                      })
                    }
                    className="w-full appearance-none bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400 transition-all font-medium"
                  >
                    <option value="arm64-v8a">ARM64-v8a (أحدث الهواتف 64-bit)</option>
                    <option value="armeabi-v7a">armeabi-v7a (أجهزة 32-bit قديمة)</option>
                    <option value="x86_64">x86_64 (محاكيات PC / WSA)</option>
                    <option value="x86">x86 (محاكيات 32-bit)</option>
                    <option value="universal">Universal (حزمة شاملة لجميع المعالجات)</option>
                  </select>
                  <ChevronDown className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Dropdown 2: Android Version */}
              <div className="flex flex-col text-right">
                <label className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                    {isAr ? 'إصدار أندرويد' : 'Android Version'}
                  </span>
                  <span className="text-[10px] text-cyan-400">API {deviceSpecs.apiLevel}</span>
                </label>
                <div className="relative">
                  <select
                    value={deviceSpecs.androidVersion}
                    onChange={(e) => {
                      const val = e.target.value;
                      let api = 34;
                      if (val.includes('15')) api = 35;
                      else if (val.includes('14')) api = 34;
                      else if (val.includes('13')) api = 33;
                      else if (val.includes('12')) api = 31;
                      else if (val.includes('11')) api = 30;
                      else if (val.includes('10')) api = 29;
                      else if (val.includes('9')) api = 28;
                      else if (val.includes('8')) api = 27;
                      else if (val.includes('7')) api = 24;
                      onUpdateSpecs({
                        ...deviceSpecs,
                        androidVersion: val,
                        apiLevel: api,
                      });
                    }}
                    className="w-full appearance-none bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400 transition-all font-medium"
                  >
                    <option value="Android 14 (API 34)">Android 14 (API 34)</option>
                    <option value="Android 15 (API 35)">Android 15 (API 35)</option>
                    <option value="Android 13 (API 33)">Android 13 (API 33)</option>
                    <option value="Android 12 (API 31/32)">Android 12 (API 31/32)</option>
                    <option value="Android 11 (API 30)">Android 11 (API 30)</option>
                    <option value="Android 10 (API 29)">Android 10 (API 29)</option>
                    <option value="Android 9.0 (API 28)">Android 9.0 Pie (API 28)</option>
                    <option value="Android 8.1 (API 27)">Android 8.1 Oreo (API 27)</option>
                    <option value="Android 7.0 (API 24)">Android 7.0+ (API 24)</option>
                  </select>
                  <ChevronDown className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Dropdown 3: File Format APK / XAPK */}
              <div className="flex flex-col text-right">
                <label className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <FileBox className="w-3.5 h-3.5 text-amber-400" />
                    {isAr ? 'صيغة الملف APK/XAPK' : 'File Format'}
                  </span>
                  <span className="text-[10px] text-amber-400">All Formats</span>
                </label>
                <div className="relative">
                  <select
                    defaultValue="all"
                    className="w-full appearance-none bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400 transition-all font-medium"
                  >
                    <option value="all">جميع الصيغ المتاحة (APK & XAPK)</option>
                    <option value="apk">ملف APK قياسي مستقل</option>
                    <option value="xapk">حزمة XAPK كاملة (مع بيانات OBB)</option>
                    <option value="splits">Split APKs (حزمة مجزأة)</option>
                  </select>
                  <ChevronDown className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Auto-detect button button below the 3 dropdowns */}
              <div className="sm:col-span-3 pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isAr
                      ? `الجهاز المستهدف: ${deviceSpecs.detectedModel || 'Android Phone'} | كثافة الشاشة: ${deviceSpecs.dpi} dpi`
                      : `Target: ${deviceSpecs.detectedModel || 'Android'} | Screen: ${deviceSpecs.dpi} dpi`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoDetect}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? 'كشف مواصفات جهازي تلقائياً' : 'Auto-detect My Device Specs'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
