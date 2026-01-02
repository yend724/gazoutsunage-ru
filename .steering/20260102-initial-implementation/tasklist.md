# 初回実装タスクリスト

## 概要
「ガゾウツナゲール」の初回実装（MVP）に必要なタスクを定義します。
各タスクは依存関係を考慮して順序立てて実行します。

## タスク一覧

### Phase 1: プロジェクトセットアップ

#### 1.1 開発環境準備
- [ ] pnpm workspaceの設定
- [ ] packages/webディレクトリ作成
- [ ] Next.js 16.1.1のセットアップ（App Router）
- [ ] TypeScript設定
- [ ] ESLint設定（開発ガイドラインに準拠）
- [ ] Prettier設定

#### 1.2 スタイリング環境
- [ ] Tailwind CSS 4.x設定
- [ ] Radix Colors設定
- [ ] globals.css作成

#### 1.3 開発ツール設定
- [ ] Vitest設定
- [ ] React Testing Library設定
- [ ] Playwright設定
- [ ] テストディレクトリ構造作成

### Phase 2: 基盤実装

#### 2.1 ディレクトリ構造作成
```
- [ ] src/app/
- [ ] src/views/home/
- [ ] src/features/image-merge/
- [ ] src/features/image-merge/ui/
- [ ] src/features/image-merge/hooks/
- [ ] src/features/image-merge/utils/
- [ ] src/features/image-merge/types/
- [ ] src/shared/ui/
- [ ] src/shared/styles/
```

#### 2.2 共通コンポーネント
- [ ] shared/ui/Button/Button.tsx作成
- [ ] shared/ui/Button/index.tsx作成
- [ ] shared/ui/LoadingSpinner/LoadingSpinner.tsx作成
- [ ] shared/ui/LoadingSpinner/index.tsx作成

#### 2.3 型定義
- [ ] features/image-merge/types/index.ts（ImageFile, MergeOptions等）
- [ ] Zodスキーマ定義（ImageFileSchema, MergeOptionsSchema）

### Phase 3: 画像アップロード機能

#### 3.1 UIコンポーネント実装
- [ ] ImageUploader/ImageUploader.tsx作成
- [ ] ImageUploader/index.tsx作成
- [ ] react-dropzoneの導入と設定
- [ ] ドラッグ&ドロップUI実装
- [ ] ファイル選択ダイアログ実装

#### 3.2 バリデーション実装
- [ ] ファイル形式チェック（JPEG、PNG）
- [ ] ファイルサイズチェック（10MB制限）
- [ ] 最大ファイル数チェック（10枚制限）
- [ ] エラーメッセージ表示

#### 3.3 画像プレビュー生成
- [ ] utils/image/image.ts作成
- [ ] utils/image/index.ts作成
- [ ] Object URL生成処理
- [ ] サムネイル生成処理
- [ ] メモリ管理（URL解放処理）

### Phase 4: 画像管理機能

#### 4.1 画像一覧表示
- [ ] ImageList/ImageList.tsx作成
- [ ] ImageList/index.tsx作成
- [ ] サムネイル表示実装
- [ ] 画像情報表示（ファイル名、サイズ）

#### 4.2 ドラッグ&ドロップ順序変更
- [ ] @dnd-kit/sortableの導入
- [ ] ドラッグ可能なサムネイル実装
- [ ] 順序変更ロジック実装
- [ ] アニメーション実装

#### 4.3 画像削除機能
- [ ] 削除ボタンUI実装
- [ ] 削除確認（必要に応じて）
- [ ] 削除時のURL解放処理

### Phase 5: 画像結合機能

#### 5.1 結合設定UI
- [ ] MergeSettings/MergeSettings.tsx作成
- [ ] MergeSettings/index.tsx作成
- [ ] 配置方法選択（横並び/縦並び）ラジオボタン
- [ ] 設定変更時の状態更新

#### 5.2 プレビュー機能
- [ ] PreviewCanvas/PreviewCanvas.tsx作成
- [ ] PreviewCanvas/index.tsx作成
- [ ] Canvas要素の実装
- [ ] リアルタイムプレビュー更新
- [ ] 低解像度プレビュー実装（パフォーマンス最適化）

