'use client'

import { ImageUploader } from '../../features/image-merge/ui/ImageUploader'
import { ImageList } from '../../features/image-merge/ui/ImageList'
import { MergeSettings } from '../../features/image-merge/ui/MergeSettings'
import { PreviewCanvas } from '../../features/image-merge/ui/PreviewCanvas'
import { useImageMerge } from '../../features/image-merge/hooks/useImageMerge'
import { IMAGE_CONSTRAINTS } from '../../features/image-merge/types'
import { downloadMergedImage } from '../../features/image-merge/utils/download'
import { Button } from '../../shared/ui/Button'

const HomePage: React.FC = () => {
  const { state, addImages, removeImage, reorderImages, updateSettings, setProcessing, reset } = useImageMerge()

  const handleDownload = async () => {
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
  }

  const canMerge = state.images.length >= 2

  return (
    <div className="space-y-8">
      {/* 画像アップロード */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-12">1. 画像をアップロード</h2>
        <ImageUploader
          onImagesUploaded={addImages}
          maxFiles={IMAGE_CONSTRAINTS.MAX_FILES}
          maxFileSize={IMAGE_CONSTRAINTS.MAX_FILE_SIZE}
          disabled={state.isProcessing}
        />
      </section>

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
          <h2 className="mb-4 text-xl font-semibold text-gray-12">
            {canMerge ? '4. プレビューとダウンロード' : 'プレビュー'}
          </h2>
          <PreviewCanvas
            images={state.images}
            settings={state.settings}
            onExport={handleDownload}
            isExporting={state.isProcessing}
          />
        </section>
      )}

      {/* 操作ボタン */}
      {state.images.length > 0 && (
        <section>
          <div className="flex justify-center space-x-4">
            <Button
              variant="secondary"
              size="lg"
              disabled={state.isProcessing}
              loading={false}
              onClick={reset}
              type="button"
              className=""
            >
              すべてリセット
            </Button>
          </div>
        </section>
      )}

      {/* 使用方法 */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-12">使用方法</h2>
        <div className="rounded-lg border border-gray-6 bg-gray-2 p-6">
          <ol className="space-y-2 text-sm text-gray-11">
            <li>1. 結合したい画像をアップロードしてください（最大10枚、10MBまで）</li>
            <li>2. アップロードと同時に画像のプレビューが表示されます</li>
            <li>3. 画像の順序を確認し、必要に応じて削除してください</li>
            <li>4. 横並び・縦並びから配置方法を選択してください</li>
            <li>5. プレビューで結果を確認してから「高解像度で画像をダウンロード」ボタンをクリックしてください</li>
          </ol>
          <div className="mt-4 text-xs text-gray-10">
            <p>※ 対応形式: JPEG、PNG</p>
            <p>※ すべての処理はブラウザ上で行われ、画像がサーバーに送信されることはありません</p>
            <p>※ プレビューは低解像度版ですが、ダウンロードされる画像は元の解像度で生成されます</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export { HomePage }
