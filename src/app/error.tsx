'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/components';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          エラーが発生しました
        </h1>
        <p className="mb-6 text-gray-600">
          申し訳ございません。予期しないエラーが発生しました。
        </p>
        <Button onClick={reset} variant="primary" className="mx-auto">
          再試行する
        </Button>
      </div>
    </div>
  );
}
