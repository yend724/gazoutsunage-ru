'use client';

import { useCallback } from 'react';
import { tv } from 'tailwind-variants';
import type { UploadedImage } from '../types';

const imageUploaderStyles = tv({
  slots: {
    container: 'w-full',
    dropzone: 'border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-gray-400 hover:bg-gray-50',
    dropzoneActive: 'border-blue-500 bg-blue-50',
    input: 'hidden',
    text: 'text-gray-600',
    button: 'mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
  }
});

interface ImageUploaderProps {
  onImagesUploaded: (images: UploadedImage[]) => void;
}

export function ImageUploader({ onImagesUploaded }: ImageUploaderProps) {
  const styles = imageUploaderStyles();

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const newImages: UploadedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const url = URL.createObjectURL(file);
      const img = new Image();
      
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = url;
      });

      newImages.push({
        id: `${Date.now()}-${i}`,
        file,
        url,
        width: img.width,
        height: img.height,
        order: i
      });
    }

    onImagesUploaded(newImages);
  }, [onImagesUploaded]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className={styles.container()}>
      <div
        className={styles.dropzone()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('image-input')?.click()}
      >
        <p className={styles.text()}>
          画像をドラッグ＆ドロップするか、クリックして選択してください
        </p>
        <p className="text-sm text-gray-500 mt-2">
          複数の画像を選択できます
        </p>
        <button
          type="button"
          className={styles.button()}
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById('image-input')?.click();
          }}
        >
          画像を選択
        </button>
      </div>
      <input
        id="image-input"
        type="file"
        multiple
        accept="image/*"
        className={styles.input()}
        onChange={(e) => handleFileChange(e.target.files)}
      />
    </div>
  );
}