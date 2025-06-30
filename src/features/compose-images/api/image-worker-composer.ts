import type { ImageEntity } from '@/entities/image';
import type { ComposedImageSettings } from '@/features/compose-images/model/types';

export async function composeImagesWithWorker(
  images: ImageEntity[],
  settings: ComposedImageSettings
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Web Workerが利用可能かチェック
    if (typeof Worker === 'undefined') {
      throw new Error('Web Workerがサポートされていません');
    }

    // Workerを作成
    const worker = new Worker('/image-worker.js');

    // タイムアウトを設定（30秒）
    const timeoutId = setTimeout(() => {
      worker.terminate();
      reject(new Error('画像処理がタイムアウトしました'));
    }, 30000);

    worker.onmessage = (e) => {
      clearTimeout(timeoutId);
      worker.terminate();

      const { success, imageData, mimeType, error } = e.data;

      if (success) {
        const blob = new Blob([imageData], { type: mimeType });
        resolve(blob);
      } else {
        reject(new Error(error || '画像処理中にエラーが発生しました'));
      }
    };

    worker.onerror = () => {
      clearTimeout(timeoutId);
      worker.terminate();
      reject(new Error('Web Workerでエラーが発生しました'));
    };

    // Workerにデータを送信
    worker.postMessage({ images, settings });
  });
}

// フォールバック用の通常の合成関数
export async function composeImagesMainThread(
  images: ImageEntity[],
  settings: ComposedImageSettings
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context を作成できませんでした'));
      return;
    }

    const imageElements: HTMLImageElement[] = [];
    let loadedCount = 0;

    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        try {
          drawImages();
        } catch (error) {
          reject(error);
        }
      }
    };

    const onImageError = () => {
      reject(new Error('画像の読み込みに失敗しました'));
    };

    // 画像を読み込み
    images.forEach((imgData, index) => {
      const img = new Image();
      img.onload = onImageLoad;
      img.onerror = onImageError;
      img.src = imgData.url;
      imageElements[index] = img;
    });

    const drawImages = () => {
      let totalWidth = 0;
      let totalHeight = 0;
      let maxWidth = 0;
      let maxHeight = 0;

      // レイアウトに基づいてキャンバスサイズを計算
      switch (settings.layout) {
        case 'horizontal':
          totalWidth = imageElements.reduce(
            (sum, img) => sum + img.width + settings.gap,
            -settings.gap
          );
          totalHeight = Math.max(...imageElements.map(img => img.height));
          break;
        case 'vertical':
          totalWidth = Math.max(...imageElements.map(img => img.width));
          totalHeight = imageElements.reduce(
            (sum, img) => sum + img.height + settings.gap,
            -settings.gap
          );
          break;
        case 'grid':
          const cols = settings.columns || 2;
          const rows = Math.ceil(imageElements.length / cols);
          maxWidth = Math.max(...imageElements.map(img => img.width));
          maxHeight = Math.max(...imageElements.map(img => img.height));
          totalWidth = maxWidth * cols + settings.gap * (cols - 1);
          totalHeight = maxHeight * rows + settings.gap * (rows - 1);
          break;
      }

      canvas.width = totalWidth;
      canvas.height = totalHeight;

      // 背景色を設定
      ctx.fillStyle = settings.backgroundColor;
      ctx.fillRect(0, 0, totalWidth, totalHeight);

      // 画像を描画
      let currentX = 0;
      let currentY = 0;

      for (let i = 0; i < imageElements.length; i++) {
        const img = imageElements[i];

        switch (settings.layout) {
          case 'horizontal':
            ctx.drawImage(img, currentX, 0);
            currentX += img.width + settings.gap;
            break;
          case 'vertical':
            ctx.drawImage(img, 0, currentY);
            currentY += img.height + settings.gap;
            break;
          case 'grid':
            const cols = settings.columns || 2;
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = col * (maxWidth + settings.gap);
            const y = row * (maxHeight + settings.gap);
            ctx.drawImage(img, x, y);
            break;
        }
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('画像の生成に失敗しました'));
          }
        },
        'image/png'
      );
    };
  });
}