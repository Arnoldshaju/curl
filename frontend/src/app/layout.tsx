import type { Metadata } from 'next';
import { Figtree, Geist_Mono, Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/components/Toast';

const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Curl — URL Shortener',
  description:
    'A complete URL shortener with custom slugs, click analytics, and referrer tracking.',
  keywords: ['URL shortener', 'Link management', 'Analytics', 'Curl', 'Next.js', 'Django', 'Redis', 'PostgreSQL'],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${figtree.variable} ${outfit.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-black text-white font-sans antialiased selection:bg-[#00a8ff] selection:text-black flex flex-col relative">
        <AuthProvider>
          <ToastProvider>
            <div className="relative z-10 flex flex-col min-h-screen">
              {children}
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
