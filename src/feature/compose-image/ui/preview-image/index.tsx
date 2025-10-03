'use client';

import styles from './index.module.css';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import type { UploadedImage } from '../../type/image';
import { Button } from '@/shared/ui/button';

const loadImageFromDataUrl = (dataUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${dataUrl}`));
    image.src = dataUrl;
  });
};

const drawImagesToCanvas = (
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[]
) => {
  const minHeight = Math.min(...images.map(img => img.naturalHeight));

  const scaledWidths = images.map(img => {
    const scale = minHeight / img.naturalHeight;
    return img.naturalWidth * scale;
  });
  const totalWidth = scaledWidths.reduce((sum, width) => sum + width, 0);

  const canvas = ctx.canvas;
  canvas.width = totalWidth;
  canvas.height = minHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let tempX = 0;
  images.forEach((image, index) => {
    const scaledWidth = scaledWidths[index];
    ctx.drawImage(image, tempX, 0, scaledWidth, minHeight);
    tempX += scaledWidth;
  });

  return { width: canvas.width, height: canvas.height };
};

type Props = {
  images: UploadedImage[];
};
export const PreviewImage: React.FC<Props> = ({ images }) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderImages = async () => {
      try {
        const loadedImages = await Promise.all(
          images.map(img => loadImageFromDataUrl(img.dataUrl))
        );
        const { width, height } = drawImagesToCanvas(ctx, loadedImages);
        setCanvasSize({ width, height });
      } catch (error) {
        console.error('Failed to render images:', error);
      }
    };

    if (images.length > 0) {
      renderImages();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setCanvasSize({ width: 0, height: 0 });
    }

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [images]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `composed-image-${new Date().getTime()}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  }, []);

  return (
    <div>
      {images.length > 0 && (
        <div className={styles.container}>
          <div className={styles.controls}>
            <input
              type="range"
              value={zoom * 100}
              min={10}
              max={200}
              step={1}
              onChange={e => setZoom(Number(e.target.value) / 100)}
            />
            <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
          </div>
          <div
            className={styles['canvas-container']}
            style={{
              height: canvasSize.height + 4,
            }}
          >
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              style={{
                inset: 0,
                zoom: zoom,
              }}
            />
          </div>
          <div>
            <Button onClick={handleDownload} disabled={images.length === 0}>
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
