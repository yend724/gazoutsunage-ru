import type { ImageEntity } from '@/entities/image';
import type { ComposedImageSettings } from '../model/types';
import type { ImageDimensions } from '@/entities/image';

export function calculateCanvasSize(
  images: ImageEntity[],
  settings: ComposedImageSettings
): ImageDimensions {
  let width = 0;
  let height = 0;

  switch (settings.layout) {
    case 'horizontal':
      if (settings.sizeMode === 'minimum') {
        height = Math.min(...images.map(img => img.height));
        width =
          images.reduce((sum, img) => {
            const scale = height / img.height;
            return sum + img.width * scale;
          }, 0) +
          (images.length - 1) * settings.gap;
      } else {
        height = Math.max(...images.map(img => img.height));
        width =
          images.reduce((sum, img) => {
            const scale = height / img.height;
            return sum + img.width * scale;
          }, 0) +
          (images.length - 1) * settings.gap;
      }
      break;

    case 'vertical':
      if (settings.sizeMode === 'minimum') {
        width = Math.min(...images.map(img => img.width));
        height =
          images.reduce((sum, img) => {
            const scale = width / img.width;
            return sum + img.height * scale;
          }, 0) +
          (images.length - 1) * settings.gap;
      } else {
        width = Math.max(...images.map(img => img.width));
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

export interface ImagePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function calculateImagePositions(
  images: ImageEntity[],
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
          const minHeight = Math.min(...images.map(img => img.height));
          scale = minHeight / image.height;
        } else {
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
          const minWidth = Math.min(...images.map(img => img.width));
          scale = minWidth / image.width;
        } else {
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

      const cellWidth =
        (canvasSize.width - (columns - 1) * settings.gap) / columns;
      const cellHeight = (canvasSize.height - (rows - 1) * settings.gap) / rows;

      for (let i = 0; i < images.length; i++) {
        const col = i % columns;
        const row = Math.floor(i / columns);
        const image = images[i];

        const scale = Math.min(
          cellWidth / image.width,
          cellHeight / image.height
        );
        const width = image.width * scale;
        const height = image.height * scale;

        const x = col * (cellWidth + settings.gap) + (cellWidth - width) / 2;
        const y = row * (cellHeight + settings.gap) + (cellHeight - height) / 2;

        positions.push({ x, y, width, height });
      }
      break;
  }

  return positions;
}