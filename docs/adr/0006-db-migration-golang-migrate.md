# ADR-006: DBマイグレーションに golang-migrate を採用する

## メタデータ

| 項目 | 内容 |
|---|---|
| 対象ドメイン | バックエンド／DB管理 |
| 変更種別 | ライブラリ選定・インフラ構成 |
| 可逆性 | 可逆（down マイグレーションで戻せる） |
| 影響範囲 | 広域（全DBスキーマ変更） |
| 領域分類 | 非センシティブ（スキーマの破壊的変更はセンシティブだが、マイグレーション基盤の選定は非センシティブ） |
| エスカレーション | 不要 |
| AIの当初判断 | golang-migrate を採用。サーバー起動時に自動適用 |
| 人間の最終判断 | 追認待ち（ADR-004 の計画に基づき自律実行） |
| 状態 | 有効 |
| 自律実行カウンタ | 1 |

## 背景

docker-compose 初回起動時に `schema.sql` を流す方式では、ボリュームが残っている場合にスキーマ変更が適用されない。
§2.2「行動の可逆性」の要件として、DBスキーマ変更は前方/後方互換を保てる仕組みが必要。

## 決定

**golang-migrate** を採用する。

- マイグレーションファイルを `backend/db/migrations/NNNNNN_name.{up,down}.sql` で管理
- サーバー起動時（`main.go`）に `m.Up()` を自動実行
- `ErrNoChange` は正常扱いとしてスキップ
- `docker-compose` から `schema.sql` のマウントを除去（マイグレーションに一本化）

## 新しいスキーマ変更手順

```
1. backend/db/migrations/NNNNNN_description.up.sql   を作成
2. backend/db/migrations/NNNNNN_description.down.sql を作成（ロールバック用）
3. backend/db/schema.sql を最新状態に更新
4. sqlc generate を実行して internal/db/ を再生成
5. swag init を実行して docs/ を再生成
```

## 結論

前方マイグレーション（up）と後方マイグレーション（down）を対で管理することで、
デプロイ後のロールバックも安全に実行できる（§2.2 準拠）。
