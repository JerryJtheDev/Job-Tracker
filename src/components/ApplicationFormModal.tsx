import React, { useState, useEffect } from 'react';
import { JobApplication, ApplicationStatus } from '../types';
import { STATUS_COLUMNS } from '../data/columns';
import { getTodayString } from '../utils/date';
import { X, Building2, Briefcase, Calendar, Link2, MapPin, DollarSign, User, FileText } from 'lucide-react';

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (applicationData: Omit<JobApplication, 'id' | 'updatedAt'>, editId?: string) => void;
  initialApplication?: JobApplication | null;
  defaultStatus?: ApplicationStatus;
}

export const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialApplication,
  defaultStatus = 'applied',
}) => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>(defaultStatus);
  const [dateApplied, setDateApplied] = useState(getTodayString());
  const [jobUrl, setJobUrl] = useState('');
  const [location, setLocation] = useState('Remote (US)');
  const [salary, setSalary] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [descriptionNotes, setDescriptionNotes] = useState('');
  const [prepNotes, setPrepNotes] = useState('');
  const [errors, setErrors] = useState<{ company?: string; role?: string }>({});

  useEffect(() => {
    if (initialApplication) {
      setCompany(initialApplication.company || '');
      setRole(initialApplication.role || '');
      setStatus(initialApplication.status || defaultStatus);
      setDateApplied(initialApplication.dateApplied || getTodayString());
      setJobUrl(initialApplication.jobUrl || '');
      setLocation(initialApplication.location || 'Remote');
      setSalary(initialApplication.salary || '');
      setContactName(initialApplication.contactName || '');
      setContactRole(initialApplication.contactRole || '');
      setContactEmail(initialApplication.contactEmail || '');
      setDescriptionNotes(initialApplication.descriptionNotes || '');
      setPrepNotes(initialApplication.prepNotes || '');
    } else {
      setCompany('');
      setRole('');
      setStatus(defaultStatus);
      setDateApplied(getTodayString());
      setJobUrl('');
      setLocation('Remote (Global)');
      setSalary('');
      setContactName('');
      setContactRole('');
      setContactEmail('');
      setDescriptionNotes('');
      setPrepNotes('');
    }
    setErrors({});
  }, [initialApplication, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { company?: string; role?: string } = {};
    if (!company.trim()) newErrors.company = 'Company name is required';
    if (!role.trim()) newErrors.role = 'Role title is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const applicationPayload: Omit<JobApplication, 'id' | 'updatedAt'> = {
      company: company.trim(),
      role: role.trim(),
      status,
      dateApplied: dateApplied || getTodayString(),
      jobUrl: jobUrl.trim() || undefined,
      location: location.trim() || undefined,
      salary: salary.trim() || undefined,
      contactName: contactName.trim() || undefined,
      contactRole: contactRole.trim() || undefined,
      contactEmail: contactEmail.trim() || undefined,
      descriptionNotes: descriptionNotes.trim() || undefined,
      prepNotes: prepNotes.trim() || undefined,
      notesList: initialApplication?.notesList || [],
    };

    onSubmit(applicationPayload, initialApplication?.id);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-xl bg-[#0d121c] border border-zinc-800 shadow-2xl shadow-black/80 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div>
            <h2 id="form-modal-title" className="text-base font-bold text-white tracking-tight">
              {initialApplication ? 'Edit Job Application' : 'Log New Application'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Record pipeline details, compensation target, and interview points.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                Company Name <span className="text-teal-400">*</span>
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  if (errors.company) setErrors({ ...errors, company: undefined });
                }}
                placeholder="e.g. Linear, Cloudflare, Stripe"
                className={`w-full bg-[#080b11] border rounded-md px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none ${
                  errors.company
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600'
                }`}
              />
              {errors.company && (
                <span className="text-[11px] text-rose-400 mt-0.5 block">{errors.company}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
                Role Title <span className="text-teal-400">*</span>
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  if (errors.role) setErrors({ ...errors, role: undefined });
                }}
                placeholder="e.g. Senior Distributed Systems Engineer"
                className={`w-full bg-[#080b11] border rounded-md px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none ${
                  errors.role
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600'
                }`}
              />
              {errors.role && (
                <span className="text-[11px] text-rose-400 mt-0.5 block">{errors.role}</span>
              )}
            </div>
          </div>

          {/* Status & Date Applied */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1">
                Current Pipeline Stage
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full bg-[#080b11] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500 cursor-pointer"
              >
                {STATUS_COLUMNS.map((col) => (
                  <option key={col.id} value={col.id} className="bg-zinc-900 text-zinc-100">
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Date Applied
              </label>
              <input
                type="date"
                value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
                className="w-full bg-[#080b11] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>
          </div>

          {/* Posting URL & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-zinc-500" />
                Job Posting URL
              </label>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#080b11] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                Work Location / Remote Mode
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Remote (US), Remote (Global), Hybrid..."
                className="w-full bg-[#080b11] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          {/* Salary / Target Compensation */}
          <div>
            <label className="block text-xs font-semibold text-zinc-200 mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
              Compensation Target / Range
            </label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. $185,000 - $210,000 + equity"
              className="w-full bg-[#080b11] border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-mono"
            />
          </div>

          {/* Contact Person Details */}
          <div className="p-3 rounded-lg bg-black/30 border border-zinc-800/80 space-y-2.5">
            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              Recruiter / Hiring Contact (Optional)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Contact Name"
                className="bg-[#080b11] border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
              />
              <input
                type="text"
                value={contactRole}
                onChange={(e) => setContactRole(e.target.value)}
                placeholder="Title (e.g. Recruiter, EM)"
                className="bg-[#080b11] border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
              />
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Email or LinkedIn"
                className="bg-[#080b11] border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          {/* Description & Requirements */}
          <div>
            <label className="block text-xs font-semibold text-zinc-200 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-zinc-500" />
              Job Description Notes & Tech Stack
            </label>
            <textarea
              rows={3}
              value={descriptionNotes}
              onChange={(e) => setDescriptionNotes(e.target.value)}
              placeholder="Key responsibilities, stack details (e.g. Go, Rust, React, Kafka), team size..."
              className="w-full p-2.5 rounded-md bg-[#080b11] border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 leading-relaxed font-sans"
            />
          </div>

          {/* Interview Prep / Initial Notes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-200 mb-1">
              Interview Prep & Action Items
            </label>
            <textarea
              rows={2}
              value={prepNotes}
              onChange={(e) => setPrepNotes(e.target.value)}
              placeholder="Referral name, talking points, questions for team, or next steps..."
              className="w-full p-2.5 rounded-md bg-[#080b11] border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 leading-relaxed font-sans"
            />
          </div>

          {/* Action Buttons: The single primary save action in Amber */}
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-sm"
            >
              {initialApplication ? 'Update Application' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
