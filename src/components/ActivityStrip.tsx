import React from 'react';
import { ApplicationStatus } from '../types';
import {
  Send,
  Target,
  Award,
  Archive,
  Plus,
  Activity,
  Database,
  RotateCcw,
} from 'lucide-react';

interface ActivityStripProps {
  currentFocusStatus: ApplicationStatus;
  onSelectFocusStatus: (status: ApplicationStatus) => void;
  onOpenNewApplication: () => void;
  isDeckOpen: boolean;
  onToggleDeck: () => void;
  onOpenBackup: () => void;
  onResetDemoData: () => void;
  onShowShortcuts?: () => void;
  counts: Record<ApplicationStatus, number>;
}

export const ActivityStrip: React.FC<ActivityStripProps> = ({
  currentFocusStatus,
  onSelectFocusStatus,
  onOpenNewApplication,
  isDeckOpen,
  onToggleDeck,
  onOpenBackup,
  onResetDemoData,
  counts,
}) => {
  return (
    <aside
      aria-label="Activity Navigation"
      className="hidden md:flex flex-col items-center justify-between w-14 shrink-0 bg-[#080b11]/90 border-r border-zinc-800/80 py-4 select-none z-30"
    >
      {/* Top: Brand Monogram Glyph */}
      <div className="flex flex-col items-center gap-5 w-full">
        <a
          href="/"
          className="group relative flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
          title="Pipeline Tracker"
        >
          <span className="font-mono text-xs font-bold text-white group-hover:scale-105 transition-transform tracking-tighter">
            P//
          </span>
          <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-teal-400 ring-2 ring-zinc-950" />
        </a>

        {/* Focus Stage Icon Selectors */}
        <div className="flex flex-col items-center gap-1.5 w-full px-2">
          {/* Interviewing (High priority loop) */}
          <button
            type="button"
            onClick={() => onSelectFocusStatus('interviewing')}
            className={`relative group flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
              currentFocusStatus === 'interviewing'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
            title={`Focus Interviewing (${counts.interviewing})`}
          >
            <Target className="w-4 h-4" />
            {counts.interviewing > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 ring-2 ring-zinc-950" />
            )}
            <span className="absolute left-14 px-2 py-1 rounded bg-zinc-900 text-xs font-mono text-zinc-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-zinc-800 shadow-md">
              Focus: Interviewing ({counts.interviewing})
            </span>
          </button>

          {/* Applied */}
          <button
            type="button"
            onClick={() => onSelectFocusStatus('applied')}
            className={`relative group flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
              currentFocusStatus === 'applied'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
            title={`Focus Applied (${counts.applied})`}
          >
            <Send className="w-4 h-4" />
            {counts.applied > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 ring-2 ring-zinc-950" />
            )}
            <span className="absolute left-14 px-2 py-1 rounded bg-zinc-900 text-xs font-mono text-zinc-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-zinc-800 shadow-md">
              Focus: Applied ({counts.applied})
            </span>
          </button>

          {/* Offer */}
          <button
            type="button"
            onClick={() => onSelectFocusStatus('offer')}
            className={`relative group flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
              currentFocusStatus === 'offer'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
            title={`Focus Offers (${counts.offer})`}
          >
            <Award className="w-4 h-4" />
            {counts.offer > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-teal-300 ring-2 ring-zinc-950" />
            )}
            <span className="absolute left-14 px-2 py-1 rounded bg-zinc-900 text-xs font-mono text-zinc-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-zinc-800 shadow-md">
              Focus: Offers ({counts.offer})
            </span>
          </button>

          {/* Rejected */}
          <button
            type="button"
            onClick={() => onSelectFocusStatus('rejected')}
            className={`relative group flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
              currentFocusStatus === 'rejected'
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
            title={`Focus Rejected (${counts.rejected})`}
          >
            <Archive className="w-4 h-4" />
            <span className="absolute left-14 px-2 py-1 rounded bg-zinc-900 text-xs font-mono text-zinc-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-zinc-800 shadow-md">
              Focus: Archive ({counts.rejected})
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-6 h-px bg-zinc-800" />

        {/* The Single Primary Action Button: Deliberately Amber */}
        <button
          type="button"
          onClick={onOpenNewApplication}
          className="group relative flex items-center justify-center w-10 h-10 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
          title="Log Application (Press N)"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="absolute left-14 px-2 py-1 rounded bg-zinc-900 text-xs font-mono text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-zinc-800 shadow-md">
            Log New Role [N]
          </span>
        </button>

        {/* Command Deck Toggle */}
        <button
          type="button"
          onClick={onToggleDeck}
          className={`group relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
            isDeckOpen
              ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
              : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
          title="Toggle Telemetry Deck"
        >
          <Activity className="w-4 h-4" />
          <span className="absolute left-14 px-2 py-1 rounded bg-zinc-900 text-xs font-mono text-zinc-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-zinc-800 shadow-md">
            {isDeckOpen ? 'Hide Telemetry' : 'Show Telemetry'}
          </span>
        </button>
      </div>

      {/* Bottom Utilities */}
      <div className="flex flex-col items-center gap-1.5 w-full px-2">
        <button
          type="button"
          onClick={onOpenBackup}
          className="group relative flex items-center justify-center w-10 h-10 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
          title="Backup & Export JSON"
        >
          <Database className="w-4 h-4" />
          <span className="absolute left-14 px-2 py-1 rounded bg-zinc-900 text-xs font-mono text-zinc-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-zinc-800 shadow-md">
            Export / Import JSON
          </span>
        </button>

        <button
          type="button"
          onClick={onResetDemoData}
          className="group relative flex items-center justify-center w-10 h-10 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
          title="Reset sample data"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="absolute left-14 px-2 py-1 rounded bg-zinc-900 text-xs font-mono text-zinc-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-zinc-800 shadow-md">
            Reset Demo Data
          </span>
        </button>
      </div>
    </aside>
  );
};
