import React, { useCallback } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'

import { Button } from '../../../../shared/ui/Button'
import {
  ImageFile,
  ImageProcessingError,
  Result,
  IMAGE_CONSTRAINTS,
} from '../../types'

type ImageUploaderProps = {
  readonly onImagesUploaded: (files: ImageFile[]) => void
  readonly maxFiles: number
  readonly maxFileSize: number
  readonly disabled: boolean
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesUploaded,
  maxFiles,
  maxFileSize,
  disabled,
}) => {
  const validateFile = useCallback((file: File): Result<File, ImageProcessingError> => {
    if (file.size > maxFileSize) {
      return {
        success: false,
        error: { type: 'FILE_TOO_LARGE', maxSize: maxFileSize },
      }
    }

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
  }, [maxFileSize])

  const processFiles = useCallback(
    async (files: File[]): Promise<ImageFile[]> => {
      const imageFiles: ImageFile[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]!
        const validation = validateFile(file)

        if (!validation.success) {
          console.warn(`ファイル ${file.name} をスキップ:`, validation.error)
          continue
        }

        try {
          const preview = URL.createObjectURL(file)
          const image = new Image()

          await new Promise<void>((resolve, reject) => {
            image.onload = () => resolve()
            image.onerror = () => reject(new Error('画像の読み込みに失敗しました'))
            image.src = preview
          })

          const imageFile: ImageFile = {
            id: crypto.randomUUID(),
            file,
            preview,
            dimensions: {
              width: image.width,
              height: image.height,
            },
            order: i,
          }

          imageFiles.push(imageFile)
        } catch (error) {
          console.error(`画像ファイル ${file.name} の処理に失敗:`, error)
        }
      }

      return imageFiles
    },
    [validateFile]
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach(({ file, errors }) => {
          errors.forEach(error => {
            console.warn(`ファイル ${file.name}:`, error.message)
          })
        })
      }

      if (acceptedFiles.length > 0) {
        const imageFiles = await processFiles(acceptedFiles)
        onImagesUploaded(imageFiles)
      }
    },
    [processFiles, onImagesUploaded]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles,
    maxSize: maxFileSize,
    disabled,
    noClick: true,
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative rounded-lg border-2 border-dashed p-8 text-center transition-colors
          ${
            isDragActive
              ? 'border-blue-8 bg-blue-2'
              : 'border-gray-6 bg-gray-2 hover:border-gray-7'
          }
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-4 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-gray-11"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-12">
              {isDragActive
                ? 'ここにファイルをドロップしてください'
                : '画像をドラッグ&ドロップ'}
            </p>
            <p className="text-sm text-gray-11">
              JPEG、PNG形式のみ（最大{Math.floor(maxFileSize / (1024 * 1024))}MB、{maxFiles}
              枚まで）
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            disabled={disabled}
            loading={false}
            onClick={open}
            type="button"
            className=""
          >
            ファイルを選択
          </Button>
        </div>
      </div>
    </div>
  )
}

export { ImageUploader }
export type { ImageUploaderProps }