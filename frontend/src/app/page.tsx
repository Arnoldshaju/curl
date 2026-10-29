import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PublicShortener from '@/components/PublicShortener';
import {
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  ArrowRight,
  Database,
  Lock,
  Globe2,
  RefreshCw,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Production-Minded URL Shortening & Telemetry
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
              Forge Short Links.{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Own Your Traffic.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
              An enterprise-grade URL shortener platform with collision-resistant routing, sub-millisecond Redis caching, anti-SSRF defenses, and privacy-respecting analytics.
            </p>

            {/* Live Interactive Shortener */}
            <PublicShortener />
          </div>
        </section>

        {/* 3 STEPS HOW IT WORKS */}
        <section className="py-20 bg-slate-950 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Workflow</h2>
              <h3 className="text-3xl font-extrabold text-white">How LinkForge Works</h3>
              <p className="text-slate-400 text-sm mt-3">
                Architected from the ground up for speed, reliability, and security at scale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative group hover:border-slate-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Validate & Verify</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Every submitted destination undergoes scheme checks and anti-SSRF network validation to eliminate internal network probing and metadata tampering.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative group hover:border-slate-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-sm mb-4">
                  02
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Allocate Short Code</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Cryptographically random Base62 codes or branded custom aliases are reserved with atomic database checks, preventing race conditions or silent overwrites.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative group hover:border-slate-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-sm mb-4">
                  03
                </div>
                <h4 className="text-lg font-bold text-white mb-2">High-Speed Redirect</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Subsequent visitors hit in-memory Redis caches for instantaneous 302 redirects. Click events are decoupled asynchronously into Celery task workers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CORE CAPABILITIES & ENGINEERING ARCHITECTURE */}
        <section className="py-24 bg-slate-900/40 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Engineering Pillars</h2>
              <h3 className="text-3xl font-extrabold text-white">Built for True Production Demands</h3>
              <p className="text-slate-400 text-sm mt-3">
                Going beyond textbook tutorials by addressing collision safety, privacy, and decoupled background workers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Sub-Millisecond Redirects</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Resolved links are automatically cached in Redis with instant invalidation upon link update or deletion, ensuring blazing response times.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Anti-SSRF Protection</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Protects internal services by actively resolving hostnames and blacklisting loopback, private IPv4/IPv6 CIDRs, and AWS EC2 metadata endpoints.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Decoupled Telemetry</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Click analytics tasks are queued via Celery. Database metrics calculations never impede or delay the redirect hot path.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-amber-600/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Privacy-First Analytics</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Raw visitor IP addresses are never stored in plaintext. They are one-way hashed with a cryptographic salt (SHA-256) for privacy and GDPR compliance.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-rose-600/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mb-4">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Collision Handling</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Transactional integrity with deterministic retries guarantees that two simultaneous requests will never overwrite each other&apos;s link.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Custom Aliases & Expiration</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Support for branded aliases, active/pause toggles, and deterministic expiration returning HTTP 410 Gone when a link expires.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="py-20 bg-slate-950 border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-white">How LinkForge Compares</h3>
              <p className="text-xs text-slate-400 mt-1">Real production engineering decisions vs basic tutorial code</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold uppercase text-slate-400">
                    <th className="py-4 px-6">Capability</th>
                    <th className="py-4 px-6 text-slate-400">Basic Shorteners</th>
                    <th className="py-4 px-6 text-blue-400 font-bold">LinkForge Platform</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-white">Short Code Collision</td>
                    <td className="py-3.5 px-6 text-slate-400">Silent overwrite or fatal 500 error</td>
                    <td className="py-3.5 px-6 text-emerald-400 font-medium">Atomic check with retry loop</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-white">SSRF Security</td>
                    <td className="py-3.5 px-6 text-slate-400">Allows loopback & cloud metadata</td>
                    <td className="py-3.5 px-6 text-emerald-400 font-medium">DNS resolution & IP blocklisting</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-white">Click Analytics Impact</td>
                    <td className="py-3.5 px-6 text-slate-400">Blocks redirect on sync DB write</td>
                    <td className="py-3.5 px-6 text-emerald-400 font-medium">Decoupled via Celery async workers</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-white">Link Expiration</td>
                    <td className="py-3.5 px-6 text-slate-400">None, or dependent on lazy TTL deletion</td>
                    <td className="py-3.5 px-6 text-emerald-400 font-medium">Application-level 410 Gone verification</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-6 font-medium text-white">Visitor Privacy</td>
                    <td className="py-3.5 px-6 text-slate-400">Stores raw IP addresses</td>
                    <td className="py-3.5 px-6 text-emerald-400 font-medium">Salted SHA-256 hashed anonymization</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="py-20 bg-gradient-to-tr from-blue-950/40 via-slate-900 to-indigo-950/40 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to take control of your links?
            </h3>
            <p className="text-slate-300 max-w-xl mx-auto mb-8 text-sm sm:text-base">
              Create an account now to start tracking click telemetry, setting custom aliases, and managing your shortened links with a dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-medium text-sm transition-colors"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
