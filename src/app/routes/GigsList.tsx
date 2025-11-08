import { useEffect, useMemo, useState } from 'react'
import { useGigs, useUI } from '@/store/hooks'
import { GigCard } from '@/components/gigs/GigCard'
import { GigFilters, type GigFilterStatus } from '@/components/gigs/GigFilters'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useFormValidation } from '@/hooks/useFormValidation'
import { createGigSchema } from '@/schemas/gigSchema'
import { uid } from '@/utils/id'
import type { Gig } from '@/types'
import { compareISO } from '@/utils/dateUtils'

export default function GigsList() {
  const { gigs, loadGigs, addGig } = useGigs()
  const { activeModal, openModal, closeModal } = useUI()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<GigFilterStatus>('all')

  useEffect(() => {
    loadGigs()
  }, [loadGigs])

  // Form for creating new gig
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useFormValidation(createGigSchema, {
    defaultValues: {
      date: '',
      callTime: '',
      venue: {
        name: '',
        address: '',
        contact: '',
      },
      compensation: {
        amount: 0,
        currency: 'USD',
        status: 'pending',
      },
      status: 'pending',
      notes: '',
    },
  })

  const onSubmit = async (data: any) => {
    const now = Date.now()
    const newGig: Gig = {
      id: uid('gig'),
      date: data.date,
      callTime: data.callTime,
      venue: data.venue,
      compensation: data.compensation.amount > 0 ? data.compensation : undefined,
      status: data.status || 'pending',
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    }

    await addGig(newGig)
    reset()
    closeModal()
  }

  // Filter and sort gigs
  const filteredGigs = useMemo(() => {
    return gigs
      .filter((g) => {
        // Search filter
        const matchesSearch = g.venue.name
          .toLowerCase()
          .includes(search.toLowerCase())

        // Status filter
        const matchesStatus =
          statusFilter === 'all' || g.status === statusFilter

        return matchesSearch && matchesStatus
      })
      .sort((a, b) => compareISO(a.date, b.date))
  }, [gigs, search, statusFilter])

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gigs</h1>
        <Button variant="primary" onClick={() => openModal('create-gig')} data-testid="new-gig-button">
          New Gig
        </Button>
      </header>

      <GigFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {filteredGigs.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg opacity-60 mb-4">
            {search || statusFilter !== 'all'
              ? 'No gigs match your filters'
              : 'No gigs yet. Create your first one!'}
          </p>
          <Button variant="primary" onClick={() => openModal('create-gig')}>
            New Gig
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGigs.map((gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>
      )}

      {/* Create Gig Modal */}
      <Modal
        open={activeModal === 'create-gig'}
        onClose={closeModal}
        title="Create New Gig"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Venue Name"
            {...register('venue.name')}
            error={errors.venue?.name?.message}
            placeholder="Blue Note Jazz Club"
          />

          <Input
            label="Venue Address (optional)"
            {...register('venue.address')}
            error={errors.venue?.address?.message}
            placeholder="123 Main St, New York, NY"
          />

          <Input
            label="Venue Contact (optional)"
            {...register('venue.contact')}
            error={errors.venue?.contact?.message}
            placeholder="Email or phone"
          />

          <Input
            label="Performance Date & Time"
            type="datetime-local"
            {...register('date')}
            error={errors.date?.message}
          />

          <Input
            label="Call Time (optional)"
            type="datetime-local"
            {...register('callTime')}
            error={errors.callTime?.message}
          />

          <Input
            label="Compensation Amount (optional)"
            type="number"
            step="0.01"
            {...register('compensation.amount', { valueAsNumber: true })}
            error={errors.compensation?.amount?.message}
            placeholder="0.00"
          />

          <Textarea
            label="Notes (optional)"
            {...register('notes')}
            error={errors.notes?.message}
            placeholder="Any additional details..."
            rows={3}
          />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={closeModal} className="flex-1" data-testid="cancel-create-gig">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1" data-testid="submit-create-gig">
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
