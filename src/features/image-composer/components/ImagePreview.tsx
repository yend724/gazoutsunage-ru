'use client';

import Image from 'next/image';
import { tv } from 'tailwind-variants';
import type { UploadedImage } from '../types';

const imagePreviewStyles = tv({
  slots: {
    container: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
    item: 'relative group',
    image: 'w-full h-32 object-cover rounded-lg',
    removeButton: 'absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600',
    info: 'text-xs text-gray-600 mt-1 text-center'
  }
});

interface ImagePreviewProps {
  images: UploadedImage[];
  onRemove: (id: string) => void;
}

export function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  const styles = imagePreviewStyles();

  if (images.length === 0) return null;

  return (
    <div className={styles.container()}>
      {images.map((image) => (
        <div key={image.id} className={styles.item()}>
          <div className="relative">
            <img
              src={image.url}
              alt={`アップロード画像 ${image.order + 1}`}
              className={styles.image()}
            />
            <button
              type="button"
              className={styles.removeButton()}
              onClick={() => onRemove(image.id)}
              aria-label="画像を削除"
            >
              ×
            </button>
          </div>
          <p className={styles.info()}>
            {image.width} × {image.height}
          </p>
        </div>
      ))}
    </div>
  );
}