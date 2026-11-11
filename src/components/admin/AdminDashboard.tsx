import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  LogOut,
  ArrowLeft,
  Filter,
  UserCheck,
  UserX,
  Shield,
  Loader2,
  Calendar,
  Briefcase,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { QuickJobLogo } from '../common/QuickJobLogo';
import { useUser, UserProfile } from '../../contexts/UserContext';

interface AdminDashboardProps {
  onBackToApp: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const { user, token, logout } = useUser();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<number | string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const baseUrl = typeof window !== 'undefined' && window.location.origin.includes('localhost') ? 'http://localhost:5055' : '';
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`${baseUrl}/api/admin/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        toast.error('Failed to load users list.');
      }
    } catch {
      toast.error('Network error connecting to admin service.');
    } finally {
      setIsLoading(false);
    }
  }, [token, statusFilter, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdateStatus = async (userId: number | string, newStatus: 'approved' | 'rejected' | 'pending') => {
    if (!token) return;
    setProcessingId(userId);
    try {
      const baseUrl = typeof window !== 'undefined' && window.location.origin.includes('localhost') ? 'http://localhost:5055' : '';
      const res = await fetch(`${baseUrl}/api/admin/users/${userId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`User status updated to ${newStatus}.`);
        // Update local state immediately
        setUsers((prev) =>
          prev.map((u) => (String(u.id) === String(userId) ? { ...u, status: newStatus } : u))
        );
      } else {
        const err = await res.json();
        toast.error(err.detail || 'Could not update user status.');
      }
    } catch {
      toast.error('Error contacting server.');
    } finally {
      setProcessingId(null);
    }
  };

  // Metrics counts
  const pendingCount = users.filter((u) => u.status === 'pending').length;
  const approvedCount = users.filter((u) => u.status === 'approved').length;
  const rejectedCount = users.filter((u) => u.status === 'rejected').length;

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#141414]/90 backdrop-blur-md border-b border-[#262626] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <QuickJobLogo size="md" />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#A78BFA] text-[11px] font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(139,92,246,0.3)]">
              Admin Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToApp}
              className="px-3.5 py-2 rounded-xl bg-[#0A0A0A] hover:bg-white/5 border border-[#262626] text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Page Title & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <Users className="w-6 h-6 text-[#8B5CF6]" />
              <span>Signup Approval & User Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Review and approve user registrations. Only approved users can sign in and generate AutoScripts.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchUsers}
            disabled={isLoading}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#262626] text-xs font-semibold text-zinc-200 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626]">
            <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider block">
              Total Signups
            </span>
            <span className="text-2xl font-black text-white mt-1 block">
              {users.length}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#141414] border border-amber-500/40 relative overflow-hidden">
            <div className="absolute -right-3 -top-3 w-16 h-16 bg-amber-500/10 rounded-full blur-xl" />
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Pending Review</span>
            </span>
            <span className="text-2xl font-black text-amber-300 mt-1 block">
              {pendingCount}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#141414] border border-[#8B5CF6]/40 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider block flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#8B5CF6]" />
              <span>Approved</span>
            </span>
            <span className="text-2xl font-black text-white mt-1 block">
              {approvedCount}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#141414] border border-rose-500/30">
            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              <span>Rejected / Disabled</span>
            </span>
            <span className="text-2xl font-black text-zinc-300 mt-1 block">
              {rejectedCount}
            </span>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 rounded-xl border border-[#262626] overflow-x-auto">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab
                    ? 'bg-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.45)]'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email or name..."
              className="w-full pl-9 pr-4 py-2 bg-[#0A0A0A] border border-[#262626] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5CF6] transition-all"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* User Table */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
              <span className="text-xs">Loading user registry...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center space-y-2 text-zinc-400">
              <Users className="w-10 h-10 mx-auto text-zinc-600 mb-2" />
              <p className="text-sm font-semibold text-zinc-300">No user applications found</p>
              <p className="text-xs text-[#A1A1AA]">
                {statusFilter !== 'all' ? `No users matching status "${statusFilter}".` : 'No signup requests currently recorded.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#262626] bg-[#0A0A0A]/50 text-[#A1A1AA] font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 sm:px-6">Candidate</th>
                    <th className="py-3.5 px-4">Role & Experience</th>
                    <th className="py-3.5 px-4">Signup Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {users.map((u) => {
                    const isProcessing = processingId === u.id;
                    const isSelfAdmin = u.email === user?.email;

                    return (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Name & Email */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">
                              {u.full_name}
                            </span>
                            <span className="text-zinc-400 text-xs font-mono">
                              {u.email}
                            </span>
                            {u.role === 'admin' && (
                              <span className="inline-block mt-1 w-max px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase">
                                Administrator
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Submitted Target Role & Exp */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-0.5 text-zinc-300">
                            <span className="flex items-center gap-1.5 font-medium">
                              <Briefcase className="w-3 h-3 text-[#8B5CF6]" />
                              <span>{u.target_role || 'Not specified'}</span>
                            </span>
                            <span className="text-[11px] text-[#A1A1AA]">
                              {u.experience_years || '2-5 Yrs'}
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-[#A1A1AA]">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-zinc-500" />
                            <span>{u.created_at ? u.created_at.slice(0, 10) : 'Recent'}</span>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4">
                          {u.status === 'approved' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approved</span>
                            </span>
                          )}
                          {u.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[11px] animate-pulse">
                              <Clock className="w-3 h-3" />
                              <span>Pending Review</span>
                            </span>
                          )}
                          {u.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[11px]">
                              <XCircle className="w-3 h-3" />
                              <span>Rejected</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          {isSelfAdmin ? (
                            <span className="text-[11px] text-zinc-500 italic pr-2">
                              Current Admin
                            </span>
                          ) : isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#8B5CF6] inline-block mr-2" />
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              {u.status !== 'approved' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(u.id, 'approved')}
                                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#A78BFA] hover:to-[#8B5CF6] text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(139,92,246,0.35)] flex items-center gap-1 cursor-pointer active:scale-95"
                                  title="Approve candidate access"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                              )}

                              {u.status !== 'rejected' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(u.id, 'rejected')}
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                                  title={u.status === 'approved' ? 'Disable approved user' : 'Reject user request'}
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  <span>{u.status === 'approved' ? 'Disable' : 'Reject'}</span>
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
