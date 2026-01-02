import React from 'react'

import { Button } from '../../../../shared/ui/Button'
import { ImageFile } from '../../types'
import { formatFileSize } from '../../utils/image'

type ImageListProps = {
  readonly images: readonly ImageFile[]
  readonly onReorder: (images: ImageFile[]) => void
  readonly onRemove: (id: string) => void
}

const ImageList: React.FC<ImageListProps> = ({ images, onReorder: _onReorder, onRemove }) => {
  if (images.length === 0) {
    return (
      <div className="rounded-lg border border-gray-6 bg-gray-2 p-6 text-center">
        <p className="text-gray-11">画像がアップロードされていません</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-12">
        アップロード済み画像 ({images.length}件)
      </h3>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map(image => (
          <ImageItem
            key={image.id}
            image={image}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  )
}

type ImageItemProps = {
  readonly image: ImageFile
  readonly onRemove: (id: string) => void
}

const ImageItem: React.FC<ImageItemProps> = ({ image, onRemove }) => {
  const handleRemove = () => {
    onRemove(image.id)
  }

  return (
    <div className="group relative rounded-lg border border-gray-6 bg-gray-2 p-4 transition-colors hover:bg-gray-3">
      {/* 画像プレビュー */}
      <div className="aspect-square overflow-hidden rounded-md bg-gray-4 mb-3">
        <img
          src={image.preview}
          alt={`プレビュー: ${image.file.name}`}
          className="h-full w-full object-cover no-drag"
          loading="lazy"
        />
      </div>

      {/* 画像情報 */}
      <div className="space-y-2">
        <h4 className="truncate text-sm font-medium text-gray-12" title={image.file.name}>
          {image.file.name}
        </h4>
        
        <div className="text-xs text-gray-11 space-y-1">
          <p>
            サイズ: {image.dimensions.width} × {image.dimensions.height}px
          </p>
          <p>
            ファイルサイズ: {formatFileSize(image.file.size)}
          </p>
        </div>
      </div>

      {/* 削除ボタン */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="danger"
          size="sm"
          disabled={false}
          loading={false}
          onClick={handleRemove}
          type="button"
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">削除</span>
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>

      {/* 順序番号 */}
      <div className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-9 text-xs font-medium text-white">
        {image.order + 1}
      </div>
    </div>
  )
}

export { ImageList }
export type { ImageListProps }