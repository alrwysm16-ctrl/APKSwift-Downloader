'use client';

import React from 'react';

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* Top right cyan ambient glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      
      {/* Bottom left emerald ambient glow */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-[130px]" />

      {/* Center subtle glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-teal-500/5 blur-[140px]" />

      {/* Tech circuit contour line graphics */}
      <svg
        className="absolute top-10 left-6 w-80 h-80 opacity-20 stroke-emerald-400"
        fill="none"
        viewBox="0 0 200 200"
      >
        <path d="M10 20 L70 20 L100 50 L100 120 L140 160 L190 160" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="10" cy="20" r="3" fill="#34d399" />
        <circle cx="100" cy="50" r="3" fill="#34d399" />
        <circle cx="190" cy="160" r="3" fill="#34d399" />
        <path d="M30 60 L60 90 L60 150 L110 180" strokeWidth="1" />
      </svg>

      <svg
        className="absolute top-16 right-10 w-96 h-96 opacity-15 stroke-cyan-400"
        fill="none"
        viewBox="0 0 250 250"
      >
        <path d="M240 30 L160 30 L120 70 L120 160 L70 190 L10 190" strokeWidth="1.5" strokeDasharray="6 3" />
        <circle cx="240" cy="30" r="3" fill="#38bdf8" />
        <circle cx="120" cy="70" r="3" fill="#38bdf8" />
        <circle cx="10" cy="190" r="3" fill="#38bdf8" />
      </svg>

      {/* Floating matrix numbers column matching screenshot right-hand side */}
      <div className="absolute right-12 top-24 font-mono text-xs text-emerald-400/25 leading-relaxed hidden md:block">
        <div>0 &nbsp; 9 &nbsp; 1 &nbsp; 5 &nbsp; 9 &nbsp; 3#</div>
        <div>1 &nbsp; 0 &nbsp; 3 &nbsp; 2 &nbsp; 1 &nbsp; 10</div>
        <div>0 &nbsp; 2 &nbsp; 1 &nbsp; 5 &nbsp; 0 &nbsp; 5</div>
        <div>1 &nbsp; 1 &nbsp; 8 &nbsp; 4 &nbsp; 1 &nbsp; 8</div>
        <div className="text-cyan-400/30">8 &nbsp; 0 &nbsp; 1 &nbsp; 2 &nbsp; 5 &nbsp; 0</div>
        <div className="text-[10px] text-emerald-300/20 my-2">
          func (main) &#123; <br />
          &nbsp;&nbsp;var (wat nil); <br />
          &#125;
        </div>
        <div>6 &nbsp; 2 &nbsp; 1 &nbsp; 9 &nbsp; 0 &nbsp; 3</div>
        <div>2 &nbsp; 3 &nbsp; 0 &nbsp; 1 &nbsp; 1 &nbsp; 8</div>
        <div>9 &nbsp; 0 &nbsp; 8 &nbsp; 3 &nbsp; 0 &nbsp; 0</div>
      </div>

      {/* Dot matrix grid in bottom left corner matching screenshot */}
      <div className="absolute bottom-10 left-10 grid grid-cols-4 gap-3 opacity-20 hidden sm:grid">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        ))}
      </div>
    </div>
  );
}
