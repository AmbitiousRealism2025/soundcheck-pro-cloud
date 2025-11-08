import { clsx } from 'clsx'
import { ReactNode } from 'react'

export interface TimelineItemProps {
  time: string
  title: string
  description?: string
  status?: 'upcoming' | 'current' | 'past'
  icon?: ReactNode
  isLast?: boolean
}

/**
 * Timeline item component for displaying chronological events
 */
export function TimelineItem({
  time,
  title,
  description,
  status = 'upcoming',
  icon,
  isLast = false,
}: TimelineItemProps) {
  const statusStyles = {
    upcoming: 'bg-foreground/20 border-foreground/30',
    current: 'bg-primary border-primary ring-4 ring-primary/20',
    past: 'bg-success border-success',
  }

  return (
    <div className="flex gap-4">
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center">
        <div
          className={clsx(
            'w-3 h-3 rounded-full border-2 transition-all duration-200',
            statusStyles[status]
          )}
        >
          {icon && (
            <div className="absolute inset-0 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
        {!isLast && (
          <div
            className={clsx(
              'w-0.5 flex-1 mt-2',
              status === 'past' ? 'bg-success/30' : 'bg-foreground/10'
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="flex items-baseline gap-3 mb-1">
          <time className="text-sm font-medium text-foreground/60">{time}</time>
          {status === 'current' && (
            <span className="text-xs font-medium text-primary">Current</span>
          )}
        </div>
        <h4
          className={clsx(
            'font-semibold',
            status === 'current' ? 'text-primary' : 'text-foreground'
          )}
        >
          {title}
        </h4>
        {description && (
          <p className="text-sm text-foreground/60 mt-1">{description}</p>
        )}
      </div>
    </div>
  )
}
