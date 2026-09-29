import React from 'react';
import { AnalyticsMetrics } from '../utils/analytics';
import { StatusChart } from './StatusChart';
import { Send, TrendingUp, TrendingDown, Target, Award, Activity } from 'lucide-react';

interface AnalyticsDashboardProps {
  metrics: AnalyticsMetrics;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ metrics }) => {
  const {
    totalApplications,
    thisWeekCount,
    lastWeekCount,
    weekOverWeekChange,
    weekOverWeekDelta,
    responseRate,
    activeInterviews,
    offersReceived,
  } = metrics;

  return (
    <section aria-label="Job Search Analytics" className="mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Metric 1: Total Applications */}
        <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-lg p-4 flex flex-col justify-between hover:border-zinc-700/80 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span className="font-medium tracking-wide">Total Applications</span>
            <Send className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-zinc-100 tabular-nums">
              {totalApplications}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              tracked
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
            <span>Active pipeline:</span>
            <span className="font-mono text-amber-400 font-semibold tabular-nums">
              {activeInterviews + offersReceived} active
            </span>
          </div>
        </div>

        {/* Metric 2: Applications Pace (This Week vs Last Week) */}
        <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-lg p-4 flex flex-col justify-between hover:border-zinc-700/80 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span className="font-medium tracking-wide">Weekly Momentum</span>
            <Activity className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold font-mono text-zinc-100 tabular-nums">
              {thisWeekCount}
            </span>
            <div className="flex items-center gap-1 text-xs">
              {weekOverWeekDelta >= 0 ? (
                <span className="inline-flex items-center text-emerald-400 font-mono font-medium">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />
                  {weekOverWeekDelta > 0 ? `+${weekOverWeekDelta}` : '0'} vs last wk
                </span>
              ) : (
                <span className="inline-flex items-center text-rose-400 font-mono font-medium">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5 inline" />
                  {weekOverWeekDelta} vs last wk
                </span>
              )}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
            <span>Previous 7 days:</span>
            <span className="font-mono text-zinc-300 tabular-nums">{lastWeekCount} sent</span>
          </div>
        </div>

        {/* Metric 3: Response Rate */}
        <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-lg p-4 flex flex-col justify-between hover:border-zinc-700/80 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span className="font-medium tracking-wide">Response Rate</span>
            <Target className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-400 tabular-nums">
              {responseRate}%
            </span>
            <span className="text-xs text-zinc-500">
              moved past applied
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
            <span>Interview stages:</span>
            <span className="font-mono text-zinc-300 tabular-nums">
              {activeInterviews} in progress
            </span>
          </div>
        </div>

        {/* Metric 4 / Chart Card: Status Breakdown & Chart */}
        <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-lg p-4 flex flex-col justify-between hover:border-zinc-700/80 transition-colors">
          <StatusChart metrics={metrics} />
        </div>
      </div>
    </section>
  );
};