#### 5.3 Canvas処理実装
- [ ] utils/canvas/canvas.ts作成
- [ ] utils/canvas/index.ts作成
- [ ] 画像読み込み処理（loadImage）
- [ ] キャンバスサイズ計算（calculateCanvasSize）
- [ ] 画像配置・描画処理（drawImages）
- [ ] 横並び配置ロジック
- [ ] 縦並び配置ロジック

### Phase 6: ダウンロード機能

#### 6.1 エクスポート処理
- [ ] OffscreenCanvas実装
- [ ] フル解像度での画像結合
- [ ] Blob生成処理
- [ ] メモリ効率的な処理実装

#### 6.2 ダウンロードUI
- [ ] ダウンロードボタン実装
- [ ] ファイル名生成（merged_[timestamp].png）
- [ ] ダウンロード処理実装
- [ ] プログレス表示（必要に応じて）

### Phase 7: 状態管理とページ統合

#### 7.1 カスタムフック実装
- [ ] useImageMerge/useImageMerge.ts作成
- [ ] useImageMerge/index.ts作成
- [ ] useImageUpload/useImageUpload.ts作成
- [ ] useImageUpload/index.ts作成
- [ ] 画像リスト管理
- [ ] 設定管理
- [ ] エラーハンドリング

#### 7.2 ページ実装
- [ ] views/home/HomePage.tsx作成
- [ ] views/home/index.tsx作成
- [ ] コンポーネント統合
- [ ] レイアウト実装
- [ ] レスポンシブ対応

#### 7.3 ルーティング設定
- [ ] app/page.tsx更新（HomePageのエクスポート）
- [ ] app/layout.tsx実装
- [ ] メタデータ設定

### Phase 8: テスト実装

#### 8.1 ユニットテスト
- [ ] utils/canvas.test.ts作成
- [ ] utils/image.test.ts作成
- [ ] バリデーションロジックのテスト
- [ ] 画像処理ロジックのテスト

#### 8.2 コンポーネントテスト
- [ ] ImageUploaderテスト
- [ ] ImageListテスト
- [ ] PreviewCanvasテスト
- [ ] アクセシビリティテスト

#### 8.3 E2Eテスト
- [ ] 画像アップロードフロー
- [ ] 画像並び替えフロー
- [ ] 画像結合・ダウンロードフロー
- [ ] エラーケーステスト
- [ ] クロスブラウザテスト（Chrome、Safari、Edge）

### Phase 9: パフォーマンス最適化

#### 9.1 React最適化
- [ ] React.memoの適用
- [ ] useCallbackの適用
- [ ] 不要な再レンダリング防止

#### 9.2 画像処理最適化
- [ ] 大容量ファイルの段階的処理
- [ ] メモリ使用量の監視
- [ ] プレビュー画像の最適化

#### 9.3 バンドルサイズ最適化
- [ ] 動的インポートの実装
- [ ] Tree shakingの確認
- [ ] 未使用コードの削除

### Phase 10: 品質保証とドキュメント

#### 10.1 品質チェック
- [ ] TypeScript型チェック通過
- [ ] ESLintエラー解消
- [ ] アクセシビリティチェック
- [ ] Lighthouse CI設定・実行

#### 10.2 ドキュメント整備
- [ ] README.md作成
- [ ] API仕様書作成（utils関数）
- [ ] コンポーネントカタログ（Storybook検討）

## 完了条件

すべてのタスクが完了し、以下の条件を満たすこと：

1. **機能要件**
   - [ ] 画像アップロード（ドラッグ&ドロップ、ファイル選択）が動作する
   - [ ] 画像の順序変更・削除が可能
   - [ ] 横並び・縦並びでの結合が可能
   - [ ] PNG形式でのダウンロードが可能

2. **非機能要件**
   - [ ] 10枚の画像（各5MB）を10秒以内に結合
   - [ ] Chrome、Safari、Edgeで正常動作
   - [ ] TypeScript型エラーなし
   - [ ] ESLintエラーなし

3. **テスト**
   - [ ] ユニットテストカバレッジ80%以上
   - [ ] E2Eテスト全パス
   - [ ] 手動テスト完了

## 注意事項

- 各フェーズは順番に実行すること
- 依存関係のあるタスクは順序を守ること
- 各タスク完了時にコミットを行うこと
- テストは各機能実装直後に作成すること
- パフォーマンス要件を常に意識すること