import {
  ImageFile,
  ImageProcessingError,
  Result,
  IMAGE_CONSTRAINTS,
  LoadedImage,
} from '../../types'

/**
 * ファイルから画像プレビューを生成する
 */
export const createImagePreview = (file: File): { preview: string; cleanup: () => void } => {
  const preview = URL.createObjectURL(file)
  const cleanup = () => URL.revokeObjectURL(preview)
  
  return { preview, cleanup }
}

/**
 * 画像ファイルの検証
 */
export const validateImageFile = (file: File): Result<File, ImageProcessingError> => {
  // ファイルサイズチェック
  if (file.size > IMAGE_CONSTRAINTS.MAX_FILE_SIZE) {
    return {
      success: false,
      error: { type: 'FILE_TOO_LARGE', maxSize: IMAGE_CONSTRAINTS.MAX_FILE_SIZE },
    }
  }

  // MIMEタイプチェック
  if (!IMAGE_CONSTRAINTS.VALID_FORMATS.includes(file.type as 'image/jpeg' | 'image/png')) {
    return {
      success: false,
      error: {
        type: 'INVALID_FORMAT',
        validFormats: IMAGE_CONSTRAINTS.VALID_FORMATS,
      },
    }
  }

  return { success: true, data: file }
}

/**
 * 画像を読み込んでHTMLImageElementとして返す
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    
    image.onload = () => resolve(image)
    image.onerror = () => {
      // Blob URLが無効になっている可能性があるため、詳細なエラーメッセージを出力
      console.error(`画像の読み込みエラー: ${src}`)
      reject(new Error(`画像の読み込みに失敗しました`))
    }
    
    image.src = src
  })
}

/**
 * 複数の画像を並行して読み込む
 */
export const loadImages = async (imagePreviews: readonly string[]): Promise<LoadedImage[]> => {
  const loadPromises = imagePreviews.map(async (preview): Promise<LoadedImage | null> => {
    try {
      const image = await loadImage(preview)
      return {
        image,
        width: image.width,
        height: image.height,
      }
    } catch (error) {
      console.error(`画像の読み込みをスキップ: ${preview}`, error)
      return null
    }
  })

  const results = await Promise.all(loadPromises)
  // nullを除外して正常に読み込めた画像のみ返す
  return results.filter((result): result is LoadedImage => result !== null)
}

/**
 * 画像のサムネイルを生成する
 */
export const createThumbnail = (
  file: File, 
  maxSize: number = 200
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Canvas context を取得できませんでした'))
      return
    }

    const image = new Image()
    
    image.onload = () => {
      // アスペクト比を保持してサイズを計算
      const { width, height } = image
      let { width: newWidth, height: newHeight } = image
      
      if (width > height) {
        if (width > maxSize) {
          newWidth = maxSize
          newHeight = (height * maxSize) / width
        }
      } else {
        if (height > maxSize) {
          newHeight = maxSize
          newWidth = (width * maxSize) / height
        }
      }

      canvas.width = newWidth
      canvas.height = newHeight

      // 画像を描画
      ctx.drawImage(image, 0, 0, newWidth, newHeight)

      // Data URLとして出力
      const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8)
      resolve(thumbnailDataUrl)
    }

    image.onerror = () => reject(new Error('サムネイル生成に失敗しました'))
    image.src = URL.createObjectURL(file)
  })
}

/**
 * ファイルサイズをフォーマットして表示
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * 画像ファイルからImageFileオブジェクトを作成
 */
export const createImageFileFromFile = async (
  file: File,
  order: number
): Promise<Result<ImageFile, ImageProcessingError>> => {
  try {
    const validation = validateImageFile(file)
    if (!validation.success) {
      return validation
    }

    const { preview } = createImagePreview(file)
    const image = await loadImage(preview)

    const imageFile: ImageFile = {
      id: crypto.randomUUID(),
      file,
      preview,
      dimensions: {
        width: image.width,
        height: image.height,
      },
      order,
    }

    return { success: true, data: imageFile }
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'CANVAS_ERROR',
        message: error instanceof Error ? error.message : '不明なエラー',
      },
    }
  }
}

/**
 * ImageFileのメモリを解放
 */
export const cleanupImageFile = (imageFile: ImageFile): void => {
  URL.revokeObjectURL(imageFile.preview)
}

/**
 * 複数のImageFileのメモリを解放
 */
export const cleanupImageFiles = (imageFiles: readonly ImageFile[]): void => {
  imageFiles.forEach(cleanupImageFile)
}