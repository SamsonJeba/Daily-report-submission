import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import EditModal from '../components/EditModal';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  fetchAllSubmissions,
  deleteSubmission,
  updateSubmission,
  clearMessages,
} from '../store/slices/submissionSlice';
import type { Submission } from '../types';

type FilterStatus = 'all' | 'complete' | 'incomplete';

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { submissions, loading, error, successMessage } = useAppSelector(s => s.submissions);

  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [editTarget, setEditTarget] = useState<Submission | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => { dispatch(fetchAllSubmissions()); }, [dispatch]);

  useEffect(() => {
    if (successMessage || error) {
      const t = setTimeout(() => dispatch(clearMessages()), 3500);
      return () => clearTimeout(t);
    }
  }, [successMessage, error, dispatch]);

  const handleDelete = async (id: string) => {
    await dispatch(deleteSubmission(id));
    setDeleteConfirm(null);
  };

  const handleUpdate = async (
    id: string,
    data: { workDone: string; status: 'complete' | 'incomplete'; userName: string }
  ) => {
    await dispatch(updateSubmission({ id, ...data }));
    setEditTarget(null);
  };

  // Filter + search + sort
  const filtered = submissions
    .filter(s => filter === 'all' || s.status === filter)
    .filter(s => {
      const q = search.toLowerCase();
      return !q || s.userName.toLowerCase().includes(q) || s.workDone.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const aTime = new Date(a.submittedAt).getTime();
      const bTime = new Date(b.submittedAt).getTime();
      return sortBy === 'newest' ? bTime - aTime : aTime - bTime;
    });

  // Stats
  const total = submissions.length;
  const completeCount = submissions.filter(s => s.status === 'complete').length;
  const incompleteCount = submissions.filter(s => s.status === 'incomplete').length;
  const completionRate = total > 0 ? Math.round((completeCount / total) * 100) : 0;

  const stats = [
    { label: 'Total Submissions', value: total, icon: '📋', color: 'indigo' },
    { label: 'Completed', value: completeCount, icon: '✅', color: 'emerald' },
    { label: 'Incomplete', value: incompleteCount, icon: '⏳', color: 'amber' },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: '📊', color: 'violet' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h1 className="font-display text-2xl font-800 text-white tracking-tight">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl">{stat.icon}</span>
                <span className={`text-2xl font-display font-800 ${
                  stat.color === 'emerald' ? 'text-emerald-400' :
                  stat.color === 'amber' ? 'text-amber-400' :
                  stat.color === 'violet' ? 'text-violet-400' :
                  'text-indigo-400'
                }`}>
                  {stat.value}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{stat.label}</p>
              {stat.label === 'Completion Rate' && (
                <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full transition-all duration-700"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Toast messages */}
        {(successMessage || error) && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-6 animate-fade-in border ${
            successMessage
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
              : 'bg-red-500/10 border-red-500/25 text-red-400'
          }`}>
            {successMessage ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            )}
            {successMessage || error}
          </div>
        )}

        {/* Submissions table */}
        <div className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Toolbar */}
          <div className="p-5 border-b border-white/8 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h2 className="section-title text-xl">All Submissions</h2>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input-field pl-8 py-2 text-xs w-44"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="input-field py-2 text-xs w-32 appearance-none cursor-pointer"
              >
                <option value="newest" className="bg-slate-900">Newest first</option>
                <option value="oldest" className="bg-slate-900">Oldest first</option>
              </select>

              {/* Filter tabs */}
              <div className="flex bg-black/30 rounded-lg p-0.5 border border-white/8">
                {(['all', 'complete', 'incomplete'] as FilterStatus[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono capitalize transition-all duration-200 ${
                      filter === f
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Refresh */}
              <button
                onClick={() => dispatch(fetchAllSubmissions())}
                disabled={loading}
                className="btn-secondary py-2 px-3"
                title="Refresh"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={loading ? 'animate-spin' : ''}>
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Table */}
          {loading && submissions.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-slate-400 text-sm">
                {search || filter !== 'all' ? 'No submissions match your filters.' : 'No submissions yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black/20">
                    <th className="table-header">Name</th>
                    <th className="table-header">Work Done</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Submitted At</th>
                    <th className="table-header text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((sub, i) => (
                    <tr
                      key={sub._id}
                      className="hover:bg-white/3 transition-colors animate-fade-in"
                      style={{ animationDelay: `${i * 0.03}s` }}
                    >
                      {/* Name */}
                      <td className="table-cell">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-display font-700 text-indigo-300 shrink-0">
                            {sub.userName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-500 text-white whitespace-nowrap">{sub.userName}</span>
                        </div>
                      </td>

                      {/* Work done */}
                      <td className="table-cell max-w-xs">
                        <p className="text-slate-300 line-clamp-2 leading-relaxed">{sub.workDone}</p>
                      </td>

                      {/* Status */}
                      <td className="table-cell">
                        <span className={`status-badge ${sub.status === 'complete' ? 'status-complete' : 'status-incomplete'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {sub.status}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="table-cell">
                        <div className="text-slate-400 font-mono text-xs whitespace-nowrap">
                          <div>{format(new Date(sub.submittedAt), 'MMM d, yyyy')}</div>
                          <div className="text-slate-600">{format(new Date(sub.submittedAt), 'h:mm a')}</div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="table-cell">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit */}
                          <button
                            onClick={() => setEditTarget(sub)}
                            className="btn-success flex items-center gap-1.5"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit
                          </button>

                          {/* Delete */}
                          {deleteConfirm === sub._id ? (
                            <div className="flex items-center gap-1.5 animate-fade-in">
                              <button
                                onClick={() => handleDelete(sub._id)}
                                className="btn-danger bg-red-500/40 hover:bg-red-500/60 text-red-200 flex items-center gap-1"
                              >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="btn-secondary text-xs px-2 py-1.5"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(sub._id)}
                              className="btn-danger flex items-center gap-1.5"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                                <path d="M10 11v6"/><path d="M14 11v6"/>
                                <path d="M9 6V4h6v2"/>
                              </svg>
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer count */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
              <p className="text-xs text-slate-500 font-mono">
                Showing {filtered.length} of {total} submissions
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {completeCount} complete
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {incompleteCount} incomplete
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editTarget && (
        <EditModal
          submission={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleUpdate}
          loading={loading}
        />
      )}
    </div>
  );
}
