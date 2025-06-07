# ガゾウツナゲール

複数の画像を1つにつなげる無料オンラインツール

## 概要

ガゾウツナゲールは、ブラウザ上で複数の画像を簡単に結合できるWebアプリケーションです。サーバーにデータを送信することなく、すべての処理がクライアントサイドで完結するため、プライバシーを保護しながら安全に画像を編集できます。

### 主な機能

- **ドラッグ&ドロップ対応**: 簡単な操作で画像をアップロード
- **複数のレイアウト**: 横並び、縦並び、グリッド配置に対応
- **柔軟な設定**: 画像サイズ調整、背景色設定、間隔調整
- **プライバシー保護**: すべての処理がブラウザ内で完結
- **高画質出力**: Canvas APIによる高品質な画像合成

## 技術仕様

- **フレームワーク**: Next.js 15.3.3 (App Router)
- **言語**: TypeScript 5
- **スタイリング**: Tailwind CSS 4
- **画像処理**: Canvas API
- **開発ツール**: ESLint, Prettier, MarkupLint

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
├── assets/                 # 静的アセット
├── features/               # 機能別モジュール
│   └── image-composer/     # 画像合成機能
└── shared/                 # 共有コンポーネント
```

## ライセンス

MIT License
