'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Link2,
  Globe,
  Cloud,
  Copy,
  Check,
  Share2,
  ShieldCheck,
  FileText,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

// Custom SVG Brand Icons for YouTube, Google Drive, Amazon, and GitHub
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path
      fill="#dc2626"
      d="M21.58 7.19a2.7 2.7 0 0 0-1.9-1.9C17.99 4.8 12 4.8 12 4.8s-5.99 0-7.68.49a2.7 2.7 0 0 0-1.9 1.9A28.3 28.3 0 0 0 2 12c0 1.63.15 3.23.42 4.81a2.7 2.7 0 0 0 1.9 1.9c1.69.49 7.68.49 7.68.49s5.99 0 7.68-.49a2.7 2.7 0 0 0 1.9-1.9c.27-1.58.42-3.18.42-4.81 0-1.63-.15-3.23-.42-4.81z"
    />
    <path fill="#ffffff" d="M10 15l5-3-5-3v6z" />
  </svg>
);

const GoogleDriveIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#0F9D58" d="M8.3 14.8L4.3 8.1 1.2 13.5l4 6.9z" />
    <path fill="#FFCD40" d="M15.8 14.8l-4-6.7H4.3l3.9 6.7z" />
    <path fill="#4285F4" d="M19.7 8.1L15.8 1.4H8.3l3.9 6.7z" />
  </svg>
);

const AmazonIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400" fill="currentColor">
    <path d="M13.8 12.8c-.8 0-1.4-.4-1.4-1.2 0-.9.7-1.3 1.8-1.3.4 0 .8 0 1.1.1v.6c0 1.1-.7 1.8-1.5 1.8zm2.4 2.8h-1.3v-.8c-.4.5-1.1.9-1.9.9-1.5 0-2.5-.9-2.5-2.4 0-1.6 1.1-2.4 2.8-2.4.6 0 1.1.1 1.6.2v-.4c0-.8-.5-1.2-1.5-1.2-.7 0-1.4.2-1.9.5l-.4-1.1c.7-.4 1.6-.6 2.6-.6 2 0 2.9 1 2.9 2.7v4.5zm4.8 1.7c-3.1 2.3-7.5 3.5-11.4 2.2-2.3-.8-4.2-2.2-5.7-4-.4-.5-.1-.9.5-.6 3.6 1.8 7.8 2.3 11.8 1.1 1.7-.5 3.3-1.4 4.7-2.5.5-.4.9 0 .1.8z" />
    <path d="M20.2 16.5c-.3.4-1.4.7-2.1.8-.2 0-.3-.2-.1-.3.7-.5 1.7-1.3 2-1.9.2-.4.4-.3.2.1z" />
  </svg>
);

// Origami Paper Airplane SVG
const OrigamiPaperAirplane = () => (
  <svg
    viewBox="0 0 48 48"
    className="w-12 h-12 drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]"
    fill="none"
  >
    <path
      d="M8 24 L42 10 L28 40 L22 28 Z"
      fill="url(#plane-grad-1)"
      stroke="#c084fc"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M22 28 L42 10 L28 40 Z"
      fill="url(#plane-grad-2)"
      stroke="#a855f7"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M22 28 L28 40 L26 31 Z"
      fill="#6b21a8"
      stroke="#7e22ce"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="plane-grad-1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f3e8ff" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
      <linearGradient id="plane-grad-2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#d8b4fe" />
        <stop offset="100%" stopColor="#7e22ce" />
      </linearGradient>
    </defs>
  </svg>
);

