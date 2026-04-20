import { useState, useEffect } from 'react';
import type { Submission } from '../types';

interface Props {
  submission: Submission | null;
  onClose: () => void;
  onSave: (id: string, data: { workDone: string; status: 'complete' | 'incomplete'; userName: string }) => void;
  loading: boolean;
}

export default function EditModal({ submission, onClose, onSave, loading }: Props) {
  const [workDone, setWorkDone] = useState('');
  const [status, setStatus] = useState<'complete' | 'incomplete'>('incomplete');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (submission) {
      setWorkDone(submission.workDone);
      setStatus(submission.status);
      setUserName(submission.userName);
    }
  }, [submission]);

  if (!submission) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(submission._id, { workDone, status, userName });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-card w-full max-w-lg p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-700 text-white">Edit Submission</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {submission._id.slice(-8)}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="label">User Name</label>
            <input
              type="text"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* Work done */}
          <div>
            <label className="label">Work Done</label>
            <textarea
              value={workDone}
              onChange={e => setWorkDone(e.target.value)}
              className="input-field resize-none"
              rows={4}
              required
              minLength={5}
            />
          </div>

          {/* Status */}
          <div>
            <label className="label">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as 'complete' | 'incomplete')}
              className="input-field appearance-none cursor-pointer"
            >
              <option value="complete" className="bg-slate-900">✓ Complete</option>
              <option value="incomplete" className="bg-slate-900">○ Incomplete</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
