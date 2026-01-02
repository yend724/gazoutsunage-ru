# 開発ガイドライン - ガゾウツナゲール

## 1. はじめに

このドキュメントは「ガゾウツナゲール」プロジェクトの開発に関するコーディング規約、命名規則、品質基準を定義します。
すべての開発者はこのガイドラインにしたがって開発を進めてください。

## 2. コーディング規約

### 2.1 関数型プログラミング指針

本プロジェクトでは関数型プログラミングパラダイムを基本とし、副作用のある処理とない処理を明確に分離します。

#### 純粋関数（Pure Functions）
```typescript
// ✅ Good: 純粋関数 - 同じ入力に対して常に同じ出力
const calculateImageDimensions = (
  images: readonly ImageDimension[],
  arrangement: ArrangementType,
  margin: number
): { width: number; height: number } => {
  if (arrangement === 'horizontal') {
    const totalWidth = images.reduce((sum, img) => sum + img.width, 0) + margin * (images.length - 1)
    const maxHeight = Math.max(...images.map(img => img.height))
    return { width: totalWidth, height: maxHeight }
  }
  
  const maxWidth = Math.max(...images.map(img => img.width))
  const totalHeight = images.reduce((sum, img) => sum + img.height, 0) + margin * (images.length - 1)
  return { width: maxWidth, height: totalHeight }
}

// ✅ Good: 純粋関数 - 配列操作は新しい配列を返す
const addImageToList = (images: readonly ImageItem[], newImage: ImageItem): readonly ImageItem[] => {
  return [...images, { ...newImage, order: images.length }]
}

const removeImageFromList = (images: readonly ImageItem[], imageId: string): readonly ImageItem[] => {
  return images.filter(img => img.id !== imageId)
}
```

#### 副作用のある処理（Side Effects）
```typescript
// ✅ Good: 副作用のある処理は明確にマーキング
const saveImageToDownload = async (dataUrl: string, filename: string): Promise<void> => {
  // DOM操作、ファイルダウンロードは副作用
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const logProcessingTime = (startTime: number, operation: string): void => {
  // コンソール出力は副作用
  const elapsed = performance.now() - startTime
  console.log(`${operation} completed in ${elapsed.toFixed(2)}ms`)
}

// ✅ Good: 副作用のある処理と純粋な処理を分離
const processImageWithLogging = async (
  file: File,
  options: ProcessOptions
): Promise<ImageItem> => {
  const startTime = performance.now()
  
  // 純粋な処理
  const validationResult = validateImageFile(file)
  if (!validationResult.success) {
    throw new Error(validationResult.error.message)
  }
  
  // 副作用のある処理（DOM API使用）
  const preview = await createImagePreview(file)
  const imageItem = createImageItem(file, preview, generateId())
  
  // 副作用のある処理（ログ出力）
  logProcessingTime(startTime, 'Image processing')
  
  return imageItem
}
```

#### Immutability（不変性）
```typescript
// ✅ Good: ReadonlyとConstアサーションの使用
const IMAGE_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  MAX_FILES: 10,
  VALID_FORMATS: ['image/jpeg', 'image/png']
} as const

interface ImageState {
  readonly images: readonly ImageItem[]
  readonly arrangement: ArrangementType
  readonly margin: number
  readonly isProcessing: boolean
}

// ✅ Good: 状態更新は新しいオブジェクトを返す
const updateImageState = (
  state: ImageState,
  action: ImageAction
): ImageState => {
  switch (action.type) {
    case 'ADD_IMAGES':
      return {
        ...state,
        images: [...state.images, ...action.payload]
      }
    
    case 'REMOVE_IMAGE':
      return {
        ...state,
        images: state.images.filter(img => img.id !== action.payload.id)
      }
    
    case 'SET_ARRANGEMENT':
      return {
        ...state,
        arrangement: action.payload
      }
    
    default:
      return state
  }
}
```

