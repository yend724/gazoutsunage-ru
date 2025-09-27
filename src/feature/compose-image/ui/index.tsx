'use client';

import styles from './index.module.css';

import { useState } from 'react';

import type { UploadedImage } from '../type/image';
import { UploadImage } from './upload-image';
import { PreviewImage } from './preview-image';

export const ComposeImage: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  return (
    <div className={styles.container}>
      <UploadImage
        onImagesChanged={allImages => {
          setUploadedImages(allImages);
        }}
      />
      <PreviewImage images={uploadedImages} />
    </div>
  );
};
