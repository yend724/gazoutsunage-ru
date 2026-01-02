import type { Metadata } from 'next'
import { Theme } from '@radix-ui/themes'

import '../shared/styles/globals.css'

export const metadata: Metadata = {
  title: 'ガゾウツナゲール',
  description: '複数の画像を簡単に結合できるWebアプリケーション',
  openGraph: {
    title: 'ガゾウツナゲール',
    description: '複数の画像を簡単に結合できるWebアプリケーション',
    url: 'https://gazoutsunage-ru.yend.dev/',
    images: [
      {
        url: 'https://gazoutsunage-ru.yend.dev/img/ogp.png',
        width: 1280,
        height: 720,
        alt: 'ガゾウツナゲール - 複数の画像を簡単に結合',
      },
    ],
    siteName: 'ガゾウツナゲール',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ガゾウツナゲール',
    description: '複数の画像を簡単に結合できるWebアプリケーション',
    images: ['/img/ogp.png'],
  },
}

type RootLayoutProps = {
  readonly children: React.ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="ja" className="dark-theme">
      <body className="min-h-screen bg-gray-1 text-gray-12">
        <Theme>
          <div className="container mx-auto px-4 py-12">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-12">ガゾウツナゲール</h1>
              <p className="mt-2 text-gray-11">複数の画像を簡単に結合</p>
            </header>

            <main>{children}</main>
          </div>
        </Theme>
      </body>
    </html>
  )
}

export default RootLayout
