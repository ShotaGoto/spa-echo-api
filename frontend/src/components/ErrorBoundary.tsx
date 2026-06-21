import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Sentry 等を導入した際はここで送信する
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-6">
          <div className="max-w-md w-full text-center">
            <p className="text-4xl mb-4">⚠️</p>
            <h1 className="text-xl font-semibold text-slate-100 mb-2">
              予期しないエラーが発生しました
            </h1>
            <p className="text-sm text-slate-400 mb-6">
              ページを再読み込みしてください。
            </p>
            <details className="text-left bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
              <summary className="text-xs text-slate-500 cursor-pointer">詳細</summary>
              <pre className="text-xs text-red-400 mt-2 whitespace-pre-wrap break-all">
                {this.state.error.message}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition"
            >
              再読み込み
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
