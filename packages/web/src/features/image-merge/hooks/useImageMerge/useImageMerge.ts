import { useState, useCallback, useEffect } from 'react'

import {
  ImageFile,
  MergeOptions,
  AppState,
  IMAGE_CONSTRAINTS,
} from '../../types'
import { cleanupImageFiles } from '../../utils/image'

type UseImageMergeReturn = {
  readonly state: AppState
  readonly addImages: (newImages: ImageFile[]) => void
  readonly removeImage: (id: string) => void
  readonly reorderImages: (images: ImageFile[]) => void
  readonly updateSettings: (settings: Partial<MergeOptions>) => void
  readonly setProcessing: (processing: boolean) => void
  readonly reset: () => void
}

const useImageMerge = (): UseImageMergeReturn => {
  const [state, setState] = useState<AppState>({
    images: [],
    settings: {
      arrangement: 'horizontal',
      gap: IMAGE_CONSTRAINTS.DEFAULT_GAP,
      alignSize: true,
    },
    isProcessing: false,
  })

  // 画像を追加
  const addImages = useCallback((newImages: ImageFile[]) => {
    setState(prevState => {
      // 現在の画像数 + 新規画像数が上限を超える場合は制限
      const allowedCount = Math.min(
        newImages.length,
        IMAGE_CONSTRAINTS.MAX_FILES - prevState.images.length
      )
      
      if (allowedCount <= 0) {
        console.warn(`最大${IMAGE_CONSTRAINTS.MAX_FILES}枚まで追加できます`)
        return prevState
      }

      const imagesToAdd = newImages.slice(0, allowedCount)
      const updatedImages = imagesToAdd.map((image, index) => ({
        ...image,
        order: prevState.images.length + index,
      }))

      return {
        ...prevState,
        images: [...prevState.images, ...updatedImages],
      }
    })
  }, [])

  // 画像を削除
  const removeImage = useCallback((id: string) => {
    setState(prevState => {
      const imageToRemove = prevState.images.find(img => img.id === id)
      if (imageToRemove) {
        // メモリクリーンアップ
        URL.revokeObjectURL(imageToRemove.preview)
      }

      const filteredImages = prevState.images.filter(img => img.id !== id)
      // 順序を再調整
      const reorderedImages = filteredImages.map((img, index) => ({
        ...img,
        order: index,
      }))

      return {
        ...prevState,
        images: reorderedImages,
      }
    })
  }, [])

  // 画像の順序を変更
  const reorderImages = useCallback((images: ImageFile[]) => {
    const reorderedImages = images.map((img, index) => ({
      ...img,
      order: index,
    }))

    setState(prevState => ({
      ...prevState,
      images: reorderedImages,
    }))
  }, [])

  // 設定を更新
  const updateSettings = useCallback((partialSettings: Partial<MergeOptions>) => {
    setState(prevState => ({
      ...prevState,
      settings: {
        ...prevState.settings,
        ...partialSettings,
      },
    }))
  }, [])

  // 処理状態を更新
  const setProcessing = useCallback((processing: boolean) => {
    setState(prevState => ({
      ...prevState,
      isProcessing: processing,
    }))
  }, [])

  // 状態をリセット
  const reset = useCallback(() => {
    setState(prevState => {
      // メモリクリーンアップ
      cleanupImageFiles(prevState.images)

      return {
        images: [],
        settings: {
          arrangement: 'horizontal',
          gap: IMAGE_CONSTRAINTS.DEFAULT_GAP,
          alignSize: true,
        },
        isProcessing: false,
      }
    })
  }, [])

  // コンポーネントアンマウント時のみクリーンアップ処理
  useEffect(() => {
    return () => {
      cleanupImageFiles(state.images)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    state,
    addImages,
    removeImage,
    reorderImages,
    updateSettings,
    setProcessing,
    reset,
  }
}

export { useImageMerge }
export type { UseImageMergeReturn }