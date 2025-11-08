import { useState } from 'react'
import { ProfileSection } from '@/components/settings/ProfileSection'
import { PreferencesSection } from '@/components/settings/PreferencesSection'
import { DataManagementSection } from '@/components/settings/DataManagementSection'
import { AboutSection } from '@/components/settings/AboutSection'

type Tab = 'profile' | 'preferences' | 'data' | 'about'

/**
 * Settings page
 * Comprehensive settings with tabs for Profile, Preferences, Data Management, and About
 */
export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'data', label: 'Data' },
    { id: 'about', label: 'About' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-foreground/70">
          Manage your profile, preferences, and app data
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/10 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-3 text-sm font-medium whitespace-nowrap
              border-b-2 transition-colors
              ${activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground/70 hover:text-foreground hover:border-white/20'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pb-8">
        {activeTab === 'profile' && <ProfileSection />}
        {activeTab === 'preferences' && <PreferencesSection />}
        {activeTab === 'data' && <DataManagementSection />}
        {activeTab === 'about' && <AboutSection />}
      </div>
    </div>
  )
}
