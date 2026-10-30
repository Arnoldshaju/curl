'use client';

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Download, ExternalLink } from 'lucide-react';
import { ShortenedURL } from '@/lib/types';

interface QrCodeModalProps {
  link: ShortenedURL | null;
  onClose: () => void;
}

export default function QrCodeModal({ link, onClose }: QrCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (link && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        link.short_url,
        {
          width: 260,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('QR code generation error:', error);
        }
      );
    }
  }, [link]);

  if (!link) return null;

  const downloadQr = () => {
    if (!canvasRef.current) return;
    const pngUrl = canvasRef.current.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `curl-qr-${link.effective_code}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-1">QR Code</h3>
          <p className="text-sm text-slate-400 truncate max-w-xs mx-auto">
            {link.title || link.effective_code}
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white rounded-2xl shadow-inner border border-slate-200">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-blue-400 truncate mr-2">{link.short_url}</span>
            <a
              href={link.short_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white flex items-center gap-1 shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex gap-3">
            <button
              onClick={downloadQr}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
