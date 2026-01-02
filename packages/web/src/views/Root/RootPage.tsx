'use client'

import { useCallback, useMemo } from 'react'
import { ImageUploader } from '../../features/image-merge/ui/ImageUploader'
import { ImageList } from '../../features/image-merge/ui/ImageList'
import { MergeSettings } from '../../features/image-merge/ui/MergeSettings'
import { PreviewCanvas } from '../../features/image-merge/ui/PreviewCanvas'
import { useImageMerge } from '../../features/image-merge/hooks/useImageMerge'
import { IMAGE_CONSTRAINTS } from '../../features/image-merge/types'
import { downloadMergedImage } from '../../features/image-merge/utils/download'
import { Grid } from '../../shared/ui/Grid'

export const RootPage: React.FC = () => {
  const { state, addImages, removeImage, reorderImages, updateSettings, setProcessing } =
    useImageMerge()

  const canMerge = useMemo(() => state.images.length >= 2, [state.images.length])

  const handleDownload = useCallback(async () => {
    if (!canMerge) {
      return
    }

    setProcessing(true)
    try {
      await downloadMergedImage(state.images, state.settings)
    } catch (error) {
      console.error('ダウンロードエラー:', error)
      alert(error instanceof Error ? error.message : 'ダウンロード中にエラーが発生しました')
    } finally {
      setProcessing(false)
    }
  }, [canMerge, setProcessing, state.images, state.settings])

  return (
    <Grid gap="8">
      {/* 画像アップロード */}
      <Grid gap="4" asChild>
        <section>
          <h2 className="text-xl font-semibold text-gray-12">1. 画像をアップロード</h2>
          <ImageUploader
            onImagesUploaded={addImages}
            maxFiles={IMAGE_CONSTRAINTS.MAX_FILES}
            maxFileSize={IMAGE_CONSTRAINTS.MAX_FILE_SIZE}
            disabled={state.isProcessing}
          />
        </section>
      </Grid>

      {/* アップロード済み画像一覧 */}
      {state.images.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-12">2. 画像の確認・編集</h2>
          <ImageList images={state.images} onReorder={reorderImages} onRemove={removeImage} />
        </section>
      )}

      {/* 結合設定 */}
      {canMerge && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-12">3. 結合設定</h2>
          <MergeSettings
            settings={state.settings}
            onChange={updateSettings}
            disabled={state.isProcessing}
          />
        </section>
      )}

      {/* プレビューとダウンロード */}
      {state.images.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-12">プレビュー</h2>
          <PreviewCanvas
            images={state.images}
            settings={state.settings}
            onExport={handleDownload}
            isExporting={state.isProcessing}
          />
        </section>
      )}
    </Grid>
  )
}