#### Higher-Order Functions（高階関数）
```typescript
// ✅ Good: 高階関数を活用したコード再利用
const withErrorHandling = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  errorHandler: (error: Error) => void = console.error
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args)
    } catch (error) {
      errorHandler(error as Error)
      return null
    }
  }
}

const withPerformanceLogging = <T extends unknown[], R>(
  fn: (...args: T) => R,
  label: string
) => {
  return (...args: T): R => {
    const startTime = performance.now()
    const result = fn(...args)
    const elapsed = performance.now() - startTime
    console.log(`${label} took ${elapsed.toFixed(2)}ms`)
    return result
  }
}

// 使用例
const safeProcessImage = withErrorHandling(processImage)
const timedCalculateDimensions = withPerformanceLogging(calculateImageDimensions, 'Dimension calculation')
```

#### 関数合成（Function Composition）
```typescript
// ✅ Good: 小さな関数を組み合わせて複雑な処理を構築
const pipe = <T>(...fns: Array<(arg: T) => T>) => (value: T): T =>
  fns.reduce((acc, fn) => fn(acc), value)

const compose = <T>(...fns: Array<(arg: T) => T>) => (value: T): T =>
  fns.reduceRight((acc, fn) => fn(acc), value)

// 個別の変換関数
const validateFiles = (files: File[]): File[] => {
  return files.filter(file => validateImageFile(file).success)
}

const limitFileCount = (maxFiles: number) => (files: File[]): File[] => {
  return files.slice(0, maxFiles)
}

const sortFilesByName = (files: File[]): File[] => {
  return [...files].sort((a, b) => a.name.localeCompare(b.name))
}

// 関数を組み合わせたパイプライン
const processUploadedFiles = pipe(
  validateFiles,
  limitFileCount(10),
  sortFilesByName
)

// 使用例
const processFileUpload = (files: File[]): File[] => {
  return processUploadedFiles(files)
}
```

#### Result型によるエラーハンドリング
```typescript
// ✅ Good: Result型で例外を避けた関数型エラーハンドリング
type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E }

const safeParseInt = (str: string): Result<number, string> => {
  const num = parseInt(str, 10)
  if (isNaN(num)) {
    return { success: false, error: `"${str}" is not a valid number` }
  }
  return { success: true, data: num }
}

const safeDivide = (a: number, b: number): Result<number, string> => {
  if (b === 0) {
    return { success: false, error: 'Division by zero' }
  }
  return { success: true, data: a / b }
}

// Result型のヘルパー関数
const map = <T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> => {
  return result.success ? { success: true, data: fn(result.data) } : result
}

const flatMap = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> => {
  return result.success ? fn(result.data) : result
}

// 使用例: 関数型パイプライン
const calculatePercentage = (numeratorStr: string, denominatorStr: string): Result<number, string> => {
  return flatMap(
    safeParseInt(numeratorStr),
    numerator => flatMap(
      safeParseInt(denominatorStr),
      denominator => map(
        safeDivide(numerator, denominator),
        ratio => ratio * 100
      )
    )
  )
}
```

### 2.2 TypeScript基本規則

#### 型定義
```typescript
// ✅ Good: type優先の型定義
type ImageItem = {
  readonly id: string
  readonly file: File
  readonly preview: string
  readonly order: number
}

// ❌ Bad: any型の使用
const data: any = getImageData()

// ❌ Bad: オプショナルパラメータの使用
type ImageUploaderProps = {
  maxFiles?: number  // ❌ Bad
}

// ✅ Good: 必須パラメータとして定義
type ImageUploaderProps = {
  maxFiles: number  // ✅ Good: 必ず値を渡す設計
}

// ✅ Good: 適切な型注釈
const processImages = async (images: ImageItem[]): Promise<string> => {
  // 処理
}
```

