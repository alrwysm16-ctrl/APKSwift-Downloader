'use client';

import React from 'react';
import {
  X,
  BookOpen,
  Cpu,
  Layers,
  ShieldCheck,
  Server,
  Code2,
  Terminal,
  FileCode,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
  lang: 'ar' | 'en';
}

export default function HowItWorksModal({ onClose, lang }: HowItWorksModalProps) {
  const isAr = lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-[#0b162c] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-right rtl:text-right ltr:text-left max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-0 float-left rtl:float-left ltr:float-right p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isAr ? 'كيف يعمل محمل تطبيقات Google Play؟' : 'How does Google Play APK Downloader Work?'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'شرح معماري كامل لتقنيات استخراج الحزم ودمج Split APKs ومشروع gplay-apk-downloader'
                : 'Architectural overview of APK extraction, Split APK merging, and gplay-apk-downloader integration'}
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-6 text-sm text-slate-300">
          {/* Section 1: Core Principles */}
          <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>{isAr ? '1. ما الفرق بين APK و XAPK و Split APKs؟' : '1. APK vs XAPK vs Split APKs'}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isAr
                ? 'تحولت Google Play إلى نظام Android App Bundles (AAB). عندما يقوم المستخدم بتحميل تطبيق حديث، لا يرسل المتجر ملفاً واحداً بل يرسل عدة ملفات مجزأة (Base APK + ملف معمارية المعالج مثل config.arm64_v8a + ملف لغة config.ar + ملف شاشة config.xxhdpi). تقوم منصتنا بمطابقة مواصفات جهازك لتوفير الحزم المناسبة أو دمجها في ملف APK واحد أو حزمة XAPK متكاملة مع بيانات OBB.'
                : 'Google Play delivers modern apps as Android App Bundles (Split APKs). Our platform matches your exact device configuration (ARM64, DPI, Android OS) to provide compatible standalone APK or XAPK packages.'}
            </p>
          </div>

          {/* Section 2: gplay-apk-downloader reference architecture */}
          <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <span>
                {isAr
                  ? '2. التكامل مع مرجع alltechdev/gplay-apk-downloader'
                  : '2. Integration with alltechdev/gplay-apk-downloader'}
              </span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {isAr
                ? 'يعتمد مشروع alltechdev/gplay-apk-downloader المفتوح المصدر على بروتوكول Google Play Protobuf API باستخدام حساب Google (AAS Token) أو موزع توكنات (Token Dispenser)، إلى جانب 23 ملف تعريف لجهاز Android ومكتبة APKEditor لدمج الحزم المجزأة.'
                : 'The alltechdev/gplay-apk-downloader project interacts with the Google Play Protobuf API using Google account AAS tokens or Aurora token dispensers, rotating 23 device profiles and merging split APKs via APKEditor.'}
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-400 space-y-2">
              <div className="text-cyan-400 font-bold"># خطوات تشغيل سيرفر gplay-apk-downloader محلياً:</div>
              <div className="text-slate-300">git clone https://github.com/alltechdev/gplay-apk-downloader.git</div>
              <div className="text-slate-300">cd gplay-apk-downloader</div>
              <div className="text-slate-300">python3 -m venv venv && source venv/bin/activate</div>
              <div className="text-slate-300">pip install -r requirements.txt</div>
              <div className="text-emerald-400"># تشغيل السيرفر مع دمج APKEditor:</div>
              <div className="text-slate-300">python3 server.py --host 0.0.0.0 --port 5000</div>
            </div>
          </div>

          {/* Section 3: WebUSB ADB & Signatures */}
          <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>
                {isAr
                  ? '3. الحفاظ على التوقيع الأصلي وتثبيت Split APKs'
                  : '3. Preserving Original Signatures & WebUSB ADB'}
              </span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isAr
                ? 'ملاحظة فنية مهمة: عند دمج Split APKs في ملف واحد باستخدام APKEditor، يتم إعادة توقيع الملف بمفتاح Debug Keystore. معظم التطبيقات تعمل بسلاسة، ولكن بعض التطبيقات الحساسة (مثل التطبيقات المصرفية أو تطبيقات WhatsApp و Uber) قد ترفض التوقيع المعدل. في هذه الحالة، الخيار الأفضل هو تثبيت الحزم المجزأة مباشرة عبر ADB أو استخدام أداة WebUSB ADB داخل المتصفح.'
                : 'Merged split APKs are re-signed with a debug key. For sensitive apps requiring original Play Store signatures (banking, authentication), install splits directly via ADB.'}
            </p>
          </div>

          {/* Section 4: Terms and Copyright compliance */}
          <div className="bg-amber-950/30 rounded-2xl p-5 border border-amber-500/40">
            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>
                {isAr
                  ? '4. احترام شروط Google Play وحقوق النشر'
                  : '4. Google Play Terms & Security Restrictions'}
              </span>
            </h3>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {isAr
                ? 'تحترم المنصة سياسات Google Play وحقوق المطورين: لا يتم تحميل أو فك تشفير التطبيقات المدفوعة (Paid Apps) أو تخطي التراخيص والحماية الرقمية (DRM). تقتصر الخدمة على التطبيقات المجانية والموزعة للعامة مع توفير بصمات SHA-256 الأصلية لضمان الأمان.'
                : 'Our service strictly respects Google Play terms. Paid applications cannot be downloaded without authentic license verification. No DRM or authentication bypass is performed.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
          >
            {isAr ? 'فهمت ذلك، إغلاق' : 'Got it, Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
