import { ImageFile, MergeOptions } from '../../types'
import { mergeImagesToBlob } from '../canvas'

/**
 * ファイル名を生成する
 */
export const generateFileName = (prefix: string = 'merged'): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  return `${prefix}_${timestamp}.png`
}

/**
 * Blobをダウンロードする
 */
export const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob)
  
  try {
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * 複数の画像を結合してダウンロードする
 */
export const downloadMergedImage = async (
  images: readonly ImageFile[],
  options: MergeOptions,
  fileName?: string
): Promise<void> => {
  if (images.length === 0) {
    throw new Error('ダウンロードする画像がありません')
  }

  if (images.length < 2) {
    throw new Error('結合するには2枚以上の画像が必要です')
  }

  const blob = await mergeImagesToBlob(images, options)
  const downloadFileName = fileName || generateFileName('merged')
  
  downloadBlob(blob, downloadFileName)
}