#### 関数定義
```typescript
// ✅ Good: アロー関数を優先使用
const calculateTotalWidth = (images: ImageItem[], margin: number): number => {
  return images.reduce((total, img) => total + img.width, 0) + margin * (images.length - 1)
}

// ✅ Good: Reactコンポーネントもアロー関数で定義
const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ image, onDelete }) => {
  return (
    <div className="thumbnail">
      <img src={image.preview} alt={`画像 ${image.order}`} />
      <button onClick={() => onDelete(image.id)}>削除</button>
    </div>
  )
}

// ❌ Bad: function宣言は使用しない
function processImage(file: File): Promise<ImageItem> {  // ❌ Bad
  // 処理
}

// ✅ Good: アロー関数で統一
const processImage = async (file: File): Promise<ImageItem> => {  // ✅ Good
  // 処理
}
```

#### エラーハンドリング
```typescript
// ✅ Good: 明示的なエラー型定義
type ImageProcessingError = 
  | { type: 'FILE_TOO_LARGE'; maxSize: number }
  | { type: 'INVALID_FORMAT'; validFormats: string[] }
  | { type: 'CANVAS_ERROR'; message: string }

const validateImage = (file: File): Result<File, ImageProcessingError> => {
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: { type: 'FILE_TOO_LARGE', maxSize: MAX_FILE_SIZE } }
  }
  
  if (!VALID_FORMATS.includes(file.type)) {
    return { success: false, error: { type: 'INVALID_FORMAT', validFormats: VALID_FORMATS } }
  }
  
  return { success: true, data: file }
}
```

### 2.2 React規則

#### コンポーネント設計
```typescript
// ✅ Good: Props型定義を先に記述
interface UploadZoneProps {
  readonly onFilesSelected: (files: File[]) => void
  readonly maxFiles?: number
  readonly disabled?: boolean
}

// ✅ Good: デフォルトPropsの型安全な定義
const UploadZone: React.FC<UploadZoneProps> = ({ 
  onFilesSelected, 
  maxFiles = 10,
  disabled = false 
}) => {
  // ✅ Good: カスタムフックでロジック分離
  const { isDragOver, handleDrop, handleFileSelect } = useFileUpload({
    onFilesSelected,
    maxFiles,
    disabled
  })
  
  return (
    <div 
      className={cn(
        "upload-zone",
        isDragOver && "drag-over",
        disabled && "disabled"
      )}
      onDrop={handleDrop}
    >
      {/* JSX */}
    </div>
  )
}
```

#### Hooks使用規則
```typescript
// ✅ Good: カスタムフック
const useImageMerger = () => {
  const [images, setImages] = useState<ImageItem[]>([])
  const [arrangement, setArrangement] = useState<'horizontal' | 'vertical'>('horizontal')
  
  // ✅ Good: useCallbackでパフォーマンス最適化
  const addImages = useCallback((files: File[]) => {
    const newImages = files.map((file, index) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      order: images.length + index
    }))
    setImages(prev => [...prev, ...newImages])
  }, [images.length])
  
  // ✅ Good: クリーンアップ処理
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview))
    }
  }, [images])
  
  return { images, arrangement, addImages, setArrangement }
}
```

### 2.3 スタイリング規約（Tailwind CSS 4.x）

#### クラス名の順序
```typescript
// ✅ Good: 推奨順序 - レイアウト → 見た目 → インタラクション
const Button: React.FC<ButtonProps> = ({ children, variant, onClick }) => (
  <button
    className={cn(
      // レイアウト
      "flex items-center justify-center px-4 py-2",
      // 見た目
      "bg-blue-500 text-white rounded-md font-medium",
      // インタラクション
      "hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500",
      // 条件付きスタイル
      variant === "secondary" && "bg-gray-500 hover:bg-gray-600"
    )}
    onClick={onClick}
  >
    {children}
  </button>
)
```

#### レスポンシブデザイン
```typescript
// ✅ Good: モバイルファースト
const Layout: React.FC = ({ children }) => (
  <div className="
    flex flex-col
    sm:flex-row
    md:grid md:grid-cols-[300px_1fr]
    lg:grid-cols-[400px_1fr]
    gap-4 p-4
  ">
    {children}
  </div>
)
```

