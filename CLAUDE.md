# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 最上位ルール（必読）

**全ての変更を行う前に、必ず [`AI_DEVELOPMENT_GOVERNANCE.md`](./AI_DEVELOPMENT_GOVERNANCE.md) を参照すること。**

このドキュメントが本リポジトリにおけるAI自律開発の最上位ルールであり、個別のADR・コードと矛盾する場合は原則としてこのドキュメントが優先される。

### 変更前の判定フロー

```
1. 関連ADRを検索（docs/adr/）
   └ 既存ADRと矛盾する？ → YES: 停止し人間に再確認（§3.3）

2. 対象はセンシティブ領域か？（§5.1）
   センシティブ: 課金・決済 / 個人情報・認証情報 / 認可ロジック /
                DBスキーマの破壊的変更 / 外部への不可逆な副作用
   └ YES: 自律実行不可。人間レビューへ

3. この操作は可逆か？（§2.2）
   └ NO: 自律実行不可。人間レビューへ

4. この変更種別は自律可能と確立されているか？（§4.3）
   └ NO / 迷う: 人間にエスカレーション
   └ YES: 自律実行可

5. 実行後、意思決定をADRに記録し、自律実行カウンタを加算（§4.1 / §6.1）
```

### センシティブ領域

`backend/internal/sensitive/` 配下は常に人間レビュー必須。委譲ラインがどれだけ広がってもこの境界は外れない。

## ローカル開発

### 起動

```bash
cp .env.example .env        # 初回のみ
docker-compose up --build   # db / backend / frontend を一括起動
```

| サービス | URL |
|---|---|
| フロントエンド | http://localhost:5173 |
| バックエンドAPI | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

### バックエンド単体

```bash
cd backend
go build ./...          # ビルド確認
go test ./...           # テスト
go run ./cmd/server     # 単体起動（要 .env）
```

air（ホットリロード）は docker-compose 経由で自動的に有効になる。

### フロントエンド単体

```bash
cd frontend
npm install
npm run dev     # 開発サーバー（http://localhost:5173）
npm run build   # プロダクションビルド
npm run lint    # ESLint
```

## アーキテクチャ

React（SPA）+ Go（Echo）の**完全分離構成**。デプロイ・スケール・障害の単位を分離し、AIが影響範囲を切り分けて独立に対応できることを土台とする。

| 層 | 技術 |
|---|---|
| フロント | React / Vite / Zustand / Tailwind CSS v4 / TanStack Query + axios |
| バック | Go（Echo）/ PostgreSQL / sqlc / swaggo/swag（Swagger UI）|
| インフラ | S3 + CloudFront（SPA）/ ECS（API）/ GitHub Actions |

### ディレクトリ構成

```
spa-echo-api/
├── AI_DEVELOPMENT_GOVERNANCE.md
├── docker-compose.yml
├── .env.example
├── .github/
│   ├── workflows/
│   └── copilot-instructions.md
├── docs/
│   └── adr/
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   └── index.css        # @import "tailwindcss" 先頭に配置
│   ├── vite.config.ts       # @tailwindcss/vite プラグイン設定済み
│   └── package.json
└── backend/
    ├── cmd/server/main.go   # エントリポイント
    ├── internal/
    │   ├── handler/         # Echoハンドラ
    │   ├── middleware/      # zerologロガー等
    │   ├── response/        # 共通ラップ { success, data, error }
    │   └── sensitive/       # センシティブ領域（常に人間レビュー必須）
    ├── .air.toml            # ホットリロード設定
    └── go.mod               # module: github.com/shotagoto/spa-echo-api/backend
```

### バックエンド設計方針
- **レスポンス形式**: 全APIで `internal/response` の共通ラップを使う（`success` / `data` / `error`）
- **DBアクセス**: sqlc（型安全・自動生成）。生SQLは書かず、スキーマからGoコードを生成する
- **API契約**: OpenAPIを単一真実源とし、Goハンドラ型・TS型を一方向生成する。契約違反はビルドで検出
- **ログ**: rs/zerolog による構造化ログ。AIの意思決定ログを独立した種別として記録する

### フロントエンド設計方針
- **コンポーネント**: Atomic Design × Feature-First
- **テスト**: Playwright（E2E・Unit）/ Storybook + Chromatic（Visual Regression）

## ADRの参照方法

新しい判断に直面したとき:
1. `docs/adr/` を変更種別・対象ドメインで絞り込んでメタデータを検索する
2. 該当ADRの本文を読み、自律可能か判定する
3. 実行後は該当ADRの自律実行カウンタを加算し、新規判断の場合は新たにADRを起票する

ADRの状態（`有効` / `superseded` / `誤りマーク`）を必ず確認すること。`superseded` なADRを根拠に動いてはならない。
