interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className = '', ...props }: Props) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-xs text-slate-400">{label}</label>}
      <textarea
        className={`rounded-lg bg-slate-800 border px-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none resize-none transition ${error ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-indigo-500'} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
