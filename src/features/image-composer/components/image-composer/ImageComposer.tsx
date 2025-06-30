'use client';

import { memo } from 'react';
import { Card } from '@/shared/components';
import { ComposerLayout } from '../composer-layout';
import { ImageManagement } from '../image-management';
import { ResultDisplay } from '../result-display';
import { ComposerSettings } from '../composer-settings';
import { useImageComposer } from '../../hooks';

const ImageComposerComponent: React.FC = () => {
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
    clearError,
    handleError,
  } = useImageComposer();

  return (
    <ComposerLayout error={error} onClearError={clearError}>
      <ImageManagement
        images={images}
        isComposing={isComposing}
        canCompose={canCompose}
        canReset={canReset}
        onImagesUploaded={handleImagesUploaded}
        onError={handleError}
        onRemoveImage={handleRemoveImage}
        onReorderImages={handleReorderImages}
        onCompose={handleCompose}
        onReset={handleReset}
      />

      <Card title="合成設定">
        <ComposerSettings settings={settings} onChange={setSettings} />
      </Card>

      {composedImageUrl && (
        <ResultDisplay
          composedImageUrl={composedImageUrl}
          onDownload={handleDownload}
        />
      )}
    </ComposerLayout>
  );
};

export const ImageComposer = memo(ImageComposerComponent);
