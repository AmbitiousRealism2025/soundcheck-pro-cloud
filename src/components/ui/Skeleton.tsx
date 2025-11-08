import { clsx } from 'clsx'
import { HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'rectangle'
  width?: string | number
  height?: string | number
}

/**
 * Skeleton loader component for loading states
 */
export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
  ...rest
}: SkeletonProps) {
  const variantStyles = {
    text: 'h-4 rounded',
    circle: 'rounded-full aspect-square',
    rectangle: 'rounded-lg',
  }

  return (
    <div
      className={clsx(
        'animate-pulse bg-muted/50 relative overflow-hidden',
        variantStyles[variant],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      {...rest}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  )
}