#### Radix Colorsの使用
```typescript
// ✅ Good: セマンティックなカラー使用
const AlertMessage: React.FC<AlertProps> = ({ type, message }) => (
  <div className={cn(
    "p-4 rounded-md border",
    type === "error" && "bg-red-2 border-red-6 text-red-11",
    type === "warning" && "bg-amber-2 border-amber-6 text-amber-11",
    type === "success" && "bg-green-2 border-green-6 text-green-11"
  )}>
    {message}
  </div>
)
```

## 3. 命名規則

### 3.1 ファイル・ディレクトリ命名

#### 基本規則
- ディレクトリ名: ケバブケース（例: `image-merge`）
- コンポーネントファイル: パスカルケース（例: `ImageUploader.tsx`）
- その他のファイル: キャメルケース（例: `useImageMerge.ts`）
- **重要**: 各モジュールは必ず`index.ts`または`index.tsx`でエクスポートする

#### エクスポート規則
```typescript
// ImageUploader/index.tsx
export { ImageUploader } from './ImageUploader'
export type { ImageUploaderProps } from './ImageUploader'

// hooks/useImageMerge/index.ts
export { useImageMerge } from './useImageMerge'

// utils/canvas/index.ts
export { mergeImages, calculateCanvasSize } from './canvas'
export type { CanvasOptions } from './canvas'
```

#### ディレクトリ構造例
```
packages/
└── web/
    └── src/
        ├── app/                      # Next.js App Router（小文字）
        ├── views/                    # ページコンポーネント（小文字）
        │   └── home/                # ケバブケース
        │       ├── HomePage.tsx
        │       └── index.tsx        # 必須: エクスポート用
        ├── features/                 # 機能単位（小文字）
        │   └── image-merge/         # ケバブケース
        │       ├── ui/              # UIコンポーネント
        │       │   ├── ImageUploader/
        │       │   │   ├── ImageUploader.tsx
        │       │   │   └── index.tsx
        │       │   └── ImageList/
        │       │       ├── ImageList.tsx
        │       │       └── index.tsx
        │       ├── hooks/           # カスタムフック
        │       │   └── useImageMerge/
        │       │       ├── useImageMerge.ts
        │       │       └── index.ts
        │       ├── utils/           # ユーティリティ
        │       │   └── canvas/
        │       │       ├── canvas.ts
        │       │       └── index.ts
        │       └── types/
        │           └── index.ts
        └── shared/                   # 共有レイヤー（小文字）
            ├── ui/                  # 共通UIコンポーネント
            │   └── Button/
            │       ├── Button.tsx
            │       └── index.tsx
            └── styles/
                └── globals.css
```

### 3.2 変数・関数命名

```typescript
// ✅ Good: 説明的で具体的な命名
const maxFileSize = 5 * 1024 * 1024 // 5MB
const validImageFormats = ['image/jpeg', 'image/png'] as const
const isValidImageFormat = (file: File): boolean => validImageFormats.includes(file.type)

// ✅ Good: Booleanは is/has/can で始める
const isProcessing = false
const hasError = false
const canDownload = images.length > 0

// ✅ Good: コンポーネントはパスカルケース
const ImageThumbnail: React.FC<ImageThumbnailProps> = () => {}
const UploadZone: React.FC<UploadZoneProps> = () => {}

// ✅ Good: カスタムフックは use で始める
const useImageMerger = () => {}
const useFileUpload = () => {}
```

### 3.3 型・インターフェイス命名

```typescript
// ✅ Good: type優先で型定義
type ArrangementType = 'horizontal' | 'vertical'
type ImageFormat = 'image/jpeg' | 'image/png'

// ✅ Good: type定義（Props は接尾辞）
type ImageItem = {
  readonly id: string
  readonly file: File
  readonly preview: string
  readonly order: number
}

// ❌ Bad: interfaceは使用しない
interface UploadZoneProps {  // ❌ Bad
  readonly onFilesSelected: (files: File[]) => void
  readonly maxFiles?: number  // ❌ Bad: オプショナル
}

// ✅ Good: type定義、オプショナル禁止
type UploadZoneProps = {
  readonly onFilesSelected: (files: File[]) => void
  readonly maxFiles: number  // ✅ Good: 必須
}

// ✅ Good: エラー型（Error 接尾辞）
type ValidationError = {
  readonly type: string
  readonly message: string
}
```

