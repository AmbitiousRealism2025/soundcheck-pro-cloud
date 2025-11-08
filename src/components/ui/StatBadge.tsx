import { clsx } from 'clsx'
import { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface StatBadgeProps {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon?: ReactNode
  className?: string
}

/**
 * Stat display component for dashboard widgets
 * Shows a statistic with optional trend indicator
 */
export function StatBadge({
  label,
  value,
  trend,
  trendValue,
  icon,
  className,
}: StatBadgeProps) {
  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  }

  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-foreground/50',
  }

  const TrendIcon = trend ? trendIcons[trend] : null

  return (
    <div className={clsx('flex items-start gap-3', className)}>
      {icon && (
        <div className="p-2 bg-primary/20 rounded-lg text-primary">
          {icon}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground/60 mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && trendValue && TrendIcon && (
            <div className={clsx('flex items-center gap-1 text-sm font-medium', trendColors[trend])}>
              <TrendIcon size={16} />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
