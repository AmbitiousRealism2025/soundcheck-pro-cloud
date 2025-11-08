import { clsx } from 'clsx'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Spinner } from './Spinner'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

/**
 * Enhanced Button component with multiple variants, sizes, and loading state
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...rest
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantStyles = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-primary shadow-md',
      secondary: 'bg-muted text-foreground hover:bg-muted/80 focus-visible:outline-foreground/50',
      ghost: 'bg-transparent text-foreground/70 hover:bg-white/5 hover:text-foreground focus-visible:outline-foreground/50',
      danger: 'bg-error text-error-foreground hover:bg-error/90 focus-visible:outline-error shadow-md',
      success: 'bg-success text-success-foreground hover:bg-success/90 focus-visible:outline-success shadow-md',
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          loading && 'cursor-wait',
          className
        )}
        disabled={disabled || loading}
        {...rest}
      >
        {loading && <Spinner size={size === 'sm' ? 'sm' : size === 'lg' ? 'md' : 'sm'} />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

// Export default for backward compatibility
export default Button
