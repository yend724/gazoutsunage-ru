'use client';

import { useState, useCallback } from 'react';
import { tv } from 'tailwind-variants';
import { ImageUploader } from './ImageUploader';
import { ImagePreview } from './ImagePreview';
import { ComposerSettings } from './ComposerSettings';
import { composeImages } from '../utils/imageComposer';
import type { UploadedImage, ComposedImageSettings } from '../types';

const composerStyles = tv({
  slots: {
    container: 'max-w-7xl mx-auto p-6 space-y-8',
    header: 'text-center',
    title: 'text-3xl font-bold text-gray-900',
    subtitle: 'text-gray-600 mt-2',
    content: 'grid grid-cols-1 lg:grid-cols-3 gap-8',
    mainSection: 'lg:col-span-2 space-y-6',
    sideSection: 'space-y-6',
    section: 'bg-white rounded-lg shadow-md p-6',
    sectionTitle: 'text-xl font-semibold mb-4',
    buttonContainer: 'flex gap-4',
    button: 'px-6 py-3 rounded-md font-medium transition-colors',
    primaryButton: 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed',
    secondaryButton: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    previewContainer: 'mt-4 overflow-auto max-h-96 max-w-full border border-gray-200 rounded-lg p-4',
    previewImage: 'block rounded-lg shadow-lg'
  }
});

export function ImageComposer() {
  const styles = composerStyles();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [settings, setSettings] = useState<ComposedImageSettings>({
    layout: 'horizontal',
    gap: 0,
    backgroundColor: '#ffffff',
    columns: 2
  });
  const [composedImageUrl, setComposedImageUrl] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);

  const handleImagesUploaded = useCallback((newImages: UploadedImage[]) => {
    setImages(prev => [...prev, ...newImages]);
    setComposedImageUrl(null);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setComposedImageUrl(null);
  }, []);

  const handleReorderImages = useCallback((dragIndex: number, dropIndex: number) => {
    setImages(prev => {
      const newImages = [...prev];
      const draggedImage = newImages[dragIndex];
      newImages.splice(dragIndex, 1);
      newImages.splice(dropIndex, 0, draggedImage);
      
      return newImages.map((img, index) => ({
        ...img,
        order: index
      }));
    });
    setComposedImageUrl(null);
  }, []);

  const handleCompose = async () => {
    if (images.length === 0) return;

    setIsComposing(true);
    try {
      const blob = await composeImages(images, settings);
      const url = URL.createObjectURL(blob);
      setComposedImageUrl(url);
    } catch (error) {
      console.error('画像の合成に失敗しました:', error);
      alert('画像の合成に失敗しました');
    } finally {
      setIsComposing(false);
    }
  };

  const handleDownload = () => {
    if (!composedImageUrl) return;

    const link = document.createElement('a');
    link.href = composedImageUrl;
    link.download = `composed-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setImages([]);
    if (composedImageUrl) {
      URL.revokeObjectURL(composedImageUrl);
      setComposedImageUrl(null);
    }
  };

  return (
    <div className={styles.container()}>
      <header className={styles.header()}>
        <h1 className={styles.title()}>ガゾウツナゲール</h1>
        <p className={styles.subtitle()}>
          複数の画像を1つにつなげます
        </p>
      </header>

      <div className={styles.content()}>
        <div className={styles.mainSection()}>
          <section className={styles.section()}>
            <h2 className={styles.sectionTitle()}>画像をアップロード</h2>
            <ImageUploader onImagesUploaded={handleImagesUploaded} />
          </section>

          {images.length > 0 && (
            <section className={styles.section()}>
              <h2 className={styles.sectionTitle()}>
                アップロードされた画像 ({images.length}枚)
              </h2>
              <ImagePreview 
                images={images} 
                onRemove={handleRemoveImage} 
                onReorder={handleReorderImages}
              />
            </section>
          )}

          <div className={styles.buttonContainer()}>
            <button
              className={`${styles.button()} ${styles.primaryButton()}`}
              onClick={handleCompose}
              disabled={images.length === 0 || isComposing}
            >
              {isComposing ? '合成中...' : '画像を合成'}
            </button>
            <button
              className={`${styles.button()} ${styles.secondaryButton()}`}
              onClick={handleReset}
              disabled={images.length === 0 && !composedImageUrl}
            >
              リセット
            </button>
          </div>

          {composedImageUrl && (
            <section className={styles.section()}>
              <h2 className={styles.sectionTitle()}>合成結果</h2>
              <div className={styles.previewContainer()}>
                <img
                  src={composedImageUrl}
                  alt="合成された画像"
                  className={styles.previewImage()}
                />
              </div>
              <div className={styles.buttonContainer()}>
                <button
                  className={`${styles.button()} ${styles.primaryButton()}`}
                  onClick={handleDownload}
                >
                  ダウンロード
                </button>
              </div>
            </section>
          )}
        </div>

        <aside className={styles.sideSection()}>
          <section className={styles.section()}>
            <ComposerSettings settings={settings} onChange={setSettings} />
          </section>
        </aside>
      </div>
    </div>
  );
}