'use client';

import { useState, useCallback } from 'react';
import { tv } from 'tailwind-variants';
import { ImageUploader } from '../image-uploader';
import { ImagePreview } from '../image-preview';
import { ComposerSettings } from '../composer-settings';
import { composeImages } from '../../utils/imageComposer';
import type { UploadedImage, ComposedImageSettings } from '../../types';

const composerStyles = tv({
  slots: {
    container: 'max-w-7xl mx-auto p-6 space-y-10',
    header: 'text-center mb-12',
    title: 'text-5xl font-extrabold text-white mb-4 drop-shadow-lg',
    subtitle: 'text-xl text-white font-medium drop-shadow-md',
    content: 'grid grid-cols-1 lg:grid-cols-3 gap-8',
    mainSection: 'lg:col-span-2 space-y-8',
    sideSection: 'space-y-8',
    section: 'bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 transition-all duration-300 hover:shadow-2xl',
    sectionTitle: 'text-2xl font-bold mb-6 text-gray-800',
    buttonContainer: 'flex gap-4 flex-wrap',
    button: 'px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg cursor-pointer',
    primaryButton: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-purple-500/25',
    secondaryButton: 'bg-white/80 text-gray-700 border-2 border-gray-200 hover:bg-white hover:border-purple-300 hover:text-purple-600 shadow-gray-200/50',
    previewContainer: 'mt-6 overflow-auto max-h-96 max-w-full border-2 border-purple-100 rounded-2xl p-6 bg-gradient-to-br from-gray-50 to-white',
    previewImage: 'block rounded-xl shadow-2xl border border-white/50'
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

          <aside className={`${styles.sideSection()} lg:hidden`}>
            <section className={styles.section()}>
              <ComposerSettings settings={settings} onChange={setSettings} />
            </section>
          </aside>

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
              <div className={`${styles.buttonContainer()} mt-6`}>
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
            </section>
          )}

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
              <div className={`${styles.buttonContainer()} mt-6`}>
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

        <aside className={`${styles.sideSection()} hidden lg:block`}>
          <section className={styles.section()}>
            <ComposerSettings settings={settings} onChange={setSettings} />
          </section>
        </aside>
      </div>
    </div>
  );
}