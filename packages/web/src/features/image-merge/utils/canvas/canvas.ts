import {
  ImageFile,
  MergeOptions,
  LoadedImage,
  CanvasSize,
  DrawPosition,
  IMAGE_CONSTRAINTS,
} from '../../types'
import { loadImages } from '../image'

/**
 * 画像サイズを揃える（小さい方に合わせる）
 */
export const normalizeImageSizes = (
  loadedImages: LoadedImage[],
  options: MergeOptions
): LoadedImage[] => {
  if (!options.alignSize || loadedImages.length === 0) {
    return loadedImages
  }

  if (options.arrangement === 'horizontal') {
    // 横並び: 高さを最小値に揃える
    const minHeight = Math.min(...loadedImages.map(img => img.height))
    return loadedImages.map(img => {
      const scale = minHeight / img.height
      return {
        ...img,
        width: Math.round(img.width * scale),
        height: minHeight,
      }
    })
  } else {
    // 縦並び: 幅を最小値に揃える
    const minWidth = Math.min(...loadedImages.map(img => img.width))
    return loadedImages.map(img => {
      const scale = minWidth / img.width
      return {
        ...img,
        width: minWidth,
        height: Math.round(img.height * scale),
      }
    })
  }
}

/**
 * 結合後のキャンバスサイズを計算する
 */
export const calculateCanvasSize = (
  loadedImages: LoadedImage[],
  options: MergeOptions
): CanvasSize => {
  if (loadedImages.length === 0) {
    return { width: 0, height: 0 }
  }

  // サイズ調整済みの画像を使用
  const normalizedImages = normalizeImageSizes(loadedImages, options)
  const { arrangement, gap } = options
  const totalGap = gap * (normalizedImages.length - 1)

  if (arrangement === 'horizontal') {
    // 横並び: 幅を合計し、高さは統一される
    const totalWidth = normalizedImages.reduce((sum, img) => sum + img.width, 0) + totalGap
    const height = normalizedImages[0]?.height || 0
    
    return { width: totalWidth, height }
  } else {
    // 縦並び: 高さを合計し、幅は統一される
    const width = normalizedImages[0]?.width || 0
    const totalHeight = normalizedImages.reduce((sum, img) => sum + img.height, 0) + totalGap
    
    return { width, height: totalHeight }
  }
}

/**
 * 各画像の描画位置を計算する
 */
export const calculateDrawPositions = (
  loadedImages: LoadedImage[],
  canvasSize: CanvasSize,
  options: MergeOptions
): DrawPosition[] => {
  const positions: DrawPosition[] = []
  const { arrangement, gap } = options
  
  // サイズ調整済みの画像を使用
  const normalizedImages = normalizeImageSizes(loadedImages, options)

  let currentX = 0
  let currentY = 0

  for (let i = 0; i < normalizedImages.length; i++) {
    const image = normalizedImages[i]!

    if (arrangement === 'horizontal') {
      // 横並び: サイズが揃っているので上揃え
      positions.push({ x: currentX, y: 0 })
      currentX += image.width + gap
    } else {
      // 縦並び: サイズが揃っているので左揃え
      positions.push({ x: 0, y: currentY })
      currentY += image.height + gap
    }
  }

  return positions
}

/**
 * キャンバスに画像を描画する
 */
export const drawImagesOnCanvas = (
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  loadedImages: LoadedImage[],
  positions: DrawPosition[],
  options: MergeOptions
): void => {
  // 背景は透明のまま（何もしない）
  // デフォルトでキャンバスは透明背景

  // サイズ調整済みの画像を使用
  const normalizedImages = normalizeImageSizes(loadedImages, options)

  // 各画像を描画
  normalizedImages.forEach((normalizedImage, index) => {
    const position = positions[index]
    const originalImage = loadedImages[index]
    if (position && originalImage) {
      ctx.drawImage(
        originalImage.image,
        position.x,
        position.y,
        normalizedImage.width,
        normalizedImage.height
      )
    }
  })
}

/**
 * キャンバスサイズが制限内かチェック
 */
export const validateCanvasSize = (size: CanvasSize): boolean => {
  const maxSize = IMAGE_CONSTRAINTS.CANVAS_MAX_SIZE
  return size.width <= maxSize && size.height <= maxSize && size.width > 0 && size.height > 0
}

/**
 * 複数の画像を結合してCanvasに描画
 */
