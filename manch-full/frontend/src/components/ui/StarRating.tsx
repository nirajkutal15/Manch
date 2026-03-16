interface Props {
  value: number
  onChange?: (val: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function StarRating({ value, onChange, readonly = false, size = 'md' }: Props) {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${sizes[size]} transition-transform ${!readonly ? 'hover:scale-125 cursor-pointer' : 'cursor-default'}`}
        >
          <span className={star <= value ? 'text-gold' : 'text-black/15'}>★</span>
        </button>
      ))}
    </div>
  )
}