export type ApplicationStatus = 'applied' | 'interviewing' | 'offer' | 'rejected';

export interface NoteEntry {
  id: string;
  createdAt: string;
  content: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  dateApplied: string; // ISO date string YYYY-MM-DD
  jobUrl?: string;
  location?: string; // e.g. "Remote (US)", "Remote (Global)", "Hybrid"
  salary?: string; // e.g. "$175k - $200k"
  contactName?: string;
  contactRole?: string;
  contactEmail?: string;
  descriptionNotes?: string;
  prepNotes?: string;
  notesList?: NoteEntry[];
  updatedAt: string;
}

export interface StatusColumnConfig {
  id: ApplicationStatus;
  title: string;
  subtitle: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  dotColor: string;
}
