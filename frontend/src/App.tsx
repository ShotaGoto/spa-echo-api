import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from './lib/api'

function StatusBadge() {
  const { data, isError, isPending } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.get('/health').then(r => r.data),
    refetchInterval: 10_000,
  })

  if (isPending) {
    return (
      <span className="flex items-center gap-2 text-sm text-slate-400">
        <span className="h-2 w-2 rounded-full bg-slate-500 animate-pulse" />
        確認中...
      </span>
    )
  }

  if (isError || !data?.success) {
    return (
      <span className="flex items-center gap-2 text-sm text-red-400">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        API 未接続
      </span>
    )
  }

  return (
    <span className="flex items-center gap-2 text-sm text-emerald-400">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      API 接続中
    </span>
  )
}

function EchoForm() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (message: string) =>
      api.post('/api/v1/echo', { message }).then(r => r.data),
    onSuccess: data => {
      setResult(data.data?.message ?? null)
    },
    onError: () => {
      setResult(null)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    mutation.mutate(input.trim())
  }

  return (
    <div className="w-full max-w-lg">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 transition"
        />
        <button
          type="submit"
          disabled={mutation.isPending || !input.trim()}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {mutation.isPending ? '送信中...' : '送信'}
        </button>
      </form>

      {mutation.isError && (
        <p className="mt-3 text-sm text-red-400">
          エラー: APIに接続できません
        </p>
      )}

      {result !== null && !mutation.isError && (
        <div className="mt-4 rounded-lg bg-slate-800 border border-slate-700 px-4 py-3">
          <p className="text-xs text-slate-500 mb-1">エコー応答</p>
          <p className="text-slate-100">{result}</p>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-slate-100 tracking-tight">spa-echo-api</span>
        <StatusBadge />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-10 px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-3 tracking-tight">
            React SPA + Go Echo
          </h1>
          <p className="text-slate-400 text-lg">
            フロントエンドとバックエンドが接続されたサンプルサイト
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 w-full max-w-lg">
          <p className="text-sm text-slate-500 self-start">エコー API を試す</p>
          <EchoForm />
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-4">
          {[
            { label: 'フロント', value: 'React + Vite' },
            { label: 'バック', value: 'Go + Echo' },
            { label: 'DB', value: 'PostgreSQL' },
          ].map(item => (
            <div key={item.label} className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-center">
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <p className="text-sm text-slate-200 font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-600">
        spa-echo-api — AI自律開発サンプル
      </footer>
    </div>
  )
}
