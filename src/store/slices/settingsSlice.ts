import type { StateCreator } from 'zustand'
import { showToast } from '@/utils/toastManager'

export type TimeFormat = '12h' | '24h'

export interface Settings {
  name: string
  email: string
  homeAddress: string
  preferredTravelMethod: string
  mileageRate: number
  currency: string
  timeFormat: TimeFormat
  notificationsEnabled: boolean
}

export interface SettingsState {
  settings: Settings
}

export interface SettingsActions {
  updateSettings: (updates: Partial<Settings>) => void
  resetSettings: () => void
}

export type SettingsSlice = SettingsState & SettingsActions

// Default settings
const defaultSettings: Settings = {
  name: '',
  email: '',
  homeAddress: '',
  preferredTravelMethod: 'driving',
  mileageRate: 0.67, // 2024 IRS standard mileage rate
  currency: 'USD',
  timeFormat: '12h',
  notificationsEnabled: true,
}

// Load settings from localStorage
const loadSettings = (): Settings => {
  try {
    const stored = localStorage.getItem('soundcheck-settings')
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...defaultSettings, ...parsed }
    }
  } catch (error) {
    console.error('Error loading settings from localStorage:', error)
  }
  return defaultSettings
}

// Debounce timer
let saveTimer: ReturnType<typeof setTimeout> | null = null

// Save settings to localStorage with debouncing
const saveSettings = (settings: Settings) => {
  // Clear existing timer
  if (saveTimer) {
    clearTimeout(saveTimer)
  }

  // Debounce saves to avoid excessive writes
  saveTimer = setTimeout(() => {
    try {
      const serialized = JSON.stringify(settings)

      // Check payload size (warn if > 100KB)
      if (serialized.length > 100000) {
        console.warn('Settings payload is large:', serialized.length, 'bytes')
        showToast.warning('Settings data is unusually large')
      }

      localStorage.setItem('soundcheck-settings', serialized)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save settings'
      console.error('Error saving settings to localStorage:', error)
      showToast.error(errorMessage)
    }
  }, 500) // 500ms debounce
}

export const createSettingsSlice: StateCreator<
  SettingsSlice,
  [],
  [],
  SettingsSlice
> = (set, get) => ({
  // Initial state
  settings: loadSettings(),

  // Actions
  updateSettings: (updates) => {
    const newSettings = { ...get().settings, ...updates }
    set({ settings: newSettings })
    saveSettings(newSettings)
  },

  resetSettings: () => {
    set({ settings: defaultSettings })
    saveSettings(defaultSettings)
  },
})
