import { describe, it, expect } from 'vitest';
import { calculateCanvasSize, calculateImagePositions } from './imageComposer';
import type {
  UploadedImage,
  ComposedImageSettings,
  ImageDimensions,
} from '../../types';

// モックデータ作成用ヘルパー
const createMockImage = (width: number, height: number): UploadedImage => ({
  id: `img-${width}x${height}`,
  file: new File([], 'mock.png'),
  url: 'mock-url',
  width,
  height,
  order: 0,
});

describe('calculateCanvasSize', () => {
  describe('horizontal layout', () => {
    it('should calculate canvas size with default mode (maximum height)', () => {
      const images = [
        createMockImage(100, 200),
        createMockImage(150, 300),
        createMockImage(200, 100),
      ];
      const settings: ComposedImageSettings = {
        layout: 'horizontal',
        gap: 10,
        backgroundColor: '#ffffff',
        sizeMode: 'default',
      };

      const result = calculateCanvasSize(images, settings);

      // 最大高さは300
      // 各画像の幅を300に合わせて調整: 150 + 150 + 600 = 900
      // gap: 10 * 2 = 20
      expect(result).toEqual({ width: 920, height: 300 });
    });

    it('should calculate canvas size with minimum mode', () => {
      const images = [
        createMockImage(100, 200),
        createMockImage(150, 300),
        createMockImage(200, 100),
      ];
      const settings: ComposedImageSettings = {
        layout: 'horizontal',
        gap: 10,
        backgroundColor: '#ffffff',
        sizeMode: 'minimum',
      };

      const result = calculateCanvasSize(images, settings);

      // 最小高さは100
      // 各画像の幅を100に合わせて調整: 50 + 50 + 200 = 300
      // gap: 10 * 2 = 20
      expect(result).toEqual({ width: 320, height: 100 });
    });

    it('should handle single image', () => {
      const images = [createMockImage(200, 100)];
      const settings: ComposedImageSettings = {
        layout: 'horizontal',
        gap: 10,
        backgroundColor: '#ffffff',
      };

      const result = calculateCanvasSize(images, settings);
      expect(result).toEqual({ width: 200, height: 100 });
    });

    it('should handle zero gap', () => {
      const images = [createMockImage(100, 100), createMockImage(100, 100)];
      const settings: ComposedImageSettings = {
        layout: 'horizontal',
        gap: 0,
        backgroundColor: '#ffffff',
      };

      const result = calculateCanvasSize(images, settings);
      expect(result).toEqual({ width: 200, height: 100 });
    });
  });

  describe('vertical layout', () => {
    it('should calculate canvas size with default mode (maximum width)', () => {
      const images = [
        createMockImage(100, 200),
        createMockImage(300, 150),
        createMockImage(200, 100),
      ];
      const settings: ComposedImageSettings = {
        layout: 'vertical',
        gap: 10,
        backgroundColor: '#ffffff',
        sizeMode: 'default',
      };

      const result = calculateCanvasSize(images, settings);

      // 最大幅は300
      // 各画像の高さを300に合わせて調整: 600 + 150 + 150 = 900
      // gap: 10 * 2 = 20
      expect(result).toEqual({ width: 300, height: 920 });
    });

    it('should calculate canvas size with minimum mode', () => {
      const images = [
        createMockImage(100, 200),
        createMockImage(300, 150),
        createMockImage(200, 100),
      ];
      const settings: ComposedImageSettings = {
        layout: 'vertical',
        gap: 10,
        backgroundColor: '#ffffff',
        sizeMode: 'minimum',
      };

      const result = calculateCanvasSize(images, settings);

      // 最小幅は100
      // 各画像の高さを100に合わせて調整: 200 + 50 + 50 = 300
      // gap: 10 * 2 = 20
      expect(result).toEqual({ width: 100, height: 320 });
    });
  });

  describe('grid layout', () => {
    it('should calculate canvas size for 2x2 grid', () => {
      const images = [
        createMockImage(100, 100),
        createMockImage(200, 200),
        createMockImage(150, 150),
        createMockImage(100, 200),
      ];
      const settings: ComposedImageSettings = {
        layout: 'grid',
        gap: 10,
        backgroundColor: '#ffffff',
        columns: 2,
      };

      const result = calculateCanvasSize(images, settings);

      // 列1の最大幅: max(100, 150) = 150
      // 列2の最大幅: max(200, 100) = 200
      // 行1の最大高さ: max(100, 200) = 200
      // 行2の最大高さ: max(150, 200) = 200
      // 幅: 150 + 200 + 10 = 360
      // 高さ: 200 + 200 + 10 = 410
      expect(result).toEqual({ width: 360, height: 410 });
    });

    it('should handle incomplete grid', () => {
      const images = [
        createMockImage(100, 100),
        createMockImage(200, 200),
        createMockImage(150, 150),
      ];
      const settings: ComposedImageSettings = {
        layout: 'grid',
        gap: 10,
        backgroundColor: '#ffffff',
        columns: 2,
      };

      const result = calculateCanvasSize(images, settings);

      // 3画像で2列なので2行になる
      // 列1の最大幅: max(100, 150) = 150
      // 列2の最大幅: 200
      // 行1の最大高さ: max(100, 200) = 200
      // 行2の最大高さ: 150
      // 幅: 150 + 200 + 10 = 360
      // 高さ: 200 + 150 + 10 = 360
      expect(result).toEqual({ width: 360, height: 360 });
    });

    it('should default to 2 columns if not specified', () => {
      const images = [createMockImage(100, 100), createMockImage(100, 100)];
      const settings: ComposedImageSettings = {
        layout: 'grid',
        gap: 0,
        backgroundColor: '#ffffff',
      };

      const result = calculateCanvasSize(images, settings);
      expect(result).toEqual({ width: 200, height: 100 });
    });
  });
});

