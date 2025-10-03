'use client';

import styles from './index.module.css';
import type { UploadedImage } from '../../type/image';
import { useState } from 'react';
import { DropZone } from './drop-zone';
import { PreviewImageList } from './preview-image-list';

type Props = {
  onImagesChanged: (allImages: UploadedImage[]) => void;
};
export const UploadImage: React.FC<Props> = ({ onImagesChanged }) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const addImages = async (fileList: FileList) => {
    const newImages = await Promise.all(
      Array.from(fileList).map(async file => {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to read file as data URL'));
            }
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
        return {
          id: crypto.randomUUID(),
          file,
          dataUrl,
        };
      })
    );

    onImagesChanged([...uploadedImages, ...newImages]);
    setUploadedImages([...uploadedImages, ...newImages]);
  };

  const removeImages = (id: string) => {
    const remainingImages = uploadedImages.filter(image => image.id !== id);
    onImagesChanged(remainingImages);
    setUploadedImages(remainingImages);
  };

  return (
    <div>
      <div className={styles.container}>
        <DropZone onFilesSelected={addImages} />
        <PreviewImageList
          images={uploadedImages}
          onImageRemoved={removeImages}
        />
      </div>
    </div>
  );
};
