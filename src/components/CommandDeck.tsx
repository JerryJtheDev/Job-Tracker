import React from 'react';
import { AnalyticsMetrics } from '../utils/analytics';
import { JobApplication } from '../types';
import { StatusChart } from './StatusChart';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Activity,
} from 'lucide-react';

interface CommandDeckProps {
  metrics: AnalyticsMetrics;
  applications: JobApplication[];
  onSelectApplication: (app: JobApplication) => void;
}

export const CommandDeck: React.FC<CommandDeckProps> = ({
  metrics,
  applications,
  onSelectApplication,
}) => {
  const {
    totalApplications,
    thisWeekCount,
    lastWeekCount,
    weekOverWeekDelta,
    responseRate,
    activeInterviews,
    offersReceived,
  } = metrics;

  // Derive "Today's Focus" items (applications in interviewing, offers, or needing follow-up)
  const focusItems = applications
    .filter(a => a.status === 'interviewing' || a.status === 'offer' || (a.prepNotes && a.prepNotes.length > 0))
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-800/80 bg-[#0a0e16]/80 p-4 shadow-lg shadow-black/40">
      {/* Deck Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-teal-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100 font-mono">
            Pipeline Telemetry
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">
          LIVE METRICS
        </span>
      </div>

      {/* Primary Telemetry Stream (High-contrast numbers with deep visual hierarchy) */}
      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
        {/* Metric 1: Total */}
        <div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Total Sent</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
              {totalApplications}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">apps</span>
          </div>
        </div>

        {/* Metric 2: Momentum */}
        <div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">7d Momentum</span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
              {thisWeekCount}
            </span>
            <span
              className={`text-[10px] font-mono font-semibold flex items-center ${
                weekOverWeekDelta >= 0 ? 'text-teal-400' : 'text-zinc-500'
              }`}
            >
              {weekOverWeekDelta >= 0 ? `+${weekOverWeekDelta}` : weekOverWeekDelta}
            </span>
          </div>
        </div>

        {/* Metric 3: Response Rate */}
        <div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Response</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
              {responseRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Chart.js Embedded Visualizer */}
      <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/60 min-h-[200px]">
        <StatusChart metrics={metrics} />
      </div>

      {/* Today's Focus / Priority Action Items */}
      <div className="mt-1 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-zinc-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Today's Focus & Action Items
          </span>
          <span className="font-mono text-[10px] text-teal-300 font-semibold">
            {activeInterviews + offersReceived} active
          </span>
        </div>

        <div className="space-y-1.5">
          {focusItems.length > 0 ? (
            focusItems.map((app) => (
              <div
                key={app.id}
                onClick={() => onSelectApplication(app)}
                className="group p-2 rounded bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        app.status === 'offer'
                          ? 'bg-teal-300 ring-2 ring-teal-400/20'
                          : 'bg-teal-400'
                      }`}
                    />
                    <span className="text-xs font-bold text-zinc-100 group-hover:text-teal-300 transition-colors truncate">
                      {app.company}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 uppercase">
                      {app.status}
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-200 transition-colors shrink-0" />
                </div>
                <p className="text-[11px] text-zinc-300 truncate font-sans">
                  {app.prepNotes || app.role}
                </p>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-zinc-500 italic">
              No active loops or offers yet. Log applications to populate focus items.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
