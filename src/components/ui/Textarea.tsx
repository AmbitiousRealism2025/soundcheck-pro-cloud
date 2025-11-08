import { TextareaHTMLAttributes, forwardRef, useEffect, useRef } from 'react'
import { clsx } from 'clsx'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  autoResize?: boolean
  maxLength?: number
  showCount?: boolean
}

/**
 * Textarea component with optional auto-resize and character count
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      autoResize = false,
      maxLength,
      showCount = false,
      id,
      value,
      ...rest
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${inputId}-error` : undefined
    const helperId = helperText ? `${inputId}-helper` : undefined

    // Auto-resize functionality
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }, [value, autoResize])

    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground/80 mb-1.5"
          >
            {label}
          </label>
        )}

        <textarea
          ref={(node) => {
            textareaRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          id={inputId}
          value={value}
          maxLength={maxLength}
          className={clsx(
            'w-full px-3 py-2 rounded-lg',
            'bg-muted text-foreground',
            'border-2 border-transparent',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
            'placeholder:text-foreground/30',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'resize-none',
            error && 'border-error focus:ring-error/50 focus:border-error',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={clsx(errorId, helperId).trim() || undefined}
          {...rest}
        />

        <div className="flex items-center justify-between mt-1.5">
          <div className="flex-1">
            {error && (
              <p id={errorId} className="text-sm text-error" role="alert">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p id={helperId} className="text-sm text-foreground/50">
                {helperText}
              </p>
            )}
          </div>

          {showCount && maxLength && (
            <p className="text-xs text-foreground/50 ml-2">
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
