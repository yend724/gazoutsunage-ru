'use client';

import { useCallback } from 'react';
import { tv } from 'tailwind-variants';
import type { UploadedImage } from '../../types';

const imageUploaderStyles = tv({
  slots: {
    container: 'w-full',
    dropzone: 'border-3 border-dashed border-purple-200 rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 hover:border-purple-300 hover:bg-purple-50/50 backdrop-blur-sm',
    dropzoneActive: 'border-purple-400 bg-purple-100/70 transform scale-[1.02]',
    input: 'hidden',
    text: 'text-gray-700 text-lg font-medium',
    button: 'mt-6 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/25 font-semibold cursor-pointer'
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