import { z } from 'zod'

// 基本型定義
export type ArrangementType = 'horizontal' | 'vertical'

export type ImageFile = {
  readonly id: string
  readonly file: File
  readonly preview: string
  readonly dimensions: {
    readonly width: number
    readonly height: number
  }
  readonly order: number
}

export type MergeOptions = {
  readonly arrangement: ArrangementType
  readonly gap: number
  readonly alignSize: boolean
}

export type AppState = {
  readonly images: readonly ImageFile[]
  readonly settings: MergeOptions
  readonly isProcessing: boolean
}

// エラー型定義
export type ImageProcessingError =
  | { readonly type: 'FILE_TOO_LARGE'; readonly maxSize: number }
  | { readonly type: 'INVALID_FORMAT'; readonly validFormats: readonly string[] }
  | { readonly type: 'TOO_MANY_FILES'; readonly maxFiles: number }
  | { readonly type: 'CANVAS_ERROR'; readonly message: string }
  | { readonly type: 'MEMORY_ERROR'; readonly message: string }

// Result型定義
export type Result<T, E> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E }

// Zodスキーマ定義
export const ImageFileValidationSchema = z.object({
  name: z.string().transform(name => name.replace(/[<>:"/\\|?*]/g, '_')),
  type: z.enum(['image/jpeg', 'image/png']),
  size: z.number().max(10 * 1024 * 1024, 'ファイルサイズは10MB以下にしてください'),
})

export const MergeOptionsSchema = z.object({
  arrangement: z.enum(['horizontal', 'vertical']),
  gap: z.number().min(0).max(100),
  alignSize: z.boolean(),
})

export const ImageUploadSchema = z.object({
  files: z.array(ImageFileValidationSchema).min(1).max(10),
})

// 定数定義
export const IMAGE_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 10,
  VALID_FORMATS: ['image/jpeg', 'image/png'] as const,
  DEFAULT_GAP: 0,
  CANVAS_MAX_SIZE: 16384,
} as const

// Canvas処理関連型
export type CanvasSize = {
  readonly width: number
  readonly height: number
}

export type LoadedImage = {
  readonly image: HTMLImageElement
  readonly width: number
  readonly height: number
}

export type DrawPosition = {
  readonly x: number
  readonly y: number
}