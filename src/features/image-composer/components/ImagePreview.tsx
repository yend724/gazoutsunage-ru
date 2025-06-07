'use client';

import Image from 'next/image';
import { useState } from 'react';
import { tv } from 'tailwind-variants';
import type { UploadedImage } from '../types';

const imagePreviewStyles = tv({
  slots: {
    container: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
    item: 'relative group cursor-move',
    dragging: 'opacity-50 transform scale-95 z-10',
    dragOver: 'border-2 border-blue-400 border-dashed bg-blue-50',
    image: 'w-full h-32 object-cover rounded-lg pointer-events-none',
    removeButton: 'absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600 z-20',
    info: 'text-xs text-gray-600 mt-1 text-center',
    orderIndicator: 'absolute top-2 left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold'
  }
});

interface ImagePreviewProps {
  images: UploadedImage[];
  onRemove: (id: string) => void;
  onReorder: (dragIndex: number, dropIndex: number) => void;
}

export function ImagePreview({ images, onRemove, onReorder }: ImagePreviewProps) {
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
          } ${
            dragOverIndex === index ? styles.dragOver() : ''
          }`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
        >
          <div className="relative">
            <div className={styles.orderIndicator()}>
              {index + 1}
            </div>
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