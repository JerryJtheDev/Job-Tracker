import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { JobApplication, ApplicationStatus } from '../types';
import { formatDate, getRelativeTime } from '../utils/date';
import { ExternalLink, GripVertical, ArrowUpRight } from 'lucide-react';

interface ApplicationCardProps {
  application: JobApplication;
  accentColor: string;
  onClick: () => void;
  onQuickMove?: (id: string, newStatus: ApplicationStatus) => void;
  isOverlay?: boolean;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
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

  const statusCodes: Record<ApplicationStatus, { code: string; label: string; textDark?: boolean }> = {
    applied: { code: 'APP', label: 'APPLIED', textDark: true },
    interviewing: { code: 'INT', label: 'INTERVIEW', textDark: true },
    offer: { code: 'OFF', label: 'OFFER', textDark: true },
    rejected: { code: 'REJ', label: 'ARCHIVED', textDark: false },
  };
  const currentStatusMeta = statusCodes[application.status] || { code: 'JOB', label: 'ACTIVE', textDark: true };

  // Short deterministic reference ID from app id / company
  const refCode = `${application.company.slice(0, 3).toUpperCase()}-${application.id.slice(-3)}`;

  return (
    <article
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('.interactive-action')) return;
        onClick();
      }}
      className={`group relative select-none bg-[#0e131f] border border-zinc-800/90 text-zinc-100 rounded-sm transition-all duration-150 overflow-hidden ${
        isDragging
          ? 'opacity-30 cursor-grabbing'
          : 'cursor-grab hover:-translate-y-0.5 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/70'
      } ${
        isOverlay
          ? 'shadow-2xl ring-1 ring-teal-500/60 bg-[#121827] cursor-grabbing rotate-1'
          : ''
      }`}
    >
      {/* Asymmetric Diagonal Corner Mark / Dog-Ear Ticket Stamp */}
      <div className="absolute top-0 right-0 w-11 h-11 overflow-hidden pointer-events-none z-10">
        <div
          className={`absolute transform rotate-45 text-[7.5px] font-mono font-bold tracking-wider py-0.5 right-[-20px] top-[8px] w-[64px] text-center shadow-xs uppercase select-none ${
            currentStatusMeta.textDark ? 'text-zinc-950 font-black' : 'text-zinc-100'
          }`}
          style={{ backgroundColor: accentColor }}
        >
          {currentStatusMeta.code}
        </div>
      </div>

      {/* Main Ticket Card Content */}
      <div className="p-3.5 pb-2.5">
        {/* Ticket Header Line */}
        <div className="flex items-baseline justify-between gap-2 pr-6 mb-1.5">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest shrink-0 font-medium">
              № {refCode}
            </span>
            <span className="text-zinc-600 font-mono text-[10px]" aria-hidden="true">/</span>
            <h4 className="text-sm font-bold uppercase tracking-tight text-white truncate group-hover:text-teal-300 transition-colors">
              {application.company}
            </h4>
          </div>

          <div
            {...attributes}
            {...listeners}
            className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5 -mr-1 cursor-grab active:cursor-grabbing shrink-0"
            title="Drag ticket"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Role Title with deliberate high-contrast weight */}
        <p className="text-xs font-semibold text-zinc-100 line-clamp-2 mb-2.5 leading-snug">
          {application.role}
        </p>

        {/* Unboxed inline metadata separated by custom typographic rules (no pill badges) */}
        <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 font-mono text-[11px] text-zinc-400 mb-2">
          {/* Date applied with relative age */}
          <span className="text-zinc-300">
            {formatDate(application.dateApplied)}
            <span className="text-zinc-500 ml-1">({getRelativeTime(application.dateApplied)})</span>
          </span>

          {application.location && (
            <>
              <span className="text-zinc-700" aria-hidden="true">|</span>
              <span className="text-zinc-400 truncate max-w-[140px]">
                {application.location}
              </span>
            </>
          )}

          {application.salary && (
            <>
              <span className="text-zinc-700" aria-hidden="true">|</span>
              <span className="text-zinc-100 font-semibold truncate max-w-[150px] tabular-nums">
                {application.salary}
              </span>
            </>
          )}
        </div>

        {/* Dispatch Note Snippet (Typewriter/index card memo look) */}
        {(application.prepNotes || application.descriptionNotes) && (
          <div className="mt-2 p-2 rounded bg-black/40 border-l-2 border-zinc-700 font-mono text-[10.5px] text-zinc-300 leading-relaxed line-clamp-2">
            <span className="text-zinc-500 mr-1.5 uppercase tracking-wider font-semibold">MEMO:</span>
            <span>{application.prepNotes || application.descriptionNotes}</span>
          </div>
        )}
      </div>

      {/* Perforated Ticket Stub Tear-Off Separator with authentic cutout notches */}
      <div className="relative my-0.5 border-t border-dashed border-zinc-800/90">
        {/* Left stub cutout notch */}
        <div
          className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-[#080b11] border-r border-zinc-800/90 pointer-events-none"
          aria-hidden="true"
        />
        {/* Right stub cutout notch */}
        <div
          className="absolute -right-1.5 -top-1.5 w-3 h-3 rounded-full bg-[#080b11] border-l border-zinc-800/90 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Ticket Stub Footer (Controls & Dispatch Details) */}
      <div className="px-3.5 py-2 bg-black/20 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2 text-zinc-500 min-w-0">
          <span className="text-[10px] tracking-wider uppercase text-zinc-400 truncate">
            {(application.notesList?.length || application.prepNotes)
              ? `[ ${(application.notesList?.length || 0) + (application.prepNotes ? 1 : 0)} NOTES ]`
              : '[ NO LOGS ]'}
          </span>

          {application.jobUrl && (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
              className="interactive-action text-zinc-400 hover:text-teal-300 transition-colors p-0.5"
              title="Open job URL"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {onQuickMove && nextStatus && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickMove(application.id, nextStatus);
            }}
            className="interactive-action inline-flex items-center gap-1 text-[10px] font-mono font-semibold tracking-wider text-zinc-400 hover:text-teal-300 uppercase transition-colors"
            title={`Advance ticket to ${nextStatus}`}
          >
            <span>Advance</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </article>
  );
};
