'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { CurlLogoMark } from './CurlLogoMark';
import { LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Left: Brand Logo & Title */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[21px] font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
        >
          <CurlLogoMark className="w-6 h-6" />
          <span>Curl</span>
        </Link>

        {/* Right: Sign in or Dashboard */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-200 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-[#00a8ff]" />
                <span>Dashboard</span>
              </Link>
              <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                <span className="text-xs text-slate-400 font-medium">{user?.username}</span>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-white hover:text-white/80 transition-colors py-2 px-2"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
