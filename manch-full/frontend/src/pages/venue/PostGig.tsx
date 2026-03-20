import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
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
  slotsAvailable: z.string().min(1, 'Slots required'),
  requirements: z.string().optional(),
  durationMinutes: z.string().optional(),
})

type PostGigForm = z.infer<typeof schema>

export default function PostGig() {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm<PostGigForm>({ resolver: zodResolver(schema), defaultValues: { slotsAvailable: '1', payType: 'FREE' } })
  const payType = watch('payType')

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => gigService.create(data),
    onSuccess: () => { toast.success('Gig posted successfully! 🎉'); navigate('/venue/gigs') },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Failed to post gig'),
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

  return (
    <div className="px-6 md:px-24 py-12 max-w-3xl">
      <div className="mb-10">
        <div className="section-label">Post a Gig</div>
        <h1 className="section-title">Create a New Slot</h1>
        <p className="text-muted font-light mt-2">Fill in the details and artists will start applying within hours.</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit(d => onSubmit(d as Record<string, unknown>))} className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label">Gig Title *</label>
                <input {...register('title')} placeholder="Thursday Open Mic at Cafe Bohemian" className="form-input" />
                {errors.title && <p className="text-rust text-xs mt-1">{errors.title.message as string}</p>}
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea {...register('description')} rows={3} placeholder="Tell artists what you're looking for, the vibe, audience size..." className="form-input resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Gig Type *</label>
                  <select {...register('gigType')} className="form-input">
                    <option value="">Select type</option>
                    {Object.entries(GIG_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  {errors.gigType && <p className="text-rust text-xs mt-1">{errors.gigType.message as string}</p>}
                </div>
                <div>
                  <label className="form-label">City *</label>
                  <select {...register('city')} className="form-input">
                    <option value="">Select city</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  {errors.city && <p className="text-rust text-xs mt-1">{errors.city.message as string}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Venue Name</label>
                  <input {...register('venue')} placeholder="Cafe Bohemian, Bandra" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Full Address</label>
                  <input {...register('address')} placeholder="123 Link Road, Bandra West, Mumbai" className="form-input" />
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
                <input {...register('eventDate')} type="date" min={new Date().toISOString().split('T')[0]} className="form-input" />
                {errors.eventDate && <p className="text-rust text-xs mt-1">{errors.eventDate.message as string}</p>}
              </div>
              <div>
                <label className="form-label">Start Time</label>
                <input {...register('eventTime')} type="time" className="form-input" />
              </div>
            </div>
            <div className="mt-4">
              <label className="form-label">Duration (minutes)</label>
              <input {...register('durationMinutes')} type="number" min="5" max="480" placeholder="e.g. 30" className="form-input w-40" />
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
                  <input {...register('payAmount')} type="number" min="0" placeholder="e.g. 2000" className="form-input" />
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
            <div>
              <label className="form-label">Specific Requirements</label>
              <textarea {...register('requirements')} rows={2} placeholder="e.g. Must have performed at least 5 times. Original material only." className="form-input resize-none" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={mutation.isPending} className="btn-gold">
              {mutation.isPending ? 'Posting...' : '🎉 Post Gig'}
            </button>
            <button type="button" onClick={() => navigate('/venue/gigs')} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}