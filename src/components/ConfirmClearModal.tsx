import React from 'react';
import { Trash2, AlertTriangle, Download, X } from 'lucide-react';
import { JobApplication } from '../types';

interface ConfirmClearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClear: () => void;
  applications: JobApplication[];
  onDownloadBackup: () => void;
}

export const ConfirmClearModal: React.FC<ConfirmClearModalProps> = ({
  isOpen,
  onClose,
  onConfirmClear,
  applications,
  onDownloadBackup,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-xl bg-[#0e131f] border border-zinc-800 shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h2 id="clear-modal-title" className="text-sm font-bold text-white tracking-tight">
                Clear All Data & Start Fresh?
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Transition from demo mode into your personal job tracker.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Body */}
        <div className="p-3 rounded-lg bg-black/40 border border-zinc-800/80 text-xs text-zinc-300 space-y-2">
          <p className="leading-relaxed">
            This will permanently remove all <span className="font-mono font-bold text-white">{applications.length}</span> currently tracked application records and reset your board to a completely blank slate.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            You can start logging your own job search entries immediately. If you want to keep a copy of the current records, you can download a backup below.
          </p>
        </div>

        {/* Optional Backup Link */}
        {applications.length > 0 && (
          <div className="flex items-center justify-between px-3 py-2 rounded bg-zinc-900/60 border border-zinc-800/60 text-xs text-zinc-400">
            <span>Want to save current data first?</span>
            <button
              type="button"
              onClick={onDownloadBackup}
              className="inline-flex items-center gap-1 text-teal-300 hover:text-teal-200 hover:underline font-mono text-[11px]"
            >
              <Download className="w-3 h-3" />
              <span>Export .json</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmClear();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded transition-colors shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Applications</span>
          </button>
        </div>
      </div>
    </div>
  );
};
