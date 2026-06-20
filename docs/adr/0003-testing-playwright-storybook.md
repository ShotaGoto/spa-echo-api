# ADR-003: テスト・UIカタログ基盤に Playwright + Storybook を採用する

## メタデータ

| 項目 | 内容 |
|---|---|
| 対象ドメイン | フロントエンド／テスト基盤 |
| 変更種別 | ライブラリ選定 |
| 可逆性 | 条件付き可逆 |
| 影響範囲 | 広域（フロントエンド全体のテスト戦略） |
| 領域分類 | 非センシティブ |
| エスカレーション | 不要 |
| AIの当初判断 | Playwright（E2E）+ Storybook（UIカタログ・Visual Regression）の組み合わせ |
| 人間の最終判断 | 追認（AI_DEVELOPMENT_GOVERNANCE.md に明記された方針と一致） |
| 状態 | 有効 |
| 自律実行カウンタ | 1 |

## 背景

AIが自律的にフロントエンドを変更する際、UIの正しさを機械的に検証する手段が必要。

## 決定

**Playwright**（E2E・Unitテスト）と **Storybook + Chromatic**（Visual Regression）を採用する。

- `frontend/tests/e2e/` に Playwright テストを配置
- `frontend/playwright.config.ts` で設定（ベースURL: http://localhost:5173）
- `frontend/.storybook/` に Storybook 設定
- コンポーネントに `*.stories.tsx` を併置する
- Chromatic 連携は CI 構築フェーズで設定する（APIキーが必要なため現時点は保留）

## 結論

Playwright の合否はCIで機械的に判定できる。§2.1「検証の機械可読性」の要件を満たす。
Storybook は Chromatic と連携することで Visual Regression を自動化し、AIによるUI変更の影響を検出する。
