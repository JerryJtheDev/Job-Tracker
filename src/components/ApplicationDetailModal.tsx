import React, { useState } from 'react';
import { JobApplication, ApplicationStatus, NoteEntry } from '../types';
import { STATUS_COLUMNS } from '../data/columns';
import { formatDate, formatDateTime, getRelativeTime } from '../utils/date';
import {
  X,
  ExternalLink,
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Mail,
  Edit3,
  Trash2,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
} from 'lucide-react';

interface ApplicationDetailModalProps {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: JobApplication) => void;
  onDelete: (id: string) => void;
  onOpenEditForm: (application: JobApplication) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onOpenEditForm,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [prepNotesValue, setPrepNotesValue] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Sync internal state when application changes
  React.useEffect(() => {
    if (application) {
      setPrepNotesValue(application.prepNotes || '');
      setIsConfirmingDelete(false);
      setNewNoteText('');
    }
  }, [application]);

  if (!isOpen || !application) return null;

  const currentColumn = STATUS_COLUMNS.find(c => c.id === application.status);

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    onUpdate({
      ...application,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSavePrepNotes = () => {
    onUpdate({
      ...application,
      prepNotes: prepNotesValue,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddNoteLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote: NoteEntry = {
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      content: newNoteText.trim(),
    };

    const updatedNotes = [newNote, ...(application.notesList || [])];
    onUpdate({
      ...application,
      notesList: updatedNotes,
      updatedAt: new Date().toISOString(),
    });
    setNewNoteText('');
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = (application.notesList || []).filter(n => n.id !== noteId);
    onUpdate({
      ...application,
      notesList: updatedNotes,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/80 overflow-hidden">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-start justify-between gap-3 bg-zinc-900/90">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: currentColumn?.accentColor || '#F59E0B' }}
              />
              <span className="text-xs font-mono text-zinc-400">
                Stage:
              </span>
              <select
                value={application.status}
                onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
                className="bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-200 rounded px-2 py-0.5 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {STATUS_COLUMNS.map((col) => (
                  <option key={col.id} value={col.id} className="bg-zinc-900 text-zinc-200">
                    {col.title}
                  </option>
                ))}
              </select>

              <span className="text-zinc-600 text-xs" aria-hidden="true">·</span>
              <span className="text-xs font-mono text-zinc-500">
                Applied {getRelativeTime(application.dateApplied)} ({formatDate(application.dateApplied)})
              </span>
            </div>

            <h2 id="modal-title" className="text-xl font-bold text-zinc-100 truncate">
              {application.company}
            </h2>
            <p className="text-sm text-zinc-300 font-medium mt-0.5">
              {application.role}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onOpenEditForm(application)}
              className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
              title="Edit application details"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-xs">
            <div>
              <span className="text-zinc-500 block mb-0.5 font-mono text-[11px]">Applied On</span>
              <div className="flex items-center gap-1 text-zinc-300 font-mono">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>{formatDate(application.dateApplied)}</span>
              </div>
            </div>

            <div>
              <span className="text-zinc-500 block mb-0.5 font-mono text-[11px]">Location</span>
              <div className="flex items-center gap-1 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span className="truncate">{application.location || 'Not specified'}</span>
              </div>
            </div>

            <div>
              <span className="text-zinc-500 block mb-0.5 font-mono text-[11px]">Target Comp</span>
              <div className="flex items-center gap-1 text-white font-mono font-semibold">
                <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                <span className="truncate tabular-nums">{application.salary || 'Negotiable'}</span>
              </div>
            </div>

            <div>
              <span className="text-zinc-500 block mb-0.5 font-mono text-[11px]">Posting Link</span>
              {application.jobUrl ? (
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-1 text-teal-300 hover:text-teal-200 hover:underline truncate font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">View Posting</span>
                </a>
              ) : (
                <span className="text-zinc-600">None added</span>
              )}
            </div>
          </div>

          {/* Contact Person Card (if available) */}
          {(application.contactName || application.contactRole || application.contactEmail) && (
            <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/80">
              <span className="text-xs font-medium text-zinc-400 block mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                Point of Contact
              </span>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs">
                {application.contactName && (
                  <span className="font-semibold text-zinc-200">{application.contactName}</span>
                )}
                {application.contactRole && (
                  <span className="text-zinc-400">{application.contactRole}</span>
                )}
                {application.contactEmail && (
                  <a
                    href={`mailto:${application.contactEmail}`}
                    className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                  >
                    <Mail className="w-3 h-3" />
                    <span>{application.contactEmail}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Job Description & Core Tech Notes */}
          {application.descriptionNotes && (
            <div>
              <span className="text-xs font-semibold text-zinc-300 block mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-zinc-400" />
                Role Requirements & Notes
              </span>
              <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
                {application.descriptionNotes}
              </div>
            </div>
          )}

          {/* Interview Prep / Follow-up Reminders (Inline editable) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Interview Prep & Talking Points
              </span>
              {prepNotesValue !== (application.prepNotes || '') && (
                <button
                  type="button"
                  onClick={handleSavePrepNotes}
                  className="px-2.5 py-0.5 text-xs font-semibold text-zinc-950 bg-teal-400 hover:bg-teal-300 rounded transition-colors"
                >
                  Save Changes
                </button>
              )}
            </div>
            <textarea
              rows={3}
              value={prepNotesValue}
              onChange={(e) => setPrepNotesValue(e.target.value)}
              onBlur={handleSavePrepNotes}
              placeholder="Key concepts to review, team questions, compensation leverage, or follow-up items..."
              className="w-full p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700 leading-relaxed"
            />
          </div>

          {/* Stage Logs & Chronological Activity Notes */}
          <div>
            <span className="text-xs font-semibold text-zinc-300 block mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              Interview Activity Log
            </span>

            {/* Quick add note form */}
            <form onSubmit={handleAddNoteLog} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Log interview round, recruiter callback, or screening outcome..."
                className="flex-1 bg-zinc-950/80 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/70"
              />
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log</span>
              </button>
            </form>

            {/* Notes timeline */}
            {application.notesList && application.notesList.length > 0 ? (
              <div className="space-y-2 border-l border-zinc-800 pl-3 ml-2">
                {application.notesList.map((entry) => (
                  <div
                    key={entry.id}
                    className="relative group p-2.5 rounded-md bg-zinc-950/40 border border-zinc-800/60 text-xs"
                  >
                    <span className="absolute -left-[19px] top-3.5 w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1 font-mono">
                      <span>{formatDateTime(entry.createdAt)}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(entry.id)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 transition-opacity"
                        title="Delete note"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">{entry.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-600 italic">
                No stage logs recorded yet. Use the box above to log screening calls and round milestones.
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 flex items-center justify-between gap-3">
          <div>
            {isConfirmingDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-400 font-medium">Permanently delete?</span>
                <button
                  type="button"
                  onClick={() => onDelete(application.id)}
                  className="px-2.5 py-1 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 rounded transition-colors"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenEditForm(application)}
              className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors"
            >
              Full Edit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
