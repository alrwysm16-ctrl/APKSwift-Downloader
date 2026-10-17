'use client';

import React from 'react';
import Image from 'next/image';
import { History, Trash2, ArrowUpRight } from 'lucide-react';
import { SearchHistoryItem } from '@/lib/types';

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelect: (packageId: string) => void;
  onClear: () => void;
  lang: 'ar' | 'en';
}

export default function SearchHistory({
  history,
  onSelect,
  onClear,
  lang,
}: SearchHistoryProps) {
  const isAr = lang === 'ar';
  if (!history || history.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
        <span className="flex items-center gap-1.5 font-bold text-slate-300">
          <History className="w-4 h-4 text-emerald-400" />
          <span>{isAr ? 'عمليات البحث الأخيرة' : 'Recent Searches'}</span>
        </span>
        <button
          onClick={onClear}
          className="text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{isAr ? 'مسح السجل' : 'Clear History'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 mt-3">
        {history.slice(0, 8).map((item) => (
          <button
            key={item.packageId}
            onClick={() => onSelect(item.packageId)}
            className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center gap-2.5 text-right rtl:text-right ltr:text-left transition-all cursor-pointer group"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
              <Image
                src={item.icon || 'https://picsum.photos/seed/apk/100/100'}
                alt={item.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                unoptimized
              />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                {item.title}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{item.packageId}</p>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
