import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'
import { Check, Minus } from 'lucide-react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  indeterminate?: boolean
}

/**
 * Checkbox component with label and indeterminate state support
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, indeterminate = false, checked, id, ...rest }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="flex items-start gap-2">
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            className="sr-only peer"
            {...rest}
          />
          <div
            className={clsx(
              'w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
              'peer-checked:bg-primary peer-checked:border-primary',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              !checked && !indeterminate && 'border-foreground/30 bg-transparent',
              indeterminate && 'bg-primary border-primary',
              className
            )}
          >
            {checked && !indeterminate && <Check size={14} className="text-primary-foreground" />}
            {indeterminate && <Minus size={14} className="text-primary-foreground" />}
          </div>
        </div>

        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium text-foreground cursor-pointer select-none pt-0.5"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
