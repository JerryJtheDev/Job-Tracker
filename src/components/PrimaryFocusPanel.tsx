import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { JobApplication, StatusColumnConfig, ApplicationStatus } from '../types';
import { STATUS_COLUMNS } from '../data/columns';
import { ApplicationCard } from './ApplicationCard';
import { Plus, Inbox, Search, X, ArrowUpDown } from 'lucide-react';

interface PrimaryFocusPanelProps {
  focusStatus: ApplicationStatus;
  onSetFocusStatus: (status: ApplicationStatus) => void;
  applications: JobApplication[];
  allApplications: JobApplication[];
  onCardClick: (application: JobApplication) => void;
  onQuickMove: (id: string, newStatus: ApplicationStatus) => void;
  onAddNewApplication: (defaultStatus?: ApplicationStatus) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: 'date-desc' | 'date-asc' | 'company-asc';
  onSortChange: (sort: 'date-desc' | 'date-asc' | 'company-asc') => void;
}

export const PrimaryFocusPanel: React.FC<PrimaryFocusPanelProps> = ({
  focusStatus,
  onSetFocusStatus,
  applications,
  allApplications,
  onCardClick,
  onQuickMove,
  onAddNewApplication,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  const currentColumn = STATUS_COLUMNS.find(c => c.id === focusStatus) || STATUS_COLUMNS[0];

  const { setNodeRef, isOver } = useDroppable({
    id: focusStatus,
    data: { status: focusStatus },
  });

  const getStageDescription = (status: ApplicationStatus) => {
    switch (status) {
      case 'applied':
        return 'Active outreach queue awaiting recruiter screen & response';
      case 'interviewing':
        return 'Active technical screens, take-home evaluations, and loop rounds';
      case 'offer':
        return 'Active compensation packages, equity reviews, and negotiations';
      case 'rejected':
        return 'Archived outcomes, feedback records, and future re-apply dates';
      default:
        return '';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col flex-1 rounded-xl border transition-all duration-200 bg-[#0b0f17]/85 backdrop-blur-md overflow-hidden ${
        isOver
          ? 'border-teal-500 ring-2 ring-teal-500/25 bg-[#0e1420] shadow-2xl'
          : 'border-zinc-800/90 shadow-lg shadow-black/40'
      }`}
    >
      {/* Primary Stage Header & Focus Switcher */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-950/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          {/* Stage Identity */}
          <div className="flex items-center gap-2.5">
            <span
              className="w-3.5 h-3.5 rounded-full ring-4 ring-black/60 shrink-0"
              style={{ backgroundColor: currentColumn.accentColor }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
                  {currentColumn.title}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-white font-bold tabular-nums">
                  {applications.length}
                </span>
                <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/80">
                  Focus Queue
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {getStageDescription(focusStatus)}
              </p>
            </div>
          </div>

          {/* Subordinate Add Action */}
          <button
            type="button"
            onClick={() => onAddNewApplication(focusStatus)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-400" />
            <span>Add to {currentColumn.title}</span>
          </button>
        </div>

        {/* Stage Selector Tabs (Easy 1-click Focus Switcher) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-zinc-800/70">
          <span className="text-[11px] font-mono text-zinc-500 mr-1 hidden sm:inline">
            Stage View:
          </span>
          {STATUS_COLUMNS.map((col) => {
            const count = allApplications.filter(a => a.status === col.id).length;
            const isSelected = col.id === focusStatus;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => onSetFocusStatus(col.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-zinc-800 text-white font-bold ring-1 ring-zinc-600 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: col.accentColor }}
                />
                <span>{col.title}</span>
                <span className="font-mono text-[10px] text-zinc-400 font-semibold">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mt-3 pt-3 border-t border-zinc-800/60">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by company, role, location..."
              className="w-full bg-[#080b11] border border-zinc-800 rounded-md pl-8 pr-7 py-1 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 text-zinc-400 bg-[#080b11] px-2 py-1 rounded border border-zinc-800 text-xs shrink-0 self-end sm:self-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="date-desc" className="bg-zinc-900 text-zinc-200">Newest date</option>
              <option value="date-asc" className="bg-zinc-900 text-zinc-200">Oldest date</option>
              <option value="company-asc" className="bg-zinc-900 text-zinc-200">Company (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards Stream Area */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 min-h-[300px]">
        {applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                accentColor={currentColumn.accentColor}
                onClick={() => onCardClick(app)}
                onQuickMove={onQuickMove}
              />
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center p-6 text-center border border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/20">
            <Inbox className="w-8 h-8 text-zinc-600 mb-2 stroke-[1.5]" />
            <p className="text-sm text-zinc-200 font-bold mb-1">
              No applications in {currentColumn.title}
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mb-4">
              {searchQuery
                ? `No matching applications for "${searchQuery}". Clear your search or add a new role.`
                : `Drag applications from the secondary queues on the right into this panel, or log a new role.`}
            </p>
            <button
              type="button"
              onClick={() => onAddNewApplication(focusStatus)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log role in {currentColumn.title}</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Drop Zone Hint */}
      <div className="px-4 py-2 bg-zinc-950/60 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
        <span>Drop tickets here to transfer to {currentColumn.title}</span>
        <span className="text-zinc-600">Drag & drop active</span>
      </div>
    </div>
  );
};
