'use client';

import { useState } from 'react';
import { tv } from 'tailwind-variants';
import type { UploadedImage } from '../../types';

const imagePreviewStyles = tv({
  slots: {
    container: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6',
    item: 'relative group cursor-move bg-white/80 backdrop-blur-sm rounded-2xl p-3 transition-all duration-300 hover:shadow-xl border border-white/30',
    dragging: 'opacity-70 transform scale-95 z-10 rotate-3',
    dragOver:
      'border-2 border-purple-400 border-dashed bg-purple-50/80 transform scale-105',
    image: 'w-full h-32 object-cover rounded-xl pointer-events-none shadow-md',
    removeButton:
      'absolute -top-2 -right-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:from-red-500 hover:to-pink-600 z-20 shadow-lg',
    info: 'text-sm text-gray-600 mt-2 text-center font-medium',
    orderIndicator:
      'absolute -top-2 -left-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg',
  },
});

interface ImagePreviewProps {
  images: UploadedImage[];
  onRemove: (id: string) => void;
  onReorder: (dragIndex: number, dropIndex: number) => void;
}

export function ImagePreview({
  images,
  onRemove,
  onReorder,
}: ImagePreviewProps) {
  const styles = imagePreviewStyles();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className={styles.container()}>
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`${styles.item()} ${
            draggedIndex === index ? styles.dragging() : ''
          } ${dragOverIndex === index ? styles.dragOver() : ''}`}
          draggable
          onDragStart={e => handleDragStart(e, index)}
          onDragOver={e => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={e => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
        >
          <div className="relative">
            <div className={styles.orderIndicator()}>{index + 1}</div>
            <img
              src={image.url}
              alt={`アップロード画像 ${index + 1}`}
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
