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
import { Header } from '@/shared/components/header';

const composerStyles = tv({
  slots: {
    container: 'max-w-7xl mx-auto p-6 grid gap-8',
    mainSection: 'grid gap-8',
    buttonContainer: 'flex gap-4 flex-wrap mt-6',
    previewContainer:
      'mt-6 overflow-auto max-h-96 max-w-full border-2 border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-gray-50 to-white',
    previewImage: 'block rounded-xl shadow-2xl border border-white/50',
  },
});

export const ImageComposer: React.FC = () => {
  const styles = composerStyles();
  const {
    images,
    settings,
    composedImageUrl,
    isComposing,
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
      <Header />

      <div className={styles.mainSection()}>
        <Card title="画像をアップロード">
          <ImageUploader onImagesUploaded={handleImagesUploaded} />
        </Card>

        <Card title="合成設定">
          <ComposerSettings settings={settings} onChange={setSettings} />
        </Card>

        {images.length > 0 && (
          <Card title={`アップロードされた画像 (${images.length}枚)`}>
            <ImagePreview
              images={images}
              onRemove={handleRemoveImage}
              onReorder={handleReorderImages}
            />
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
    </div>
  );
};
