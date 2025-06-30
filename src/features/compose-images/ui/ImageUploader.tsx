'use client';

import { useCallback, useState, useRef } from 'react';
import { tv } from 'tailwind-variants';
import { useImageContext } from '@/entities/image';
import { Button } from '@/shared/components/button';

const imageUploaderStyles = tv({
  slots: {
    container: 'w-full',
    dropzone:
      'border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 hover:border-slate-400 hover:bg-slate-50/50 backdrop-blur-sm',
    dropzoneActive: 'border-slate-400 bg-slate-100/70 transform scale-[1.02]',
    input: 'hidden',
    text: 'text-gray-700',
  },
});

interface ImageUploaderProps {
  onError?: (error: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onError }) => {
  const styles = imageUploaderStyles();
  const { addImage } = useImageContext();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      setIsProcessing(true);
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          if (!file.type.startsWith('image/') || !validImageTypes.includes(file.type)) {
            if (onError) {
              onError(`${file.name} は対応していない画像形式です。JPEG、PNG、GIF、WebP形式の画像を使用してください。`);
            }
            continue;
          }

          if (file.size > maxFileSize) {
            if (onError) {
              onError(`${file.name} のサイズが大きすぎます。10MB以下の画像を使用してください。`);
            }
            continue;
          }

          const url = URL.createObjectURL(file);
          const img = new Image();

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
          });

          addImage({
            id: `${Date.now()}-${i}`,
            file,
            url,
            width: img.width,
            height: img.height,
            order: i,
          });
        }
      } catch (error) {
        console.error('画像の読み込みに失敗しました:', error);
        if (onError) {
          onError('画像の読み込み中にエラーが発生しました。');
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [addImage, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileChange(e.dataTransfer.files);
    },
    [handleFileChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <div className={styles.container()}>
      <div
        className={`${styles.dropzone()} ${isDragOver ? styles.dropzoneActive() : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <p className={styles.text()} id="upload-description">
          {isProcessing
            ? '画像を処理中...'
            : '画像をドラッグ＆ドロップするか、クリックして選択してください'}
        </p>
        <Button
          onClick={e => {
            e.stopPropagation();
            handleClick();
          }}
          disabled={isProcessing}
        >
          {isProcessing ? '処理中...' : '画像を選択'}
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className={styles.input()}
        onChange={e => handleFileChange(e.target.files)}
        aria-hidden="true"
      />
    </div>
  );
};