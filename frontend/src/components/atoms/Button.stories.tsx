import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { children: '投稿する', variant: 'primary' },
}

export const Danger: Story = {
  args: { children: '削除', variant: 'danger', size: 'sm' },
}

export const Ghost: Story = {
  args: { children: 'キャンセル', variant: 'ghost', size: 'sm' },
}

export const Loading: Story = {
  args: { children: '投稿する', loading: true },
}
