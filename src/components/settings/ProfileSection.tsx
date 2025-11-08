import { useState } from 'react'
import { User, MapPin, Save } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/ToastProvider'

/**
 * Profile settings section
 * Allows editing name, email, and home address
 */
export function ProfileSection() {
  const settings = useStore(state => state.settings)
  const updateSettings = useStore(state => state.updateSettings)
  const toast = useToast()

  const [name, setName] = useState(settings.name || '')
  const [email, setEmail] = useState(settings.email || '')
  const [homeAddress, setHomeAddress] = useState(settings.homeAddress || '')

  const handleSave = () => {
    updateSettings({
      name,
      email,
      homeAddress,
    })

    toast.success('Profile updated successfully')
  }

  const hasChanges =
    name !== (settings.name || '') ||
    email !== (settings.email || '') ||
    homeAddress !== (settings.homeAddress || '')

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User size={20} />
          Profile
        </h3>
        <p className="text-sm text-foreground/70 mb-4">
          Your personal information and preferences
        </p>
      </div>

      <Input
        label="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
      />

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your.email@example.com"
      />

      <Input
        label="Home Address"
        value={homeAddress}
        onChange={e => setHomeAddress(e.target.value)}
        placeholder="123 Main St, City, State ZIP"
        helperText="🗺️ Used for calculating mileage to gig venues"
      />

      <Button
        onClick={handleSave}
        disabled={!hasChanges}
        className="w-full sm:w-auto"
      >
        <Save size={16} />
        Save Changes
      </Button>
    </div>
  )
}
