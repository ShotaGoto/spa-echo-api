# ADR-001: ローカル開発環境に docker-compose を採用する

## メタデータ

| 項目 | 内容 |
|---|---|
| 対象ドメイン | インフラ／開発環境 |
| 変更種別 | インフラ構成 |
| 可逆性 | 可逆 |
| 影響範囲 | 局所（開発環境のみ） |
| 領域分類 | 非センシティブ |
| エスカレーション | 不要（ローカル開発環境の選定はAI自律判断の範囲） |
| AIの当初判断 | docker-compose でローカル完結、Terraform は本番インフラに限定 |
| 人間の最終判断 | 追認（「お願いします」で承認） |
| 状態 | 有効 |
| 自律実行カウンタ | 1 |

## 背景

WSL上でのローカル動作検証が最初の目標だった。
インフラツールとして Terraform と docker-compose が候補として挙がった。

## 決定

ローカル開発環境は **docker-compose** を採用する。Terraform は本番AWSリソースのプロビジョニング専用とし、現時点では導入しない。

- `docker-compose up --build` 一発で db（PostgreSQL）/ backend（Go+air）/ frontend（Node+Vite）が立ち上がる
- ホットリロード（air / Vite）対応
- DBデータは `postgres_data` ボリュームに永続化
- `backend/db/schema.sql` を `/docker-entrypoint-initdb.d/` にマウントして初回起動時に自動適用

## 結論

Terraform は「AWS上の土地を作るツール」、docker-compose は「アプリを動かすツール」であり用途が異なる。
本番インフラ構築フェーズになったとき Terraform を `infra/` 以下に導入する。
