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
      Array.from(fileList).map(async (file, index) => {
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
          order: uploadedImages.length + index + 1,
        };
      })
    );

    onImagesChanged([...uploadedImages, ...newImages]);
    setUploadedImages([...uploadedImages, ...newImages]);
  };

  const removeImage = (id: string) => {
    const remainingImages = uploadedImages
      .filter(image => image.id !== id)
      .map((img, i) => ({
        ...img,
        order: i + 1,
      }));
    onImagesChanged(remainingImages);
    setUploadedImages(remainingImages);
  };

  const moveUpImage = (id: string) => {
    const index = uploadedImages.findIndex(img => img.id === id);
    if (index <= 0) return;

    const updatedImages = [...uploadedImages];
    [updatedImages[index - 1], updatedImages[index]] = [
      updatedImages[index],
      updatedImages[index - 1],
    ];

    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      order: i + 1,
    }));
    setUploadedImages(reorderedImages);
    onImagesChanged(reorderedImages);
  };

  const moveDownImage = (id: string) => {
    const index = uploadedImages.findIndex(img => img.id === id);
    if (index < 0 || index >= uploadedImages.length - 1) return;

    const updatedImages = [...uploadedImages];
    [updatedImages[index], updatedImages[index + 1]] = [
      updatedImages[index + 1],
      updatedImages[index],
    ];

    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      order: i + 1,
    }));
    setUploadedImages(reorderedImages);
    onImagesChanged(reorderedImages);
  };

  return (
    <div>
      <div className={styles.container}>
        <DropZone onFilesSelected={addImages} />
        <PreviewImageList
          images={uploadedImages}
          onImageOrderMoveUp={moveUpImage}
          onImageOrderMoveDown={moveDownImage}
          onImageRemoved={removeImage}
        />
      </div>
    </div>
  );
};
