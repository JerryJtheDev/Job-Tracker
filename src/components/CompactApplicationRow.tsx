import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { JobApplication, ApplicationStatus } from '../types';
import { formatDate, getRelativeTime } from '../utils/date';
import { ExternalLink, GripVertical, ArrowUpRight } from 'lucide-react';

interface CompactApplicationRowProps {
  application: JobApplication;
  accentColor: string;
  onClick: () => void;
  onQuickMove?: (id: string, newStatus: ApplicationStatus) => void;
  isOverlay?: boolean;
}

export const CompactApplicationRow: React.FC<CompactApplicationRowProps> = ({
  application,
  accentColor,
  onClick,
  onQuickMove,
  isOverlay = false,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application.id,
    data: { application },
    disabled: isOverlay,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 50 : undefined,
      }
    : undefined;

  const nextStatuses: Record<ApplicationStatus, ApplicationStatus | null> = {
    applied: 'interviewing',
    interviewing: 'offer',
    offer: null,
    rejected: null,
  };
  const nextStatus = nextStatuses[application.status];

  const refCode = `${application.company.slice(0, 3).toUpperCase()}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('.interactive-action')) return;
        onClick();
      }}
      className={`group select-none relative flex items-center justify-between gap-2.5 px-2.5 py-2 bg-[#0e131f] border border-zinc-800/80 hover:border-zinc-700 hover:bg-[#121827] transition-all rounded-sm ${
        isDragging ? 'opacity-30 cursor-grabbing' : 'cursor-grab'
      } ${isOverlay ? 'shadow-2xl ring-1 ring-teal-500/50 bg-[#121827] cursor-grabbing' : ''}`}
    >
      {/* Left side: grab handle + company & role in high-contrast typographic hierarchy */}
      <div className="flex items-center gap-2 min-w-0">
        <div
          {...attributes}
          {...listeners}
          className="text-zinc-600 group-hover:text-zinc-300 cursor-grab active:cursor-grabbing shrink-0"
          title="Drag ticket"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider shrink-0">
          {refCode}
        </span>

        <span className="text-zinc-600 font-mono text-[10px]" aria-hidden="true">/</span>

        <div className="min-w-0 flex items-baseline gap-1.5 truncate">
          <span className="text-xs font-bold uppercase tracking-tight text-white group-hover:text-teal-300 transition-colors truncate">
            {application.company}
          </span>
          <span className="text-[11px] text-zinc-300 truncate hidden sm:inline font-medium">
            — {application.role}
          </span>
        </div>
      </div>

      {/* Right side: inline unboxed metadata + actions */}
      <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-zinc-400">
        <span className="text-[10.5px] text-zinc-400 hidden md:inline">
          {getRelativeTime(application.dateApplied)}
        </span>

        {application.jobUrl && (
          <a
            href={application.jobUrl}
            target="_blank"
            rel="noreferrer noopener"
            onClick={(e) => e.stopPropagation()}
            className="interactive-action p-0.5 text-zinc-500 hover:text-teal-300 transition-colors"
            title="Open job link"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        {onQuickMove && nextStatus && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickMove(application.id, nextStatus);
            }}
            className="interactive-action inline-flex items-center gap-0.5 text-[10px] font-mono font-semibold text-zinc-400 hover:text-teal-300 uppercase transition-colors"
            title={`Advance to ${nextStatus}`}
          >
            <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
