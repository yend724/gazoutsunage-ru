import type { Metadata } from 'next'

import '../shared/styles/globals.css'

export const metadata: Metadata = {
  title: 'ガゾウツナゲール',
  description: '複数の画像を簡単に結合できるWebアプリケーション',
}

type RootLayoutProps = {
  readonly children: React.ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="ja" className="dark-theme">
      <body className="min-h-screen bg-gray-1 text-gray-12">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-12">ガゾウツナゲール</h1>
            <p className="mt-2 text-gray-11">複数の画像を簡単に結合</p>
          </header>

          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}

export default RootLayout
