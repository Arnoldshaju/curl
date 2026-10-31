'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QrCodeModal from '@/components/QrCodeModal';
import { api } from '@/lib/api';
import { ShortenedURL } from '@/lib/types';
import { useToast } from '@/components/Toast';
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  QrCode,
  ExternalLink,
} from 'lucide-react';

export default function LandingShortenerPage() {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ShortenedURL | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

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
    toast('Copied short link to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShortenAnother = () => {
    setResult(null);
    setUrl('');
    setError('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="relative min-h-screen md:h-screen md:max-h-screen md:overflow-hidden bg-transparent text-white flex flex-col justify-between selection:bg-[#00a8ff] selection:text-black">
      {/* Black box glowing grid background - ONLY kept on first page */}
      <div aria-hidden="true" className="ambient-glow-layer" />
      <div aria-hidden="true" className="grid-overlay-layer" />

      {/* Top Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 z-10 min-h-0 py-1">
        {/* Soft Blurred Color Blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 left-1/4 -z-10 h-64 w-64 rounded-full bg-[#00a8ff]/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-20 right-1/4 -z-10 h-64 w-64 rounded-full bg-[#00a8ff]/15 blur-3xl"
        />

        {/* Hero Section */}
        <section className="w-full max-w-3xl mx-auto text-center z-10 shrink-0">
          {/* Main Title & Subtitle */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-1.5">
            URL shortener
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal">
            Shorten, customize, and track links
          </p>

          {/* Interactive URL Shortener Input Bar (Black Box Design) */}
          <div className="mt-3 sm:mt-4 max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="url"
                  placeholder="Paste your long URL here…"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError('');
                  }}
                  className={`h-11 sm:h-12 text-sm sm:text-base w-full rounded-xl border ${
                    error
                      ? 'border-rose-500'
                      : 'border-[#00a8ff]/40 hover:border-[#00a8ff]/70 focus:border-[#00a8ff]'
                  } bg-[#06080e] px-4 text-white placeholder:text-neutral-500 focus:outline-none transition-all`}
                  style={{
                    boxShadow:
                      '0 0 0 1px rgba(0, 168, 255, 0.25), 0 0 16px -2px rgba(0, 168, 255, 0.3), 0 8px 24px -4px rgba(0, 168, 255, 0.3)',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="h-11 sm:h-12 px-6 rounded-full bg-[#00a8ff] hover:bg-[#0096e6] text-black font-semibold text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center shrink-0 cursor-pointer shadow-lg shadow-[#00a8ff]/25"
              >
                {isLoading ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Shortening...
                  </span>
                ) : (
                  <span>Shorten</span>
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400 text-left px-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}

            {/* Shortened URL Result Card */}
            {result && (
              <div className="mt-2.5 rounded-lg border border-[#27272a] bg-[#09090b] p-3 sm:p-4 text-left shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00a8ff]" />
                  <span>Your short link is ready</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={result.short_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-base font-semibold text-[#00a8ff] hover:underline mr-1"
                  >
                    {result.short_url}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#27272a] bg-[#141416] hover:bg-[#1f1f23] text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQrModalOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#27272a] bg-[#141416] hover:bg-[#1f1f23] text-white text-xs font-medium transition-colors cursor-pointer"
                    title="QR Code"
                  >
                    <QrCode className="w-3 h-3" />
                    <span>QR Code</span>
                  </button>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#27272a] bg-[#141416] hover:bg-[#1f1f23] text-white text-xs font-medium transition-colors"
                  >
                    Save to dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleShortenAnother}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Shorten another
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Architecture & Workflow Diagram Showcase Section (Second Image - Upscaled & Compact) */}
        <section className="w-full max-w-2xl lg:max-w-[680px] mx-auto mt-2 sm:mt-3 z-10 shrink-1 min-h-0 flex items-center justify-center">
          <div
            className="relative rounded-2xl border border-[#00a8ff]/30 bg-[#070b12]/85 p-1.5 sm:p-2.5 shadow-2xl backdrop-blur-xl overflow-hidden group hover:border-[#00a8ff]/60 transition-all duration-300 max-h-[46vh] flex items-center justify-center"
            style={{
              boxShadow:
                '0 0 35px -8px rgba(0, 168, 255, 0.25), 0 16px 32px -10px rgba(0, 0, 0, 0.8)',
            }}
          >
            <div className="relative w-full overflow-hidden rounded-xl bg-black/40 flex items-center justify-center">
              <Image
                src="/curl-diagram.png"
                alt="Curl link workflow: convert long complex URLs to short, clean, trackable links"
                width={2048}
                height={1364}
                priority
                quality={100}
                className="w-auto h-auto max-h-[42vh] max-w-full rounded-xl object-contain transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Compact Footer */}
      <Footer compact />

      {/* QR Code Modal */}
      {qrModalOpen && result && (
        <QrCodeModal link={result} onClose={() => setQrModalOpen(false)} />
      )}
    </div>
  );
}
