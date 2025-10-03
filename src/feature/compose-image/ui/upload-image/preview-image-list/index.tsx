'use client';

import styles from './index.module.css';
import type { UploadedImage } from '../../../type/image';

type Props = {
  images: UploadedImage[];
  onImageOrderMoveUp: (id: string) => void;
  onImageOrderMoveDown: (id: string) => void;
  onImageRemoved: (id: string) => void;
};
export const PreviewImageList: React.FC<Props> = ({
  images,
  onImageRemoved,
  onImageOrderMoveUp,
  onImageOrderMoveDown,
}) => {
  return (
    <div className={styles.container}>
      {images.map(image => (
        <div key={image.id} className={styles.item}>
          <span className={styles['image-index']}>{image.order}</span>
          <button
            className={styles['remove-button']}
            onClick={() => onImageRemoved(image.id)}
          >
            Remove
          </button>
          <div className={styles['order-buttons']}>
            <button
              className={styles['order-button']}
              onClick={() => onImageOrderMoveUp(image.id)}
            >
              ←
            </button>
            <button
              className={styles['order-button']}
              onClick={() => onImageOrderMoveDown(image.id)}
            >
              →
            </button>
          </div>
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
