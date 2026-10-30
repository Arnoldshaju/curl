'use client';

import React from 'react';
import Link from 'next/link';
import { Link2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-500 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Link2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-semibold text-slate-200">Curl</span>
          <span className="text-slate-600">|</span>
          <span>&copy; 2026 Curl. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="hover:text-slate-300 transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="hover:text-slate-300 transition-colors">
            Create Account
          </Link>
          <Link href="/dashboard" className="hover:text-slate-300 transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
