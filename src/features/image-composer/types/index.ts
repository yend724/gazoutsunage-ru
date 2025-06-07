export interface UploadedImage {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
  order: number;
}

export interface ComposedImageSettings {
  layout: 'horizontal' | 'vertical' | 'grid';
  gap: number;
  backgroundColor: string;
  columns?: number; // gridレイアウトの場合
  sizeMode?: 'default' | 'minimum'; // サイズ調整モード
}

export interface ImageDimensions {
  width: number;
  height: number;
}