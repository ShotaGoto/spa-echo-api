import { Button } from '../atoms/Button'
import { useDeleteMessage } from '../../features/messages/hooks/useMessages'
import type { Message } from '../../features/messages/api/messagesApi'

interface Props {
  message: Message
}

export function MessageCard({ message }: Props) {
  const deleteMutation = useDeleteMessage()

  const formattedDate = new Date(message.created_at).toLocaleString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="rounded-lg bg-slate-800 border border-slate-700 p-4 flex justify-between gap-4 group">
      <div className="flex-1 min-w-0">
        <p className="text-slate-100 text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <p className="text-xs text-slate-500 mt-2">{formattedDate}</p>
      </div>
      <Button
        variant="danger"
        size="sm"
        onClick={() => deleteMutation.mutate(message.id)}
        loading={deleteMutation.isPending}
        className="opacity-0 group-hover:opacity-100 shrink-0 self-start"
        aria-label="削除"
      >
        削除
      </Button>
    </div>
  )
}
