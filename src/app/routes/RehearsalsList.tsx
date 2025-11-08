import { useEffect, useMemo, useState } from 'react'
import { useRehearsals, useUI } from '@/store/hooks'
import { RehearsalCard } from '@/components/rehearsals/RehearsalCard'
import { RehearsalFilters, type GroupBy } from '@/components/rehearsals/RehearsalFilters'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { useFormValidation } from '@/hooks/useFormValidation'
import { createRehearsalSchema } from '@/schemas/rehearsalSchema'
import { uid } from '@/utils/id'
import type { Rehearsal } from '@/types'

export default function RehearsalsList() {
  const { rehearsals, loadRehearsals, addRehearsal } = useRehearsals()
  const { activeModal, openModal, closeModal } = useUI()
  const [search, setSearch] = useState('')
  const [groupBy, setGroupBy] = useState<GroupBy>('date')

  useEffect(() => {
    loadRehearsals()
  }, [loadRehearsals])

  // Form for creating new rehearsal
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useFormValidation(createRehearsalSchema, {
    defaultValues: {
      eventName: '',
      date: '',
      location: '',
      tasks: [],
    },
  })

  const onSubmit = async (data: any) => {
    const now = Date.now()
    const newRehearsal: Rehearsal = {
      id: uid('rehearsal'),
      eventName: data.eventName,
      date: data.date,
      location: data.location,
      tasks: [],
      createdAt: now,
      updatedAt: now,
    }

    await addRehearsal(newRehearsal)
    reset()
    closeModal()
  }

  // Filter rehearsals by search
  const filteredRehearsals = useMemo(() => {
    return rehearsals.filter((r) =>
      r.eventName.toLowerCase().includes(search.toLowerCase())
    )
  }, [rehearsals, search])

  // Group rehearsals
  const groupedRehearsals = useMemo(() => {
    const sorted = [...filteredRehearsals].sort((a, b) => a.date.localeCompare(b.date))

    if (groupBy === 'none') {
      return { All: sorted }
    }

    if (groupBy === 'date') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
      const thisWeekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      const groups: Record<string, Rehearsal[]> = {
        Today: [],
        Tomorrow: [],
        'This Week': [],
        'This Month': [],
        Past: [],
        Future: [],
      }

      sorted.forEach((r) => {
        const date = new Date(r.date)
        if (date < today) {
          groups.Past.push(r)
        } else if (date >= today && date < tomorrow) {
          groups.Today.push(r)
        } else if (date >= tomorrow && date < thisWeekEnd) {
          groups['This Week'].push(r)
        } else if (date >= thisWeekEnd && date <= thisMonthEnd) {
          groups['This Month'].push(r)
        } else {
          groups.Future.push(r)
        }
      })

      // Remove empty groups
      return Object.fromEntries(Object.entries(groups).filter(([_, items]) => items.length > 0))
    }

    if (groupBy === 'status') {
      const groups: Record<string, Rehearsal[]> = {
        Upcoming: [],
        Past: [],
      }

      const now = new Date()
      sorted.forEach((r) => {
        const date = new Date(r.date)
        if (date >= now) {
          groups.Upcoming.push(r)
        } else {
          groups.Past.push(r)
        }
      })

      return Object.fromEntries(Object.entries(groups).filter(([_, items]) => items.length > 0))
    }

    return { All: sorted }
  }, [filteredRehearsals, groupBy])

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rehearsals</h1>
        <Button variant="primary" onClick={() => openModal('create-rehearsal')}>
          New Rehearsal
        </Button>
      </header>

      <RehearsalFilters
        search={search}
        onSearchChange={setSearch}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
      />

      {Object.keys(groupedRehearsals).length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg opacity-60 mb-4">No rehearsals yet. Create your first one!</p>
          <Button variant="primary" onClick={() => openModal('create-rehearsal')}>
            New Rehearsal
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedRehearsals).map(([group, items]) => (
            <div key={group}>
              <h2 className="text-lg font-semibold mb-4 opacity-80">{group}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((rehearsal) => (
                  <RehearsalCard key={rehearsal.id} rehearsal={rehearsal} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Rehearsal Modal */}
      <Modal
        open={activeModal === 'create-rehearsal'}
        onClose={closeModal}
        title="Create New Rehearsal"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Event Name"
            {...register('eventName')}
            error={errors.eventName?.message}
            placeholder="Band Practice"
          />

          <Input
            label="Date & Time"
            type="datetime-local"
            {...register('date')}
            error={errors.date?.message}
          />

          <Input
            label="Location (optional)"
            {...register('location')}
            error={errors.location?.message}
            placeholder="Studio 5"
          />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={closeModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
