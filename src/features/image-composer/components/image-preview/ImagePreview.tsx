'use client';

import { useState, memo, useCallback } from 'react';
import { tv } from 'tailwind-variants';
import { OptimizedImage } from '../../../../shared/components';
import type { UploadedImage } from '../../types';

const imagePreviewStyles = tv({
  slots: {
    container: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6',
    item: 'relative group cursor-move bg-white/80 backdrop-blur-sm rounded-2xl p-3 transition-all duration-300 hover:shadow-xl border border-white/30',
    dragging: 'opacity-70 transform scale-95 z-10 rotate-3',
    dragOver:
      'border-2 border-slate-400 border-dashed bg-slate-50/80 transform scale-105',
    image: 'w-full h-32 object-cover rounded-xl pointer-events-none shadow-md',
    removeButton:
      'absolute -top-2 -right-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:from-red-500 hover:to-red-600 z-20 shadow-lg',
    info: 'text-sm text-gray-600 mt-2 text-center font-medium',
    orderIndicator:
      'absolute -top-2 -left-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg z-20',
  },
});

interface ImagePreviewProps {
  images: UploadedImage[];
  onRemove: (id: string) => void;
  onReorder: (dragIndex: number, dropIndex: number) => void;
}

const ImagePreviewItem = memo(function ImagePreviewItem({
  image,
  index,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onRemove,
  styles,
}: {
  image: UploadedImage;
  index: number;
  isDragging: boolean;
  isDragOver: boolean;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onRemove: (id: string) => void;
  styles: ReturnType<typeof imagePreviewStyles>;
}) {
  return (
    <div
      className={`${styles.item()} ${isDragging ? styles.dragging() : ''} ${
        isDragOver ? styles.dragOver() : ''
      }`}
      draggable
      onDragStart={e => onDragStart(e, index)}
      onDragOver={e => onDragOver(e, index)}
      onDragLeave={onDragLeave}
      onDrop={e => onDrop(e, index)}
      onDragEnd={onDragEnd}
    >
      <div className="relative">
        <div className={styles.orderIndicator()}>{index + 1}</div>
        <OptimizedImage
          src={image.url}
          alt={`アップロード画像 ${index + 1}`}
          className={styles.image()}
          loading="lazy"
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
  );
});

export const ImagePreview = memo(function ImagePreview({
  images,
  onRemove,
  onReorder,
}: ImagePreviewProps) {
  const styles = imagePreviewStyles();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      if (draggedIndex !== null && draggedIndex !== dropIndex) {
        onReorder(draggedIndex, dropIndex);
      }
      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [draggedIndex, onReorder]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  if (images.length === 0) return null;

  return (
    <div className={styles.container()}>
      {images.map((image, index) => (
        <ImagePreviewItem
          key={image.id}
          image={image}
          index={index}
          isDragging={draggedIndex === index}
          isDragOver={dragOverIndex === index}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onRemove={onRemove}
          styles={styles}
        />
      ))}
    </div>
  );
});
