import type { Metadata } from 'next';
import '../assets/styles/globals.css';

export const metadata: Metadata = {
  title: 'ガゾウツナゲール',
  description: '複数の画像を1つにつなげる無料オンラインツール',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
