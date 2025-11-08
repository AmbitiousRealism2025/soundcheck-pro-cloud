import { clsx } from 'clsx'
import { useState, useRef, useEffect } from 'react'

export interface SegmentedControlOption {
  value: string
  label: string
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

/**
 * Segmented control component (iOS-style tab switcher)
 * Animated sliding background indicator
 */
export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<Map<string, HTMLButtonElement>>(new Map())

  useEffect(() => {
    const activeButton = buttonsRef.current.get(value)
    if (activeButton && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      })
    }
  }, [value, options])

  return (
    <div
      ref={containerRef}
      className={clsx(
        'relative inline-flex p-1 bg-muted rounded-lg',
        className
      )}
      role="tablist"
    >
      {/* Animated indicator */}
      <div
        className="absolute top-1 bottom-1 bg-primary rounded-md transition-all duration-200 ease-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />

      {/* Buttons */}
      {options.map((option) => (
        <button
          key={option.value}
          ref={(el) => {
            if (el) {
              buttonsRef.current.set(option.value, el)
            } else {
              buttonsRef.current.delete(option.value)
            }
          }}
          onClick={() => onChange(option.value)}
          className={clsx(
            'relative z-10 px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200',
            value === option.value
              ? 'text-primary-foreground'
              : 'text-foreground/70 hover:text-foreground'
          )}
          role="tab"
          aria-selected={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
