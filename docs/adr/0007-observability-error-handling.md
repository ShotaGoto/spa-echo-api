# ADR-007: エラーハンドリングとオブザーバビリティの初期構成

## メタデータ

| 項目 | 内容 |
|---|---|
| 対象ドメイン | バックエンド／フロントエンド全体 |
| 変更種別 | ロジック変更 |
| 可逆性 | 可逆 |
| 影響範囲 | 広域 |
| 領域分類 | 非センシティブ |
| エスカレーション | 不要 |
| AIの当初判断 | Error Boundary + カスタムエラーハンドラで初期構成。Sentry は本番フェーズで追加 |
| 人間の最終判断 | 追認待ち |
| 状態 | 有効 |
| 自律実行カウンタ | 1 |

## 背景

バグ検知とログ確認の仕組みが不足していた。具体的には:
- フロントのJS例外が白画面になるだけで原因が追えない
- バックエンドの5xxエラーがリクエストログと同じ INFO レベルで埋もれる
- 本番（ECS）でのログ集約・アラートが未定義

## 決定

### バックエンド: カスタムエラーハンドラ（`internal/middleware/error_handler.go`）
- `e.HTTPErrorHandler` に登録し、Echo の全エラーをここで処理
- 5xx: `zerolog.ERROR` レベル + `.Stack()` でスタックトレースを出力
- 4xx: `zerolog.ERROR` レベル（スタックトレースなし）
- 共通レスポンス形式（`success: false`, `error`）で返す

### フロントエンド: React Error Boundary（`src/components/ErrorBoundary.tsx`）
- アプリ全体を `<ErrorBoundary>` でラップ
- JS例外をキャッチして白画面を防ぎ、再読み込みボタン付きのエラー画面を表示
- `componentDidCatch` に Sentry 送信のフックポイントを用意済み

## 残課題（本番フェーズで対応）

| 項目 | 対応方法 |
|---|---|
| ログ集約 | ECS タスク定義の logDriver を `awslogs` に設定（コード変更不要） |
| エラー通知 | Sentry 導入（Go SDK + React SDK）。DSNキー管理が必要なためセンシティブ扱いで人間判断 |
| アラート | CloudWatch Alarm → SNS → メール/Slack |
