'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { ShortenedURL } from '@/lib/types';
import { useToast } from '@/components/Toast';
import CreateLinkModal from '@/components/CreateLinkModal';
import EditLinkModal from '@/components/EditLinkModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import QrCodeModal from '@/components/QrCodeModal';
import AnalyticsModal from '@/components/AnalyticsModal';
import {
  Plus,
  Search,
  Copy,
  Check,
  QrCode,
  BarChart2,
  Edit2,
  Trash2,
  ExternalLink,
  Filter,
  RefreshCw,
  Link2,
  MousePointerClick,
  Activity,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [links, setLinks] = useState<ShortenedURL[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');

  // Copy tracking
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ShortenedURL | null>(null);
  const [deletingLink, setDeletingLink] = useState<ShortenedURL | null>(null);
  const [qrLink, setQrLink] = useState<ShortenedURL | null>(null);
  const [analyticsLink, setAnalyticsLink] = useState<ShortenedURL | null>(null);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch links
  const fetchLinks = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await api.links.list({
        search: searchTerm.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: currentPage,
      });
      setLinks(res.results);
      setTotalCount(res.count);
      setTotalPages(Math.max(Math.ceil(res.count / 10), 1));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch links.';
      toast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, searchTerm, statusFilter, currentPage, toast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLinks();
    }
  }, [fetchLinks, isAuthenticated]);

  const handleCopy = (link: ShortenedURL) => {
    navigator.clipboard.writeText(link.short_url);
    setCopiedId(link.id);
    toast('Short link copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleLinkCreated = (newLink: ShortenedURL) => {
    setLinks((prev) => [newLink, ...prev]);
    setTotalCount((prev) => prev + 1);
  };

  const handleLinkUpdated = (updatedLink: ShortenedURL) => {
    setLinks((prev) => prev.map((l) => (l.id === updatedLink.id ? updatedLink : l)));
  };

  const handleLinkDeleted = (deletedId: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== deletedId));
    setTotalCount((prev) => Math.max(prev - 1, 0));
  };

  // Metrics summary
  const totalClicksAcrossLinks = links.reduce((sum, l) => sum + l.click_count, 0);
  const activeLinksCount = links.filter((l) => l.is_active && !l.is_expired).length;

  if (authLoading || (!isAuthenticated && !links.length)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400">Loading your LinkForge dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Welcome back, <span className="text-blue-400 font-semibold">{user?.username}</span>. Manage and monitor your links.
            </p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Short Link</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Total Active Links</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Link2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{totalCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">{activeLinksCount} currently redirecting visitors</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Page Clicks Tracked</span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <MousePointerClick className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{totalClicksAcrossLinks}</div>
            <p className="text-[11px] text-slate-500 mt-1">Real-time click telemetry logged</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>System Health</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xl font-bold text-emerald-400">Operational</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Postgres &bull; Redis &bull; Celery Active</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, original URL, or short code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="pl-8 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">All Links</option>
                <option value="active">Active Only</option>
                <option value="expired">Expired Only</option>
              </select>
            </div>

            <button
              onClick={fetchLinks}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
              title="Refresh link list"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Links List / Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 rounded-2xl bg-slate-900/50 border border-slate-800/80 animate-pulse" />
            ))}
          </div>
        ) : links.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center mx-auto mb-3">
              <Link2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No shortened links found</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-5">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'Create your first shortened link to begin redirecting visitors and tracking clicks.'}
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
            >
              Forge Your First Link
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => {
              const isExpired = link.is_expired;
              const isPaused = !link.is_active;

              return (
                <div
                  key={link.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  {/* Left Column: Link Info */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-base truncate max-w-md">
                        {link.title || `/${link.effective_code}`}
                      </span>

                      {/* Status Badges */}
                      {isPaused ? (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold uppercase">
                          Paused
                        </span>
                      ) : isExpired ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-semibold uppercase">
                          Expired
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold uppercase">
                          Active
                        </span>
                      )}

                      {link.custom_alias && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono">
                          alias: {link.custom_alias}
                        </span>
                      )}
                    </div>

                    {/* Short link and original link */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono text-blue-400 font-semibold">{link.short_url}</span>
                      <span className="text-slate-600">&bull;</span>
                      <a
                        href={link.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-200 truncate max-w-xs sm:max-w-md flex items-center gap-1 transition-colors"
                      >
                        <span className="truncate">{link.original_url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>

                    {/* Metadata: Dates */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span>Created: {new Date(link.created_at).toLocaleDateString()}</span>
                      {link.expires_at ? (
                        <span>Expires: {new Date(link.expires_at).toLocaleDateString()}</span>
                      ) : (
                        <span>No Expiration</span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Click Count & Action Buttons */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {/* Click Count Badge */}
                    <button
                      onClick={() => setAnalyticsLink(link)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200 transition-colors mr-1"
                      title="View Clicks Analytics"
                    >
                      <MousePointerClick className="w-3.5 h-3.5 text-blue-400" />
                      <span>{link.click_count} clicks</span>
                    </button>

                    {/* Copy Link */}
                    <button
                      onClick={() => handleCopy(link)}
                      className="p-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                      title="Copy Short Link"
                      aria-label="Copy Short Link"
                    >
                      {copiedId === link.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    {/* QR Code */}
                    <button
                      onClick={() => setQrLink(link)}
                      className="p-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                      title="View QR Code"
                      aria-label="View QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>

                    {/* Analytics */}
                    <button
                      onClick={() => setAnalyticsLink(link)}
                      className="p-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                      title="Detailed Analytics"
                      aria-label="Detailed Analytics"
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => setEditingLink(link)}
                      className="p-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                      title="Edit Metadata"
                      aria-label="Edit Metadata"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeletingLink(link)}
                      className="p-2 rounded-xl border border-slate-700/60 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Link"
                      aria-label="Delete Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 mt-6 text-xs text-slate-400">
            <span>
              Page {currentPage} of {totalPages} ({totalCount} total links)
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Modals */}
      <CreateLinkModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onLinkCreated={handleLinkCreated}
      />

      <EditLinkModal
        link={editingLink}
        onClose={() => setEditingLink(null)}
        onLinkUpdated={handleLinkUpdated}
      />

      <DeleteConfirmModal
        link={deletingLink}
        onClose={() => setDeletingLink(null)}
        onDeleted={handleLinkDeleted}
      />

      <QrCodeModal link={qrLink} onClose={() => setQrLink(null)} />

      <AnalyticsModal link={analyticsLink} onClose={() => setAnalyticsLink(null)} />
    </div>
  );
}
