'use client';

import { ImageProvider } from '@/entities/image';
import { ComposeSettingsProvider } from '@/features/compose-images';
import { ImageComposerWidget } from '@/widgets/image-composer';

export const HomePage: React.FC = () => {
  return (
    <ImageProvider>
      <ComposeSettingsProvider>
        <ImageComposerWidget />
      </ComposeSettingsProvider>
    </ImageProvider>
  );
};