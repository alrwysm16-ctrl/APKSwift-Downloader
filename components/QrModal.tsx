'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { X, Smartphone, QrCode, Copy, Check, ExternalLink } from 'lucide-react';
import { ApkVariant, AppDetails } from '@/lib/types';

interface QrModalProps {
  app: AppDetails;
  variant: ApkVariant;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export default function QrModal({ app, variant, onClose, lang }: QrModalProps) {
  const isAr = lang === 'ar';
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const directUrl =
    typeof window !== 'undefined'
      ? variant.downloadUrl.startsWith('http')
        ? variant.downloadUrl
        : `${window.location.origin}${variant.downloadUrl}`
      : variant.downloadUrl;

  useEffect(() => {
    if (directUrl) {
      QRCode.toDataURL(directUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#020617',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [directUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(directUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#0b162c] border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 rtl:left-4 rtl:right-auto ltr:right-4 ltr:left-auto p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-2">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {isAr ? 'امسح بالهاتف للتحميل المباشر' : 'Scan to Download on Phone'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {app.title} ({variant.architecture} - {variant.format})
          </p>
        </div>

        {/* QR Code container */}
        <div className="my-3 p-3 bg-white rounded-2xl shadow-xl inline-block border-4 border-slate-800">
          {qrDataUrl ? (
            <Image
              src={qrDataUrl}
              alt="QR Code"
              width={224}
              height={224}
              className="w-56 h-56 mx-auto rounded-lg"
              unoptimized
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-slate-600 text-xs">
              Generating QR Code...
            </div>
          )}
        </div>

        <p className="text-xs text-slate-300 mt-2 flex items-center justify-center gap-1.5">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>
            {isAr
              ? 'افتح كاميرا هاتفك وامسح الرمز لبدء التنزيل فوراً'
              : 'Point your Android camera at the QR code to install directly'}
          </span>
        </p>

        {/* Copy Link button */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-center gap-2">
          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (isAr ? 'تم نسخ الرابط' : 'Link Copied!') : (isAr ? 'نسخ الرابط المباشر' : 'Copy Direct Link')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
