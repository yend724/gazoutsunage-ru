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
 * 結合後のキャンバスサイズを計算する
 */
export const calculateCanvasSize = (
  loadedImages: LoadedImage[],
  options: MergeOptions
): CanvasSize => {
  if (loadedImages.length === 0) {
    return { width: 0, height: 0 }
  }

  const { arrangement, gap } = options
  const totalGap = gap * (loadedImages.length - 1)

  if (arrangement === 'horizontal') {
    // 横並び: 幅を合計し、高さは最大値を取る
    const totalWidth = loadedImages.reduce((sum, img) => sum + img.width, 0) + totalGap
    const maxHeight = Math.max(...loadedImages.map(img => img.height))
    
    return { width: totalWidth, height: maxHeight }
  } else {
    // 縦並び: 高さを合計し、幅は最大値を取る
    const maxWidth = Math.max(...loadedImages.map(img => img.width))
    const totalHeight = loadedImages.reduce((sum, img) => sum + img.height, 0) + totalGap
    
    return { width: maxWidth, height: totalHeight }
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

  let currentX = 0
  let currentY = 0

  for (let i = 0; i < loadedImages.length; i++) {
    const image = loadedImages[i]!

    if (arrangement === 'horizontal') {
      // 横並び: 垂直方向は中央揃え
      const y = Math.max(0, (canvasSize.height - image.height) / 2)
      positions.push({ x: currentX, y })
      currentX += image.width + gap
    } else {
      // 縦並び: 水平方向は中央揃え
      const x = Math.max(0, (canvasSize.width - image.width) / 2)
      positions.push({ x, y: currentY })
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
  positions: DrawPosition[]
): void => {
  // 背景を白で塗りつぶし
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // 各画像を描画
  loadedImages.forEach((loadedImage, index) => {
    const position = positions[index]
    if (position) {
      ctx.drawImage(
        loadedImage.image,
        position.x,
        position.y,
        loadedImage.width,
        loadedImage.height
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
  drawImagesOnCanvas(ctx, loadedImages, positions)
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
  drawImagesOnCanvas(ctx, loadedImages, positions)

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

  // 背景を白で塗りつぶし
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, previewSize.width, previewSize.height)

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

  // Blobとして出力（品質を下げてファイルサイズを削減）
  return canvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 })
}