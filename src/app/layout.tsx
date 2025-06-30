import type { Metadata } from 'next';
import '../assets/styles/globals.css';

export const metadata: Metadata = {
  title: 'ガゾウツナゲール - 複数画像を簡単結合',
  description:
    '複数の画像を1つにつなげる無料オンラインツール。ドラッグ&ドロップで簡単操作。横並び・縦並び・グリッド配置に対応。ブラウザ内で処理が完結するためプライバシーも安心。',
  keywords: [
    '画像結合',
    '画像つなげる',
    '画像編集',
    'オンラインツール',
    '無料',
    'ガゾウツナゲール',
  ],
  authors: [{ name: 'yend724' }],
  creator: 'yend724',
  publisher: 'yend724',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'ガゾウツナゲール - 複数画像を簡単結合',
    description:
      '複数の画像を1つにつなげる無料オンラインツール。ドラッグ&ドロップで簡単操作。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'ガゾウツナゲール',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ガゾウツナゲール - 複数画像を簡単結合',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ガゾウツナゲール - 複数画像を簡単結合',
    description:
      '複数の画像を1つにつなげる無料オンラインツール。ドラッグ&ドロップで簡単操作。',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self';"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
