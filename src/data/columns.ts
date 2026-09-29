import { StatusColumnConfig } from '../types';

export const STATUS_COLUMNS: StatusColumnConfig[] = [
  {
    id: 'applied',
    title: 'Applied',
    subtitle: 'Awaiting recruiter response',
    accentColor: '#94A3B8', // Slate / Clean Technical Monochrome
    badgeBg: 'bg-slate-500/10',
    badgeText: 'text-slate-300',
    borderColor: 'border-slate-500/30',
    dotColor: 'bg-slate-400',
  },
  {
    id: 'interviewing',
    title: 'Interviewing',
    subtitle: 'Active screening & rounds',
    accentColor: '#14B8A6', // Secondary Supporting Accent: Electric Teal
    badgeBg: 'bg-teal-500/10',
    badgeText: 'text-teal-300',
    borderColor: 'border-teal-500/30',
    dotColor: 'bg-teal-400',
  },
  {
    id: 'offer',
    title: 'Offer',
    subtitle: 'Offers & compensation review',
    accentColor: '#2DD4BF', // Mint / Luminous Teal
    badgeBg: 'bg-teal-400/15',
    badgeText: 'text-teal-200',
    borderColor: 'border-teal-400/40',
    dotColor: 'bg-teal-300',
  },
  {
    id: 'rejected',
    title: 'Rejected',
    subtitle: 'Archived & follow-up notes',
    accentColor: '#52525B', // Muted Zinc / Closed Archive
    badgeBg: 'bg-zinc-800/40',
    badgeText: 'text-zinc-400',
    borderColor: 'border-zinc-700/30',
    dotColor: 'bg-zinc-500',
  },
];
