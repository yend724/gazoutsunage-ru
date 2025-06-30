'use client';

import { memo } from 'react';
import { tv } from 'tailwind-variants';
import { Button, Card, OptimizedImage } from '@/shared/components';

const resultDisplayStyles = tv({
  slots: {
    previewContainer:
      'mt-6 overflow-auto max-h-96 max-w-full border-2 border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-gray-50 to-white',
    previewImage: 'block rounded-xl shadow-2xl border border-white/50',
    buttonContainer: 'flex gap-4 flex-wrap mt-6',
  },
});

interface ResultDisplayProps {
  composedImageUrl: string;
  onDownload: () => void;
}

const ResultDisplayComponent: React.FC<ResultDisplayProps> = ({
  composedImageUrl,
  onDownload,
}) => {
  const styles = resultDisplayStyles();

  return (
    <Card title="合成結果">
      <div className={styles.previewContainer()}>
        <OptimizedImage
          src={composedImageUrl}
          alt="合成された画像"
          className={styles.previewImage()}
        />
      </div>
      <div className={styles.buttonContainer()}>
        <Button variant="primary" onClick={onDownload}>
          ダウンロード
        </Button>
      </div>
    </Card>
  );
};

export const ResultDisplay = memo(ResultDisplayComponent);