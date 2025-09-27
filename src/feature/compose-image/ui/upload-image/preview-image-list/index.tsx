'use client';

import styles from './index.module.css';
import type { UploadedImage } from '../../../type/image';

type Props = {
  images: UploadedImage[];
  onImageRemoved: (id: string) => void;
};
export const PreviewImageList: React.FC<Props> = ({
  images,
  onImageRemoved,
}) => {
  return (
    <div className={styles.container}>
      {images.map(image => (
        <div key={image.id} className={styles.item}>
          <button
            className={styles.removeButton}
            onClick={() => onImageRemoved(image.id)}
          >
            Remove
          </button>
          <img
            className={styles.image}
            src={image.dataUrl}
            alt={image.file.name}
          />
        </div>
      ))}
    </div>
  );
};
