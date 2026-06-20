import { Button } from '../atoms/Button'
import { Badge } from '../atoms/Badge'
import { MessageCard } from '../molecules/MessageCard'
import { MessageForm } from '../molecules/MessageForm'
import { useMessages } from '../../features/messages/hooks/useMessages'
import { useUIStore } from '../../store/uiStore'

export function MessageBoard() {
  const { data: messages, isLoading, isError } = useMessages()
  const { isFormOpen, openForm } = useUIStore()

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-100">メッセージ</h2>
          {messages && (
            <Badge color="slate">{messages.length} 件</Badge>
          )}
        </div>
        {!isFormOpen && (
          <Button size="sm" onClick={openForm}>
            + 投稿する
          </Button>
        )}
      </div>

      {isFormOpen && (
        <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-4">
          <MessageForm />
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12 text-slate-500 text-sm">読み込み中...</div>
      )}

      {isError && (
        <div className="text-center py-12 text-red-400 text-sm">
          メッセージの取得に失敗しました。APIに接続できているか確認してください。
        </div>
      )}

      {messages && messages.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          まだメッセージがありません。最初の投稿をどうぞ。
        </div>
      )}

      {messages && messages.length > 0 && (
        <div className="flex flex-col gap-3">
          {messages.map(msg => (
            <MessageCard key={msg.id} message={msg} />
          ))}
        </div>
      )}
    </div>
  )
}
