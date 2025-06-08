'use client';

import { tv } from 'tailwind-variants';
import { ImageUploader } from '../image-uploader';
import { ImagePreview } from '../image-preview';
import { ComposerSettings } from '../composer-settings';
import {
  Button,
  Card,
  LoadingSpinner,
  OptimizedImage,
} from '../../../../shared/components';
import { useImageComposer } from '../../hooks';

const composerStyles = tv({
  slots: {
    container: 'max-w-7xl mx-auto p-6 space-y-10',
    header: 'text-center mb-12',
    title: 'text-3xl font-bold text-gray-800 mb-4',
    subtitle: 'text-lg text-gray-600 font-medium',
    content: 'grid grid-cols-1 lg:grid-cols-3 gap-8',
    mainSection: 'lg:col-span-2 space-y-8',
    sideSection: 'space-y-8',
    buttonContainer: 'flex gap-4 flex-wrap mt-6',
    previewContainer:
      'mt-6 overflow-auto max-h-96 max-w-full border-2 border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-gray-50 to-white',
    previewImage: 'block rounded-xl shadow-2xl border border-white/50',
  },
});

export function ImageComposer() {
  const styles = composerStyles();
  const {
    images,
    settings,
    composedImageUrl,
    isComposing,
    error,
    canCompose,
    canReset,
    handleImagesUploaded,
    handleRemoveImage,
    handleReorderImages,
    handleCompose,
    handleDownload,
    handleReset,
    setSettings,
  } = useImageComposer();

  return (
    <div className={styles.container()}>
      <header className={styles.header()}>
        <h1 className={styles.title()}>
          <span className="inline-flex items-center gap-3">
            <svg 
              width="36" 
              height="36" 
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <rect width="32" height="32" rx="8" fill="#475569"/>
              <rect x="3" y="10" width="8" height="12" rx="2" fill="#FFFFFF"/>
              <rect x="21" y="10" width="8" height="12" rx="2" fill="#FFFFFF"/>
              <path d="M14 16 L18 16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M16 14 L16 18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            ガゾウツナゲール
          </span>
        </h1>
        <p className={styles.subtitle()}>複数の画像を1つにつなげます</p>
      </header>

      <div className={styles.content()}>
        <div className={styles.mainSection()}>
          <Card title="画像をアップロード">
            <ImageUploader onImagesUploaded={handleImagesUploaded} />
          </Card>

          <aside className={`${styles.sideSection()} lg:hidden`}>
            <Card>
              <ComposerSettings settings={settings} onChange={setSettings} />
            </Card>
          </aside>

          {images.length > 0 && (
            <Card title={`アップロードされた画像 (${images.length}枚)`}>
              <ImagePreview
                images={images}
                onRemove={handleRemoveImage}
                onReorder={handleReorderImages}
              />
              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-800">
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <div className={styles.buttonContainer()}>
                <Button
                  variant="primary"
                  onClick={handleCompose}
                  disabled={!canCompose}
                  aria-busy={isComposing}
                >
                  {isComposing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2 inline" />
                      合成中...
                    </>
                  ) : (
                    '画像を合成'
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleReset}
                  disabled={!canReset}
                >
                  リセット
                </Button>
              </div>
            </Card>
          )}

          {composedImageUrl && (
            <Card title="合成結果">
              <div className={styles.previewContainer()}>
                <OptimizedImage
                  src={composedImageUrl}
                  alt="合成された画像"
                  className={styles.previewImage()}
                />
              </div>
              <div className={styles.buttonContainer()}>
                <Button variant="primary" onClick={handleDownload}>
                  ダウンロード
                </Button>
              </div>
            </Card>
          )}
        </div>

        <aside className={`${styles.sideSection()} hidden lg:block`}>
          <Card>
            <ComposerSettings settings={settings} onChange={setSettings} />
          </Card>
        </aside>
      </div>
    </div>
  );
}
