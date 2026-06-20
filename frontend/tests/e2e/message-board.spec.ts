import { test, expect } from '@playwright/test'

test.describe('メッセージボード', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('ページが表示される', async ({ page }) => {
    await expect(page.getByText('spa-echo-api')).toBeVisible()
    await expect(page.getByText('メッセージ')).toBeVisible()
  })

  test('投稿フォームを開閉できる', async ({ page }) => {
    await page.getByRole('button', { name: /投稿する/ }).click()
    await expect(page.getByPlaceholder(/メッセージを入力/)).toBeVisible()
    await page.getByRole('button', { name: 'キャンセル' }).click()
    await expect(page.getByPlaceholder(/メッセージを入力/)).not.toBeVisible()
  })

  test('メッセージを投稿できる', async ({ page }) => {
    await page.getByRole('button', { name: /投稿する/ }).click()
    await page.getByPlaceholder(/メッセージを入力/).fill('テストメッセージ')
    await page.getByRole('button', { name: '投稿' }).click()
    await expect(page.getByText('テストメッセージ')).toBeVisible()
  })
})
