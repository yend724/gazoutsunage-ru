# ガゾウツナゲール

複数の画像を1つにつなげる無料オンラインツール

![ガゾウツナゲール](public/icon.svg)

## 概要

ガゾウツナゲールは、ブラウザ上で複数の画像を簡単に結合できるWebアプリケーションです。サーバーにデータを送信することなく、すべての処理がクライアントサイドで完結するため、プライバシーを保護しながら安全に画像を編集できます。

### 主な機能

- 🖼️ **ドラッグ&ドロップ対応**: 簡単な操作で画像をアップロード
- 📐 **複数のレイアウト**: 横並び、縦並び、グリッド配置に対応
- ⚙️ **柔軟な設定**: 画像サイズ調整、間隔調整
- 🔒 **プライバシー保護**: すべての処理がブラウザ内で完結
- ✨ **高画質出力**: Canvas APIによる高品質な画像合成

## 使い方

1. **画像をアップロード**: ドラッグ&ドロップまたはファイル選択で画像を追加
2. **レイアウトを選択**: 横並び・縦並び・グリッドから選択
3. **設定を調整**: サイズ調整方法、間隔などを設定
4. **画像を合成**: 「画像を合成」ボタンをクリック
5. **ダウンロード**: 合成された画像をダウンロード

## 技術仕様

- **フレームワーク**: Next.js 15.3.3 (App Router)
- **言語**: TypeScript 5 (Strict Mode)
- **スタイリング**: Tailwind CSS 4 + Tailwind Variants
- **画像処理**: Canvas API
- **開発ツール**: ESLint, Prettier, MarkupLint
- **アーキテクチャ**: Package by Features

## 開発環境のセットアップ

### 前提条件

- Node.js 18以上
- npm

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd gazoutsunage-ru

# 依存関係をインストール
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

### その他のコマンド

```bash
# プロダクションビルド
npm run build

# プロダクション実行
npm start

# ESLintによるコードチェック
npm run lint

# Prettierによるコードフォーマット
npm run format

# フォーマットチェック
npm run format:check

# MarkupLintによるJSXチェック
npm run markuplint
```

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ホームページ
├── assets/                 # 静的アセット
│   ├── images/            # 画像ファイル
│   └── styles/            # グローバルスタイル
├── features/               # 機能別モジュール
│   └── image-composer/     # 画像合成機能
│       ├── components/    # UIコンポーネント
│       ├── types/         # 型定義
│       └── utils/         # ユーティリティ関数
└── shared/                 # 共有コンポーネント
    └── components/        # 汎用UIコンポーネント
```

## 対応ブラウザ

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 貢献

プルリクエストは歓迎します。大きな変更を行う場合は、まずイシューを開いて変更内容について議論してください。

開発前に以下のコマンドを実行してください：

```bash
# コードフォーマット
npm run format

# Lintチェック
npm run lint

# マークアップチェック
npm run markuplint
```

## ライセンス

[MIT License](./LICENSE)
