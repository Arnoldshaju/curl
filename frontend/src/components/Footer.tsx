'use client';

import React from 'react';
import Link from 'next/link';
import { Link2, Shield, Zap, GitBranch, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Link2 className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">LinkForge</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Production-grade, privacy-conscious URL shortening and analytics platform built independently with Django, PostgreSQL, Redis, Celery, and Next.js.
          </p>
          <div className="text-xs text-slate-400">
            &copy; 2026 Arnold Shaju. Open source under MIT License.
          </div>
        </div>

        {/* Product & Docs */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Architecture</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="http://localhost:8000/api/docs/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                OpenAPI / Swagger UI
              </a>
            </li>
            <li>
              <a href="http://localhost:8000/api/schema/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                OpenAPI 3.0 Schema
              </a>
            </li>
            <li>
              <a href="http://localhost:8000/api/health/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Live Health Check
              </a>
            </li>
            <li>
              <span className="text-slate-400">Async Celery Workers</span>
            </li>
          </ul>
        </div>

        {/* Security & Core Values */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Engineering Highlights</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Anti-SSRF Protection</span>
            </li>
            <li className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Redis Sub-Millisecond Cache</span>
            </li>
            <li className="flex items-center gap-2">
              <GitBranch className="w-3.5 h-3.5 text-blue-400" />
              <span>Collision-Resistant Writes</span>
            </li>
            <li className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              <span>Hashed SHA-256 IP Privacy</span>
            </li>
          </ul>
        </div>

        {/* Project Links & Independence */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Attribution & Origin</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Architecturally inspired by the educational questions explored in YourCloudDude&apos;s serverless project, implemented cleanly from the ground up as a full-stack system.
          </p>
          <div className="flex gap-3 text-xs">
            <Link href="/login" className="text-blue-400 hover:text-blue-300">
              Sign In &rarr;
            </Link>
            <Link href="/register" className="text-blue-400 hover:text-blue-300">
              Register &rarr;
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
