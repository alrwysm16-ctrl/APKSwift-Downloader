'use client';

import React, { useState } from 'react';
import {
  Download,
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
  Gamepad2,
  Check,
  Globe2,
} from 'lucide-react';
import { DeviceSpecs, SourceId } from '@/lib/types';
import { detectClientDevice } from '@/lib/device-detector';

interface HeroSearchProps {
  onSearch: (url: string, specs: DeviceSpecs, source: SourceId) => void;
  isLoading: boolean;
  deviceSpecs: DeviceSpecs;
  onUpdateSpecs: (specs: DeviceSpecs) => void;
  selectedSource: SourceId;
  onSelectSource: (source: SourceId) => void;
  inputUrl: string;
  onInputUrlChange: (url: string) => void;
  lang: 'ar' | 'en';
}

const SOURCES_LIST: { id: SourceId; name: string; nameAr: string; badge: string; color: string }[] = [
  { id: 'all', name: 'All Sources', nameAr: 'جميع المصادر', badge: 'أفضل تطابق', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40' },
  { id: 'gplay', name: 'Google Play', nameAr: 'Google Play', badge: 'رسمي', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40' },
  { id: 'apkpure', name: 'APKPure', nameAr: 'APKPure', badge: 'سريع', color: 'text-teal-400 border-teal-500/40 bg-teal-950/40' },
  { id: 'uptodown', name: 'Uptodown', nameAr: 'Uptodown', badge: 'آمن', color: 'text-blue-400 border-blue-500/40 bg-blue-950/40' },
  { id: 'apkcombo', name: 'APKCombo', nameAr: 'APKCombo', badge: 'حزم', color: 'text-amber-400 border-amber-500/40 bg-amber-950/40' },
  { id: 'apkmirror', name: 'APKMirror', nameAr: 'APKMirror', badge: 'تشفير', color: 'text-orange-400 border-orange-500/40 bg-orange-950/40' },
  { id: 'apkfab', name: 'APKFab', nameAr: 'APKFab', badge: 'XAPK', color: 'text-purple-400 border-purple-500/40 bg-purple-950/40' },
];

const POPULAR_GAMES = [
  { name: 'Subway Surfers', id: 'com.kiloo.subwaysurf', icon: '🏃' },
  { name: 'Free Fire', id: 'com.dts.freefireth', icon: '🔥' },
  { name: 'Roblox', id: 'com.roblox.client', icon: '🧱' },
  { name: 'PUBG Mobile', id: 'com.tencent.ig', icon: '🎯' },
  { name: 'Candy Crush', id: 'com.king.candycrushsaga', icon: '🍬' },
];

const POPULAR_APPS = [
  { name: 'WhatsApp', id: 'com.whatsapp', icon: '💬' },
  { name: 'Telegram', id: 'org.telegram.messenger', icon: '✈️' },
  { name: 'VLC Player', id: 'org.videolan.vlc', icon: '🎬' },
  { name: 'Brave Browser', id: 'com.brave.browser', icon: '🦁' },
  { name: 'Spotify Music', id: 'com.spotify.music', icon: '🎵' },
];

export default function HeroSearch({
  onSearch,
  isLoading,
  deviceSpecs,
  onUpdateSpecs,
  selectedSource,
  onSelectSource,
  inputUrl,
  onInputUrlChange,
  lang,
}: HeroSearchProps) {
  const isAr = lang === 'ar';
  const [showCustomizer, setShowCustomizer] = useState(true);
  const [autoDetectNotice, setAutoDetectNotice] = useState<string | null>(null);
  const [categoryTab, setCategoryTab] = useState<'games' | 'apps'>('games');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) return;
    onSearch(inputUrl.trim(), deviceSpecs, selectedSource);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onInputUrlChange(text);
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
        ? `تم الكشف: ${detected.detectedModel} (${detected.arch})`
        : `Detected: ${detected.detectedModel} (${detected.arch})`
    );
    setTimeout(() => setAutoDetectNotice(null), 5000);
  };

  return (
    <section className="relative w-full max-w-full overflow-hidden pt-6 sm:pt-12 pb-6 flex flex-col items-center justify-center text-center px-3 sm:px-6">
      {/* Arabic Main Headline */}
      <h1 className="text-2xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-full leading-snug sm:leading-tight px-1">
        {isAr ? 'تحميل ملفات APK مباشرة وسريعة' : 'Direct & Fast APK Downloads'}
      </h1>

      {/* Subtitle */}
      <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed px-2">
        {isAr
          ? 'أدخل رابط اللعبة أو التطبيق من متجر Google Play للحصول على ملف APK أو XAPK فوراً'
          : 'Enter Google Play game/app URL to download genuine APK or XAPK with verified mirrors'}
      </p>

      {/* Multi-Source Selector Bar */}
      <div className="w-full max-w-full sm:max-w-3xl mt-5 px-1 overflow-hidden">
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 mb-1.5 font-medium px-1">
          <span className="flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAr ? 'المصدر المستهدف:' : 'Source:'}</span>
          </span>
          <span className="text-[10px] text-emerald-400 truncate max-w-[200px]">
            {isAr ? 'يدعم APKPure, Uptodown, APKCombo' : 'Supports Multi-Mirrors'}
          </span>
        </div>

        {/* Scrollable pill container with high touch-target */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar w-full max-w-full">
          {SOURCES_LIST.map((source) => {
            const isSelected = selectedSource === source.id;
            return (
              <button
                key={source.id}
                type="button"
                onClick={() => onSelectSource(source.id)}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 flex items-center gap-1 cursor-pointer active:scale-95 ${
                  isSelected
                    ? `${source.color} shadow-sm shadow-emerald-500/20 ring-1 ring-emerald-400/50`
                    : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />}
                <span>{isAr ? source.nameAr : source.name}</span>
                <span className="text-[9px] opacity-70 font-normal">({source.badge})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Glowing Search Box with responsive sizing and no overflow */}
      <div className="w-full max-w-full sm:max-w-3xl mt-3 px-0.5">
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-full flex flex-col sm:flex-row items-center p-2 rounded-2xl sm:rounded-3xl bg-[#09152b]/95 border-2 border-emerald-400 glow-neon-green shadow-xl transition-all duration-300 focus-within:border-emerald-300"
        >
          {/* Action Button: on mobile order-2, on desktop order-1 */}
          <button
            type="submit"
            disabled={isLoading || !inputUrl.trim()}
            className="w-full sm:w-auto order-2 sm:order-1 min-h-[46px] px-6 py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-400 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-xs sm:text-base shadow-md shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 mt-1.5 sm:mt-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Download className="w-4 h-4 stroke-[2.8]" />
            )}
            <span>{isAr ? 'جلب ملف APK' : 'Fetch APK File'}</span>
          </button>

          {/* Input field with min-w-0 to prevent flex expansion */}
          <div className="relative w-full min-w-0 flex-1 order-1 sm:order-2 flex items-center my-0.5 px-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => onInputUrlChange(e.target.value)}
              placeholder={isAr ? 'ضع رابط اللعبة أو التطبيق هنا...' : 'Paste Game/App URL or Package ID...'}
              className="w-full min-w-0 flex-1 min-h-[42px] bg-transparent text-white placeholder-slate-400 text-xs sm:text-base outline-none px-1 py-1 font-medium text-right rtl:text-right ltr:text-left dir-auto"
              dir="auto"
            />

            {/* Clear / Paste helper */}
            <div className="flex items-center gap-1 shrink-0">
              {inputUrl ? (
                <button
                  type="button"
                  onClick={() => onInputUrlChange('')}
                  className="min-h-[36px] min-w-[36px] p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors flex items-center justify-center"
                  title={isAr ? 'مسح' : 'Clear'}
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePaste}
                  title={isAr ? 'لصق من الحافظة' : 'Paste from clipboard'}
                  className="min-h-[36px] px-2 py-1 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800/60 transition-colors flex items-center gap-1 text-[11px]"
                >
                  <ClipboardPaste className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{isAr ? 'لصق' : 'Paste'}</span>
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Quick Testing: Tabs between Games & Apps */}
        <div className="mt-3 flex flex-col items-center gap-1.5 w-full max-w-full">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setCategoryTab('games')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer text-xs ${
                categoryTab === 'games'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3 h-3 text-purple-400" />
              <span>{isAr ? 'ألعاب شائعة' : 'Games'}</span>
            </button>
            <span className="text-slate-700">|</span>
            <button
              type="button"
              onClick={() => setCategoryTab('apps')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer text-xs ${
                categoryTab === 'apps'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3 text-cyan-400" />
              <span>{isAr ? 'تطبيقات مميزة' : 'Apps'}</span>
            </button>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-1.5 text-xs w-full max-w-full">
            {(categoryTab === 'games' ? POPULAR_GAMES : POPULAR_APPS).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onInputUrlChange(item.id);
                  onSearch(item.id, deviceSpecs, selectedSource);
                }}
                className="min-h-[34px] px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 transition-all flex items-center gap-1 cursor-pointer active:scale-95 text-[11px]"
              >
                <span>{item.icon}</span>
                <span className="font-semibold">{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Customization Button highlighted in orange/cyan box */}
        <div className="mt-4 flex flex-col items-center w-full max-w-full">
          <button
            type="button"
            onClick={() => setShowCustomizer(!showCustomizer)}
            className="group min-h-[42px] px-5 py-2 rounded-2xl bg-[#0e1d3a] border-2 border-orange-500/80 hover:border-orange-400 text-cyan-300 hover:text-cyan-200 font-bold text-xs sm:text-sm shadow-md glow-orange flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Settings2 className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
            <span>{isAr ? 'تخصيص التحميل' : 'Customize Download'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${
                showCustomizer ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Auto-detect notification toast if fired */}
          {autoDetectNotice && (
            <div className="mt-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-1.5 animate-fadeIn max-w-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{autoDetectNotice}</span>
            </div>
          )}

          {/* Dropdown controls matching the 3 cards in the screenshot */}
          {showCustomizer && (
            <div className="mt-3 w-full max-w-full sm:max-w-2xl bg-[#0d1b33]/95 border border-slate-700/60 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-md grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Dropdown 1: Architecture */}
              <div className="flex flex-col text-right">
                <label className="text-[10px] sm:text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-emerald-400" />
                    {isAr ? 'اختيار المعمارية' : 'Architecture'}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-mono">{deviceSpecs.arch}</span>
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
                    className="w-full min-h-[40px] appearance-none bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-cyan-400 transition-all font-medium"
                  >
                    <option value="arm64-v8a">ARM64-v8a (هواتف حديثة 64-bit)</option>
                    <option value="armeabi-v7a">armeabi-v7a (أجهزة 32-bit قديمة)</option>
                    <option value="x86_64">x86_64 (محاكيات PC / WSA)</option>
                    <option value="x86">x86 (محاكيات 32-bit)</option>
                    <option value="universal">Universal (شامل لكل المعالجات)</option>
                  </select>
                  <ChevronDown className="absolute left-2.5 top-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Dropdown 2: Android Version */}
              <div className="flex flex-col text-right">
                <label className="text-[10px] sm:text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-cyan-400" />
                    {isAr ? 'إصدار أندرويد' : 'OS Version'}
                  </span>
                  <span className="text-[9px] text-cyan-400 font-mono">API {deviceSpecs.apiLevel}</span>
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
                    className="w-full min-h-[40px] appearance-none bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-cyan-400 transition-all font-medium"
                  >
                    <option value="Android 14 (API 34)">Android 14 (API 34)</option>
                    <option value="Android 15 (API 35)">Android 15 (API 35)</option>
                    <option value="Android 13 (API 33)">Android 13 (API 33)</option>
                    <option value="Android 12 (API 31/32)">Android 12 (API 31/32)</option>
                    <option value="Android 11 (API 30)">Android 11 (API 30)</option>
                    <option value="Android 10 (API 29)">Android 10 (API 29)</option>
                    <option value="Android 9.0 (API 28)">Android 9.0 (API 28)</option>
                    <option value="Android 8.1 (API 27)">Android 8.1 (API 27)</option>
                    <option value="Android 7.0 (API 24)">Android 7.0+ (API 24)</option>
                  </select>
                  <ChevronDown className="absolute left-2.5 top-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Dropdown 3: File Format APK / XAPK */}
              <div className="flex flex-col text-right">
                <label className="text-[10px] sm:text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <FileBox className="w-3 h-3 text-amber-400" />
                    {isAr ? 'صيغة الملف' : 'Format'}
                  </span>
                  <span className="text-[9px] text-amber-400">All</span>
                </label>
                <div className="relative">
                  <select
                    defaultValue="all"
                    className="w-full min-h-[40px] appearance-none bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-cyan-400 transition-all font-medium"
                  >
                    <option value="all">جميع الصيغ (APK & OBB)</option>
                    <option value="apk">ملف APK قياسي</option>
                    <option value="xapk">حزمة XAPK كاملة</option>
                    <option value="splits">Split APKs مجزأة</option>
                  </select>
                  <ChevronDown className="absolute left-2.5 top-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Auto-detect button below dropdowns */}
              <div className="sm:col-span-3 pt-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/80 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-400 text-right w-full sm:w-auto overflow-hidden">
                  <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    {isAr
                      ? `الجهاز: ${deviceSpecs.detectedModel || 'Android Target'}`
                      : `Target: ${deviceSpecs.detectedModel || 'Android Target'}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoDetect}
                  className="w-full sm:w-auto min-h-[38px] px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? 'كشف مواصفاتي تلقائياً' : 'Auto-detect Specs'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
