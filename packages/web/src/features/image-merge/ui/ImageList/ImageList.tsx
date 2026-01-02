import React from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Button } from '../../../../shared/ui/Button'
import { ImageFile } from '../../types'
import { formatFileSize } from '../../utils/image'

type ImageListProps = {
  readonly images: readonly ImageFile[]
  readonly onReorder: (images: ImageFile[]) => void
  readonly onRemove: (id: string) => void
}

const ImageList: React.FC<ImageListProps> = React.memo(({ images, onReorder, onRemove }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex(item => item.id === active.id)
      const newIndex = images.findIndex(item => item.id === over?.id)

      const reorderedImages = arrayMove([...images], oldIndex, newIndex)
      onReorder(reorderedImages)
    }
  }

  if (images.length === 0) {
    return (
      <div className="rounded-lg border border-gray-6 bg-gray-2 p-6 text-center">
        <p className="text-gray-11">画像がアップロードされていません</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-12">
          アップロード済み画像 ({images.length}件)
        </h3>
        <p className="text-sm text-gray-11">ドラッグ&ドロップで順序を変更できます</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map(img => img.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map(image => (
              <SortableImageItem key={image.id} image={image} onRemove={onRemove} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
})

ImageList.displayName = 'ImageList'

type SortableImageItemProps = {
  readonly image: ImageFile
  readonly onRemove: (id: string) => void
}

const SortableImageItem: React.FC<SortableImageItemProps> = React.memo(({ image, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleRemove = () => {
    onRemove(image.id)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg border border-gray-6 bg-gray-2 p-4 transition-colors hover:bg-gray-3 ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      {/* ドラッグハンドル */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 flex h-8 w-8 cursor-grab items-center justify-center rounded-full bg-blue-9 text-xs font-medium text-white hover:bg-blue-10 active:cursor-grabbing"
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* 画像プレビュー */}
      <div className="aspect-square overflow-hidden rounded-md bg-gray-4 mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.preview}
          alt={`プレビュー: ${image.file.name}`}
          className="h-full w-full object-cover no-drag pointer-events-none"
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
          <p>ファイルサイズ: {formatFileSize(image.file.size)}</p>
        </div>
      </div>

      {/* 削除ボタン */}
      <div className="absolute top-2 right-2 transition-opacity">
        <Button
          variant="danger"
          size="sm"
          disabled={false}
          loading={false}
          onClick={handleRemove}
          type="button"
        >
          <span>削除</span>
        </Button>
      </div>
    </div>
  )
})

SortableImageItem.displayName = 'SortableImageItem'

export { ImageList }
export type { ImageListProps }
