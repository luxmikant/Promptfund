'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeaderBarProps {
  activeView: 'landing' | 'workbench';
  onSelectView: (view: 'landing' | 'workbench') => void;
}

export function HeaderBar({ activeView, onSelectView }: HeaderBarProps) {
  return (
    <header className="h-14 border-b border-[#E6E6E1] bg-[#FFFFFF] px-4 sm:px-6 flex items-center justify-between shrink-0 select-none">
      
      {/* Left: Wordmark & Navigation Tabs */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Wordmark */}
        <button
          onClick={() => onSelectView('landing')}
          className="flex items-center gap-2 text-left group"
        >
          <span className="font-semibold text-sm sm:text-base tracking-tight text-[#111110] group-hover:text-[#005EA6] transition">
            PromptFund
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-[#F4F4F0] text-[#686763] border border-[#E6E6E1]">
            Clearinghouse
          </span>
        </button>

        {/* View Segmented Tabs */}
        <nav className="flex items-center p-0.5 rounded bg-[#F4F4F0] border border-[#E6E6E1] text-xs">
          <button
            onClick={() => onSelectView('landing')}
            className={`px-3 py-1 rounded transition text-xs font-medium ${
              activeView === 'landing'
                ? 'bg-white text-[#111110] shadow-sm font-semibold'
                : 'text-[#686763] hover:text-[#111110]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSelectView('workbench')}
            className={`px-3 py-1 rounded transition text-xs font-medium ${
              activeView === 'workbench'
                ? 'bg-white text-[#111110] shadow-sm font-semibold'
                : 'text-[#686763] hover:text-[#111110]'
            }`}
          >
            Workbench
          </button>
        </nav>

      </div>

      {/* Right: Sandbox Status & Quick Action */}
      <div className="flex items-center gap-3">
        
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#686763]">
          <span className="w-2 h-2 rounded-full bg-[#0D7A5F]" />
          <span className="hidden md:inline">PayPal Sandbox Live</span>
          <span className="md:hidden">Sandbox</span>
        </div>

        {activeView === 'landing' && (
          <button
            onClick={() => onSelectView('workbench')}
            className="px-3 py-1.5 rounded bg-[#005EA6] hover:bg-[#004d88] text-white text-xs font-medium flex items-center gap-1 transition"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}

      </div>

    </header>
  );
}
