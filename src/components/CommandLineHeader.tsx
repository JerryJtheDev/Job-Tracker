import React from 'react';
import { ApplicationStatus } from '../types';
import { AnalyticsMetrics } from '../utils/analytics';
import { Plus, Search, Activity, Terminal, Database, Trash2, X } from 'lucide-react';

interface CommandLineHeaderProps {
  currentFocusStatus: ApplicationStatus;
  metrics: AnalyticsMetrics;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNewApplication: () => void;
  isDeckOpen: boolean;
  onToggleDeck: () => void;
  onOpenBackup: () => void;
  onResetDemoData: () => void;
  onOpenClearConfirm: () => void;
}

export const CommandLineHeader: React.FC<CommandLineHeaderProps> = ({
  currentFocusStatus,
  metrics,
  searchQuery,
  onSearchChange,
  onOpenNewApplication,
  isDeckOpen,
  onToggleDeck,
  onOpenBackup,
  onOpenClearConfirm,
}) => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 px-3 sm:px-5 py-2.5 bg-[#080b11]/90 border-b border-zinc-800/80 backdrop-blur-md text-xs select-none">
      {/* Left: Terminal breadcrumb & prompt */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex items-center gap-1.5 font-mono text-zinc-400">
          <Terminal className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="text-zinc-300 font-semibold hidden sm:inline">pipeline</span>
          <span className="text-zinc-600">/</span>
          <span className="text-white font-bold uppercase text-[11px] truncate tracking-wider">
            {currentFocusStatus}
          </span>
        </div>

        {/* Live snapshot telemetry ticker with high-contrast figures */}
        <div className="hidden xl:flex items-center gap-2 pl-3 ml-2 border-l border-zinc-800 text-[11px] font-mono text-zinc-400">
          <span className="text-white font-semibold tabular-nums">{metrics.totalApplications}</span>
          <span className="text-zinc-500">tracked</span>
          <span className="text-zinc-700">·</span>
          <span className="text-teal-300 font-semibold tabular-nums">{metrics.activeInterviews}</span>
          <span className="text-zinc-500">interviewing</span>
          <span className="text-zinc-700">·</span>
          <span className="text-teal-200 font-semibold tabular-nums">{metrics.offersReceived}</span>
          <span className="text-zinc-500">offer</span>
          <span className="text-zinc-700">·</span>
          <span className="text-white font-semibold tabular-nums">{metrics.responseRate}%</span>
          <span className="text-zinc-500">response</span>
        </div>
      </div>

      {/* Center: Command Search Input */}
      <div className="relative flex-1 max-w-xs sm:max-w-sm mx-1 sm:mx-4">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter applications (/)..."
          className="w-full bg-[#0d121c] border border-zinc-800 rounded px-8 py-1 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <X className="w-3 h-3" />
          </button>
        ) : (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-600 border border-zinc-800 rounded px-1 hidden sm:inline">
            /
          </span>
        )}
      </div>

      {/* Right: Quick actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Clear All / Start Fresh Button (Prominent & Clear) */}
        <button
          type="button"
          onClick={onOpenClearConfirm}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-rose-300 bg-zinc-900/60 hover:bg-rose-950/40 rounded border border-zinc-800 hover:border-rose-900/60 transition-colors"
          title="Clear all data to track your personal job search"
        >
          <Trash2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-rose-400" />
          <span className="hidden sm:inline">Start Fresh</span>
        </button>

        {/* Backup Utility */}
        <button
          type="button"
          onClick={onOpenBackup}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-800 transition-colors"
          title="Backup & Export JSON"
        >
          <Database className="w-3.5 h-3.5 text-zinc-500" />
          <span className="hidden md:inline">Backup</span>
        </button>

        {/* Toggle Command Deck */}
        <button
          type="button"
          onClick={onToggleDeck}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors border ${
            isDeckOpen
              ? 'bg-zinc-800 text-white border-zinc-700 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900 border-zinc-800'
          }`}
          title="Toggle Telemetry Deck"
        >
          <Activity className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden sm:inline">Telemetry</span>
        </button>

        {/* Primary Action Button: Deliberately Amber */}
        <button
          type="button"
          onClick={onOpenNewApplication}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Log</span>
          <span className="hidden sm:inline font-mono text-[10px] opacity-75 ml-0.5">[N]</span>
        </button>
      </div>
    </header>
  );
};
