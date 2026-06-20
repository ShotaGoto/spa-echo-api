type Variant = 'primary' | 'danger' | 'ghost'
type Size = 'sm' | 'md'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40',
  danger:  'bg-red-600/20 text-red-400 hover:bg-red-600/30 disabled:opacity-40',
  ghost:   'bg-transparent text-slate-400 hover:text-slate-200 disabled:opacity-40',
}

const sizeClass: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  className = '',
  ...props
}: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={`rounded-lg font-medium transition cursor-pointer disabled:cursor-not-allowed ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...props}
    >
      {loading ? '処理中...' : children}
    </button>
  )
}
