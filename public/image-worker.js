// Web Worker for image composition
self.onmessage = async function(e) {
  const { images, settings } = e.data;
  
  try {
    // OffscreenCanvasを使用した画像合成
    const canvas = new OffscreenCanvas(100, 100); // 初期サイズ
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Canvas context を作成できませんでした');
    }

    // 画像をロード
    const loadedImages = await Promise.all(
      images.map(async (img) => {
        const response = await fetch(img.url);
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        return {
          ...img,
          bitmap
        };
      })
    );

    let totalWidth = 0;
    let totalHeight = 0;
    let maxWidth = 0;
    let maxHeight = 0;

    // レイアウトに基づいてキャンバスサイズを計算
    switch (settings.layout) {
      case 'horizontal':
        totalWidth = loadedImages.reduce(
          (sum, img) => sum + img.bitmap.width + settings.gap,
          -settings.gap
        );
        totalHeight = Math.max(...loadedImages.map(img => img.bitmap.height));
        break;
      case 'vertical':
        totalWidth = Math.max(...loadedImages.map(img => img.bitmap.width));
        totalHeight = loadedImages.reduce(
          (sum, img) => sum + img.bitmap.height + settings.gap,
          -settings.gap
        );
        break;
      case 'grid':
        const cols = settings.columns || 2;
        const rows = Math.ceil(loadedImages.length / cols);
        maxWidth = Math.max(...loadedImages.map(img => img.bitmap.width));
        maxHeight = Math.max(...loadedImages.map(img => img.bitmap.height));
        totalWidth = maxWidth * cols + settings.gap * (cols - 1);
        totalHeight = maxHeight * rows + settings.gap * (rows - 1);
        break;
    }

    // キャンバスサイズを設定
    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // 背景色を設定
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // 画像を描画
    let currentX = 0;
    let currentY = 0;

    for (let i = 0; i < loadedImages.length; i++) {
      const img = loadedImages[i];

      switch (settings.layout) {
        case 'horizontal':
          ctx.drawImage(img.bitmap, currentX, 0);
          currentX += img.bitmap.width + settings.gap;
          break;
        case 'vertical':
          ctx.drawImage(img.bitmap, 0, currentY);
          currentY += img.bitmap.height + settings.gap;
          break;
        case 'grid':
          const cols = settings.columns || 2;
          const row = Math.floor(i / cols);
          const col = i % cols;
          const x = col * (maxWidth + settings.gap);
          const y = row * (maxHeight + settings.gap);
          ctx.drawImage(img.bitmap, x, y);
          break;
      }
    }

    // Blobを作成
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    
    // ArrayBufferとして送信
    const arrayBuffer = await blob.arrayBuffer();
    
    self.postMessage({
      success: true,
      imageData: arrayBuffer,
      mimeType: 'image/png'
    });

    // リソースを解放
    loadedImages.forEach(img => img.bitmap.close());

  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message
    });
  }
};