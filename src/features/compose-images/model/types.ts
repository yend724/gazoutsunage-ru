export interface ComposedImageSettings {
  layout: 'horizontal' | 'vertical' | 'grid';
  gap: number;
  backgroundColor: string;
  columns?: number;
  sizeMode?: 'default' | 'minimum';
}