'use client';

import React from 'react';
import Link from 'next/link';
import { CurlLogoMark } from './CurlLogoMark';

export default function Footer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <footer className="w-full border-t border-white/5 py-2 sm:py-2.5 px-6 bg-transparent text-neutral-400 shrink-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs text-neutral-500">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
          >
            <CurlLogoMark className="w-4 h-4" />
            <span>Curl</span>
          </Link>
          <span className="hidden sm:inline text-neutral-500">
            Short links. Real insights. Built for makers.
          </span>
          <span>&copy; 2026 Curl</span>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/5 py-12 bg-transparent text-neutral-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 text-center lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-[21px] font-semibold leading-6 tracking-tight text-white hover:opacity-90 transition-opacity"
        >
          <CurlLogoMark className="w-6 h-6" />
          <span>Curl</span>
        </Link>
        <p className="text-sm text-neutral-400">
          Short links. Real insights. Built for makers and solo operators.
        </p>
        <p className="text-xs text-neutral-500">
          &copy; 2026 Curl. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
