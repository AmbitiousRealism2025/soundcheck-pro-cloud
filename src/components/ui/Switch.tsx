import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

/**
 * Toggle switch component
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, checked, id, ...rest }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            checked={checked}
            className="sr-only peer"
            {...rest}
          />
          <div
            className={clsx(
              'w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
              'peer-checked:bg-primary',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              !checked && 'bg-muted',
              className
            )}
          >
            <div
              className={clsx(
                'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200',
                checked && 'translate-x-5'
              )}
            />
          </div>
        </div>

        {label && (
          <label
            htmlFor={switchId}
            className="text-sm font-medium text-foreground cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Switch.displayName = 'Switch'
