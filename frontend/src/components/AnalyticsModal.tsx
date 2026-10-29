'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  BarChart3,
  Globe,
  Smartphone,
  Laptop,
  Compass,
  Clock,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { api } from '@/lib/api';
import { ShortenedURL, AnalyticsSummary } from '@/lib/types';

interface AnalyticsModalProps {
  link: ShortenedURL | null;
  onClose: () => void;
}

export default function AnalyticsModal({ link, onClose }: AnalyticsModalProps) {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (link) {
      setIsLoading(true);
      setError(null);
      api.links
        .getAnalytics(link.id)
        .then((res) => {
          setData(res);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to load analytics.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [link]);

  if (!link) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Link Analytics</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  /{link.effective_code}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-sm sm:max-w-md">
                Destination: {link.original_url}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
              <p className="text-sm text-slate-400 font-medium">Aggregating telemetry and visitor records...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
              {error}
            </div>
          ) : data ? (
            <>
              {/* Stats Overview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Total Clicks
                  </div>
                  <div className="text-2xl font-black text-white">{data.total_clicks}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" /> Top Referrer
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    {data.clicks_by_referrer[0]?.referrer_domain || 'Direct'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
                    <Smartphone className="w-3.5 h-3.5 text-purple-400" /> Primary Device
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    {data.clicks_by_device[0]?.device_category || 'Desktop'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
                    <Compass className="w-3.5 h-3.5 text-amber-400" /> Top Browser
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    {data.clicks_by_browser[0]?.browser || 'Unknown'}
                  </div>
                </div>
              </div>

              {/* Clicks Timeline Chart */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" /> Clicks Over Time (Last 30 Days)
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">
                    {data.clicks_over_time.length} active days recorded
                  </span>
                </div>

                {data.clicks_over_time.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No click activity recorded yet in this period.
                  </div>
                ) : (
                  <div className="h-44 flex items-end gap-2 pt-6 pb-2 px-2 overflow-x-auto">
                    {data.clicks_over_time.map((item, idx) => {
                      const maxClicks = Math.max(...data.clicks_over_time.map((d) => d.count), 1);
                      const heightPercent = Math.max((item.count / maxClicks) * 100, 10);
                      return (
                        <div key={idx} className="flex-1 min-w-[36px] flex flex-col items-center gap-2 group">
                          <span className="text-[10px] font-mono font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.count}
                          </span>
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:from-blue-400 group-hover:to-indigo-400 transition-all shadow-md"
                          />
                          <span className="text-[9px] font-mono text-slate-400 truncate w-full text-center">
                            {item.date.slice(5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Breakdown Grid: Devices & Browsers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Devices */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-purple-400" /> Devices
                  </h4>
                  {data.clicks_by_device.length === 0 ? (
                    <div className="text-xs text-slate-500 py-4 text-center">No device data</div>
                  ) : (
                    <div className="space-y-3">
                      {data.clicks_by_device.map((dev, i) => {
                        const total = data.total_clicks || 1;
                        const pct = Math.round((dev.count / total) * 100);
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-300 font-medium">{dev.device_category}</span>
                              <span className="text-slate-400 font-mono">
                                {dev.count} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                style={{ width: `${pct}%` }}
                                className="h-full bg-purple-500 rounded-full"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Referrers */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" /> Top Referrers
                  </h4>
                  {data.clicks_by_referrer.length === 0 ? (
                    <div className="text-xs text-slate-500 py-4 text-center">No referrer data</div>
                  ) : (
                    <div className="space-y-3">
                      {data.clicks_by_referrer.map((ref, i) => {
                        const total = data.total_clicks || 1;
                        const pct = Math.round((ref.count / total) * 100);
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-300 font-medium truncate max-w-[200px]">
                                {ref.referrer_domain}
                              </span>
                              <span className="text-slate-400 font-mono">
                                {ref.count} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                style={{ width: `${pct}%` }}
                                className="h-full bg-emerald-500 rounded-full"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Click Event Log */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Privacy-Anonymized Click Activity
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    SHA-256 Hashed IPs (GDPR Safe)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-2.5 font-semibold">Timestamp</th>
                        <th className="pb-2.5 font-semibold">Device</th>
                        <th className="pb-2.5 font-semibold">Browser / OS</th>
                        <th className="pb-2.5 font-semibold">Referrer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {data.recent_clicks.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-500 font-sans">
                            No clicks recorded yet. Share your short link to view incoming traffic!
                          </td>
                        </tr>
                      ) : (
                        data.recent_clicks.map((click) => (
                          <tr key={click.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="py-2.5 text-slate-400">
                              {new Date(click.clicked_at).toLocaleString()}
                            </td>
                            <td className="py-2.5 text-slate-300">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-sans font-medium">
                                {click.device_category}
                              </span>
                            </td>
                            <td className="py-2.5 text-slate-300 font-sans">
                              {click.browser} on {click.os}
                            </td>
                            <td className="py-2.5 text-slate-400 truncate max-w-[150px]">
                              {click.referrer_domain}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
