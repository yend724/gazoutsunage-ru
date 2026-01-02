# 初回実装タスクリスト

## 概要
「ガゾウツナゲール」の初回実装（MVP）に必要なタスクを定義します。
各タスクは依存関係を考慮して順序立てて実行します。

## 進捗サマリー（2026年1月2日時点）

**✅ 完了フェーズ**: Phase 1-7（主要MVP機能完成）
**✅ Phase 4**: ドラッグ&ドロップ順序変更実装完了
**✅ Phase 7.5**: 追加機能実装完了
**✅ Phase 9.1**: React最適化完了
**⏳ 未着手**: Phase 9.2-10（パフォーマンス最適化・ドキュメント）

### 主要成果物
- 完全に動作するWebアプリケーション
- 画像アップロード、編集、結合、ダウンロード機能
- ドラッグ&ドロップによる順序変更
- **画像サイズ揃え機能**（小さい方に合わせてリサイズ）
- リアルタイムプレビュー（チェッカーボード背景で透明度視覚化）
- **透明背景での画像結合**（PNG形式出力）
- レスポンシブデザイン
- TypeScript型安全性、ESLint準拠

## タスク一覧

### Phase 1: プロジェクトセットアップ ✅

#### 1.1 開発環境準備
- [x] pnpm workspaceの設定
- [x] packages/webディレクトリ作成
- [x] Next.js 16.1.1のセットアップ（App Router）
- [x] TypeScript設定
- [x] ESLint設定（開発ガイドラインに準拠）
- [x] Prettier設定

#### 1.2 スタイリング環境
- [x] Tailwind CSS 4.x設定
- [x] Radix Colors設定
- [x] globals.css作成


### Phase 2: 基盤実装 ✅

#### 2.1 ディレクトリ構造作成
```
- [x] src/app/
- [x] src/views/home/
- [x] src/features/image-merge/
- [x] src/features/image-merge/ui/
- [x] src/features/image-merge/hooks/
- [x] src/features/image-merge/utils/
- [x] src/features/image-merge/types/
- [x] src/shared/ui/
- [x] src/shared/styles/
```

#### 2.2 共通コンポーネント
- [x] shared/ui/Button/Button.tsx作成
- [x] shared/ui/Button/index.tsx作成
- [x] shared/ui/LoadingSpinner/LoadingSpinner.tsx作成
- [x] shared/ui/LoadingSpinner/index.tsx作成

#### 2.3 型定義
- [x] features/image-merge/types/index.ts（ImageFile, MergeOptions等）
- [x] Zodスキーマ定義（ImageFileSchema, MergeOptionsSchema）

### Phase 3: 画像アップロード機能 ✅

#### 3.1 UIコンポーネント実装
- [x] ImageUploader/ImageUploader.tsx作成
- [x] ImageUploader/index.tsx作成
- [x] react-dropzoneの導入と設定
- [x] ドラッグ&ドロップUI実装
- [x] ファイル選択ダイアログ実装

#### 3.2 バリデーション実装
- [x] ファイル形式チェック（JPEG、PNG）
- [x] ファイルサイズチェック（10MB制限）
- [x] 最大ファイル数チェック（10枚制限）
- [x] エラーメッセージ表示

#### 3.3 画像プレビュー生成
- [x] utils/image/image.ts作成
- [x] utils/image/index.ts作成
- [x] Object URL生成処理
- [x] サムネイル生成処理
- [x] メモリ管理（URL解放処理）

### Phase 4: 画像管理機能 ✅

#### 4.1 画像一覧表示
- [x] ImageList/ImageList.tsx作成
- [x] ImageList/index.tsx作成
- [x] サムネイル表示実装
- [x] 画像情報表示（ファイル名、サイズ）

#### 4.2 ドラッグ&ドロップ順序変更
- [x] @dnd-kit/sortableの導入
- [x] ドラッグ可能なサムネイル実装
- [x] 順序変更ロジック実装
- [x] アニメーション実装
- [x] ドラッグハンドルUI実装

#### 4.3 画像削除機能
- [x] 削除ボタンUI実装
- [x] 削除確認（必要に応じて）
- [x] 削除時のURL解放処理

### Phase 5: 画像結合機能 ✅

#### 5.1 結合設定UI
- [x] MergeSettings/MergeSettings.tsx作成
- [x] MergeSettings/index.tsx作成
- [x] 配置方法選択（横並び/縦並び）ラジオボタン
- [x] 間隔設定スライダー実装
- [x] **サイズ揃え設定チェックボックス実装**
- [x] 設定変更時の状態更新

