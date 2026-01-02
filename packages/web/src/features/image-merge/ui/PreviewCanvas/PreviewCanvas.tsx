import React, { useEffect, useRef, useState, useCallback } from 'react'

import { ImageFile, MergeOptions } from '../../types'
import { mergeImages } from '../../utils/canvas'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner'
import { Button } from '../../../../shared/ui/Button'

type PreviewCanvasProps = {
  readonly images: readonly ImageFile[]
  readonly settings: MergeOptions
  readonly onExport: () => void
  readonly isExporting: boolean
}

const PreviewCanvas: React.FC<PreviewCanvasProps> = React.memo(
  ({ images, settings, onExport, isExporting }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const updatePreview = useCallback(async () => {
      if (images.length === 0 || !canvasRef.current) {
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        await mergeImages(Array.from(images), settings, canvasRef.current)

        // プレビュー用のData URLを生成（透明背景保持のためPNG）
        const dataUrl = canvasRef.current.toDataURL('image/png')
        setPreviewUrl(dataUrl)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました'
        setError(errorMessage)
        console.error('プレビュー生成エラー:', err)
      } finally {
        setIsLoading(false)
      }
    }, [images, settings])

    // 画像や設定が変更されたときにプレビューを更新
    useEffect(() => {
      updatePreview()
    }, [updatePreview])

    // クリーンアップ
    useEffect(() => {
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
        }
      }
    }, [previewUrl])

    const canMerge = images.length >= 2

    if (images.length === 0) {
      return (
        <div className="rounded-lg border border-gray-6 bg-gray-2 p-8 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-4 flex items-center justify-center">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-12 mb-2">プレビューなし</h3>
          <p className="text-gray-11">画像をアップロードするとプレビューが表示されます</p>
        </div>
      )
    }

    if (!canMerge) {
      return (
        <div className="rounded-lg border border-amber-6 bg-amber-2 p-8 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-amber-4 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-amber-11"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-amber-12 mb-2">画像が不足</h3>
          <p className="text-amber-11">
            結合するには2枚以上の画像が必要です（現在: {images.length}枚）
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-8">
        <div className="space-y-4">
          {/* プレビューエリア */}
          <div className="rounded-lg border border-gray-6 bg-gray-2 p-4">
            {error ? (
              <div className="text-center py-8">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-4 flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-red-11"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-red-12 mb-2">エラーが発生しました</h4>
                <p className="text-red-11 text-sm mb-4">{error}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isLoading}
                  loading={false}
                  onClick={updatePreview}
                  type="button"
                  className=""
                >
                  再試行
                </Button>
              </div>
            ) : (
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-1 bg-opacity-75 flex items-center justify-center z-10 rounded-md">
                    <LoadingSpinner size="lg" className="" label="プレビューを生成中..." />
                  </div>
                )}

                <canvas
                  ref={canvasRef}
                  className={`max-w-full h-auto mx-auto block border border-gray-6 rounded-md ${
                    isLoading ? 'opacity-50' : ''
                  }`}
                  style={{
                    maxHeight: '400px',
                    objectFit: 'contain',
                    backgroundColor: 'transparent',
                    // チェッカーボード背景で透明度を視覚化（薄いグレー）
                    backgroundImage:
                      'linear-gradient(45deg, #f8f8f8 25%, transparent 25%), linear-gradient(-45deg, #f8f8f8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8f8f8 75%), linear-gradient(-45deg, transparent 75%, #f8f8f8 75%)',
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                  }}
                />

                {!isLoading && canvasRef.current && (
                  <div className="mt-3 text-center text-sm text-gray-11">
                    サイズ: {canvasRef.current.width} × {canvasRef.current.height}px
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ダウンロードボタン */}
          {!error && !isLoading && (
            <div className="flex justify-center">
              <Button
                variant="primary"
                size="lg"
                disabled={isExporting}
                loading={isExporting}
                onClick={onExport}
                type="button"
                className=""
              >
                画像をダウンロード
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }
)

PreviewCanvas.displayName = 'PreviewCanvas'

export { PreviewCanvas }
export type { PreviewCanvasProps }
