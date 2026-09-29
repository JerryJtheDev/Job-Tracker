import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { JobApplication, StatusColumnConfig, ApplicationStatus } from '../types';
import { ApplicationCard } from './ApplicationCard';
import { Plus, Inbox } from 'lucide-react';

interface KanbanColumnProps {
  column: StatusColumnConfig;
  applications: JobApplication[];
  onCardClick: (application: JobApplication) => void;
  onQuickMove: (id: string, newStatus: ApplicationStatus) => void;
  onAddNewToColumn: (status: ApplicationStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  applications,
  onCardClick,
  onQuickMove,
  onAddNewToColumn,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { status: column.id },
  });

  const getEmptyStateMessage = (status: ApplicationStatus) => {
    switch (status) {
      case 'applied':
        return 'No submitted applications awaiting response. Log new roles to start tracking.';
      case 'interviewing':
        return 'No active interview loops right now. Drag applied cards here when screens are scheduled.';
      case 'offer':
        return 'No offers in negotiation yet. Keep the pipeline active!';
      case 'rejected':
        return 'No archived rejections. All active applications are in progression.';
      default:
        return 'No applications in this stage.';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[280px] lg:min-w-0 flex-1 rounded-xl bg-zinc-950/60 border transition-all duration-200 ${
        isOver
          ? 'border-amber-500/60 ring-2 ring-amber-500/20 bg-zinc-900/40'
          : 'border-zinc-800/80 hover:border-zinc-800'
      }`}
    >
      {/* Column Header */}
      <div className="p-3.5 border-b border-zinc-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: column.accentColor }}
            aria-hidden="true"
          />
          <h3 className="text-sm font-semibold text-zinc-100 tracking-tight truncate">
            {column.title}
          </h3>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 tabular-nums">
            {applications.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddNewToColumn(column.id)}
          className="p-1 text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/80 rounded transition-colors"
          title={`Add role to ${column.title}`}
          aria-label={`Add role to ${column.title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Column Subtitle / stage description */}
      <div className="px-3.5 py-1.5 bg-zinc-900/40 border-b border-zinc-800/40 text-[11px] text-zinc-500 truncate">
        {column.subtitle}
      </div>

      {/* Cards list container */}
      <div className="flex-1 p-2.5 space-y-2.5 overflow-y-auto min-h-[200px] max-h-[calc(100vh-320px)]">
        {applications.length > 0 ? (
          applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              accentColor={column.accentColor}
              onClick={() => onCardClick(app)}
              onQuickMove={onQuickMove}
            />
          ))
        ) : (
          <div className="h-44 flex flex-col items-center justify-center p-4 text-center border border-dashed border-zinc-800/80 rounded-lg bg-zinc-900/20">
            <Inbox className="w-6 h-6 text-zinc-600 mb-2 stroke-[1.5]" />
            <p className="text-xs text-zinc-400 font-medium mb-1">Queue empty</p>
            <p className="text-[11px] text-zinc-500 leading-relaxed mb-3">
              {getEmptyStateMessage(column.id)}
            </p>
            <button
              type="button"
              onClick={() => onAddNewToColumn(column.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:text-amber-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log role</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Add Footer button */}
      <div className="p-2 border-t border-zinc-800/60 bg-zinc-950/40">
        <button
          type="button"
          onClick={() => onAddNewToColumn(column.id)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded transition-colors border border-transparent hover:border-zinc-800"
        >
          <Plus className="w-3.5 h-3.5 text-zinc-500" />
          <span>New {column.title}</span>
        </button>
      </div>
    </div>
  );
};
