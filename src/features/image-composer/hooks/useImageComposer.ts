import { useState, useCallback, useMemo, useEffect } from 'react';
import type { UploadedImage, ComposedImageSettings } from '../types';
import { composeImages } from '../utils/image-composer';

export function useImageComposer() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [settings, setSettings] = useState<ComposedImageSettings>({
    layout: 'horizontal',
    gap: 0,
    backgroundColor: '#ffffff',
    columns: 2,
  });
  const [composedImageUrl, setComposedImageUrl] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImagesUploaded = useCallback((newImages: UploadedImage[]) => {
    setImages(prev => [...prev, ...newImages]);
    setComposedImageUrl(null);
    setError(null);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove && imageToRemove.url) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter(img => img.id !== id);
    });
    setComposedImageUrl(null);
  }, []);

  const handleReorderImages = useCallback(
    (dragIndex: number, dropIndex: number) => {
      setImages(prev => {
        const newImages = [...prev];
        const draggedImage = newImages[dragIndex];
        newImages.splice(dragIndex, 1);
        newImages.splice(dropIndex, 0, draggedImage);

        return newImages.map((img, index) => ({
          ...img,
          order: index,
        }));
      });
      setComposedImageUrl(null);
    },
    []
  );

  const handleCompose = useCallback(async () => {
    if (images.length === 0) return;

    setIsComposing(true);
    setError(null);
    try {
      const blob = await composeImages(images, settings);
      const url = URL.createObjectURL(blob);

      // 古いURLをクリーンアップ
      if (composedImageUrl) {
        URL.revokeObjectURL(composedImageUrl);
      }

      setComposedImageUrl(url);
    } catch (error) {
      console.error('画像の合成に失敗しました:', error);
      setError('画像の合成に失敗しました。もう一度お試しください。');
    } finally {
      setIsComposing(false);
    }
  }, [images, settings, composedImageUrl]);

  const handleDownload = useCallback(() => {
    if (!composedImageUrl) return;

    const link = document.createElement('a');
    link.href = composedImageUrl;
    link.download = `composed-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [composedImageUrl]);

  const handleReset = useCallback(() => {
    // 既存の画像URLをすべてクリーンアップ
    images.forEach(image => {
      if (image.url) {
        URL.revokeObjectURL(image.url);
      }
    });
    setImages([]);
    
    if (composedImageUrl) {
      URL.revokeObjectURL(composedImageUrl);
      setComposedImageUrl(null);
    }
    setError(null);
  }, [composedImageUrl, images]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  // コンポーネントのアンマウント時にURLをクリーンアップ
  useEffect(() => {
    return () => {
      if (composedImageUrl) {
        URL.revokeObjectURL(composedImageUrl);
      }
      images.forEach(image => {
        if (image.url) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [composedImageUrl, images]);

  const canCompose = useMemo(
    () => images.length > 0 && !isComposing,
    [images.length, isComposing]
  );
  const canReset = useMemo(
    () => images.length > 0 || composedImageUrl !== null,
    [images.length, composedImageUrl]
  );

  return {
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
  };
}
