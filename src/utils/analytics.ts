import { JobApplication } from '../types';

export interface AnalyticsMetrics {
  totalApplications: number;
  thisWeekCount: number;
  lastWeekCount: number;
  weekOverWeekChange: number; // percentage change or count delta
  weekOverWeekDelta: number;
  responseRate: number; // percentage moved past 'applied'
  activeInterviews: number;
  offersReceived: number;
  statusBreakdown: {
    applied: number;
    interviewing: number;
    offer: number;
    rejected: number;
  };
  weeklyVelocity: {
    label: string;
    count: number;
  }[];
}

export function calculateAnalytics(applications: JobApplication[]): AnalyticsMetrics {
  const total = applications.length;

  const statusBreakdown = {
    applied: applications.filter(a => a.status === 'applied').length,
    interviewing: applications.filter(a => a.status === 'interviewing').length,
    offer: applications.filter(a => a.status === 'offer').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  // Response rate: % of applications that moved past "Applied"
  // When an application moves to Interviewing, Offer, or Rejected, it has received a response.
  const movedPastApplied = statusBreakdown.interviewing + statusBreakdown.offer + statusBreakdown.rejected;
  const responseRate = total > 0 ? Math.round((movedPastApplied / total) * 100) : 0;

  // Calculate this week vs last week applications
  // Week boundaries: rolling 7 days or calendar week
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Rolling 7 days: Day 0 to 6
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  
  // Previous 7 days: Day 7 to 13
  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(today.getDate() - 14);

  let thisWeekCount = 0;
  let lastWeekCount = 0;

  applications.forEach(app => {
    if (!app.dateApplied) return;
    const parts = app.dateApplied.split('-');
    let appDate: Date;
    if (parts.length === 3) {
      appDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      appDate = new Date(app.dateApplied);
    }

    if (appDate >= sevenDaysAgo && appDate <= today) {
      thisWeekCount++;
    } else if (appDate >= fourteenDaysAgo && appDate < sevenDaysAgo) {
      lastWeekCount++;
    }
  });

  const weekOverWeekDelta = thisWeekCount - lastWeekCount;
  let weekOverWeekChange = 0;
  if (lastWeekCount > 0) {
    weekOverWeekChange = Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
  } else if (thisWeekCount > 0) {
    weekOverWeekChange = 100;
  }

  // Weekly velocity (last 4 calendar weeks)
  const weeklyVelocity = [
    { label: '3w ago', count: 0 },
    { label: '2w ago', count: 0 },
    { label: 'Last week', count: lastWeekCount },
    { label: 'This week', count: thisWeekCount },
  ];

  const twentyOneDaysAgo = new Date(today);
  twentyOneDaysAgo.setDate(today.getDate() - 21);
  const twentyEightDaysAgo = new Date(today);
  twentyEightDaysAgo.setDate(today.getDate() - 28);

  applications.forEach(app => {
    if (!app.dateApplied) return;
    const parts = app.dateApplied.split('-');
    let appDate: Date;
    if (parts.length === 3) {
      appDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      appDate = new Date(app.dateApplied);
    }

    if (appDate >= twentyEightDaysAgo && appDate < twentyOneDaysAgo) {
      weeklyVelocity[0].count++;
    } else if (appDate >= twentyOneDaysAgo && appDate < fourteenDaysAgo) {
      weeklyVelocity[1].count++;
    }
  });

  return {
    totalApplications: total,
    thisWeekCount,
    lastWeekCount,
    weekOverWeekChange,
    weekOverWeekDelta,
    responseRate,
    activeInterviews: statusBreakdown.interviewing,
    offersReceived: statusBreakdown.offer,
    statusBreakdown,
    weeklyVelocity,
  };
}