export default function RootWelcomePage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const leftPills = [
    {
      id: 0,
      icon: <Globe className="w-5 h-5 text-white" />,
      badgeBg: 'bg-blue-600',
      borderClass: 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.35)]',
      color: '#3b82f6',
      url: 'https://www.example.com/articles/product-launch-2025?ref=campaign&...',
    },
    {
      id: 1,
      icon: <YoutubeIcon />,
      badgeBg: 'bg-rose-950/50',
      borderClass: 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.35)]',
      color: '#f43f5e',
      url: 'https://www.youtube.com/watch?v=Qw4w9WgXcQ&list=PL123...',
    },
    {
      id: 2,
      icon: <GithubIcon />,
      badgeBg: 'bg-purple-950/70',
      borderClass: 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.35)]',
      color: '#a855f7',
      url: 'https://github.com/your-repo/project/blob/main/docs/setup-guide.md',
    },
    {
      id: 3,
      icon: <GoogleDriveIcon />,
      badgeBg: 'bg-emerald-950/70',
      borderClass: 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.35)]',
      color: '#10b981',
      url: 'https://drive.google.com/file/d/1aB2c3D4e5F6g7H8i9J0kL/view?usp=...',
    },
    {
      id: 4,
      icon: <AmazonIcon />,
      badgeBg: 'bg-black',
      borderClass: 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.35)]',
      color: '#f59e0b',
      url: 'https://www.amazon.in/dp/B0C7VZ1234?ref=...',
    },
    {
      id: 5,
      icon: <Cloud className="w-5 h-5 text-white" />,
      badgeBg: 'bg-sky-600',
      borderClass: 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)]',
      color: '#06b6d4',
      url: 'https://cloud-storage.example.com/backup/2025/10/28/file.zip',
    },
  ];

  const rightPills = [
    {
      id: 0,
      iconColor: 'text-purple-400',
      borderClass: 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.35)]',
      color: '#8b5cf6',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=...',
      hasCopy: false,
      hasSparks: false,
    },
    {
      id: 1,
      iconColor: 'text-pink-400',
      borderClass: 'border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.35)]',
      color: '#ec4899',
      url: 'https://yt.be/watch',
      hasCopy: true,
      hasSparks: true,
    },
    {
      id: 2,
      iconColor: 'text-emerald-400',
      borderClass: 'border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.35)]',
      color: '#10b981',
      url: 'https://gh/repo',
      hasCopy: true,
      hasSparks: true,
    },
    {
      id: 3,
      iconColor: 'text-amber-400',
      borderClass: 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.35)]',
      color: '#f59e0b',
      url: 'https://drive.ly/file',
      hasCopy: true,
      hasSparks: true,
    },
    {
      id: 4,
      iconColor: 'text-cyan-400',
      borderClass: 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.35)]',
      color: '#06b6d4',
      url: 'https://amz.to/product',
      hasCopy: true,
      hasSparks: true,
    },
    {
      id: 5,
      iconColor: 'text-sky-400',
      borderClass: 'border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.35)]',
      color: '#0ea5e9',
      url: 'https://cld.ly/backup',
      hasCopy: true,
      hasSparks: true,
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  // Center connection points matching vertical indices
  const centerEntryYs = [128, 150, 172, 198, 220, 242];

  return (
    <div className="relative min-h-screen bg-[#060c18] text-white overflow-x-hidden flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      {/* Background Ambient Spotlight Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-cyan-600/10 via-blue-600/15 to-purple-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-700/10 via-indigo-600/15 to-fuchsia-600/10 blur-[130px] rounded-full" />
      </div>

      {/* Top Header / Navigation Bar */}
      <header className="relative z-30 w-full px-6 py-3.5 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
              <Link2 className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <span className="font-extrabold tracking-wider text-lg text-white">CURL</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/shorten"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition-all hover:scale-105 shadow-sm"
          >
            <span>Open Shortener</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-20 flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 flex flex-col justify-between">
        
        {/* ======================================================== */}
        {/* TOP SECTION: Input URLs -> CURL Hub -> Short Clean URLs */}
        {/* ======================================================== */}
        <section className="relative w-full py-4 lg:py-6">
          
          {/* DESKTOP VIEW WITH PRECISE SVG FLOW CONNECTORS (>= 1024px) */}
          <div className="hidden lg:flex items-center justify-center w-full">
            
            {/* 1. LEFT COLUMN: 6 Original Long URLs */}
            <div className="w-[390px] xl:w-[420px] flex flex-col gap-3.5 shrink-0 z-10">
              {leftPills.map((pill, index) => (
                <div
                  key={pill.id}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`group relative h-12 flex items-center gap-3 px-3.5 rounded-full bg-[#0a1324]/90 backdrop-blur-md border ${pill.borderClass} transition-all duration-200 hover:scale-[1.02] hover:bg-[#0e1a33] cursor-default`}
                >
                  {/* Circular Badge Icon */}
                  <div
                    className={`w-7 h-7 rounded-full ${pill.badgeBg} flex items-center justify-center shrink-0 shadow-inner`}
                  >
                    {pill.icon}
                  </div>

                  {/* Long Truncated URL */}
                  <span className="font-mono text-[12px] text-slate-300 truncate select-all group-hover:text-white transition-colors">
                    {pill.url}
                  </span>
                </div>
              ))}
            </div>

            {/* 2. LEFT CONNECTOR CURVES SVG (width ~110px, height ~370px) */}
            <div className="w-[90px] xl:w-[110px] h-[370px] shrink-0 pointer-events-none relative z-0">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 110 370"
                preserveAspectRatio="none"
              >
                <defs>
                  {leftPills.map((pill) => (
                    <marker
                      key={`arrow-left-${pill.id}`}
                      id={`arrow-left-${pill.id}`}
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="5"
                      markerHeight="5"
                      orient="auto"
                    >
                      <path d="M 0 1 L 9 5 L 0 9 z" fill={pill.color} />
                    </marker>
                  ))}
                </defs>

                {leftPills.map((pill, idx) => {
                  const startY = 24 + idx * 62;
                  const targetY = centerEntryYs[idx];
                  return (
                    <path
                      key={`line-left-${pill.id}`}
                      d={`M 0 ${startY} C 55 ${startY}, 55 ${targetY}, 108 ${targetY}`}
                      fill="none"
                      stroke={pill.color}
                      strokeWidth={hoveredRow === idx ? '3.5' : '2.2'}
                      strokeLinecap="round"
                      opacity={hoveredRow === null || hoveredRow === idx ? 0.95 : 0.3}
                      markerEnd={`url(#arrow-left-${pill.id})`}
                      className="transition-all duration-300"
                      style={{
                        filter: `drop-shadow(0 0 4px ${pill.color})`,
                      }}
                    />
                  );
                })}
              </svg>
            </div>

            {/* 3. CENTER HUB: CURL Box */}
            <div className="w-[190px] xl:w-[210px] shrink-0 relative z-10 flex flex-col items-center justify-center">
              {/* Radiating tick marks on top */}
              <div className="flex items-end justify-center gap-2 mb-2">
                <span className="w-1 h-3.5 bg-cyan-400 -rotate-25 rounded-full shadow-[0_0_8px_#38bdf8]" />
                <span className="w-1 h-4.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#38bdf8]" />
                <span className="w-1 h-3.5 bg-cyan-400 rotate-25 rounded-full shadow-[0_0_8px_#38bdf8]" />
              </div>

              {/* The Glowing Hub Card */}
              <div className="w-[190px] xl:w-[205px] h-[190px] xl:h-[200px] rounded-3xl bg-[#081224]/95 border-2 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.45),inset_0_0_20px_rgba(6,182,212,0.15)] flex flex-col items-center justify-center p-4 text-center backdrop-blur-lg group hover:shadow-[0_0_55px_rgba(6,182,212,0.65)] hover:border-cyan-300 transition-all duration-300">
                {/* Thick Glowing Chain Link Icon */}
                <div className="relative mb-2 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
                      <path
                        d="M26 38 L38 26 M20 44 L28 52 C33 57 41 57 46 52 L50 48 C55 43 55 35 50 30 L44 24"
                        stroke="url(#chain-grad)"
                        strokeWidth="5.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: 'drop-shadow(0 0 6px #38bdf8)' }}
                      />
                      <path
                        d="M38 26 L44 20 C49 15 49 7 44 2 L40 -2 C35 -7 27 -7 22 -2 L14 6 C9 11 9 19 14 24 L20 30"
                        stroke="url(#chain-grad)"
                        strokeWidth="5.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: 'drop-shadow(0 0 6px #38bdf8)' }}
                      />
                      <defs>
                        <linearGradient id="chain-grad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="50%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Branding Title */}
                <h2 className="text-3xl font-extrabold tracking-wider text-white mb-1.5 font-sans">
                  CURL
                </h2>

                {/* Tagline */}
                <span className="text-[10px] font-bold tracking-[0.22em] text-cyan-400 uppercase">
                  SIMPLE • FAST • RELIABLE
                </span>
              </div>
            </div>

            {/* 4. RIGHT CONNECTOR CURVES SVG */}
            <div className="w-[90px] xl:w-[110px] h-[370px] shrink-0 pointer-events-none relative z-0">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 110 370"
                preserveAspectRatio="none"
              >
                <defs>
                  {rightPills.map((pill) => (
                    <marker
                      key={`arrow-right-${pill.id}`}
                      id={`arrow-right-${pill.id}`}
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="5"
                      markerHeight="5"
                      orient="auto"
                    >
                      <path d="M 0 1 L 9 5 L 0 9 z" fill={pill.color} />
                    </marker>
                  ))}
                </defs>

                {rightPills.map((pill, idx) => {
                  const startY = centerEntryYs[idx];
                  const targetY = 24 + idx * 62;
                  return (
                    <path
                      key={`line-right-${pill.id}`}
                      d={`M 2 ${startY} C 55 ${startY}, 55 ${targetY}, 108 ${targetY}`}
                      fill="none"
                      stroke={pill.color}
                      strokeWidth={hoveredRow === idx ? '3.5' : '2.2'}
                      strokeLinecap="round"
                      opacity={hoveredRow === null || hoveredRow === idx ? 0.95 : 0.3}
                      markerEnd={`url(#arrow-right-${pill.id})`}
                      className="transition-all duration-300"
                      style={{
                        filter: `drop-shadow(0 0 4px ${pill.color})`,
                      }}
                    />
                  );
                })}
              </svg>
            </div>

            {/* 5. RIGHT COLUMN: 6 Shortened URLs */}
            <div className="w-[390px] xl:w-[420px] flex flex-col gap-3.5 shrink-0 z-10">
              {rightPills.map((pill, index) => (
                <div key={pill.id} className="relative flex items-center">
                  <div
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`group w-full h-12 flex items-center justify-between gap-3 px-4 rounded-full bg-[#0a1324]/90 backdrop-blur-md border ${pill.borderClass} transition-all duration-200 hover:scale-[1.02] hover:bg-[#0e1a33]`}
                  >
                    {/* Left Tilted Link Icon */}
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Link2 className={`w-4 h-4 shrink-0 -rotate-45 ${pill.iconColor}`} />
                      <span className="font-mono text-[12px] text-slate-200 font-medium truncate select-all group-hover:text-white transition-colors">
                        {pill.url}
                      </span>
                    </div>

                    {/* Copy Button */}
                    {pill.hasCopy ? (
                      <button
                        onClick={() => handleCopy(pill.url, index)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                        title="Copy to clipboard"
                        aria-label={`Copy ${pill.url}`}
                      >
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4 hover:scale-110 transition-transform" />
                        )}
                      </button>
                    ) : (
                      <div className="w-7 shrink-0" />
                    )}
                  </div>

                  {/* Radiating Accent Bursts for right side pills */}
                  {pill.hasSparks && (
                    <div className="absolute -right-5 flex flex-col justify-center items-center pointer-events-none opacity-85">
                      <span
                        className="w-2.5 h-0.5 rounded-full rotate-45 mb-1"
                        style={{ backgroundColor: pill.color }}
                      />
                      <span
                        className="w-3.5 h-0.5 rounded-full mb-1"
                        style={{ backgroundColor: pill.color }}
                      />
                      <span
                        className="w-2.5 h-0.5 rounded-full -rotate-45"
                        style={{ backgroundColor: pill.color }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

          {/* ======================================================== */}
          {/* MOBILE & TABLET RESPONSIVE FALLBACK (< 1024px) */}
          {/* ======================================================== */}
          <div className="lg:hidden flex flex-col items-center gap-6">
            {/* Center CURL Hub Card */}
            <div className="flex flex-col items-center">
              <div className="flex items-end justify-center gap-2 mb-2">
                <span className="w-1 h-3 bg-cyan-400 -rotate-25 rounded-full shadow-[0_0_8px_#38bdf8]" />
                <span className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_#38bdf8]" />
                <span className="w-1 h-3 bg-cyan-400 rotate-25 rounded-full shadow-[0_0_8px_#38bdf8]" />
              </div>

              <div className="w-[180px] h-[170px] rounded-3xl bg-[#081224]/95 border-2 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.45)] flex flex-col items-center justify-center p-4 text-center">
                <Link2 className="w-10 h-10 text-cyan-400 -rotate-45 mb-2 filter drop-shadow-[0_0_8px_#38bdf8]" />
                <h2 className="text-2xl font-extrabold tracking-wider text-white mb-1">CURL</h2>
                <span className="text-[9px] font-bold tracking-[0.2em] text-cyan-400 uppercase">
                  SIMPLE • FAST • RELIABLE
                </span>
              </div>
            </div>

            {/* Split Grid for Mobile/Tablet */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Long URLs */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  Messy Long URLs
                </h3>
                {leftPills.map((pill) => (
                  <div
                    key={pill.id}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full bg-[#0a1324] border ${pill.borderClass}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full ${pill.badgeBg} flex items-center justify-center shrink-0`}
                    >
                      {pill.icon}
                    </div>
                    <span className="font-mono text-xs text-slate-300 truncate">{pill.url}</span>
                  </div>
                ))}
              </div>

              {/* Right Column: Shortened Clean URLs */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 px-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Short Clean URLs
                </h3>
                {rightPills.map((pill, index) => (
                  <div
                    key={pill.id}
                    className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-full bg-[#0a1324] border ${pill.borderClass}`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Link2 className={`w-4 h-4 shrink-0 -rotate-45 ${pill.iconColor}`} />
                      <span className="font-mono text-xs text-slate-200 font-medium truncate">
                        {pill.url}
                      </span>
                    </div>
                    {pill.hasCopy && (
                      <button
                        onClick={() => handleCopy(pill.url, index)}
                        className="p-1 rounded text-slate-400 hover:text-white"
                        aria-label="Copy URL"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* BOTTOM SECTION: The Problem Doodle -> CTA Button -> Benefits */}
        {/* ======================================================== */}
        <section className="relative w-full pt-6 pb-2">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-6 xl:gap-10">
            
            {/* ---------------------------------------------------- */}
            {/* BOTTOM-LEFT: Messy Scribble Doodle & Handwriting */}
            {/* ---------------------------------------------------- */}
            <div className="relative flex flex-col items-center justify-center p-2">
              <div className="relative w-[280px] sm:w-[320px] h-[180px] flex items-center justify-center">
                
                {/* Handwritten Callout Annotations */}
                <div className="absolute top-0 left-2 text-slate-300 font-handwriting text-2xl rotate-[-8deg] select-none">
                  Too long
                  <svg className="w-16 h-2 -mt-1 text-slate-400" viewBox="0 0 60 8" fill="none">
                    <path d="M 2 4 Q 30 8 58 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="absolute top-2 right-4 text-slate-300 font-handwriting text-2xl rotate-[6deg] select-none">
                  Hard to share
                </div>

                <div className="absolute bottom-2 left-4 text-slate-300 font-handwriting text-2xl rotate-[5deg] select-none">
                  Looks messy
                </div>

                <div className="absolute bottom-0 right-0 text-slate-300 font-handwriting text-2xl rotate-[-4deg] select-none">
                  Easy to make mistakes
                </div>

                {/* Hand-Drawn Messy Ball of Yarn Doodle (SVG) */}
                <svg
                  viewBox="0 0 160 120"
                  className="w-40 sm:w-48 h-32 sm:h-36 text-blue-200/80 drop-shadow-[0_0_8px_rgba(147,197,253,0.3)] transition-transform hover:scale-105 duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M 40 60 C 20 40, 50 15, 80 30 C 110 45, 130 20, 140 50 C 150 80, 120 105, 90 95 C 60 85, 30 110, 25 80 C 20 50, 60 40, 95 50 C 130 60, 120 85, 80 80 C 40 75, 45 45, 75 40 C 105 35, 115 65, 85 70 C 55 75, 60 95, 100 85" />
                  <path d="M 50 35 C 70 70, 120 40, 110 80 C 100 120, 50 90, 45 60 C 40 30, 85 20, 125 45 C 165 70, 100 110, 70 95 C 40 80, 35 45, 65 30" />
                  <path d="M 30 75 C 65 95, 95 40, 120 60 C 145 80, 85 110, 60 90 C 35 70, 75 30, 110 50 C 145 70, 110 100, 80 90 C 50 80, 40 60, 70 55" />
                  <path d="M 45 50 C 55 25, 95 30, 105 55 C 115 80, 80 100, 55 90 C 30 80, 40 40, 80 35 C 120 30, 135 75, 105 85 C 75 95, 55 65, 90 60" />
                </svg>

                {/* Hand-Drawn Chalk Arrow pointing from scribble towards button */}
                <div className="hidden lg:block absolute -right-12 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-20 h-14 overflow-visible" viewBox="0 0 80 50" fill="none">
                    <path
                      d="M 5 25 C 25 10, 50 15, 70 30"
                      stroke="#93c5fd"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 58 32 L 72 31 L 68 18"
                      stroke="#93c5fd"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* BOTTOM-CENTER: Hero "Click Here" CTA Button & Slogan */}
            {/* ---------------------------------------------------- */}
            <div className="relative flex flex-col items-center justify-center text-center">
              
              {/* Radiating Accent Dashes around the button */}
              <div className="relative flex items-center justify-center mb-1">
                
                {/* Radiant Burst Rays (SVG overlay) */}
                <div className="absolute -inset-6 pointer-events-none flex items-center justify-center">
                  <svg
                    className="w-full h-full overflow-visible"
                    viewBox="0 0 280 100"
                    fill="none"
                  >
                    {/* Top rays */}
                    <line x1="140" y1="14" x2="140" y2="2" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="105" y1="18" x2="98" y2="6" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="175" y1="18" x2="182" y2="6" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="70" y1="28" x2="58" y2="18" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="210" y1="28" x2="222" y2="18" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Side rays */}
                    <line x1="42" y1="50" x2="28" y2="46" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="238" y1="50" x2="252" y2="46" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="48" y1="72" x2="36" y2="82" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="232" y1="72" x2="244" y2="82" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* THE "CLICK HERE" BUTTON -> GOES TO /shorten */}
                <Link
                  href="/shorten"
                  className="group relative inline-flex items-center justify-center gap-3.5 px-8 sm:px-10 py-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xl sm:text-2xl shadow-[0_0_35px_rgba(99,102,241,0.7),0_0_15px_rgba(56,189,248,0.5)] hover:shadow-[0_0_50px_rgba(99,102,241,0.9),0_0_25px_rgba(56,189,248,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 border border-cyan-400/50 backdrop-blur-sm z-10"
                >
                  {/* Subtle top inner glow highlight */}
                  <span className="absolute inset-x-6 top-1 h-2 bg-gradient-to-b from-white/40 to-transparent rounded-full pointer-events-none" />

                  {/* Chain link icon */}
                  <Link2 className="w-6 sm:w-7 h-6 sm:h-7 text-white -rotate-45 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)] group-hover:rotate-0 transition-transform duration-300" />
                  
                  {/* Button Label */}
                  <span className="tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                    Click Here
                  </span>
                </Link>
              </div>

              {/* Handwriting Slogan Under Button */}
              <div className="mt-2.5 relative flex flex-col items-center">
                <span className="font-handwriting text-3xl sm:text-4xl text-white font-bold tracking-wide select-none drop-shadow-md">
                  Short. Clean. Done.
                </span>
                
                {/* Curved green underline accent underneath "Done." */}
                <svg
                  className="w-24 sm:w-28 h-4 -mt-1 text-emerald-400 overflow-visible"
                  viewBox="0 0 100 16"
                  fill="none"
                >
                  <path
                    d="M 5 8 Q 50 16 95 6"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 6px #10b981)' }}
                  />
                </svg>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* BOTTOM-RIGHT: Paper Airplane & 4 Feature Benefits */}
            {/* ---------------------------------------------------- */}
            <div className="relative flex items-center justify-center lg:justify-start gap-4 sm:gap-6 p-2">
              
              {/* Dashed trajectory curve and Paper Airplane */}
              <div className="relative flex flex-col items-center justify-center shrink-0">
                <div className="absolute -left-12 -bottom-2 w-16 h-16 pointer-events-none hidden sm:block">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 60 60" fill="none">
                    <path
                      d="M 0 50 Q 25 45 45 20"
                      stroke="#c084fc"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="relative -rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer">
                  <OrigamiPaperAirplane />
                </div>
              </div>

              {/* Vertical Benefits List (4 items) */}
              <div className="flex flex-col gap-3 sm:gap-3.5">
                
                {/* 1. Easy to share */}
                <div className="flex items-center gap-3 group transition-transform duration-200 hover:translate-x-1">
                  <div className="w-8 h-8 rounded-full bg-[#181133] border border-purple-500/80 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.3)] group-hover:border-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all">
                    <Share2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-200 group-hover:text-white transition-colors">
                    Easy to share
                  </span>
                </div>

                {/* 2. Looks professional */}
                <div className="flex items-center gap-3 group transition-transform duration-200 hover:translate-x-1">
                  <div className="w-8 h-8 rounded-full bg-[#082218] border border-emerald-500/80 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)] group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-200 group-hover:text-white transition-colors">
                    Looks professional
                  </span>
                </div>

                {/* 3. Saves characters */}
                <div className="flex items-center gap-3 group transition-transform duration-200 hover:translate-x-1">
                  <div className="w-8 h-8 rounded-full bg-[#261e08] border border-amber-500/80 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.3)] group-hover:border-amber-400 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all">
                    <FileText className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-200 group-hover:text-white transition-colors">
                    Saves characters
                  </span>
                </div>

                {/* 4. Trackable (optional) */}
                <div className="flex items-center gap-3 group transition-transform duration-200 hover:translate-x-1">
                  <div className="w-8 h-8 rounded-full bg-[#082029] border border-cyan-400/80 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.3)] group-hover:border-cyan-300 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-200 group-hover:text-white transition-colors">
                    Trackable (optional)
                  </span>
                </div>

              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-slate-900 py-3 text-center text-xs text-slate-500">
        <p>Curl &copy; 2026 — Fast, secure, and privacy-conscious link management.</p>
      </footer>
    </div>
  );
}
