# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code) へのガイダンスを提供します。
必ず日本語で回答してください。

## プロジェクト概要

ガゾウツナゲール - 複数の画像を1つにつなげる無料オンラインツール
- ブラウザ内で完結する処理（サーバーサイド処理なし）
- Canvas APIを使用した画像合成
- 日本語UI

## 技術スタック

- **フレームワーク**: Next.js 15.3.3 (App Router)
- **言語**: TypeScript 5 (strict mode)
- **スタイリング**: Tailwind CSS 4 + Tailwind Variants
- **アーキテクチャ**: Package by Features
- **React**: v19

## コマンド

```bash
# 開発サーバー起動 (Turbopackを使用)
npm run dev

# プロダクションビルド
npm run build

# プロダクション実行
npm start

# Lintチェック
npm run lint
```

## アーキテクチャと主要な実装

### Package by Features構造
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト (Geistフォント使用)
│   ├── page.tsx           # ImageComposerを表示
│   └── globals.css        # Tailwind CSS 4のインポート
└── features/              
    └── image-composer/    
        ├── components/    
        │   ├── ImageComposer.tsx      # メイン統合コンポーネント
        │   ├── ImageUploader.tsx      # ドラッグ&ドロップ対応アップローダー
        │   ├── ImagePreview.tsx       # グリッド表示とサムネイル
        │   └── ComposerSettings.tsx   # 合成設定UI
        ├── types/         
        │   └── index.ts               # UploadedImage, ComposedImageSettings型定義
        ├── utils/         
        │   └── imageComposer.ts       # Canvas APIによる画像合成ロジック
        └── index.ts                   # 公開APIのエクスポート
```

### 画像合成の処理フロー

1. **画像アップロード** (`ImageUploader.tsx`)
   - FileAPIでファイルを読み込み
   - URL.createObjectURLでプレビュー用URL生成
   - Image要素で画像の幅・高さを取得

2. **合成処理** (`imageComposer.ts`)
   - `calculateCanvasSize()`: レイアウトに応じたキャンバスサイズ計算
   - `calculateImagePositions()`: 各画像の配置位置を決定
   - `composeImages()`: Canvas 2D APIで画像を描画、Blobとして出力

3. **レイアウトアルゴリズム**
   - **横並び**: 高さを最大値または最小値に合わせ、各画像を適切にスケーリング
   - **縦並び**: 幅を最大値または最小値に合わせ、各画像を適切にスケーリング  
   - **グリッド**: 指定列数で動的なセルサイズ、アスペクト比保持

### スタイリング戦略

Tailwind Variantsを使用した型安全なスタイル定義:
```typescript
const styles = tv({
  slots: {
    container: 'w-full',
    dropzone: 'border-2 border-dashed ...',
    // 各パーツごとにスタイルを定義
  }
});
```

### 状態管理

- React hooks (useState, useCallback) によるローカル状態管理
- 画像リスト、設定、合成結果URLを`ImageComposer`で一元管理
- メモリリークを防ぐため、不要になったObjectURLはrevokeする

## 注意事項

- Tailwind CSS 4を使用（設定ファイルなし、PostCSS経由）
- すべての処理はクライアントサイドで完結
- テストは未実装