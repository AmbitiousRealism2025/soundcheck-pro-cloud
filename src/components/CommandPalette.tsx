import { useEffect, useRef, useState } from 'react'
import { Search, Command as CommandIcon } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useCommandPalette, type Command } from '@/hooks/useCommandPalette'
import { Portal } from '@/components/ui/Portal'

const GROUP_LABELS: Record<string, string> = {
  navigation: 'Navigation',
  actions: 'Actions',
  settings: 'Settings',
  recent: 'Recent',
}

export function CommandPalette() {
  const isOpen = useStore(state => state.commandPaletteOpen)
  const closeCommandPalette = useStore(state => state.closeCommandPalette)
  const { searchQuery, setSearchQuery, filteredCommands, groupedCommands, executeCommand } = useCommandPalette()

  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Reset selection when commands change
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredCommands])

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      setSearchQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen, setSearchQuery])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeCommandPalette()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        )
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        const command = filteredCommands[selectedIndex]
        if (command) {
          executeCommand(command)
        }
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands, closeCommandPalette, executeCommand])

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return

    const selectedElement = listRef.current.querySelector(`[data-index="${selectedIndex}"]`)
    selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <Portal>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={closeCommandPalette}
      />

      {/* Command Palette */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] pointer-events-none">
        <div className="w-full max-w-2xl mx-4 pointer-events-auto animate-slideIn">
          <div className="bg-background/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
              <Search size={20} className="text-foreground/50" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-foreground/50"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs bg-white/5 rounded border border-white/10">
                ESC
              </kbd>
            </div>

            {/* Commands List */}
            <div
              ref={listRef}
              className="max-h-96 overflow-y-auto overscroll-contain"
            >
              {filteredCommands.length === 0 ? (
                <div className="px-4 py-8 text-center text-foreground/50">
                  No commands found
                </div>
              ) : (
                <div className="py-2">
                  {Object.entries(groupedCommands).map(([group, commands]) => {
                    if (commands.length === 0) return null

                    return (
                      <div key={group} className="mb-2">
                        <div className="px-4 py-2 text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                          {GROUP_LABELS[group] || group}
                        </div>
                        {commands.map((command, idx) => {
                          const globalIndex = filteredCommands.indexOf(command)
                          const isSelected = globalIndex === selectedIndex

                          return (
                            <button
                              key={command.id}
                              data-index={globalIndex}
                              onClick={() => executeCommand(command)}
                              className={`
                                w-full flex items-center gap-3 px-4 py-3
                                transition-colors text-left
                                ${isSelected
                                  ? 'bg-primary/20 text-primary'
                                  : 'text-foreground hover:bg-white/5'
                                }
                              `}
                            >
                              {command.icon && (
                                <command.icon
                                  size={18}
                                  className={isSelected ? 'text-primary' : 'text-foreground/70'}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">
                                  {command.label}
                                </div>
                                {command.description && (
                                  <div className={`text-xs truncate ${isSelected ? 'text-primary/70' : 'text-foreground/50'}`}>
                                    {command.description}
                                  </div>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/5 text-xs text-foreground/50">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10">↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10">↵</kbd>
                  Select
                </span>
              </div>
              <div className="flex items-center gap-1">
                <CommandIcon size={12} />
                <span>Command Palette</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  )
}
