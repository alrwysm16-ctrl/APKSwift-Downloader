'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Usb,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { ApkVariant, AppDetails } from '@/lib/types';

interface DownloadModalProps {
  app: AppDetails;
  variant: ApkVariant;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export default function DownloadModal({
  app,
  variant,
  onClose,
  lang,
}: DownloadModalProps) {
  const isAr = lang === 'ar';
  const [progress, setProgress] = useState(12);
  const [downloadSpeed, setDownloadSpeed] = useState('14.2 MB/s');
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [hasTriggeredDownload, setHasTriggeredDownload] = useState(false);

  const filename = `${app.packageId}_v${variant.version}_${variant.architecture}.${variant.format.toLowerCase()}`;

  useEffect(() => {
    // Simulate active download progress for smooth UX, then trigger actual browser download
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsCompleted(true);
          return 100;
        }
        const step = Math.floor(Math.random() * 20) + 15;
        const nextVal = Math.min(100, prev + step);
        const newSpeed = (Math.random() * 6 + 12).toFixed(1) + ' MB/s';
        setDownloadSpeed(newSpeed);

        if (nextVal >= 100) {
          clearInterval(timer);
          setIsCompleted(true);
          // Trigger actual download
          try {
            const link = document.createElement('a');
            link.href = variant.downloadUrl;
            link.setAttribute('download', filename);
            link.setAttribute('target', '_blank');
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch {
            // ignore
          }
          return 100;
        }
        return nextVal;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [variant.downloadUrl, filename]);

  const copyHash = () => {
    navigator.clipboard.writeText(variant.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0b162c] border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-right rtl:text-right ltr:text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-5 rtl:right-auto ltr:right-5 ltr:left-auto p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Download className="w-6 h-6 animate-bounce" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {isCompleted
                ? isAr ? 'اكتمل تجهيز التنزيل!' : 'Download Ready!'
                : isAr ? 'جاري تجهيز وتحميل الملف...' : 'Preparing & Downloading File...'}
            </h3>
            <p className="text-xs text-slate-400 font-mono truncate max-w-[280px]">
              {filename}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="my-5">
          <div className="flex items-center justify-between text-xs mb-2 text-slate-300">
            <span>{isCompleted ? (isAr ? '100% مكتمل' : '100% Complete') : downloadSpeed}</span>
            <span className="font-bold text-emerald-400">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400 transition-all duration-300 shadow-md shadow-emerald-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* File & Security Info Box */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 text-xs space-y-2 mb-5">
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
                <span>SHA-256 Checksum:</span>
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

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <a
            href={variant.downloadUrl}
            download={filename}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer text-center"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isAr ? 'إذا لم يبدأ التحميل، اضغط هنا مباشرة' : 'Click here if download did not start'}</span>
          </a>

          {/* WebUSB ADB direct install notice (referencing gplay-apk-downloader capability) */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
            <Usb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {isAr
                ? 'ميزة متقدمة: يدعم مشروع gplay-apk-downloader التثبيت المباشر عبر منفذ USB (WebUSB ADB) على متصفح Chrome، أو تثبيت ملفات Split APK المدمجة دون فقدان التوقيع.'
                : 'Advanced: gplay-apk-downloader supports direct WebUSB ADB installation in Chrome/Edge, or merging Split APKs with APKEditor.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