### 3.4 定数命名

```typescript
// ✅ Good: SCREAMING_SNAKE_CASE
const MAX_FILE_SIZE = 5 * 1024 * 1024
const VALID_IMAGE_FORMATS = ['image/jpeg', 'image/png'] as const
const DEFAULT_MARGIN = 10
const CANVAS_MAX_SIZE = 16384

// ✅ Good: 設定オブジェクト
const IMAGE_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  MAX_FILES: 10,
  VALID_FORMATS: ['image/jpeg', 'image/png']
} as const
```

## 4. テスト規約

### 4.1 テストファイル構成

```
src/
├── features/
│   └── image-merger/
│       ├── ui/
│       │   ├── upload-zone.tsx
│       │   └── __tests__/
│       │       └── upload-zone.test.tsx
│       └── lib/
│           ├── image-combiner.ts
│           └── __tests__/
│               └── image-combiner.test.ts
└── shared/
    └── lib/
        ├── file-validator.ts
        └── __tests__/
            └── file-validator.test.ts

tests/
├── fixtures/
│   └── images/
│       ├── sample.jpg
│       └── large.jpg
└── e2e/
    ├── image-merger.spec.ts
    └── visual.spec.ts
```

### 4.2 テスト命名規則

```typescript
// ✅ Good: describe/it による構造化
describe('FileValidator', () => {
  describe('validateFileSize', () => {
    it('ファイルサイズが制限内の場合、成功を返す', () => {
      // テスト内容
    })
    
    it('ファイルサイズが制限を超える場合、エラーを返す', () => {
      // テスト内容
    })
  })
  
  describe('validateFileFormat', () => {
    it('対応形式の場合、成功を返す', () => {
      // テスト内容
    })
    
    it('未対応形式の場合、エラーを返す', () => {
      // テスト内容
    })
  })
})
```

### 4.3 E2Eテスト規約

```typescript
// ✅ Good: ユーザーフロー重視の命名
test.describe('画像結合機能', () => {
  test('2枚の画像を横並びで結合してダウンロードできる', async ({ page }) => {
    // Given: 初期状態
    await page.goto('/')
    
    // When: ユーザーアクション
    await page.setInputFiles('[data-testid="upload-zone"]', [
      'tests/fixtures/images/sample1.jpg',
      'tests/fixtures/images/sample2.jpg'
    ])
    await page.getByLabel('横並び').check()
    
    // Then: 期待結果
    await expect(page.getByTestId('preview-canvas')).toBeVisible()
    
    // When: ダウンロード実行
    const downloadPromise = page.waitForEvent('download')
    await page.getByText('ダウンロード').click()
    
    // Then: ダウンロード完了
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/^merged_\d{8}_\d{6}\.png$/)
  })
})
```

## 5. Git規約

### 5.1 ブランチ命名規則

```bash
# ✅ Good: プレフィックス付き命名
feature/add-image-rotation     # 新機能
bugfix/fix-canvas-memory-leak  # バグ修正
hotfix/security-patch         # 緊急修正
refactor/simplify-upload-logic # リファクタリング
docs/update-api-documentation  # ドキュメント更新
test/add-e2e-coverage         # テスト追加
```

### 5.2 コミットメッセージ規約

```bash
# ✅ Good: 簡潔で分かりやすいメッセージ
feat: 画像回転機能を追加
fix: キャンバスのメモリリーク問題を修正
docs: READMEのセットアップ手順を更新
test: ファイルアップロードのE2Eテストを追加
refactor: 画像処理ロジックを簡素化
style: Tailwind CSSクラスの順序を統一
perf: 大容量ファイル処理を最適化

# ❌ Bad: 曖昧なメッセージ
update code
fix bug
change style
add feature
```

