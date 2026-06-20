import { useQuery } from '@tanstack/react-query'
import { MessageBoard } from './components/organisms/MessageBoard'
import api from './lib/api'

function ApiStatus() {
  const { data, isError, isPending } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.get('/health').then(r => r.data),
    refetchInterval: 10_000,
  })

  if (isPending) return (
    <span className="flex items-center gap-2 text-xs text-slate-500">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-600 animate-pulse" />
      確認中
    </span>
  )

  if (isError || !data?.success) return (
    <span className="flex items-center gap-2 text-xs text-red-400">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      API 未接続
    </span>
  )

  return (
    <span className="flex items-center gap-2 text-xs text-emerald-400">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      API 接続中
    </span>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-slate-100 tracking-tight">spa-echo-api</span>
        <div className="flex items-center gap-4">
          <a
            href="http://localhost:8080/swagger/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            Swagger UI
          </a>
          <ApiStatus />
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <MessageBoard />
      </main>

      <footer className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-600">
        spa-echo-api — AI自律開発サンプル
      </footer>
    </div>
  )
}
