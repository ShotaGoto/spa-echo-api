import { useState } from 'react'
import { Textarea } from '../atoms/Textarea'
import { Button } from '../atoms/Button'
import { useCreateMessage } from '../../features/messages/hooks/useMessages'
import { useUIStore } from '../../store/uiStore'

const MAX_LENGTH = 500

export function MessageForm() {
  const [content, setContent] = useState('')
  const createMutation = useCreateMessage()
  const closeForm = useUIStore(s => s.closeForm)

  const remaining = MAX_LENGTH - content.length
  const isValid = content.trim().length > 0 && remaining >= 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    createMutation.mutate(content.trim(), {
      onSuccess: () => {
        setContent('')
        closeForm()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Textarea
        label="メッセージ"
        placeholder="メッセージを入力（最大500文字）"
        rows={4}
        value={content}
        onChange={e => setContent(e.target.value)}
        maxLength={MAX_LENGTH}
        error={createMutation.isError ? 'APIエラー。再度お試しください。' : undefined}
        autoFocus
      />
      <div className="flex items-center justify-between">
        <span className={`text-xs ${remaining < 50 ? 'text-amber-400' : 'text-slate-500'}`}>
          残り {remaining} 文字
        </span>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={closeForm}>
            キャンセル
          </Button>
          <Button type="submit" size="sm" loading={createMutation.isPending} disabled={!isValid}>
            投稿
          </Button>
        </div>
      </div>
    </form>
  )
}