### 5.3 プルリクエスト規約

```markdown
## 概要
画像回転機能を追加しました。

## 変更内容
- 90度、180度、270度の回転機能を実装
- 回転後のプレビュー表示を追加
- 回転状態を保持する状態管理を追加

## テスト内容
- [ ] 各角度での回転が正しく動作することを確認
- [ ] 回転後の画像サイズが正しく計算されることを確認
- [ ] E2Eテストが通過することを確認

## 確認事項
- [ ] TypeScript型チェックが通過している
- [ ] ESLintエラーがない
- [ ] Unitテストが通過している
- [ ] E2Eテストが通過している
```

## 6. パフォーマンス規約

### 6.1 React最適化

```typescript
// ✅ Good: React.memo でのメモ化
const ImageThumbnail = React.memo<ImageThumbnailProps>(({ image, onDelete }) => {
  return (
    <div className="thumbnail">
      <img src={image.preview} alt={`画像 ${image.order}`} />
      <button onClick={() => onDelete(image.id)}>削除</button>
    </div>
  )
})

// ✅ Good: useCallback でのコールバック最適化
const ImageList: React.FC<ImageListProps> = ({ images, onDeleteImage }) => {
  const handleDelete = useCallback((imageId: string) => {
    onDeleteImage(imageId)
  }, [onDeleteImage])
  
  return (
    <div>
      {images.map(image => (
        <ImageThumbnail 
          key={image.id} 
          image={image} 
          onDelete={handleDelete} 
        />
      ))}
    </div>
  )
}
```

### 6.2 画像処理最適化

```typescript
// ✅ Good: 段階的画像処理
const processImagesSequentially = async (files: File[]): Promise<ImageItem[]> => {
  const results: ImageItem[] = []
  
  for (const file of files) {
    // 1枚ずつ処理してUIをブロックしない
    const imageItem = await processImage(file)
    results.push(imageItem)
    
    // React の状態更新を間に挟む
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  
  return results
}

// ✅ Good: メモリ管理
const createImagePreview = (file: File): { preview: string; cleanup: () => void } => {
  const preview = URL.createObjectURL(file)
  const cleanup = () => URL.revokeObjectURL(preview)
  
  return { preview, cleanup }
}
```

## 7. セキュリティ規約

### 7.1 入力値検証

```typescript
// ✅ Good: Zodによる型安全なバリデーション
import { z } from 'zod'

// スキーマ定義
const ImageFileSchema = z.object({
  name: z.string().transform(name => name.replace(/[<>:"/\\|?*]/g, '_')),
  type: z.enum(['image/jpeg', 'image/png']),
  size: z.number().max(5 * 1024 * 1024, 'ファイルサイズは5MB以下にしてください')
})

const MergeOptionsSchema = z.object({
  arrangement: z.enum(['horizontal', 'vertical']),
  gap: z.number().min(0).max(100)
})

// 使用例
const validateImageFile = (file: File): Result<File, z.ZodError> => {
  const result = ImageFileSchema.safeParse({
    name: file.name,
    type: file.type,
    size: file.size
  })
  
  if (!result.success) {
    return { success: false, error: result.error }
  }
  
  return { success: true, data: file }
}

// APIリクエストのバリデーション
const ImageMergeRequestSchema = z.object({
  images: z.array(z.string()).min(2).max(10),
  options: MergeOptionsSchema
})

type ImageMergeRequest = z.infer<typeof ImageMergeRequestSchema>

// フォーム入力のバリデーション
const useImageForm = () => {
  const [errors, setErrors] = useState<z.ZodError | null>(null)
  
  const validateForm = (data: unknown) => {
    const result = ImageMergeRequestSchema.safeParse(data)
    if (!result.success) {
      setErrors(result.error)
      return false
    }
    setErrors(null)
    return true
  }
  
  return { validateForm, errors }
}
```

### 7.2 XSS対策

