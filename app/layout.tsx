import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#070c18',
};

export const metadata: Metadata = {
  title: 'APK Downloader - تحميل ملفات APK مباشرة وسريعة من Google Play',
  description: 'تحميل ملفات APK و XAPK الأصلية والمباشرة من متجر Google Play مع تخصيص المعمارية (ARM64, ARMv7, x86) وإصدار أندرويد وكشف مواصفات الجهاز.',
  keywords: [
    'APK Downloader',
    'Google Play APK',
    'تحميل APK مباشر',
    'XAPK Downloader',
    'ARM64-v8a',
    'gplay-apk-downloader',
    'تطبيقات أندرويد',
  ],
  authors: [{ name: 'APK Downloader Team' }],
  openGraph: {
    title: 'APK Downloader - تحميل ملفات APK مباشرة وسريعة',
    description: 'أدخل رابط التطبيق من متجر Google Play للحصول على ملف APK فوراً مع دعم XAPK والمعماريات المختلفة.',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'APK Downloader - تحميل ملفات APK مباشرة وسريعة',
    description: 'أدخل رابط التطبيق من متجر Google Play للحصول على ملف APK فوراً مع دعم XAPK والمعماريات المختلفة.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark overflow-x-hidden w-full max-w-[100vw]" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://play-lh.googleusercontent.com" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#070c18] text-slate-100 antialiased selection:bg-emerald-500 selection:text-black relative"
      >
        {children}
      </body>
    </html>
  );
}
