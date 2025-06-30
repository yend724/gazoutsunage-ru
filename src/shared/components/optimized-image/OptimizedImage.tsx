'use client';

import { memo, useState } from 'react';
import Image from 'next/image';
import { LoadingSpinner } from '../loading-spinner';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImageComponent: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={`画像読み込みエラー: ${alt}`}
      >
        <span className="text-sm">画像を読み込めませんでした</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${className}`}
          style={{ width, height }}
        >
          <LoadingSpinner size="sm" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width || 0}
        height={height || 0}
        className={`${className} ${isLoading ? 'invisible' : 'visible'}`}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        unoptimized
      />
    </div>
  );
};

export const OptimizedImage = memo(OptimizedImageComponent);
