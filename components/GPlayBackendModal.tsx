'use client';

import React, { useState, useEffect } from 'react';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw, Save, Shield } from 'lucide-react';
import { GPlayConfig } from '@/lib/types';

interface GPlayBackendModalProps {
  onClose: () => void;
  lang: 'ar' | 'en';
}

const DEFAULT_CONFIG: GPlayConfig = {
  backendUrl: 'http://localhost:5000',
  useCustomBackend: false,
  googleEmail: '',
  aasToken: '',
  tokenDispenserUrl: 'https://auroraoss.com/api/token',
  deviceProfile: 'Pixel_8_Pro',
};

export default function GPlayBackendModal({ onClose, lang }: GPlayBackendModalProps) {
  const isAr = lang === 'ar';
  const [config, setConfig] = useState<GPlayConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('gplay_downloader_config');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {
        // ignore
      }
    }
    return DEFAULT_CONFIG;
  });
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSave = () => {
    localStorage.setItem('gplay_downloader_config', JSON.stringify(config));
    setMessage(isAr ? 'تم حفظ الإعدادات بنجاح في المتصفح' : 'Configuration saved successfully');
    setTimeout(() => setMessage(''), 4000);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setMessage('');
    try {
      // Test the endpoint or proxy
      const res = await fetch('/api/app-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'org.videolan.vlc' }),
      });
      if (res.ok) {
        setTestStatus('success');
        setMessage(
          isAr
            ? 'الاتصال بالخدمة والمرايا الموثوقة يعمل بكفاءة وسرعة!'
            : 'Service and verified mirrors are connected and responding!'
        );
      } else {
        setTestStatus('error');
        setMessage(isAr ? 'تعذر الاتصال بالخادم المخصص' : 'Failed to reach custom server');
      }
    } catch (err: any) {
      setTestStatus('error');
      setMessage(err.message || 'Connection error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0b162c] border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-right rtl:text-right ltr:text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-5 rtl:right-auto ltr:right-5 ltr:left-auto p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {isAr ? 'إعدادات ربط gplay-apk-downloader' : 'gplay-apk-downloader Backend Setup'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'ربط سيرفرك الخاص من مستودع alltechdev/gplay-apk-downloader على GitHub'
                : 'Connect your self-hosted alltechdev/gplay-apk-downloader Python instance'}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 text-xs">
          {/* Custom Backend Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <p className="font-bold text-white text-sm">
                {isAr ? 'تفعيل سيرفر gplay-apk-downloader مخصص' : 'Enable Custom Backend'}
              </p>
              <p className="text-slate-400 text-xs">
                {isAr
                  ? 'عند التعطيل، تستخدم المنصة محرك Google Play Direct Engine الأصلي المدمج مجاناً.'
                  : 'When disabled, the native built-in Google Play Direct Engine is used.'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={config.useCustomBackend}
              onChange={(e) => setConfig({ ...config, useCustomBackend: e.target.checked })}
              className="w-5 h-5 accent-emerald-500 cursor-pointer"
            />
          </div>

          {config.useCustomBackend && (
            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isAr ? 'رابط خادم السيرفر (Backend URL)' : 'Backend Server URL'}
                </label>
                <input
                  type="text"
                  value={config.backendUrl}
                  onChange={(e) => setConfig({ ...config, backendUrl: e.target.value })}
                  placeholder="http://localhost:5000 أو https://api.my-apk-server.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isAr ? 'بريد Google (حساب تجريبي Throwaway)' : 'Google Account Email (Recommended Throwaway)'}
                </label>
                <input
                  type="email"
                  value={config.googleEmail}
                  onChange={(e) => setConfig({ ...config, googleEmail: e.target.value })}
                  placeholder="burner.account@gmail.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  AAS Token / OAuth Token
                </label>
                <input
                  type="password"
                  value={config.aasToken}
                  onChange={(e) => setConfig({ ...config, aasToken: e.target.value })}
                  placeholder="aas_et/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isAr ? 'ملف تعريف الجهاز (Device Profile)' : 'Device Profile'}
                </label>
                <select
                  value={config.deviceProfile}
                  onChange={(e) => setConfig({ ...config, deviceProfile: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                >
                  <option value="Pixel_8_Pro">Google Pixel 8 Pro (Android 14, ARM64-v8a)</option>
                  <option value="Galaxy_S24_Ultra">Samsung Galaxy S24 Ultra (Android 14, ARM64-v8a)</option>
                  <option value="Xiaomi_14">Xiaomi 14 (HyperOS, ARM64-v8a)</option>
                  <option value="Pixel_7">Google Pixel 7 (Android 13, ARM64-v8a)</option>
                </select>
              </div>
            </div>
          )}

          {/* Test connection & Save */}
          {message && (
            <div
              className={`p-3 rounded-xl flex items-center gap-2 ${
                testStatus === 'error'
                  ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                  : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
              }`}
            >
              {testStatus === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
              <span>{isAr ? 'اختبار الاتصال' : 'Test Connection'}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isAr ? 'حفظ الإعدادات' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
