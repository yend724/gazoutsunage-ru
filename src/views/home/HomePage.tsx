import { Suspense } from 'react';
import { ImageComposer } from '@/features/image-composer';
import { ErrorBoundary } from '@/features/image-composer/components/error-boundary';
import { LoadingSpinner } from '@/shared/components';

function ImageComposerLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">ガゾウツナゲールを準備中...</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ImageComposerLoading />}>
        <ImageComposer />
      </Suspense>
    </ErrorBoundary>
  );
}
