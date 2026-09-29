import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { JobApplication, StatusColumnConfig, ApplicationStatus } from '../types';
import { CompactApplicationRow } from './CompactApplicationRow';
import { ChevronDown, ChevronRight, Plus, ArrowUpRight, Inbox } from 'lucide-react';

interface SecondaryQueueRowProps {
  column: StatusColumnConfig;
  applications: JobApplication[];
  onCardClick: (application: JobApplication) => void;
  onQuickMove: (id: string, newStatus: ApplicationStatus) => void;
  onAddNewToColumn: (status: ApplicationStatus) => void;
  onSetAsPrimaryFocus: (status: ApplicationStatus) => void;
  defaultExpanded?: boolean;
}

export const SecondaryQueueRow: React.FC<SecondaryQueueRowProps> = ({
  column,
  applications,
  onCardClick,
  onQuickMove,
  onAddNewToColumn,
  onSetAsPrimaryFocus,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { status: column.id },
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border transition-all duration-150 overflow-hidden ${
        isOver
          ? 'border-teal-500/90 bg-[#0e1420] ring-2 ring-teal-500/20 shadow-xl'
          : 'border-zinc-800/80 bg-[#0a0e16]/80 hover:border-zinc-700/80'
      }`}
    >
      {/* Header bar / Drop zone handle */}
      <div className="flex items-center justify-between p-3 gap-2 bg-zinc-950/40 hover:bg-zinc-900/60 transition-colors">
        {/* Left: toggle expand + title + count */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2.5 text-left min-w-0 flex-1 group"
        >
          <span className="text-zinc-500 group-hover:text-zinc-200 transition-colors">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>

          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: column.accentColor }}
            aria-hidden="true"
          />

          <span className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors truncate">
            {column.title}
          </span>

          <span className="font-mono text-[11px] font-bold px-2 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 tabular-nums">
            {applications.length}
          </span>

          {!isExpanded && applications.length > 0 && (
            <span className="text-[11px] text-zinc-500 truncate max-w-[160px] hidden sm:inline font-mono">
              ({applications.map(a => a.company).slice(0, 3).join(', ')}{applications.length > 3 ? '…' : ''})
            </span>
          )}
        </button>

        {/* Right actions: Set as Primary Focus + Add */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onSetAsPrimaryFocus(column.id)}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded border border-transparent hover:border-zinc-700 transition-colors"
            title={`Promote ${column.title} to Primary Focus Panel`}
          >
            <span>Focus</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => onAddNewToColumn(column.id)}
            className="p-1 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
            title={`Add role to ${column.title}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded list container */}
      {isExpanded && (
        <div className="p-2.5 space-y-1.5 border-t border-zinc-800/60 bg-black/20">
          {applications.length > 0 ? (
            applications.map((app) => (
              <CompactApplicationRow
                key={app.id}
                application={app}
                accentColor={column.accentColor}
                onClick={() => onCardClick(app)}
                onQuickMove={onQuickMove}
              />
            ))
          ) : (
            <div className="py-4 text-center text-xs text-zinc-500 flex flex-col items-center justify-center">
              <Inbox className="w-4 h-4 text-zinc-600 mb-1" />
              <span>No applications in {column.title.toLowerCase()}</span>
              <button
                type="button"
                onClick={() => onAddNewToColumn(column.id)}
                className="mt-1 text-[11px] text-teal-400 hover:text-teal-300 underline font-mono"
              >
                + Add one
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
