'use client';

import { memo } from 'react';
import { tv } from 'tailwind-variants';
import { Button, Card, LoadingSpinner } from '@/shared/components';
import { ImageUploader } from '../image-uploader';
import { ImagePreview } from '../image-preview';
import type { UploadedImage } from '../../types';

const imageManagementStyles = tv({
  slots: {
    buttonContainer: 'flex gap-4 flex-wrap mt-6',
  },
});

interface ImageManagementProps {
  images: UploadedImage[];
  isComposing: boolean;
  canCompose: boolean;
  canReset: boolean;
  onImagesUploaded: (images: UploadedImage[]) => void;
  onError?: (error: string) => void;
  onRemoveImage: (id: string) => void;
  onReorderImages: (dragIndex: number, dropIndex: number) => void;
  onCompose: () => void;
  onReset: () => void;
}

const ImageManagementComponent: React.FC<ImageManagementProps> = ({
  images,
  isComposing,
  canCompose,
  canReset,
  onImagesUploaded,
  onError,
  onRemoveImage,
  onReorderImages,
  onCompose,
  onReset,
}) => {
  const styles = imageManagementStyles();

  return (
    <>
      <Card title="画像をアップロード">
        <ImageUploader 
          onImagesUploaded={onImagesUploaded} 
          onError={onError}
        />
      </Card>

      {images.length > 0 && (
        <Card title={`アップロードされた画像 (${images.length}枚)`}>
          <ImagePreview
            images={images}
            onRemove={onRemoveImage}
            onReorder={onReorderImages}
          />
          <div className={styles.buttonContainer()}>
            <Button
              variant="primary"
              onClick={onCompose}
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
              onClick={onReset}
              disabled={!canReset}
            >
              リセット
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};

export const ImageManagement = memo(ImageManagementComponent);