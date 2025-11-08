import { clsx } from 'clsx'
import { HTMLAttributes } from 'react'
import { X } from 'lucide-react'

export interface ChipProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  onRemove?: () => void
  selected?: boolean
}

/**
 * Chip component for tags and filters
 */
export function Chip({
  label,
  onRemove,
  selected = false,
  className,
  ...rest
}: ChipProps) {
  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
        selected
          ? 'bg-primary/20 text-primary border border-primary/30'
          : 'bg-muted text-foreground/70 border border-white/10 hover:bg-muted/80',
        rest.onClick && 'cursor-pointer',
        className
      )}
      {...rest}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
