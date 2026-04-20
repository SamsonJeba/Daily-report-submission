import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { createSubmission, fetchMySubmissions, clearMessages } from '../store/slices/submissionSlice';

export default function UserDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(s => s.auth);
  const { submissions, loading, error, successMessage } = useAppSelector(s => s.submissions);

  const [workDone, setWorkDone] = useState('');
  const [status, setStatus] = useState<'complete' | 'incomplete'>('incomplete');

  useEffect(() => {
    dispatch(fetchMySubmissions());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => dispatch(clearMessages()), 3500);
      return () => clearTimeout(t);
    }
  }, [successMessage, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workDone.trim()) return;
    await dispatch(createSubmission({ workDone: workDone.trim(), status }));
    setWorkDone('');
    setStatus('incomplete');
  };

  const wordCount = workDone.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
        {/* Welcome header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/40 text-sm font-display font-700 text-white">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl font-800 text-white tracking-tight">
                Hey, {user?.name.split(' ')[0]} 👋
              </h1>
              <p className="text-slate-400 text-sm">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <div className="glass-card p-6 mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <div>
              <h2 className="font-display text-lg font-700 text-white">Daily Report</h2>
              <p className="text-xs text-slate-400">Submit your work update for today</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (read-only display) */}
            <div>
              <label className="label">Name</label>
              <div className="input-field flex items-center gap-2 opacity-70 cursor-not-allowed">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="text-slate-300">{user?.name}</span>
              </div>
            </div>

            {/* Work Done */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Work Done</label>
                <span className="text-xs text-slate-500 font-mono">{wordCount} words</span>
              </div>
              <textarea
                value={workDone}
                onChange={e => setWorkDone(e.target.value)}
                placeholder="Describe what you accomplished today…"
                className="input-field resize-none leading-relaxed"
                rows={5}
                required
                minLength={5}
                maxLength={1000}
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs font-mono ${workDone.length > 900 ? 'text-amber-400' : 'text-slate-600'}`}>
                  {workDone.length}/1000
                </span>
              </div>
            </div>

            {/* Status dropdown */}
            <div>
              <label className="label">Status</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as 'complete' | 'incomplete')}
                  className="input-field appearance-none cursor-pointer pr-10"
                >
                  <option value="complete" className="bg-slate-900">✓ Complete</option>
                  <option value="incomplete" className="bg-slate-900">○ Incomplete</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>
              {/* Visual status indicator */}
              <div className={`mt-2 flex items-center gap-2 text-xs font-mono transition-all ${
                status === 'complete' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${status === 'complete' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {status === 'complete' ? 'Marked as completed' : 'Marked as in progress'}
              </div>
            </div>

            {/* Feedback messages */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm animate-fade-in">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}
            {successMessage && (
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-sm animate-fade-in">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {successMessage}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading || !workDone.trim()} className="btn-primary w-full">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Submit Daily Report
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Submission History */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title text-xl">Submission History</h2>
            <span className="text-xs text-slate-500 font-mono bg-white/5 px-3 py-1 rounded-full border border-white/8">
              {submissions.length} {submissions.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>

          {loading && submissions.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <p className="text-slate-400 text-sm">No submissions yet. Submit your first daily report above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub, i) => (
                <div
                  key={sub._id}
                  className="glass-card p-5 hover:border-white/20 transition-all duration-200 animate-slide-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-slate-200 text-sm leading-relaxed flex-1">{sub.workDone}</p>
                    <span className={`status-badge shrink-0 ${sub.status === 'complete' ? 'status-complete' : 'status-incomplete'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {sub.status}
                    </span>
                  </div>
                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono border-t border-white/5 pt-3">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    Submitted {format(new Date(sub.submittedAt), 'MMM d, yyyy')} at {format(new Date(sub.submittedAt), 'h:mm a')}
                    {sub.updatedAt !== sub.createdAt && (
                      <span className="text-slate-600 ml-2">
                        · edited {format(new Date(sub.updatedAt), 'MMM d')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
