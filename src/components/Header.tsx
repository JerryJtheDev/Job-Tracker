import React from 'react';
import { Plus, Database, RotateCcw, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenNewApplication: () => void;
  onOpenBackup: () => void;
  onResetDemoData: () => void;
  activeFilter?: string;
  onFilterSelect?: (filter: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewApplication,
  onOpenBackup,
  onResetDemoData,
  activeFilter = 'board',
  onFilterSelect,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      {/* Zone 1: Wordmark Brand element strictly single text element */}
      <div className="flex items-center gap-3">
        <a
          href="/"
          className="text-base sm:text-lg font-bold tracking-tight text-zinc-100 hover:text-amber-400 transition-colors flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
          <span>Pipeline</span>
        </a>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
        <button
          type="button"
          onClick={() => onFilterSelect?.('board')}
          className={`hover:text-zinc-100 transition-colors ${
            activeFilter === 'board' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Kanban Board
        </button>
        <button
          type="button"
          onClick={() => onFilterSelect?.('interviewing')}
          className={`hover:text-zinc-100 transition-colors ${
            activeFilter === 'interviewing' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Interviews
        </button>
        <button
          type="button"
          onClick={() => onFilterSelect?.('offer')}
          className={`hover:text-zinc-100 transition-colors ${
            activeFilter === 'offer' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Offers
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onResetDemoData}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded transition-colors"
          title="Reset to sample data"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
          <span className="hidden lg:inline">Reset Demo</span>
        </button>

        <button
          type="button"
          onClick={onOpenBackup}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded transition-colors border border-zinc-800"
          title="Backup & Export JSON"
        >
          <Database className="w-3.5 h-3.5 text-zinc-500" />
          <span className="hidden sm:inline">Backup</span>
        </button>

        <button
          type="button"
          onClick={onOpenNewApplication}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors shadow-sm whitespace-nowrap active:translate-y-px"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Log Application</span>
        </button>
      </div>
    </header>
  );
};
