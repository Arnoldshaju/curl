'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { CurlLogoMark } from '@/components/CurlLogoMark';
import QrCodeModal from '@/components/QrCodeModal';
import { api } from '@/lib/api';
import { ShortenedURL } from '@/lib/types';
import { useToast } from '@/components/Toast';
import { useAuth } from '@/lib/auth-context';
import { CheckCircle2, AlertCircle, Copy, Check, QrCode } from 'lucide-react';

function normalizeInputUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(normalizeInputUrl(value));
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function displayShortUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    return `${parsed.host}${parsed.pathname}`;
  } catch {
    return rawUrl.replace(/^https?:\/\//, '');
  }
}

export default function LandingShortenerPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ShortenedURL | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    if (!isValidUrl(url)) {
      setError('Enter a valid URL (e.g. https://example.com)');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const clean = normalizeInputUrl(url);
      const link = await api.links.publicCreate(clean);
      setResult(link);
      toast('Short link created successfully!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create short link.';
      setError(msg);
      toast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.short_url);
    setCopied(true);
    toast('Copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShortenAnother = () => {
    setResult(null);
    setUrl('');
    setError('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col justify-between selection:bg-[#00a8ff] selection:text-black">
      {/* ── 1. Header (Mirrors Link landing/components/header.tsx in Dark Theme) ── */}
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/5">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-[21px] font-semibold leading-6 tracking-tight text-white group"
          >
            <CurlLogoMark className="w-6 h-6 group-hover:scale-105 transition-transform" />
            <span>Curl</span>
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center h-9 px-4 rounded-full text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-9 px-4 rounded-full text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      {/* ── 2. Hero Section ── */}
      <main className="relative z-10 flex-1 flex flex-col justify-center py-4 sm:py-6">
        <section className="landing relative isolate overflow-hidden px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <hgroup className="flex flex-col items-center">
              <h1 className="font-heading font-black tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-b from-white via-neutral-100 to-[#38bdf8] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(0,168,255,0.45)] mb-2 select-none">
                CURL
              </h1>
              <p className="text-sm sm:text-base text-neutral-400 text-pretty max-w-md">
                Shorten, customize, and track links
              </p>
            </hgroup>

            {/* URL Input Form with Signature Glowing Cyan Shadow */}
            <form onSubmit={handleSubmit} className="mt-6 flex gap-2 max-w-xl mx-auto">
              <input
                ref={inputRef}
                type="url"
                placeholder="Paste your long URL here…"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError('');
                }}
                className={`h-12 text-sm sm:text-base flex w-full rounded-xl border ${
                  error
                    ? 'border-rose-500'
                    : 'border-[#00a8ff]/40 hover:border-[#00a8ff]/70 focus:border-[#00a8ff]'
                } bg-[#06080e]/95 px-4 py-2 text-white placeholder:text-neutral-500 focus:outline-none transition-all`}
                style={{
                  boxShadow:
                    '0 0 0 1px rgba(0, 168, 255, 0.25), 0 0 16px -2px rgba(0, 168, 255, 0.3), 0 8px 24px -4px rgba(0, 168, 255, 0.3)',
                }}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="h-12 px-6 sm:px-7 rounded-full bg-[#00a8ff] hover:bg-[#0096e6] text-black font-semibold text-sm sm:text-base inline-flex items-center justify-center shrink-0 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#00a8ff]/25 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Shortening...
                  </span>
                ) : (
                  'Shorten'
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <p className="mt-2.5 flex items-center gap-1.5 text-sm text-rose-400 text-left max-w-xl mx-auto px-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </p>
            )}

            {/* Result Card */}
            {result && (
              <div className="mt-4 rounded-xl border border-[#27272a] bg-[#09090b]/90 backdrop-blur-xl p-4 text-left shadow-2xl max-w-xl mx-auto animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00a8ff]" />
                  <span>Your short link is ready</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={result.short_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-base sm:text-lg font-semibold text-[#00a8ff] hover:underline mr-1"
                  >
                    {displayShortUrl(result.short_url)}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-[#27272a] bg-[#141416] hover:bg-[#1f1f23] text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQrModalOpen(true)}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-[#27272a] bg-[#141416] hover:bg-[#1f1f23] text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR Code</span>
                  </button>
                  <Link
                    href="/register"
                    className="inline-flex items-center h-8 px-3 rounded-full border border-[#27272a] bg-[#141416] hover:bg-[#1f1f23] text-white text-xs font-medium transition-colors"
                  >
                    Save to dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleShortenAnother}
                    className="inline-flex items-center h-8 px-3 rounded-full hover:bg-white/5 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Shorten another
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── 3. CTA Section (Moved upwards and made compact so the page fits without scrolling) ── */}
        <section className="mt-8 sm:mt-10 px-6 sm:px-8 z-10">
          <div className="mx-auto max-w-4xl">
            <div
              className="landing relative isolate overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#0284c7] px-6 py-7 sm:py-8 text-center shadow-2xl border border-[#00a8ff]/40 sm:px-12"
              style={{
                boxShadow: '0 0 45px -10px rgba(0, 168, 255, 0.35), 0 16px 32px -12px rgba(0,0,0,0.85)',
              }}
            >
              {/* Radial gloss on CTA banner */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.22),transparent_70%)]"
              />

              <h2 className="relative z-10 text-balance text-white font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight">
                Your links. Your data. No bloat.
              </h2>
              <p className="relative z-10 mx-auto mt-2 sm:mt-2.5 max-w-lg text-pretty text-sm sm:text-base text-white/85">
                Ship faster with links that actually tell you what happened after the click.
              </p>
              <div className="relative z-10 mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-white hover:bg-neutral-100 text-black text-sm font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-black/20"
                >
                  Get started free
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-white transition-colors hover:text-white/80 inline-flex items-center gap-1.5"
                >
                  Sign in <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── 4. Footer ── */}
      <footer className="relative z-10 border-t border-white/10 py-5 bg-black/60 backdrop-blur-md shrink-0">
        <div className="mx-auto flex max-w-[1440px] flex-col sm:flex-row items-center justify-between gap-2 px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-lg font-semibold leading-6 tracking-tight text-white hover:opacity-90 transition-opacity"
          >
            <CurlLogoMark className="w-5 h-5" />
            <span>Curl</span>
          </Link>
          <p className="text-xs text-neutral-400">
            Short links. Real insights. Built for makers and solo operators.
          </p>
          <p className="text-xs text-neutral-500">
            &copy; 2026 Curl. All rights reserved.
          </p>
        </div>
      </footer>

      {/* QR Code Modal */}
      {qrModalOpen && result && (
        <QrCodeModal link={result} onClose={() => setQrModalOpen(false)} />
      )}
    </div>
  );
}
