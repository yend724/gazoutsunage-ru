import type {
  UploadedImage,
  ComposedImageSettings,
  ImageDimensions,
} from '../../types';

export async function composeImages(
  images: UploadedImage[],
  settings: ComposedImageSettings
): Promise<Blob> {
  if (images.length === 0) {
    throw new Error('画像が選択されていません');
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas contextの取得に失敗しました');
  }

  // キャンバスサイズを計算
  const canvasSize = calculateCanvasSize(images, settings);
  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;

  // 背景色を設定
  ctx.fillStyle = settings.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 画像を配置
  const positions = calculateImagePositions(images, settings, canvasSize);

  // 各画像を描画
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const position = positions[i];

    const img = new Image();
    img.src = image.url;
    await new Promise(resolve => {
      img.onload = resolve;
    });

    ctx.drawImage(img, position.x, position.y, position.width, position.height);
  }

  // Blobとして出力
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('画像の生成に失敗しました'));
      }
    }, 'image/png');
  });
}

export function calculateCanvasSize(
  images: UploadedImage[],
  settings: ComposedImageSettings
): ImageDimensions {
  let width = 0;
  let height = 0;

  switch (settings.layout) {
    case 'horizontal':
      // 横並び: 幅は合計、高さは最大値または最小値
      if (settings.sizeMode === 'minimum') {
        height = Math.min(...images.map(img => img.height));
        // 各画像の幅を最小高さに合わせて調整
        width =
          images.reduce((sum, img) => {
            const scale = height / img.height;
            return sum + img.width * scale;
          }, 0) +
          (images.length - 1) * settings.gap;
      } else {
        height = Math.max(...images.map(img => img.height));
        // 各画像の幅を最大高さに合わせて調整
        width =
          images.reduce((sum, img) => {
            const scale = height / img.height;
            return sum + img.width * scale;
          }, 0) +
          (images.length - 1) * settings.gap;
      }
      break;

    case 'vertical':
      // 縦並び: 幅は最大値または最小値、高さは合計
      if (settings.sizeMode === 'minimum') {
        width = Math.min(...images.map(img => img.width));
        // 各画像の高さを最小幅に合わせて調整
        height =
          images.reduce((sum, img) => {
            const scale = width / img.width;
            return sum + img.height * scale;
          }, 0) +
          (images.length - 1) * settings.gap;
      } else {
        width = Math.max(...images.map(img => img.width));
        // 各画像の高さを最大幅に合わせて調整
        height =
          images.reduce((sum, img) => {
            const scale = width / img.width;
            return sum + img.height * scale;
          }, 0) +
          (images.length - 1) * settings.gap;
      }
      break;

    case 'grid':
      const columns = settings.columns || 2;
      const rows = Math.ceil(images.length / columns);

      // 各列の最大幅を計算
      const columnWidths: number[] = [];
      for (let col = 0; col < columns; col++) {
        let maxWidth = 0;
        for (let row = 0; row < rows; row++) {
          const index = row * columns + col;
          if (index < images.length) {
            maxWidth = Math.max(maxWidth, images[index].width);
          }
        }
        columnWidths.push(maxWidth);
      }

      // 各行の最大高さを計算
      const rowHeights: number[] = [];
      for (let row = 0; row < rows; row++) {
        let maxHeight = 0;
        for (let col = 0; col < columns; col++) {
          const index = row * columns + col;
          if (index < images.length) {
            maxHeight = Math.max(maxHeight, images[index].height);
          }
        }
        rowHeights.push(maxHeight);
      }

      width =
        columnWidths.reduce((sum, w) => sum + w, 0) +
        (columns - 1) * settings.gap;
      height =
        rowHeights.reduce((sum, h) => sum + h, 0) + (rows - 1) * settings.gap;
      break;
  }

  return { width, height };
}

interface ImagePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function calculateImagePositions(
  images: UploadedImage[],
  settings: ComposedImageSettings,
  canvasSize: ImageDimensions
): ImagePosition[] {
  const positions: ImagePosition[] = [];

  switch (settings.layout) {
    case 'horizontal':
      let xOffset = 0;

      for (const image of images) {
        let scale: number;
        if (settings.sizeMode === 'minimum') {
          // 最小高さに合わせるモード：すべての画像を最小高さに縮小
          const minHeight = Math.min(...images.map(img => img.height));
          scale = minHeight / image.height;
        } else {
          // デフォルトモード：最大高さに合わせる
          const maxHeight = Math.max(...images.map(img => img.height));
          scale = maxHeight / image.height;
        }

        const width = image.width * scale;
        const height = image.height * scale;
        const y = (canvasSize.height - height) / 2;

        positions.push({ x: xOffset, y, width, height });
        xOffset += width + settings.gap;
      }
      break;

    case 'vertical':
      let yOffset = 0;

      for (const image of images) {
        let scale: number;
        if (settings.sizeMode === 'minimum') {
          // 最小幅に合わせるモード：すべての画像を最小幅に縮小
          const minWidth = Math.min(...images.map(img => img.width));
          scale = minWidth / image.width;
        } else {
          // デフォルトモード：最大幅に合わせる
          const maxWidth = Math.max(...images.map(img => img.width));
          scale = maxWidth / image.width;
        }

        const width = image.width * scale;
        const height = image.height * scale;
        const x = (canvasSize.width - width) / 2;

        positions.push({ x, y: yOffset, width, height });
        yOffset += height + settings.gap;
      }
      break;

    case 'grid':
      const columns = settings.columns || 2;
      const rows = Math.ceil(images.length / columns);

      // セルサイズを計算
      const cellWidth =
        (canvasSize.width - (columns - 1) * settings.gap) / columns;
      const cellHeight = (canvasSize.height - (rows - 1) * settings.gap) / rows;

      for (let i = 0; i < images.length; i++) {
        const col = i % columns;
        const row = Math.floor(i / columns);
        const image = images[i];

        // アスペクト比を保持してセル内に収める
        const scale = Math.min(
          cellWidth / image.width,
          cellHeight / image.height
        );
        const width = image.width * scale;
        const height = image.height * scale;

        // セル内で中央揃え
        const x = col * (cellWidth + settings.gap) + (cellWidth - width) / 2;
        const y = row * (cellHeight + settings.gap) + (cellHeight - height) / 2;

        positions.push({ x, y, width, height });
      }
      break;
  }

  return positions;
}
