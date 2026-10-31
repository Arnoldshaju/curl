import React from 'react';

export function CurlLogoMark({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="curl-logo-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#curl-logo-bg)" />
      <g transform="rotate(-45 32 32)">
        {/* Left C facing right into center */}
        <path
          d="M 28 24.5 L 19 24.5 A 7.5 7.5 0 0 0 19 39.5 L 28 39.5"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right C facing left into center */}
        <path
          d="M 36 24.5 L 45 24.5 A 7.5 7.5 0 0 1 45 39.5 L 36 39.5"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Center link connecting the two Cs */}
        <line
          x1="25"
          y1="32"
          x2="39"
          y2="32"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export default CurlLogoMark;
