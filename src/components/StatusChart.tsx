import React, { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartOptions,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { AnalyticsMetrics } from '../utils/analytics';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface StatusChartProps {
  metrics: AnalyticsMetrics;
}

export const StatusChart: React.FC<StatusChartProps> = ({ metrics }) => {
  const [chartView, setChartView] = useState<'donut' | 'bars'>('donut');

  const { statusBreakdown, weeklyVelocity, totalApplications } = metrics;

  // Disciplined palette: Slate for applied, Teal for interviewing, Mint for offer, Charcoal for rejected
  const donutData = {
    labels: ['Applied', 'Interviewing', 'Offer', 'Rejected'],
    datasets: [
      {
        data: [
          statusBreakdown.applied,
          statusBreakdown.interviewing,
          statusBreakdown.offer,
          statusBreakdown.rejected,
        ],
        backgroundColor: [
          '#64748B', // Applied (Slate)
          '#14B8A6', // Interviewing (Teal)
          '#2DD4BF', // Offer (Mint)
          '#3F3F46', // Rejected (Charcoal)
        ],
        borderColor: '#0b0f17',
        borderWidth: 3,
        hoverOffset: 4,
      },
    ],
  };

  const donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#111622',
        borderColor: '#27272A',
        borderWidth: 1,
        titleColor: '#FFFFFF',
        bodyColor: '#D4D4D8',
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const count = context.parsed;
            const pct = totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0;
            return ` ${count} applications (${pct}%)`;
          },
        },
      },
    },
  };

  // Weekly bar data styled with sleek teal gradient
  const barData = {
    labels: weeklyVelocity.map(v => v.label),
    datasets: [
      {
        label: 'Applications',
        data: weeklyVelocity.map(v => v.count),
        backgroundColor: [
          'rgba(100, 116, 139, 0.4)',
          'rgba(20, 184, 166, 0.35)',
          'rgba(20, 184, 166, 0.65)',
          '#14B8A6',
        ],
        borderColor: '#2DD4BF',
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 24,
      },
    ],
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#71717A',
          font: {
            size: 11,
            family: 'JetBrains Mono',
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#71717A',
          stepSize: 1,
          precision: 0,
          font: {
            size: 11,
            family: 'JetBrains Mono',
          },
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#111622',
        borderColor: '#27272A',
        borderWidth: 1,
        titleColor: '#FFFFFF',
        bodyColor: '#D4D4D8',
        padding: 10,
        callbacks: {
          label: (context) => ` ${context.parsed.y} applications sent`,
        },
      },
    },
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 mb-3">
        <span className="text-xs font-semibold text-zinc-300">
          {chartView === 'donut' ? 'Pipeline Breakdown' : 'Application Velocity'}
        </span>
        <div className="flex items-center gap-1 bg-zinc-900/90 p-0.5 rounded border border-zinc-800">
          <button
            type="button"
            onClick={() => setChartView('donut')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${
              chartView === 'donut'
                ? 'bg-zinc-800 text-zinc-100 font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Stages
          </button>
          <button
            type="button"
            onClick={() => setChartView('bars')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${
              chartView === 'bars'
                ? 'bg-zinc-800 text-zinc-100 font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      <div className="relative flex-1 min-h-[140px] flex items-center justify-center">
        {chartView === 'donut' ? (
          <div className="relative w-full h-[140px] flex items-center justify-center">
            {totalApplications > 0 ? (
              <>
                <Doughnut data={donutData} options={donutOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
                    {totalApplications}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                    Total
                  </span>
                </div>
              </>
            ) : (
              <div className="text-xs text-zinc-600 font-mono">No data</div>
            )}
          </div>
        ) : (
          <div className="w-full h-[140px]">
            <Bar data={barData} options={barOptions} />
          </div>
        )}
      </div>

      {chartView === 'donut' && (
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 pt-2 border-t border-zinc-800/60 text-[11px]">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
            <span className="truncate">Applied:</span>
            <span className="font-mono text-zinc-100 font-semibold ml-auto tabular-nums">{statusBreakdown.applied}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
            <span className="truncate">Interview:</span>
            <span className="font-mono text-teal-300 font-semibold ml-auto tabular-nums">{statusBreakdown.interviewing}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-teal-300 shrink-0" />
            <span className="truncate">Offer:</span>
            <span className="font-mono text-teal-200 font-semibold ml-auto tabular-nums">{statusBreakdown.offer}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-zinc-600 shrink-0" />
            <span className="truncate">Rejected:</span>
            <span className="font-mono text-zinc-400 ml-auto tabular-nums">{statusBreakdown.rejected}</span>
          </div>
        </div>
      )}
    </div>
  );
};
