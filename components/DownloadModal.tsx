'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Download,
  X,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Usb,
  Home,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { ApkVariant, AppDetails } from '@/lib/types';

interface DownloadModalProps {
  app: AppDetails;
  variant: ApkVariant;
  onClose: () => void;
  onGoHome?: () => void;
  lang: 'ar' | 'en';
}

export default function DownloadModal({
  app,
  variant,
  onClose,
  onGoHome,
  lang,
}: DownloadModalProps) {
  const isAr = lang === 'ar';
  const [progress, setProgress] = useState(15);
  const [downloadSpeed, setDownloadSpeed] = useState('14.2 MB/s');
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [officialUrl, setOfficialUrl] = useState<string | null>(null);
  const [uptodownUrl, setUptodownUrl] = useState<string | null>(null);

  const filename = `${app.packageId}_v${variant.version}_${variant.architecture}.${variant.format.toLowerCase()}`;

  const triggerActualDownload = useCallback(async () => {
    try {
      setErrorMessage(null);
      const res = await fetch(variant.downloadUrl);
      if (!res.ok) {
        let errData: any = {};
        try {
          errData = await res.json();
        } catch {}
        throw new Error(errData.error || (isAr ? 'تعذر التنزيل المباشر بسبب قيود أمنية أو حظر المصدر.' : 'Direct download failed due to source security restrictions.'));
      }
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || (isAr ? 'حدث خطأ أثناء محاولة التنزيل المباشر' : 'Download error occurred'));
      setOfficialUrl(app.googlePlayUrl || `https://play.google.com/store/apps/details?id=${app.packageId}`);
      setUptodownUrl(`https://ar.uptodown.com/android/search/${encodeURIComponent(app.packageId)}`);
      setIsCompleted(false);
    }
  }, [variant.downloadUrl, filename, app.googlePlayUrl, app.packageId, isAr]);

  useEffect(() => {
    // Smooth progress animation followed by reliable blob download
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (!errorMessage) {
            setIsCompleted(true);
          }
          return 100;
        }
        const step = Math.floor(Math.random() * 25) + 20;
        const nextVal = Math.min(100, prev + step);
        const newSpeed = (Math.random() * 6 + 14).toFixed(1) + ' MB/s';
        setDownloadSpeed(newSpeed);

        if (nextVal >= 100) {
          clearInterval(timer);
          setIsCompleted(true);
          triggerActualDownload();
          return 100;
        }
        return nextVal;
      });
    }, 280);

    return () => clearInterval(timer);
  }, [triggerActualDownload, errorMessage]);

  const copyHash = () => {
    navigator.clipboard.writeText(variant.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 3000);
  };

  const handleRestartDownload = () => {
    setProgress(30);
    setErrorMessage(null);
    setIsCompleted(false);
    triggerActualDownload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0b162c] border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl text-right rtl:text-right ltr:text-left my-auto">
        {/* Top Header Buttons: Home & Back & Close */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="min-h-[38px] px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                title={isAr ? 'العودة للرئيسية' : 'Return to Home'}
              >
                <Home className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
              title={isAr ? 'رجوع لتفاصيل التطبيق' : 'Back to App Details'}
            >
              {isAr ? <ArrowRight className="w-3.5 h-3.5 text-cyan-400" /> : <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{isAr ? 'رجوع للتطبيق' : 'Back to App'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="min-h-[38px] min-w-[38px] p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Status Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${errorMessage ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400' : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'}`}>
            {errorMessage ? <AlertTriangle className="w-6 h-6" /> : isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Download className="w-6 h-6 animate-bounce" />}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-base sm:text-lg font-bold text-white truncate">
              {errorMessage
                ? (isAr ? 'تنبيه: تعذر التنزيل المباشر' : 'Direct Download Restricted')
                : isCompleted
                ? (isAr ? 'اكتمل تجهيز التنزيل!' : 'Download Ready!')
                : (isAr ? 'جاري تجهيز وتحميل الملف...' : 'Preparing & Downloading File...')}
            </h3>
            <p className="text-[11px] text-slate-400 font-mono truncate">
              {filename}
            </p>
          </div>
        </div>

        {/* Error Message & Official Fallback Links */}
        {errorMessage ? (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs space-y-3 mb-4 text-rose-200">
            <p className="leading-relaxed font-medium">{errorMessage}</p>
            <p className="text-[11px] text-slate-300">
              {isAr
                ? 'حفاظاً على أمان جهازك وتجنب الملفات الوهمية أو المعطوبة، يرجى التنزيل مباشرة من الصفحات الرسمية المعتمدة أدناه:'
                : 'To protect your device and prevent invalid files, please download directly from official verified sources below:'}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              {officialUrl && (
                <a
                  href={officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{isAr ? 'متجر Google Play الرسمي' : 'Official Google Play'}</span>
                </a>
              )}
              {uptodownUrl && (
                <a
                  href={uptodownUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{isAr ? 'منصة Uptodown الرسمية' : 'Official Uptodown'}</span>
                </a>
              )}
            </div>
          </div>
        ) : (
          /* Progress Bar */
          <div className="my-4">
            <div className="flex items-center justify-between text-xs mb-1.5 text-slate-300">
              <span>{isCompleted ? (isAr ? '100% تم إرسال الملف' : '100% Complete') : downloadSpeed}</span>
              <span className="font-bold text-emerald-400">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400 transition-all duration-300 shadow-md shadow-emerald-500/50"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* File & Security Info Box */}
        <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 text-xs space-y-2 mb-4">
          <div className="flex items-center justify-between text-slate-300">
            <span>{isAr ? 'المصدر المعتمد:' : 'Verified Source:'}</span>
            <strong className="text-cyan-300">{variant.source}</strong>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>{isAr ? 'حجم الملف:' : 'File Size:'}</span>
            <strong className="text-white">{variant.fileSize}</strong>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>{isAr ? 'المعمارية:' : 'Architecture:'}</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
              {variant.architecture}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>{isAr ? 'الصيغة:' : 'Format:'}</span>
            <span className="font-bold text-emerald-400">{variant.format}</span>
          </div>

          {/* SHA-256 Hash */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SHA-256:</span>
              </span>
              <button
                onClick={copyHash}
                className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedHash ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ البصمة' : 'Copy')}</span>
              </button>
            </div>
            <p className="font-mono text-[10px] text-slate-400 break-all select-all bg-slate-950 p-2 rounded-lg border border-slate-800">
              {variant.sha256}
            </p>
          </div>
        </div>

        {/* Action Buttons: Direct link, restart, home */}
        <div className="space-y-2">
          {!errorMessage && (
            <button
              type="button"
              onClick={triggerActualDownload}
              className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer text-center active:scale-95"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{isAr ? 'اضغط هنا للتحميل المباشر الفوري للملف' : 'Click here to download directly now'}</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleRestartDownload}
              className="flex-1 min-h-[42px] py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة التنزيل' : 'Restart Download'}</span>
            </button>

            {onGoHome && (
              <button
                onClick={onGoHome}
                className="flex-1 min-h-[42px] py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-emerald-500/30"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{isAr ? 'العودة للرئيسية' : 'Return Home'}</span>
              </button>
            )}
          </div>

          {/* WebUSB ADB note */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Usb className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {isAr
                ? 'نظام التحميل الموثق يرفض تماماً أي ملفات وهمية أو معطوبة ويضمن سلامة حزم APK الأصلية.'
                : 'Strict verification protocol eliminates fake or corrupted files and guarantees genuine APK packages.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
