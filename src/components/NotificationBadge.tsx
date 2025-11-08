interface NotificationBadgeProps {
  count: number
  className?: string
}

/**
 * Badge component showing notification count
 * Displays with a pulse animation when count > 0
 */
export function NotificationBadge({ count, className = '' }: NotificationBadgeProps) {
  if (count === 0) return null

  return (
    <span
      className={`
        absolute -top-1 -right-1
        flex items-center justify-center
        min-w-[18px] h-[18px] px-1
        bg-error text-error-foreground
        text-[10px] font-bold
        rounded-full
        animate-pulse
        ${className}
      `}
      aria-label={`${count} unread notification${count !== 1 ? 's' : ''}`}
    >
      {count > 9 ? '9+' : count}
    </span>
  )
}
