import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { gigService } from '@/services'
import { GIG_TYPE_LABELS, CITIES } from '@/types'

const schema = z.object({
  title: z.string().min(3, 'Title required').max(200),
  description: z.string().optional(),
  city: z.string().min(1, 'City required'),
  venue: z.string().optional(),
  address: z.string().optional(),
  eventDate: z.string().min(1, 'Event date required'),
  eventTime: z.string().optional(),
  gigType: z.string().min(1, 'Gig type required'),
  payType: z.string().min(1, 'Pay type required'),
  payAmount: z.string().optional(),
  slotsAvailable: z.string().min(1),
  requirements: z.string().optional(),
  durationMinutes: z.string().optional(),
})

export default function EditGig() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: gig, isLoading } = useQuery({
    queryKey: ['gig', id],
    queryFn: () => gigService.get(id!),
    enabled: !!id,
  })

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    values: gig ? {
      title: gig.title ?? '',
      description: gig.description ?? '',
      city: gig.city ?? '',
      venue: gig.venue ?? '',
      address: gig.address ?? '',
      eventDate: gig.eventDate ?? '',
      eventTime: gig.eventTime?.substring(0, 5) ?? '',
      gigType: gig.gigType ?? '',
      payType: gig.payType ?? 'FREE',
      payAmount: gig.payAmount ? String(gig.payAmount) : '',
      slotsAvailable: String(gig.slotsAvailable ?? 1),
      requirements: gig.requirements ?? '',
      durationMinutes: gig.durationMinutes ? String(gig.durationMinutes) : '',
    } : undefined,
  })

  const payType = watch('payType')

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => gigService.update(id!, data),
    onSuccess: () => {
      toast.success('Gig updated successfully! ✅')
      qc.invalidateQueries({ queryKey: ['gig', id] })
      qc.invalidateQueries({ queryKey: ['venue-gigs'] })
      navigate('/venue/gigs')
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Failed to update gig'),
  })

  const onSubmit = (raw: Record<string, unknown>) => {
    const data: Record<string, unknown> = {
      ...raw,
      slotsAvailable: Number(raw.slotsAvailable),
      payAmount: raw.payAmount ? Number(raw.payAmount) : null,
      durationMinutes: raw.durationMinutes ? Number(raw.durationMinutes) : null,
      eventTime: raw.eventTime || null,
    }
    mutation.mutate(data)
  }

  if (isLoading) return (
    <div className="px-6 md:px-24 py-12">
      <div className="animate-pulse space-y-4">
        {[...Array(6)].map((_, i) => <div key={i} className="card h-12" />)}
      </div>
    </div>
  )

  return (
    <div className="px-6 md:px-24 py-12 max-w-3xl">
      <Link to="/venue/gigs" className="text-muted text-sm hover:text-gold mb-6 inline-block">← Back to Gigs</Link>

      <div className="mb-10">
        <div className="section-label">Edit Gig</div>
        <h1 className="section-title">Update Gig Details</h1>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit(d => onSubmit(d as Record<string, unknown>))} className="space-y-6">

          {/* Basic Info */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label">Gig Title *</label>
                <input {...register('title')} className="form-input" />
                {errors.title && <p className="text-rust text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea {...register('description')} rows={3} className="form-input resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Gig Type *</label>
                  <select {...register('gigType')} className="form-input">
                    <option value="">Select type</option>
                    {Object.entries(GIG_TYPE_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                  {errors.gigType && <p className="text-rust text-xs mt-1">{errors.gigType.message}</p>}
                </div>
                <div>
                  <label className="form-label">City *</label>
                  <select {...register('city')} className="form-input">
                    <option value="">Select city</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  {errors.city && <p className="text-rust text-xs mt-1">{errors.city.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Venue Name</label>
                  <input {...register('venue')} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Full Address</label>
                  <input {...register('address')} className="form-input" />
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="border-t border-gold/10 pt-6">
            <h3 className="font-display font-bold text-lg mb-4">Date & Time</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Event Date *</label>
                <input {...register('eventDate')} type="date" className="form-input" />
                {errors.eventDate && <p className="text-rust text-xs mt-1">{errors.eventDate.message}</p>}
              </div>
              <div>
                <label className="form-label">Start Time</label>
                <input {...register('eventTime')} type="time" className="form-input" />
              </div>
            </div>
            <div className="mt-4">
              <label className="form-label">Duration (minutes)</label>
              <input {...register('durationMinutes')} type="number" min="5" max="480" className="form-input w-40" />
            </div>
          </div>

          {/* Pay & Slots */}
          <div className="border-t border-gold/10 pt-6">
            <h3 className="font-display font-bold text-lg mb-4">Payment & Slots</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="form-label">Pay Type *</label>
                <select {...register('payType')} className="form-input">
                  <option value="FREE">🆓 Free</option>
                  <option value="PAID">💰 Paid</option>
                  <option value="NEGOTIABLE">🤝 Negotiable</option>
                </select>
              </div>
              {payType === 'PAID' && (
                <div>
                  <label className="form-label">Amount (₹)</label>
                  <input {...register('payAmount')} type="number" min="0" className="form-input" />
                </div>
              )}
              <div>
                <label className="form-label">Slots Available *</label>
                <input {...register('slotsAvailable')} type="number" min="1" max="50" className="form-input" />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="border-t border-gold/10 pt-6">
            <h3 className="font-display font-bold text-lg mb-4">Requirements</h3>
            <textarea {...register('requirements')} rows={2} className="form-input resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={mutation.isPending} className="btn-gold">
              {mutation.isPending ? 'Saving...' : '✅ Save Changes'}
            </button>
            <button type="button" onClick={() => navigate('/venue/gigs')} className="btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}