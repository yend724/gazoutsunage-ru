'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { ImageEntity } from './types';

interface ImageContextValue {
  images: ImageEntity[];
  addImage: (image: ImageEntity) => void;
  removeImage: (id: string) => void;
  updateImageOrder: (images: ImageEntity[]) => void;
  clearImages: () => void;
}

const ImageContext = createContext<ImageContextValue | undefined>(undefined);

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImageContext must be used within ImageProvider');
  }
  return context;
};

interface ImageProviderProps {
  children: ReactNode;
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [images, setImages] = useState<ImageEntity[]>([]);

  const addImage = useCallback((image: ImageEntity) => {
    setImages((prev) => [...prev, image]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const updateImageOrder = useCallback((newImages: ImageEntity[]) => {
    setImages(newImages);
  }, []);

  const clearImages = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
  }, [images]);

  const value: ImageContextValue = {
    images,
    addImage,
    removeImage,
    updateImageOrder,
    clearImages,
  };

  return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
};