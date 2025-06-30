export interface ImageEntity {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
  order: number;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}