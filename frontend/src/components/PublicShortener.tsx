'use client';

import React, { useState } from 'react';
import { ArrowRight, Copy, Check, QrCode, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { ShortenedURL } from '@/lib/types';
import { useToast } from './Toast';
import QrCodeModal from './QrCodeModal';

export default function PublicShortener() {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ShortenedURL | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let clean = url.trim();
    if (!clean) return;

    if (!/^https?:\/\//i.test(clean)) {
      clean = `https://${clean}`;
    }

    setIsLoading(true);
    try {
      const link = await api.links.publicCreate(clean);
      setResult(link);
      toast('Short link created successfully!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create short link.';
      toast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.short_url);
    setCopied(true);
    toast('Copied short link to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl transition-all focus-within:border-blue-500/80 focus-within:ring-4 focus-within:ring-blue-500/10">
          <input
            type="text"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your long URL here (e.g. https://github.com/my-project)..."
            className="w-full px-4 py-3 bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] disabled:opacity-50 shrink-0"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Shortening...
              </span>
            ) : (
              <>
                <span>Shorten</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Instant Result Card */}
      {result && (
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-blue-500/40 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  Ready to share
                </span>
              </div>
              <div className="font-mono text-base sm:text-lg font-bold text-white truncate">
                {result.short_url}
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                Target: {result.original_url}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>

              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                title="View QR Code"
                aria-label="View QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>

              <a
                href={result.short_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                title="Follow Redirect"
                aria-label="Follow Redirect"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Trust indicator */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Fast &amp; Secure
        </span>
        <span>&bull;</span>
        <span>Instant Redirects</span>
        <span>&bull;</span>
        <span>Free to Use</span>
      </div>

      {qrModalOpen && result && (
        <QrCodeModal link={result} onClose={() => setQrModalOpen(false)} />
      )}
    </div>
  );
}
