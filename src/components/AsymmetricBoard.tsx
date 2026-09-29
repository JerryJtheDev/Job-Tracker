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
import { AnalyticsMetrics } from '../utils/analytics';
import { PrimaryFocusPanel } from './PrimaryFocusPanel';
import { SecondaryQueueRow } from './SecondaryQueueRow';
import { CommandDeck } from './CommandDeck';
import { ApplicationCard } from './ApplicationCard';
import { CompactApplicationRow } from './CompactApplicationRow';
import { Layers, Activity, ChevronRight, Sparkles } from 'lucide-react';

interface AsymmetricBoardProps {
  applications: JobApplication[];
  metrics: AnalyticsMetrics;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onSelectApplication: (application: JobApplication) => void;
  onAddNewApplication: (defaultStatus?: ApplicationStatus) => void;
  onResetDemoData?: () => void;
  focusStatus: ApplicationStatus;
  onSetFocusStatus: (status: ApplicationStatus) => void;
  isDeckOpen: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AsymmetricBoard: React.FC<AsymmetricBoardProps> = ({
  applications,
  metrics,
  onStatusChange,
  onSelectApplication,
  onAddNewApplication,
  onResetDemoData,
  focusStatus,
  onSetFocusStatus,
  isDeckOpen,
  searchQuery,
  onSearchChange,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'company-asc'>('date-desc');
  const [rightPanelTab, setRightPanelTab] = useState<'queues' | 'telemetry'>('queues');

  // DnD sensors with smooth pointer & touch constraints
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
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

    // Direct drop onto a status column / row target
    const targetColumn = STATUS_COLUMNS.find(col => col.id === overId);
    if (targetColumn) {
      onStatusChange(activeAppId, targetColumn.id);
      return;
    }

    // Drop onto another card: move to that card's status
    const targetApp = applications.find(app => app.id === overId);
    if (targetApp && targetApp.status) {
      onStatusChange(activeAppId, targetApp.status);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Filter applications by search query
  const filteredApplications = applications.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.company.toLowerCase().includes(q) ||
      app.role.toLowerCase().includes(q) ||
      (app.location && app.location.toLowerCase().includes(q)) ||
      (app.contactName && app.contactName.toLowerCase().includes(q))
    );
  });

  // Sort applications
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

  // Primary focus applications
  const focusApplications = sortedApplications.filter(app => app.status === focusStatus);

  // Secondary non-focus columns
  const secondaryColumns = STATUS_COLUMNS.filter(col => col.id !== focusStatus);

  const activeApplication = activeId
    ? applications.find(app => app.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-4 pb-6 min-h-0">
        {/* Asymmetric Left Panel: Primary Focus Stage (~65% width) */}
        <div className="flex-1 flex flex-col min-w-0">
          <PrimaryFocusPanel
            focusStatus={focusStatus}
            onSetFocusStatus={onSetFocusStatus}
            applications={focusApplications}
            allApplications={applications}
            onCardClick={onSelectApplication}
            onQuickMove={onStatusChange}
            onAddNewApplication={onAddNewApplication}
            onResetDemoData={onResetDemoData}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Asymmetric Right Panel: Secondary Collapsible Queues & Integrated Telemetry Deck (~35% width) */}
        <div className="w-full lg:w-[420px] xl:w-[460px] shrink-0 flex flex-col gap-4">
          {/* Right Panel View Switcher (Queues vs Telemetry Deck) */}
          <div className="flex items-center justify-between p-1 bg-zinc-900/80 rounded-lg border border-zinc-800">
            <div className="flex items-center gap-1 flex-1">
              <button
                type="button"
                onClick={() => setRightPanelTab('queues')}
                className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                  rightPanelTab === 'queues'
                    ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                <span>Secondary Queues</span>
                <span className="font-mono text-[10px] text-zinc-400 ml-1">
                  ({applications.length - focusApplications.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRightPanelTab('telemetry')}
                className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                  rightPanelTab === 'telemetry'
                    ? 'bg-zinc-800 text-white font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-teal-400" />
                <span>Command Deck</span>
                <span className="font-mono text-[10px] text-teal-300 font-semibold ml-1">
                  ({metrics.responseRate}%)
                </span>
              </button>
            </div>
          </div>

          {/* Right Panel Tab 1: Secondary Collapsible Queues */}
          {rightPanelTab === 'queues' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 px-1">
                <span>COLLAPSED STATUS STACKS</span>
                <span>DRAG TARGETS</span>
              </div>

              {secondaryColumns.map((column) => {
                const columnApps = sortedApplications.filter(app => app.status === column.id);
                return (
                  <SecondaryQueueRow
                    key={column.id}
                    column={column}
                    applications={columnApps}
                    onCardClick={onSelectApplication}
                    onQuickMove={onStatusChange}
                    onAddNewToColumn={onAddNewApplication}
                    onSetAsPrimaryFocus={onSetFocusStatus}
                    defaultExpanded={column.id === 'offer' || columnApps.length > 0}
                  />
                );
              })}

              {/* Quick snippet of Command Deck underneath if space permits */}
              <div className="mt-2">
                <CommandDeck
                  metrics={metrics}
                  applications={applications}
                  onSelectApplication={onSelectApplication}
                />
              </div>
            </div>
          )}

          {/* Right Panel Tab 2: Full Command Deck & Performance Telemetry */}
          {rightPanelTab === 'telemetry' && (
            <div className="flex flex-col gap-3">
              <CommandDeck
                metrics={metrics}
                applications={applications}
                onSelectApplication={onSelectApplication}
              />

              <div className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/60 text-xs text-zinc-400">
                <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">
                  Stage Distribution
                </span>
                <div className="space-y-1 font-mono text-[11px]">
                  {STATUS_COLUMNS.map(col => {
                    const count = applications.filter(a => a.status === col.id).length;
                    return (
                      <div
                        key={col.id}
                        onClick={() => onSetFocusStatus(col.id)}
                        className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-zinc-900 cursor-pointer text-zinc-300"
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: col.accentColor }}
                          />
                          <span>{col.title}</span>
                        </div>
                        <span className="text-zinc-400 tabular-nums">
                          {count} roles {col.id === focusStatus ? '(active focus)' : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fluid Drag Overlay */}
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
  );
};
