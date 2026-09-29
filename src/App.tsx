/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { JobApplication, ApplicationStatus } from './types';
import { INITIAL_APPLICATIONS } from './data/initialData';
import { calculateAnalytics } from './utils/analytics';
import { ActivityStrip } from './components/ActivityStrip';
import { CommandLineHeader } from './components/CommandLineHeader';
import { AsymmetricBoard } from './components/AsymmetricBoard';
import { ApplicationDetailModal } from './components/ApplicationDetailModal';
import { ApplicationFormModal } from './components/ApplicationFormModal';
import { ExportImportModal } from './components/ExportImportModal';
import { ConfirmClearModal } from './components/ConfirmClearModal';

const STORAGE_KEY = 'pipeline_job_tracker_applications_v3';

export default function App() {
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load applications from localStorage', e);
    }
    return INITIAL_APPLICATIONS;
  });

  const [focusStatus, setFocusStatus] = useState<ApplicationStatus>('interviewing');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isDeckOpen, setIsDeckOpen] = useState(true);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [formDefaultStatus, setFormDefaultStatus] = useState<ApplicationStatus>('applied');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [applications]);

  // Keyboard shortcuts handler:
  // - 'n' / 'N': Open new application modal
  // - '/': Focus search query
  // - '1'-'4': Switch focus stage
  // - 'Escape': Close modals / clear search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName);
      if (isInput) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      if (
        (e.key === 'n' || e.key === 'N') &&
        !isFormOpen &&
        !isDetailOpen &&
        !isBackupOpen &&
        !isClearConfirmOpen
      ) {
        e.preventDefault();
        handleOpenNewApplication(focusStatus);
      } else if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Filter applications"]') as HTMLInputElement;
        searchInput?.focus();
      } else if (e.key === '1') {
        setFocusStatus('applied');
      } else if (e.key === '2') {
        setFocusStatus('interviewing');
      } else if (e.key === '3') {
        setFocusStatus('offer');
      } else if (e.key === '4') {
        setFocusStatus('rejected');
      } else if (e.key === 'Escape') {
        setIsDetailOpen(false);
        setIsFormOpen(false);
        setIsBackupOpen(false);
        setIsClearConfirmOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFormOpen, isDetailOpen, isBackupOpen, isClearConfirmOpen, focusStatus]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2800);
  };

  // Analytics computation
  const metrics = useMemo(() => calculateAnalytics(applications), [applications]);

  // Quick counts
  const stageCounts = useMemo(() => {
    return {
      applied: applications.filter(a => a.status === 'applied').length,
      interviewing: applications.filter(a => a.status === 'interviewing').length,
      offer: applications.filter(a => a.status === 'offer').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
    };
  }, [applications]);

  // Update application status
  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id && app.status !== newStatus) {
          const updated = {
            ...app,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
          if (selectedApplication?.id === id) {
            setSelectedApplication(updated);
          }
          return updated;
        }
        return app;
      })
    );
    showToast(`Moved to ${newStatus.toUpperCase()}`);
  };

  // Create or Update Application
  const handleSaveApplication = (
    data: Omit<JobApplication, 'id' | 'updatedAt'>,
    editId?: string
  ) => {
    if (editId) {
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id === editId) {
            const updated = {
              ...app,
              ...data,
              updatedAt: new Date().toISOString(),
            };
            if (selectedApplication?.id === editId) {
              setSelectedApplication(updated);
            }
            return updated;
          }
          return app;
        })
      );
      showToast(`Updated ${data.company}`);
    } else {
      const newApp: JobApplication = {
        ...data,
        id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        updatedAt: new Date().toISOString(),
      };
      setApplications((prev) => [newApp, ...prev]);
      showToast(`Logged ${data.company} role`);
    }
  };

  // Delete Application
  const handleDeleteApplication = (id: string) => {
    const target = applications.find(a => a.id === id);
    setApplications((prev) => prev.filter((app) => app.id !== id));
    setIsDetailOpen(false);
    setSelectedApplication(null);
    showToast(`Removed ${target?.company || 'role'}`);
  };

  // Clear All Data / Start Fresh
  const handleConfirmClearAll = () => {
    setApplications([]);
    setSelectedApplication(null);
    setIsDetailOpen(false);
    showToast('All applications cleared. Ready for your personal job search!');
  };

  // Download Backup JSON helper
  const handleDownloadBackup = () => {
    const jsonString = JSON.stringify(applications, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline-job-tracker-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup downloaded');
  };

  // Update application from detail modal
  const handleUpdateApplication = (updated: JobApplication) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === updated.id ? updated : app))
    );
    setSelectedApplication(updated);
  };

  // Open modal handlers
  const handleSelectApplication = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsDetailOpen(true);
  };

  const handleOpenNewApplication = (defaultStatus: ApplicationStatus = focusStatus) => {
    setEditingApplication(null);
    setFormDefaultStatus(defaultStatus);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (application: JobApplication) => {
    setIsDetailOpen(false);
    setEditingApplication(application);
    setIsFormOpen(true);
  };

  const handleResetDemoData = () => {
    if (
      applications.length === 0 ||
      window.confirm('Reset tracker to junior remote developer sample pipeline? Any current entries will be replaced.')
    ) {
      setApplications(INITIAL_APPLICATIONS);
      showToast('Junior remote demo pipeline loaded');
    }
  };

  const handleImportApplications = (imported: JobApplication[]) => {
    setApplications(imported);
    showToast(`Imported ${imported.length} applications`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden app-texture-overlay bg-transparent text-zinc-100 font-sans selection:bg-teal-500/20 selection:text-teal-200">
      {/* Activity Strip: Icon-only slim navigation on the far left edge */}
      <ActivityStrip
        currentFocusStatus={focusStatus}
        onSelectFocusStatus={setFocusStatus}
        onOpenNewApplication={() => handleOpenNewApplication(focusStatus)}
        isDeckOpen={isDeckOpen}
        onToggleDeck={() => setIsDeckOpen(!isDeckOpen)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onResetDemoData={handleResetDemoData}
        onOpenClearConfirm={() => setIsClearConfirmOpen(true)}
        counts={stageCounts}
      />

      {/* Main Command Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Single-line Command-bar Style Header */}
        <CommandLineHeader
          currentFocusStatus={focusStatus}
          metrics={metrics}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNewApplication={() => handleOpenNewApplication(focusStatus)}
          isDeckOpen={isDeckOpen}
          onToggleDeck={() => setIsDeckOpen(!isDeckOpen)}
          onOpenBackup={() => setIsBackupOpen(true)}
          onResetDemoData={handleResetDemoData}
          onOpenClearConfirm={() => setIsClearConfirmOpen(true)}
        />

        {/* Asymmetric Core Workspace */}
        <main className="flex-1 px-3 sm:px-6 py-4 flex flex-col min-h-0">
          <AsymmetricBoard
            applications={applications}
            metrics={metrics}
            onStatusChange={handleStatusChange}
            onSelectApplication={handleSelectApplication}
            onAddNewApplication={handleOpenNewApplication}
            onResetDemoData={handleResetDemoData}
            focusStatus={focusStatus}
            onSetFocusStatus={setFocusStatus}
            isDeckOpen={isDeckOpen}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </main>
      </div>

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUpdate={handleUpdateApplication}
        onDelete={handleDeleteApplication}
        onOpenEditForm={handleOpenEditForm}
      />

      {/* Add / Edit Form Modal */}
      <ApplicationFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveApplication}
        initialApplication={editingApplication}
        defaultStatus={formDefaultStatus}
      />

      {/* Export / Import Backup Modal */}
      <ExportImportModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        applications={applications}
        onImport={handleImportApplications}
        onOpenClearConfirm={() => setIsClearConfirmOpen(true)}
        onResetSampleData={handleResetDemoData}
      />

      {/* Confirmation Modal to Clear All Data & Start Fresh */}
      <ConfirmClearModal
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirmClear={handleConfirmClearAll}
        applications={applications}
        onDownloadBackup={handleDownloadBackup}
      />

      {/* Discreet Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-xs font-mono text-zinc-200 shadow-xl shadow-black/80 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
