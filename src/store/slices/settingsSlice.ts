import type { StateCreator } from 'zustand'

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

// Save settings to localStorage
const saveSettings = (settings: Settings) => {
  try {
    localStorage.setItem('soundcheck-settings', JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving settings to localStorage:', error)
  }
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
