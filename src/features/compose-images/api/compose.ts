import type { ImageEntity } from '@/entities/image';
import type { ComposedImageSettings } from '../model/types';
import { composeImagesWithWorker, composeImagesMainThread } from './image-worker-composer';

export async function composeImages(
  images: ImageEntity[],
  settings: ComposedImageSettings
): Promise<Blob> {
  if (images.length === 0) {
    throw new Error('画像が選択されていません');
  }

  const useWorker = typeof Worker !== 'undefined' && 
                   typeof OffscreenCanvas !== 'undefined' &&
                   images.length > 1;

  try {
    if (useWorker) {
      console.log('Web Workerを使用して画像を合成します');
      return await composeImagesWithWorker(images, settings);
    } else {
      console.log('メインスレッドで画像を合成します');
      return await composeImagesMainThread(images, settings);
    }
  } catch (error) {
    if (useWorker) {
      console.warn('Web Workerでの処理に失敗しました。メインスレッドにフォールバックします:', error);
      return await composeImagesMainThread(images, settings);
    }
    throw error;
  }
}