'use client';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="ja">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="mx-auto max-w-md text-center">
            <h1 className="mb-4 text-2xl font-bold">
              システムエラーが発生しました
            </h1>
            <p className="mb-6 text-gray-600">
              申し訳ございません。システムエラーが発生しました。
              しばらく時間をおいてから再度お試しください。
            </p>
            <button
              onClick={reset}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              再試行する
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
