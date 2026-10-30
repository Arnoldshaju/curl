import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import PublicShortener from '@/components/PublicShortener';
import { Link2, ArrowLeft } from 'lucide-react';

export default function ShortenerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {/* Top Bar with back link to Welcome */}
      <header className="relative z-30 w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Welcome</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="w-full max-w-4xl mx-auto text-center relative z-10">
          {/* Logo Branding */}
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-500 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Link2 className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
              Curl
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-[1.15] mb-4">
            Curl Short Links.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Own Your Traffic.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 max-w-lg mx-auto leading-relaxed mb-8">
            Create clean, fast, and trackable short links in seconds. Free, secure, and instant.
          </p>

          {/* Live Interactive Shortener */}
          <PublicShortener />
        </div>
      </main>

      <Footer />
    </div>
  );
}