export const mergeImages = async (
  images: readonly ImageFile[],
  options: MergeOptions,
  canvas: HTMLCanvasElement
): Promise<void> => {
  if (images.length === 0) {
    throw new Error('画像が選択されていません')
  }

  // 画像を読み込み
  const imagePreviews = images.map(img => img.preview)
  const loadedImages = await loadImages(imagePreviews)

  // キャンバスサイズを計算
  const canvasSize = calculateCanvasSize(loadedImages, options)
  
  // キャンバスサイズの検証
  if (!validateCanvasSize(canvasSize)) {
    throw new Error(
      `キャンバスサイズが大きすぎます（${canvasSize.width}x${canvasSize.height}px）。` +
      `最大サイズ: ${IMAGE_CONSTRAINTS.CANVAS_MAX_SIZE}x${IMAGE_CONSTRAINTS.CANVAS_MAX_SIZE}px`
    )
  }

  // キャンバスのサイズを設定
  canvas.width = canvasSize.width
  canvas.height = canvasSize.height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas context の取得に失敗しました')
  }

  // 高品質な描画設定
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // 描画位置を計算
  const positions = calculateDrawPositions(loadedImages, canvasSize, options)

  // 画像を描画
  drawImagesOnCanvas(ctx, loadedImages, positions, options)
}

/**
 * 結合画像をBlobとして生成（ダウンロード用）
 */
export const mergeImagesToBlob = async (
  images: readonly ImageFile[],
  options: MergeOptions
): Promise<Blob> => {
  if (images.length === 0) {
    throw new Error('画像が選択されていません')
  }

  // 画像を読み込み
  const imagePreviews = images.map(img => img.preview)
  const loadedImages = await loadImages(imagePreviews)

  // キャンバスサイズを計算
  const canvasSize = calculateCanvasSize(loadedImages, options)
  
  // キャンバスサイズの検証
  if (!validateCanvasSize(canvasSize)) {
    throw new Error(
      `キャンバスサイズが大きすぎます（${canvasSize.width}x${canvasSize.height}px）。` +
      `最大サイズ: ${IMAGE_CONSTRAINTS.CANVAS_MAX_SIZE}x${IMAGE_CONSTRAINTS.CANVAS_MAX_SIZE}px`
    )
  }

  // OffscreenCanvasを使用（パフォーマンス向上）
  const canvas = new OffscreenCanvas(canvasSize.width, canvasSize.height)
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('OffscreenCanvas context の取得に失敗しました')
  }

  // 高品質な描画設定
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // 描画位置を計算
  const positions = calculateDrawPositions(loadedImages, canvasSize, options)

  // 画像を描画
  drawImagesOnCanvas(ctx, loadedImages, positions, options)

  // Blobとして出力
  return canvas.convertToBlob({ type: 'image/png', quality: 1.0 })
}

/**
 * プレビュー用の低解像度結合画像を生成
 */
export const mergeImagesForPreview = async (
  images: readonly ImageFile[],
  options: MergeOptions,
  maxSize: number = 800
): Promise<Blob> => {
  if (images.length === 0) {
    throw new Error('画像が選択されていません')
  }

  // 画像を読み込み
  const imagePreviews = images.map(img => img.preview)
  const loadedImages = await loadImages(imagePreviews)

  // 元のキャンバスサイズを計算
  const originalSize = calculateCanvasSize(loadedImages, options)
  
  // プレビュー用にスケールダウン
  const scale = Math.min(1, maxSize / Math.max(originalSize.width, originalSize.height))
  const previewSize: CanvasSize = {
    width: Math.round(originalSize.width * scale),
    height: Math.round(originalSize.height * scale),
  }

  // スケールされた画像データを作成
  const scaledImages: LoadedImage[] = loadedImages.map(img => ({
    ...img,
    width: Math.round(img.width * scale),
    height: Math.round(img.height * scale),
  }))

  // スケールされたオプションを作成
  const scaledOptions: MergeOptions = {
    ...options,
    gap: Math.round(options.gap * scale),
  }

  // OffscreenCanvasで描画
  const canvas = new OffscreenCanvas(previewSize.width, previewSize.height)
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('OffscreenCanvas context の取得に失敗しました')
  }

  // 描画位置を計算（スケール後のサイズで）
  const positions = calculateDrawPositions(scaledImages, previewSize, scaledOptions)

  // 背景は透明のまま（プレビューも透明背景）
  // デフォルトでキャンバスは透明背景

  // スケールされた画像を描画
  loadedImages.forEach((loadedImage, index) => {
    const position = positions[index]
    const scaledImg = scaledImages[index]
    if (position && scaledImg) {
      ctx.drawImage(
        loadedImage.image,
        position.x,
        position.y,
        scaledImg.width,
        scaledImg.height
      )
    }
  })

  // Blobとして出力（透明背景保持のためPNG形式）
  return canvas.convertToBlob({ type: 'image/png' })
}