describe('calculateImagePositions', () => {
  describe('horizontal layout', () => {
    it('should position images horizontally with center alignment', () => {
      const images = [
        createMockImage(100, 200),
        createMockImage(150, 300),
      ];
      const settings: ComposedImageSettings = {
        layout: 'horizontal',
        gap: 10,
        backgroundColor: '#ffffff',
      };
      const canvasSize: ImageDimensions = { width: 310, height: 300 };

      const positions = calculateImagePositions(images, settings, canvasSize);

      expect(positions).toHaveLength(2);
      // 第1画像: 高さ300に合わせて拡大
      expect(positions[0]).toEqual({
        x: 0,
        y: 0,
        width: 150,
        height: 300,
      });
      // 第2画像: そのまま
      expect(positions[1]).toEqual({
        x: 160,
        y: 0,
        width: 150,
        height: 300,
      });
    });

    it('should position images with minimum size mode', () => {
      const images = [
        createMockImage(100, 200),
        createMockImage(200, 100),
      ];
      const settings: ComposedImageSettings = {
        layout: 'horizontal',
        gap: 10,
        backgroundColor: '#ffffff',
        sizeMode: 'minimum',
      };
      const canvasSize: ImageDimensions = { width: 260, height: 100 };

      const positions = calculateImagePositions(images, settings, canvasSize);

      expect(positions).toHaveLength(2);
      // 第1画像: 高さ100に合わせて縮小
      expect(positions[0]).toEqual({
        x: 0,
        y: 0,
        width: 50,
        height: 100,
      });
      // 第2画像: そのまま
      expect(positions[1]).toEqual({
        x: 60,
        y: 0,
        width: 200,
        height: 100,
      });
    });
  });

  describe('vertical layout', () => {
    it('should position images vertically with center alignment', () => {
      const images = [
        createMockImage(100, 200),
        createMockImage(200, 100),
      ];
      const settings: ComposedImageSettings = {
        layout: 'vertical',
        gap: 10,
        backgroundColor: '#ffffff',
      };
      const canvasSize: ImageDimensions = { width: 200, height: 310 };

      const positions = calculateImagePositions(images, settings, canvasSize);

      expect(positions).toHaveLength(2);
      // 第1画像: 幅200に合わせて拡大
      expect(positions[0]).toEqual({
        x: 0,
        y: 0,
        width: 200,
        height: 400,
      });
      // 第2画像: そのまま（ただし水平方向は中央）
      expect(positions[1]).toEqual({
        x: 0,
        y: 410,
        width: 200,
        height: 100,
      });
    });
  });

  describe('grid layout', () => {
    it('should position images in grid with aspect ratio preservation', () => {
      const images = [
        createMockImage(100, 100),
        createMockImage(200, 100),
        createMockImage(100, 200),
        createMockImage(150, 150),
      ];
      const settings: ComposedImageSettings = {
        layout: 'grid',
        gap: 10,
        backgroundColor: '#ffffff',
        columns: 2,
      };
      const canvasSize: ImageDimensions = { width: 410, height: 410 };

      const positions = calculateImagePositions(images, settings, canvasSize);

      expect(positions).toHaveLength(4);
      
      // セルサイズ: 200x200
      // 各画像はアスペクト比を保持しながらセル内に収まる
      
      // 画像1 (100x100): scale = min(200/100, 200/100) = 2
      expect(positions[0]).toEqual({
        x: 0,    // 0 * (200 + 10) + (200 - 200) / 2
        y: 0,    // 0 * (200 + 10) + (200 - 200) / 2
        width: 200,
        height: 200,
      });
      
      // 画像2 (200x100): scale = min(200/200, 200/100) = 1
      expect(positions[1]).toEqual({
        x: 210,  // 1 * (200 + 10) + (200 - 200) / 2
        y: 50,   // 0 * (200 + 10) + (200 - 100) / 2
        width: 200,
        height: 100,
      });
      
      // 画像3 (100x200): scale = min(200/100, 200/200) = 1
      expect(positions[2]).toEqual({
        x: 50,   // 0 * (200 + 10) + (200 - 100) / 2
        y: 210,  // 1 * (200 + 10) + (200 - 200) / 2
        width: 100,
        height: 200,
      });
      
      // 画像4 (150x150): scale = min(200/150, 200/150) = 1.333...
      expect(positions[3]).toEqual({
        x: 210,  // 1 * (200 + 10) + (200 - 200) / 2
        y: 210,  // 1 * (200 + 10) + (200 - 200) / 2
        width: 200,
        height: 200,
      });
    });

    it('should handle single image in grid', () => {
      const images = [createMockImage(100, 100)];
      const settings: ComposedImageSettings = {
        layout: 'grid',
        gap: 0,
        backgroundColor: '#ffffff',
        columns: 1,
      };
      const canvasSize: ImageDimensions = { width: 100, height: 100 };

      const positions = calculateImagePositions(images, settings, canvasSize);

      expect(positions).toHaveLength(1);
      expect(positions[0]).toEqual({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      });
    });
  });
});