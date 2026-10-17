'use client';

import React from 'react';
import {
  X,
  BookOpen,
  Cpu,
  Layers,
  ShieldCheck,
  Server,
  Globe2,
  Lock,
} from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
  lang: 'ar' | 'en';
}

export default function HowItWorksModal({ onClose, lang }: HowItWorksModalProps) {
  const isAr = lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 sm:my-8 bg-[#0b162c] border border-slate-700/80 rounded-3xl p-5 sm:p-8 shadow-2xl text-right rtl:text-right ltr:text-left max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-0 float-left rtl:float-left ltr:float-right p-2.5 text-slate-400 hover:text-white rounded-xl bg-slate-800/90 hover:bg-slate-700 transition-colors z-10 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-white">
              {isAr ? 'كيف يعمل محمل تطبيقات وألعاب الأندرويد؟' : 'How does Multi-Source APK Downloader Work?'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'شرح معماري كامل لتكامل المصادر (APKPure, Uptodown, APKCombo, APKMirror, APKFab, gplay-apk-downloader)'
                : 'Architectural overview of multi-source repositories and gplay-apk-downloader integration'}
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-5 text-sm text-slate-300">
          {/* Section 1: Multi-Source Support */}
          <div className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 mb-2">
              <Globe2 className="w-5 h-5 text-cyan-400" />
              <span>{isAr ? '1. المصادر المتعددة المعتمدة وكيفية عملها' : '1. Multi-Source Integration'}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {isAr
                ? 'لا تعتمد منصتنا على جهة واحدة فقط، بل تدمج عدة قنوات رسمية وسحابية موثوقة تضمن عدم انقطاع التحميل:'
                : 'Our platform aggregates legitimate global mirrors with zero spoofing or fabricated results:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="font-bold text-emerald-400">APKPure:</span>
                <p className="text-slate-400 mt-0.5 text-[11px]">
                  {isAr ? 'تنزيل مباشر لحزم APK/XAPK عبر شبكات CDN عالية السرعة مع التوقيع الأصلي.' : 'Direct APK/XAPK CDN downloads with original signature.'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="font-bold text-blue-400">Uptodown:</span>
                <p className="text-slate-400 mt-0.5 text-[11px]">
                  {isAr ? 'مستودع آمن مفحوص بأكثر من 70 برنامج مضاد فيروسات عبر VirusTotal.' : 'VirusTotal verified repository with version rollback.'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="font-bold text-amber-400">APKCombo:</span>
                <p className="text-slate-400 mt-0.5 text-[11px]">
                  {isAr ? 'استخراج حزم Base و Split APKs المخصصة بدقة حسب معمارية هاتفك.' : 'Granular split bundle and CPU architecture extractor.'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="font-bold text-orange-400">APKMirror:</span>
                <p className="text-slate-400 mt-0.5 text-[11px]">
                  {isAr ? 'أرشيف تشفيري فائق الأمان (يتطلب فتح بوابة التحقق لتجاوز حماية Cloudflare).' : 'Cryptographically signed archive via direct portal.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Core Principles */}
          <div className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>{isAr ? '2. ما الفرق بين APK و XAPK و Split APKs؟' : '2. APK vs XAPK vs Split APKs'}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isAr
                ? 'تعتمد Google Play على نظام Android App Bundles (AAB) لتجزئة التطبيقات. الألعاب الكبيرة (مثل Free Fire و PUBG) تستخدم حزم XAPK التي تضم ملف التثبيت ومجلد بيانات اللعبة (OBB). تقوم منصتنا بمطابقة مواصفات جهازك (ARM64-v8a, x86_64, 480dpi) لتوفير الحزمة المناسبة.'
                : 'Modern Android apps use split bundles. Large games use XAPK containers bundling base APK with OBB assets. Our engine matches your device specs to provide compatible files.'}
            </p>
          </div>

          {/* Section 3: gplay-apk-downloader reference architecture */}
          <div className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 mb-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <span>
                {isAr
                  ? '3. التكامل مع سيرفر alltechdev/gplay-apk-downloader'
                  : '3. Integration with alltechdev/gplay-apk-downloader'}
              </span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {isAr
                ? 'يعتمد مشروع alltechdev/gplay-apk-downloader على بروتوكول Google Play Protobuf API مع دمج Split APKs عبر أداة APKEditor، مع إمكانية التثبيت المباشر عبر WebUSB ADB في المتصفح.'
                : 'The alltechdev/gplay-apk-downloader project downloads from Google Play Protobuf API, merges splits with APKEditor, and supports WebUSB ADB installation in Chrome/Edge.'}
            </p>

            <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 font-mono text-[11px] sm:text-xs text-slate-400 space-y-1.5 overflow-x-auto">
              <div className="text-cyan-400 font-bold"># تشغيل سيرفر gplay-apk-downloader محلياً:</div>
              <div className="text-slate-300">git clone https://github.com/alltechdev/gplay-apk-downloader.git</div>
              <div className="text-slate-300">cd gplay-apk-downloader && pip install -r requirements.txt</div>
              <div className="text-emerald-400">python3 server.py --host 0.0.0.0 --port 5000</div>
            </div>
          </div>

          {/* Section 4: Terms and Copyright compliance */}
          <div className="bg-amber-950/30 rounded-2xl p-4 sm:p-5 border border-amber-500/40">
            <h3 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>
                {isAr
                  ? '4. احترام شروط المتاجر وحقوق الملكية'
                  : '4. Terms & Security Restrictions'}
              </span>
            </h3>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {isAr
                ? 'تحترم المنصة سياسات Google Play وحقوق المطورين: لا يتم تحميل أو كسر حماية الألعاب والتطبيقات المدفوعة، ولا يتم التلاعب بالتراخيص الرقمية. تقتصر الخدمة على التطبيقات المجانية والموزعة للعامة مع التحقق من بصمات التجزئة SHA-256.'
                : 'We strictly respect Google Play terms. Paid apps cannot be downloaded without genuine purchase license. We provide original signed packages without DRM tampering.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
          >
            {isAr ? 'فهمت ذلك، إغلاق' : 'Got it, Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
