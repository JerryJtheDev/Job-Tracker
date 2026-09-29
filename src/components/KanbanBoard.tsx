import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { JobApplication, ApplicationStatus } from '../types';
import { STATUS_COLUMNS } from '../data/columns';
import { KanbanColumn } from './KanbanColumn';
import { ApplicationCard } from './ApplicationCard';
import { Search, Filter, ArrowUpDown, X, LayoutGrid, Columns } from 'lucide-react';

interface KanbanBoardProps {
  applications: JobApplication[];
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onSelectApplication: (application: JobApplication) => void;
  onAddNewApplication: (defaultStatus?: ApplicationStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  onStatusChange,
  onSelectApplication,
  onAddNewApplication,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'company-asc'>('date-desc');
  const [mobileActiveColumn, setMobileActiveColumn] = useState<ApplicationStatus>('applied');
  const [mobileViewMode, setMobileViewMode] = useState<'single' | 'grid'>('single');

  // Sensors configured for smooth drag with immediate click detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6, // 6px drag before triggering dnd
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeAppId = active.id as string;
    const overId = over.id as string;

    // Check if dropped directly onto a column
    const isColumn = STATUS_COLUMNS.some(col => col.id === overId);
    if (isColumn) {
      onStatusChange(activeAppId, overId as ApplicationStatus);
      return;
    }

    // Dropped onto another card: find that card's column
    const targetApp = applications.find(app => app.id === overId);
    if (targetApp && targetApp.status) {
      onStatusChange(activeAppId, targetApp.status);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Filter & sort applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.contactName && app.contactName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.location && app.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return (b.dateApplied || '').localeCompare(a.dateApplied || '');
    }
    if (sortBy === 'date-asc') {
      return (a.dateApplied || '').localeCompare(b.dateApplied || '');
    }
    if (sortBy === 'company-asc') {
      return a.company.localeCompare(b.company);
    }
    return 0;
  });

  const activeApplication = activeId
    ? applications.find(app => app.id === activeId)
    : null;

  return (
    <section aria-label="Kanban Application Board" className="flex flex-col flex-1">
      {/* Search & Filter Command Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by company, role, location..."
            className="w-full bg-zinc-950/80 border border-zinc-800 rounded-md pl-9 pr-8 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Filters & Sorting */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Status Segmented Filter */}
          <div className="flex items-center gap-1 bg-zinc-950/80 p-0.5 rounded border border-zinc-800">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                statusFilter === 'all'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              All ({applications.length})
            </button>
            {STATUS_COLUMNS.map((col) => {
              const count = applications.filter(a => a.status === col.id).length;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setStatusFilter(col.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
                    statusFilter === col.id
                      ? 'bg-zinc-800 text-zinc-100 font-semibold'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: col.accentColor }}
                  />
                  <span>{col.title}</span>
                  <span className="font-mono text-[10px] text-zinc-400">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1 text-zinc-400 bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="date-desc" className="bg-zinc-900 text-zinc-200">Newest first</option>
              <option value="date-asc" className="bg-zinc-900 text-zinc-200">Oldest first</option>
              <option value="company-asc" className="bg-zinc-900 text-zinc-200">Company (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile view controls: switcher tabs */}
      <div className="lg:hidden flex items-center justify-between gap-2 mb-3">
        <div className="flex-1 flex overflow-x-auto gap-1 bg-zinc-900/60 p-1 rounded-lg border border-zinc-800/80">
          {STATUS_COLUMNS.map((col) => {
            const count = applications.filter(a => a.status === col.id).length;
            const isActive = mobileActiveColumn === col.id;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => setMobileActiveColumn(col.id)}
                className={`flex-1 min-w-[75px] py-1.5 px-2 text-xs font-medium rounded text-center transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: col.accentColor }}
                />
                <span>{col.title}</span>
                <span className="font-mono text-[10px] text-zinc-400">({count})</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setMobileViewMode(mobileViewMode === 'single' ? 'grid' : 'single')}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
          title={mobileViewMode === 'single' ? 'Show all 4 columns side by side' : 'Focus single column'}
        >
          {mobileViewMode === 'single' ? (
            <Columns className="w-4 h-4" />
          ) : (
            <LayoutGrid className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Kanban Board Columns Container */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex-1">
          {/* Desktop view (always 4-column grid) */}
          <div className="hidden lg:grid grid-cols-4 gap-4 h-full items-start">
            {STATUS_COLUMNS.map((column) => {
              const columnApps = sortedApplications.filter(
                (app) => app.status === column.id
              );
              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  applications={columnApps}
                  onCardClick={onSelectApplication}
                  onQuickMove={onStatusChange}
                  onAddNewToColumn={onAddNewApplication}
                />
              );
            })}
          </div>

          {/* Mobile / Tablet View */}
          <div className="lg:hidden">
            {mobileViewMode === 'single' ? (
              // Single tabbed column view for optimal mobile ergonomics
              (() => {
                const column = STATUS_COLUMNS.find(c => c.id === mobileActiveColumn)!;
                const columnApps = sortedApplications.filter(
                  app => app.status === column.id
                );
                return (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    applications={columnApps}
                    onCardClick={onSelectApplication}
                    onQuickMove={onStatusChange}
                    onAddNewToColumn={onAddNewApplication}
                  />
                );
              })()
            ) : (
              // Horizontal scrollable multi-column board
              <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
                {STATUS_COLUMNS.map((column) => {
                  const columnApps = sortedApplications.filter(
                    (app) => app.status === column.id
                  );
                  return (
                    <div key={column.id} className="w-[85vw] max-w-[340px] shrink-0 snap-start">
                      <KanbanColumn
                        column={column}
                        applications={columnApps}
                        onCardClick={onSelectApplication}
                        onQuickMove={onStatusChange}
                        onAddNewToColumn={onAddNewApplication}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Drag Overlay for fluid dragging feedback */}
        <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
          {activeApplication ? (
            <ApplicationCard
              application={activeApplication}
              accentColor={
                STATUS_COLUMNS.find(c => c.id === activeApplication.status)?.accentColor || '#F59E0B'
              }
              onClick={() => {}}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
};