#### 5.2 プレビュー機能
- [x] PreviewCanvas/PreviewCanvas.tsx作成
- [x] PreviewCanvas/index.tsx作成
- [x] Canvas要素の実装
- [x] リアルタイムプレビュー更新
- [x] 低解像度プレビュー実装（パフォーマンス最適化）

#### 5.3 Canvas処理実装
- [x] utils/canvas/canvas.ts作成
- [x] utils/canvas/index.ts作成
- [x] 画像読み込み処理（loadImage）
- [x] キャンバスサイズ計算（calculateCanvasSize）
- [x] **画像サイズ正規化処理（normalizeImageSizes）**
- [x] 画像配置・描画処理（drawImages）
- [x] 横並び配置ロジック（高さ揃え対応）
- [x] 縦並び配置ロジック（幅揃え対応）

### Phase 6: ダウンロード機能 ✅

#### 6.1 エクスポート処理
- [x] OffscreenCanvas実装
- [x] フル解像度での画像結合
- [x] Blob生成処理
- [x] メモリ効率的な処理実装

#### 6.2 ダウンロードUI
- [x] ダウンロードボタン実装（PreviewCanvas内統合）
- [x] ファイル名生成（merged_[timestamp].png）
- [x] ダウンロード処理実装
- [x] エラーハンドリング実装

### Phase 7: 状態管理とページ統合 ✅

#### 7.1 カスタムフック実装
- [x] useImageMerge/useImageMerge.ts作成
- [x] useImageMerge/index.ts作成
- [x] 画像リスト管理
- [x] 設定管理
- [x] エラーハンドリング
- [x] メモリクリーンアップ処理

#### 7.2 ページ実装
- [x] views/home/HomePage.tsx作成
- [x] views/home/index.tsx作成
- [x] コンポーネント統合
- [x] レイアウト実装
- [x] レスポンシブ対応
- [x] 相対パス import対応

#### 7.3 ルーティング設定
- [x] app/page.tsx更新（HomePageのエクスポート）
- [x] app/layout.tsx実装
- [x] メタデータ設定

### Phase 7.5: 追加機能実装 ✅

#### 7.5.1 画像サイズ揃え機能
- [x] MergeOptions型にalignSizeオプション追加
- [x] normalizeImageSizes関数実装（小さい方に合わせるリサイズ）
- [x] Canvas処理でサイズ揃え対応
- [x] MergeSettingsにチェックボックス追加
- [x] デフォルトでサイズ揃えを有効化

#### 7.5.2 透明背景対応改善
- [x] PreviewCanvasのPNG形式対応
- [x] チェッカーボード背景で透明度視覚化
- [x] より薄いグレーでチェッカー色調整

#### 7.5.3 コード品質改善
- [x] ESLint警告修正（useCallback依存関係）
- [x] TypeScript型安全性向上


### Phase 9: パフォーマンス最適化

#### 9.1 React最適化 ✅
- [x] React.memoの適用
- [x] useCallbackの適用
- [x] 不要な再レンダリング防止

#### 9.2 画像処理最適化
- [ ] 大容量ファイルの段階的処理
- [ ] メモリ使用量の監視
- [ ] プレビュー画像の最適化

#### 9.3 バンドルサイズ最適化
- [ ] 動的インポートの実装
- [ ] Tree shakingの確認
- [ ] 未使用コードの削除

### Phase 10: 品質保証とドキュメント

#### 10.1 品質チェック ✅
- [x] TypeScript型チェック通過
- [x] ESLintエラー解消
- [ ] アクセシビリティチェック
- [ ] Lighthouse CI設定・実行

#### 10.2 ドキュメント整備
- [ ] README.md作成
- [ ] API仕様書作成（utils関数）
- [ ] コンポーネントカタログ（Storybook検討）

## 完了条件

すべてのタスクが完了し、以下の条件を満たすこと：

1. **機能要件**
   - [x] 画像アップロード（ドラッグ&ドロップ、ファイル選択）が動作する
   - [x] 画像の順序変更・削除が可能
   - [x] 横並び・縦並びでの結合が可能
   - [x] PNG形式でのダウンロードが可能

2. **非機能要件**
   - [x] TypeScript型エラーなし
   - [x] ESLintエラーなし（軽微な警告のみ）
   - [x] 開発サーバー正常起動
   - [x] ビルド成功
   - [ ] パフォーマンステスト（10枚の画像結合）
   - [ ] クロスブラウザテスト（Chrome、Safari、Edge）

## 注意事項

- 各フェーズは順番に実行すること
- 依存関係のあるタスクは順序を守ること
- 各タスク完了時にコミットを行うこと
- パフォーマンス要件を常に意識すること