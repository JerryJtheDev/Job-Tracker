import React, { useState } from 'react';
import { JobApplication } from '../types';
import { X, Download, Upload, Copy, Check, AlertCircle, Trash2, RotateCcw } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: JobApplication[];
  onImport: (importedApplications: JobApplication[]) => void;
  onOpenClearConfirm?: () => void;
  onResetSampleData?: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  applications,
  onImport,
  onOpenClearConfirm,
  onResetSampleData,
}) => {
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(applications, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline-job-tracker-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        throw new Error('Import data must be a JSON array of applications.');
      }
      const valid = parsed.every(item => item.company && item.role && item.status);
      if (!valid) {
        throw new Error('Each record must contain at least company, role, and status.');
      }
      onImport(parsed);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="backup-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-xl bg-[#0e131f] border border-zinc-800 shadow-2xl p-5 space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h2 id="backup-modal-title" className="text-sm font-bold text-white tracking-tight">
            Data Management & Backup
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Start Fresh / Transition to Real Search */}
        <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-200">
              Personal Setup // Start Fresh
            </span>
            <span className="font-mono text-[10px] text-zinc-500 uppercase">
              {applications.length} applications
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Transitioning from the demo into your personal search? Wipe all demo data with one click to start tracking your own pipeline from an empty board.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenClearConfirm?.();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Data / Start Fresh</span>
            </button>

            {onResetSampleData && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onResetSampleData();
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
                title="Reload junior demo data"
              >
                <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                <span>Reload Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Export Section */}
        <div>
          <span className="text-xs font-semibold text-zinc-300 block mb-1">
            Export JSON Backup ({applications.length} applications)
          </span>
          <p className="text-xs text-zinc-400 mb-2.5">
            Download your tracker records as a standalone JSON file to preserve your data.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .json</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="pt-3 border-t border-zinc-800">
          <span className="text-xs font-semibold text-zinc-300 block mb-1">
            Import or Restore Data
          </span>
          <p className="text-xs text-zinc-400 mb-2">
            Paste exported JSON data below to restore your pipeline.
          </p>
          <form onSubmit={handleImportSubmit} className="space-y-2">
            <textarea
              rows={4}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='[{"company": "Paystack", "role": "Junior Frontend Developer", "status": "applied", ...}]'
              className="w-full p-2.5 rounded-md bg-[#080b11] border border-zinc-800 font-mono text-[11px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
            />
            {error && (
              <div className="flex items-center gap-1 text-xs text-rose-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                disabled={!importText.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 border border-zinc-700 rounded transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import Data</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
