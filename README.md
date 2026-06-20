# spa-echo-api

React（SPA）+ Go（Echo）の完全分離構成によるWebアプリケーション。
本リポジトリは単なるアプリのコードベースではなく、**AIが開発の主体となることを前提に設計された** プロジェクトである。

## このリポジトリの前提

- **人間** が要求を出し、AIと要件定義を行い、高度な判断を下す
- **AI** が実装・検証・リリース・保守・障害対応を自律的に担う
- AIは高度な判断が必要と判断したときのみ、人間にエスカレーションする

この自律ループを安全に成立させるため、開発を統治する最上位ルールを
[`AI_DEVELOPMENT_GOVERNANCE.md`](./AI_DEVELOPMENT_GOVERNANCE.md) に定めている。
AIは全ての変更にあたり、まずこのドキュメントに従うこと。

## 技術構成

| 層 | 技術 |
|---|---|
| フロント | React / Vite / Zustand / Tailwind CSS / TanStack Query |
| バック | Go（Echo）/ PostgreSQL / sqlc / swaggo |
| インフラ | S3 + CloudFront（SPA）/ ECS（API）/ GitHub Actions |

完全分離構成（SPA & APIサーバー）。デプロイ・スケール・障害の単位を分離し、
AIが影響範囲を切り分けて独立に対応できることを土台とする。

## ガバナンスの骨格

開発の統治は二層構造を取る。

- **静的層** — コードをセンシティブ／非センシティブ領域に構造分離し、自律可否を固定する
- **動的層** — ADRの蓄積により、非センシティブ領域の自律可能範囲を漸進的に調整する

詳細は [`AI_DEVELOPMENT_GOVERNANCE.md`](./AI_DEVELOPMENT_GOVERNANCE.md) を参照。

## ディレクトリ構成（予定）

```
spa-echo-api/
├── docker-compose.yml          # ローカル開発用（DB含む）
├── AI_DEVELOPMENT_GOVERNANCE.md # AI自律開発の最上位ルール
├── .github/
│   ├── workflows/              # GitHub Actions（CI/CD）
│   └── copilot-instructions.md # ガバナンス文書への参照導線
├── docs/
│   └── adr/                    # Architecture Decision Records
├── frontend/                   # React + Vite
└── backend/                    # Go + Echo
    └── internal/
        └── sensitive/          # センシティブ領域（常に人間レビュー必須）
```
