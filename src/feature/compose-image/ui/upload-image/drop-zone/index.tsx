'use client';

import { useRef } from 'react';
import styles from './index.module.css';
import { Button } from '@/shared/ui/button';

type Props = {
  onFilesSelected: (fileList: FileList) => void;
};
export const DropZone: React.FC<Props> = ({ onFilesSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={styles.dropZone}
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault();
        const { files } = e.dataTransfer;
        onFilesSelected(files);
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={e => {
          e.preventDefault();
          const { files } = e.target;
          if (!files) return;
          onFilesSelected(files);
        }}
        className={styles.hiddenInput}
      />
      <div className={styles.uploadContent}>
        <p className={styles.uploadText}>画像をドラッグ＆ドロップまたは</p>
        <Button onClick={handleButtonClick}>ファイルを選択</Button>
      </div>
    </div>
  );
};
