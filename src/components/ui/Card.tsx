import { clsx } from 'clsx'
import { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  title?: string
  subtitle?: string
  footer?: ReactNode
}

/**
 * Card component with variants for different visual styles
 */
export function Card({
  variant = 'default',
  title,
  subtitle,
  footer,
  children,
  className,
  ...rest
}: CardProps) {
  const variantStyles = {
    default: 'bg-card border border-white/5',
    elevated: 'glass shadow-lg hover:shadow-xl',
    outlined: 'bg-transparent border-2 border-white/10',
  }

  return (
    <div
      className={clsx(
        'rounded-xl p-4 transition-all duration-200',
        variantStyles[variant],
        rest.onClick && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
      {...rest}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-foreground/60 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <div className="card-content">{children}</div>

      {footer && (
        <div className="mt-4 pt-4 border-t border-white/10">{footer}</div>
      )}
    </div>
  )
}
