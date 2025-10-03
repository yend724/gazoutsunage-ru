'use client';

import styles from './index.module.css';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import type { UploadedImage } from '../../type/image';
import { Button } from '@/shared/ui/button';
import { loadImageFromDataUrl } from '../../utils/image';
import { drawImagesToCanvas, downloadCanvasAsImage } from '../../utils/canvas';

type Props = {
  images: UploadedImage[];
};
export const PreviewImage: React.FC<Props> = ({ images }) => {
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
        drawImagesToCanvas(ctx, loadedImages);
      } catch (error) {
        console.error('Failed to render images:', error);
      }
    };

    if (images.length > 0) {
      renderImages();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = 0;
      canvas.height = 0;
    };
  }, [images]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    downloadCanvasAsImage(canvas);
  }, [downloadCanvasAsImage]);

  const disabled = useMemo(() => images.length === 0, [images]);
  const zoomLevel = disabled ? 1 : zoom;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.controls}>
          <input
            type="range"
            value={zoomLevel * 100}
            min={10}
            max={200}
            step={1}
            onChange={e => setZoom(Number(e.target.value) / 100)}
            disabled={disabled}
          />
          <span>Zoom: {(zoomLevel * 100).toFixed(0)}%</span>
        </div>
        <div className={styles['canvas-container']}>
          {disabled && (
            <p>画像を選択してプレビューを表示</p>
          )}
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            style={{
              zoom: zoom,
            }}
          />
        </div>
        <div>
          <Button onClick={handleDownload} disabled={disabled}>
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};
