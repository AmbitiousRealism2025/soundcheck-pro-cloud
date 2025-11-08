import { Sun, Moon, MonitorSmartphone } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { Theme } from '@/store/slices/uiSlice'

/**
 * Theme toggle component
 * Allows switching between Auto, Light, and Dark themes
 */
export function ThemeToggle() {
  const theme = useStore(state => state.theme)
  const setTheme = useStore(state => state.setTheme)

  const themes: { value: Theme; label: string; icon: any }[] = [
    { value: 'auto', label: 'Auto', icon: MonitorSmartphone },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
  ]

  return (
    <div>
      <label className="block text-sm font-medium mb-3">Theme</label>
      <div className="grid grid-cols-3 gap-3">
        {themes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-lg border transition-all
              ${theme === value
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-white/5 border-white/10 text-foreground/70 hover:bg-white/10 hover:border-white/20'
              }
            `}
          >
            <Icon size={24} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-foreground/50 mt-2">
        {theme === 'auto' && 'Theme follows your system preferences'}
        {theme === 'light' && 'Light theme is active'}
        {theme === 'dark' && 'Dark theme is active'}
      </p>
    </div>
  )
}