```typescript
// ✅ Good: React標準の自動エスケープを活用
const SafeFileDisplay: React.FC<{ fileName: string }> = ({ fileName }) => {
  // React が自動的にエスケープするため安全
  return <span className="file-name">{fileName}</span>
}

// ❌ Bad: innerHTML は使用禁止
// const UnsafeDisplay = ({ content }) => (
//   <div dangerouslySetInnerHTML={{ __html: content }} />
// )
```

## 8. アクセシビリティ規約

### 8.1 キーボード操作対応

```typescript
// ✅ Good: キーボードナビゲーション対応
const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ image, onDelete, onMove }) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'Delete':
        onDelete(image.id)
        break
      case 'ArrowLeft':
        onMove(image.id, 'left')
        break
      case 'ArrowRight':
        onMove(image.id, 'right')
        break
    }
  }
  
  return (
    <div 
      className="thumbnail focus:outline-none focus:ring-2 focus:ring-blue-500"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`画像 ${image.order}: ${image.file.name}`}
    >
      <img src={image.preview} alt="" />
      <button 
        onClick={() => onDelete(image.id)}
        aria-label={`画像 ${image.file.name} を削除`}
      >
        削除
      </button>
    </div>
  )
}
```

### 8.2 ARIA属性の活用

```typescript
// ✅ Good: 適切なARIA属性
const UploadProgress: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="progress-container">
    <div 
      className="progress-bar"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="アップロード進行状況"
    >
      <div 
        className="progress-fill bg-blue-500"
        style={{ width: `${progress}%` }}
      />
    </div>
    <span aria-live="polite">{progress}% 完了</span>
  </div>
)
```

## 9. エラーハンドリング規約

### 9.1 エラー境界の実装

```typescript
// ✅ Good: 包括的なエラー境界
class ImageProcessingErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('画像処理エラー:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="text-red-800 font-medium">画像処理中にエラーが発生しました</h3>
          <p className="text-red-600 mt-2">
            ページを再読み込みして、再度お試しください。
          </p>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

### 9.2 ユーザーフレンドリーなエラー表示

```typescript
// ✅ Good: 分かりやすいエラーメッセージ
const getErrorMessage = (error: ImageProcessingError): string => {
  switch (error.type) {
    case 'FILE_TOO_LARGE':
      return `ファイルサイズは${formatFileSize(error.maxSize)}以下にしてください`
    case 'INVALID_FORMAT':
      return `対応形式は${error.validFormats.join(', ')}のみです`
    case 'CANVAS_ERROR':
      return '画像が大きすぎます。数を減らしてください'
    default:
      return '画像処理中にエラーが発生しました'
  }
}
```

## 10. ドキュメント規約

### 10.1 JSDocコメント

```typescript
/**
 * 複数の画像を指定された配置で結合する
 * @param images - 結合する画像の配列
 * @param options - 結合オプション
 * @returns 結合された画像のデータURL
 * @throws {Error} キャンバスサイズが制限を超えた場合
 */
const combineImages = async (
  images: ImageItem[],
  options: CombineOptions
): Promise<string> => {
  // 実装
}

/**
 * ファイルが有効な画像形式かチェックする
 * @param file - チェックするファイル
 * @returns 有効な場合true、無効な場合false
 */
const isValidImageFile = (file: File): boolean => {
  return VALID_IMAGE_FORMATS.includes(file.type as ImageFormat)
}
```

### 10.2 README記述規約

```markdown
# プロジェクト名

簡潔な説明（1〜2行）

## セットアップ

\`\`\`bash
# 依存関係インストール
pnpm install

# 開発サーバー起動
pnpm dev
\`\`\`

## コマンド

| コマンド | 説明 |
|----------|------|
| `pnpm dev` | 開発サーバー起動 |
| `pnpm build` | 本番ビルド |
| `pnpm test` | Unitテスト実行 |
| `pnpm test:e2e` | E2Eテスト実行 |

## 技術スタック

- Next.js 16.1.1
- TypeScript 5.x
- Tailwind CSS 4.x
- Vitest + Playwright
```

これらのガイドラインにしたがって、保守性と品質の高いコードを書きましょう。