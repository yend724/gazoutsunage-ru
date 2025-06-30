'use client';

import { useState, useCallback, useEffect } from 'react';
import { tv } from 'tailwind-variants';
import Image from 'next/image';
import { useImageContext } from '@/entities/image';
import { useComposeSettingsContext, ImageUploader, ComposerSettings, composeImages } from '@/features/compose-images';
import { Button } from '@/shared/components/button';
import { Alert } from '@/shared/components/alert';
import { LoadingSpinner } from '@/shared/components/loading-spinner';
import { OptimizedImage } from '@/shared/components/optimized-image';

const composerStyles = tv({
  slots: {
    container: 'max-w-screen-xl mx-auto px-4 py-12',
    card: 'bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100',
    title: 'text-2xl font-bold text-gray-900 mb-6',
    previewGrid: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6',
    previewItem: 'relative group',
    previewImage: 'w-full h-32 object-cover rounded-xl shadow-md',
    removeButton: 'absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors',
    resultSection: 'mt-8 text-center',
    resultImage: 'max-w-full h-auto rounded-xl shadow-lg mx-auto',
    downloadLink: 'inline-flex items-center gap-2 mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors',
    loadingContainer: 'flex items-center justify-center p-8',
  },
});

export const ImageComposerWidget: React.FC = () => {
  const styles = composerStyles();
  const { images, removeImage, clearImages } = useImageContext();
  const { settings } = useComposeSettingsContext();
  const [composedImageUrl, setComposedImageUrl] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (composedImageUrl) {
        URL.revokeObjectURL(composedImageUrl);
      }
    };
  }, [composedImageUrl]);

  const handleCompose = useCallback(async () => {
    if (images.length === 0) {
      setError('画像を選択してください');
      return;
    }

    setIsComposing(true);
    setError(null);

    try {
      const blob = await composeImages(images, settings);
      const url = URL.createObjectURL(blob);
      
      if (composedImageUrl) {
        URL.revokeObjectURL(composedImageUrl);
      }
      
      setComposedImageUrl(url);
    } catch (err) {
      console.error('画像の合成に失敗しました:', err);
      setError(err instanceof Error ? err.message : '画像の合成中にエラーが発生しました');
    } finally {
      setIsComposing(false);
    }
  }, [images, settings, composedImageUrl]);

  const handleReset = useCallback(() => {
    if (composedImageUrl) {
      URL.revokeObjectURL(composedImageUrl);
      setComposedImageUrl(null);
    }
    clearImages();
    setError(null);
  }, [composedImageUrl, clearImages]);

  return (
    <div className={styles.container()}>
      <div className={styles.card()}>
        <h2 className={styles.title()}>画像をアップロード</h2>
        <ImageUploader onError={setError} />
      </div>

      {images.length > 0 && (
        <>
          <div className={styles.card()}>
            <h2 className={styles.title()}>アップロードした画像</h2>
            <div className={styles.previewGrid()}>
              {images.map((image) => (
                <div key={image.id} className={styles.previewItem()}>
                  <OptimizedImage
                    src={image.url}
                    alt={image.file.name}
                    className={styles.previewImage()}
                  />
                  <button
                    className={styles.removeButton()}
                    onClick={() => removeImage(image.id)}
                    aria-label={`${image.file.name}を削除`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card()}>
            <h2 className={styles.title()}>設定</h2>
            <ComposerSettings />
          </div>

          <div className="text-center space-x-4 mb-8">
            <Button
              onClick={handleCompose}
              disabled={isComposing}
              variant="primary"
            >
              {isComposing ? '合成中...' : '画像を合成'}
            </Button>
            <Button
              onClick={handleReset}
              variant="secondary"
            >
              リセット
            </Button>
          </div>
        </>
      )}

      {error && (
        <div className="mt-4">
          <Alert variant="error" message={error} />
        </div>
      )}

      {isComposing && (
        <div className={styles.loadingContainer()}>
          <LoadingSpinner size="lg" />
        </div>
      )}

      {composedImageUrl && !isComposing && (
        <div className={styles.card()}>
          <h2 className={styles.title()}>合成結果</h2>
          <div className={styles.resultSection()}>
            <Image
              src={composedImageUrl}
              alt="合成された画像"
              className={styles.resultImage()}
              width={800}
              height={600}
              unoptimized
            />
            <a
              href={composedImageUrl}
              download="composed-image.png"
              className={styles.downloadLink()}
            >
              ダウンロード
            </a>
          </div>
        </div>
      )}
    </div>
  );
};