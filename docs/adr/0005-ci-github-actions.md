# ADR-005: CIに GitHub Actions を採用する

## メタデータ

| 項目 | 内容 |
|---|---|
| 対象ドメイン | インフラ／CI |
| 変更種別 | インフラ構成 |
| 可逆性 | 可逆 |
| 影響範囲 | 全体 |
| 領域分類 | 非センシティブ |
| エスカレーション | 不要 |
| AIの当初判断 | GitHub Actions を採用。backend / frontend を独立ジョブで並列実行 |
| 人間の最終判断 | 追認待ち（ADR-004 の計画に基づき自律実行） |
| 状態 | 有効 |
| 自律実行カウンタ | 1 |

## 背景

§2.1「検証の機械可読性」の要件として、AIが自律実行した成果を機械的に検証する基盤が必要。
CIがない状態では自律ループを安全に回せない（ADR-004 §2 参照）。

## 決定

`.github/workflows/ci.yml` を作成し、以下を自動実行する。

**backend ジョブ:**
- `go build ./...` — コンパイルエラーを検出
- `go vet ./...` — 静的解析
- `go test ./...` — ユニットテスト
- `sqlc generate` 後に `git diff` — 生成コードの乖離を検出
- `swag init` 後に `git diff` — Swagger ドキュメントの乖離を検出

**frontend ジョブ:**
- `npm ci` → `npm run lint` → `npm run build`

トリガー: `main` ブランチへの push および PR、`claude/**` ブランチへの push。

## 結論

sqlc・swag の生成コードをCIで検証することで「スキーマ変更後に再生成し忘れた」を自動検出できる。
Playwright E2E はサービス起動が必要なため、DB設定が整ったフェーズで追加する。
