'use client';

import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

interface ContactModalProps {
  onClose: () => void;
  lang: 'ar' | 'en';
}

export default function ContactModal({ onClose, lang }: ContactModalProps) {
  const isAr = lang === 'ar';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0b162c] border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-right rtl:text-right ltr:text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-5 rtl:right-auto ltr:right-5 ltr:left-auto p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{isAr ? 'اتصل بنا' : 'Contact Us'}</h3>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'فريق الدعم الفني واقتراحات تحسين محمل التطبيقات'
                : 'Technical support and feedback for APK Downloader'}
            </p>
          </div>
        </div>

        {isSent ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">
              {isAr ? 'تم استلام رسالتك بنجاح!' : 'Message Received Successfully!'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {isAr
                ? 'شكراً لتواصلك معنا، سنقوم بمراجعة طلبك في أقرب وقت.'
                : 'Thank you for contacting us, we will review your inquiry shortly.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {isAr ? 'الاسم' : 'Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isAr ? 'اسمك الكريم' : 'Your name'}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {isAr ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {isAr ? 'الرسالة أو الاستفسار' : 'Message or Question'}
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isAr
                    ? 'أخبرنا بملاحظاتك، أو إذا واجهت حزمة APK تتطلب تحديثاً أو معمارية خاصة...'
                    : 'Describe your feedback, request, or issue with any specific APK variant...'
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer mt-2"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span>{isAr ? 'إرسال الرسالة' : 'Send Message'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
