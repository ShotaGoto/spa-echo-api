type Color = 'emerald' | 'red' | 'slate'

interface Props {
  color?: Color
  children: React.ReactNode
}

const colorClass: Record<Color, string> = {
  emerald: 'bg-emerald-500/20 text-emerald-400',
  red:     'bg-red-500/20 text-red-400',
  slate:   'bg-slate-700 text-slate-400',
}

export function Badge({ color = 'slate', children }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass[color]}`}>
      {children}
    </span>
  )
}
