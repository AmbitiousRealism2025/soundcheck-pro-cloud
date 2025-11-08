import { Settings as SettingsIcon, DollarSign, Car, Clock, Bell } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { Select } from '@/components/ui/Select'
import { ThemeToggle } from './ThemeToggle'
import { useToast } from '@/components/ui/ToastProvider'

/**
 * Preferences settings section
 * Theme, currency, time format, mileage rate, notifications
 */
export function PreferencesSection() {
  const settings = useStore(state => state.settings)
  const updateSettings = useStore(state => state.updateSettings)
  const toast = useToast()

  const handleCurrencyChange = (value: string) => {
    updateSettings({ currency: value })
    toast.success(`Currency changed to ${value}`)
  }

  const handleTimeFormatChange = (value: '12h' | '24h') => {
    updateSettings({ timeFormat: value })
    toast.success(`Time format changed to ${value === '12h' ? '12-hour' : '24-hour'}`)
  }

  const handleMileageRateChange = (value: string) => {
    const rate = parseFloat(value)
    if (!isNaN(rate) && rate >= 0) {
      updateSettings({ mileageRate: rate })
    }
  }

  const handleTravelMethodChange = (value: string) => {
    updateSettings({ preferredTravelMethod: value })
  }

  const handleNotificationsToggle = (enabled: boolean) => {
    updateSettings({ notificationsEnabled: enabled })
    toast.success(enabled ? 'Notifications enabled' : 'Notifications disabled')
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <SettingsIcon size={20} />
          Preferences
        </h3>
        <p className="text-sm text-foreground/70 mb-4">
          Customize your SoundCheck Pro experience
        </p>
      </div>

      {/* Theme */}
      <ThemeToggle />

      {/* Currency */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <DollarSign size={16} className="inline mr-1" />
          Currency
        </label>
        <Select
          value={settings.currency}
          onChange={handleCurrencyChange}
          options={[
            { value: 'USD', label: 'USD ($)' },
            { value: 'EUR', label: 'EUR (€)' },
            { value: 'GBP', label: 'GBP (£)' },
            { value: 'CAD', label: 'CAD ($)' },
            { value: 'AUD', label: 'AUD ($)' },
          ]}
        />
      </div>

      {/* Time Format */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <Clock size={16} className="inline mr-1" />
          Time Format
        </label>
        <Select
          value={settings.timeFormat}
          onChange={handleTimeFormatChange}
          options={[
            { value: '12h', label: '12-hour (2:30 PM)' },
            { value: '24h', label: '24-hour (14:30)' },
          ]}
        />
      </div>

      {/* Mileage Rate */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <Car size={16} className="inline mr-1" />
          Mileage Rate ({settings.currency}/mile)
        </label>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={settings.mileageRate}
          onChange={e => handleMileageRateChange(e.target.value)}
          helperText="Standard IRS rate for 2024 is $0.67/mile"
        />
      </div>

      {/* Preferred Travel Method */}
      <div>
        <label className="block text-sm font-medium mb-2">Preferred Travel Method</label>
        <Select
          value={settings.preferredTravelMethod}
          onChange={handleTravelMethodChange}
          options={[
            { value: 'driving', label: 'Driving' },
            { value: 'transit', label: 'Public Transit' },
            { value: 'walking', label: 'Walking' },
            { value: 'bicycling', label: 'Bicycling' },
          ]}
        />
      </div>

      {/* Notifications */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
        <div>
          <div className="font-medium flex items-center gap-2">
            <Bell size={16} />
            Notifications
          </div>
          <p className="text-sm text-foreground/70 mt-1">
            Show alerts for upcoming call times and overdue tasks
          </p>
        </div>
        <Switch
          checked={settings.notificationsEnabled}
          onChange={(e) => handleNotificationsToggle(e.target.checked)}
        />
      </div>
    </div>
  )
}
