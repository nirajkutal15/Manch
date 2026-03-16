import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { gigService } from '@/services'
import { GIG_TYPE_LABELS } from '@/types'

export default function VenueGigs() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['venue-gigs'], queryFn: () => gigService.mine() })

  const cancel = useMutation({
    mutationFn: (id: string) => gigService.cancel(id),
    onSuccess: () => {
      toast.success('Gig cancelled')
      qc.invalidateQueries({ queryKey: ['venue-gigs'] })
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Failed')
  })

  const sb = (s: string) => ({
    OPEN: 'badge-accepted',
    CLOSED: 'badge-pending',
    CANCELLED: 'badge-rejected',
    COMPLETED: 'bg-black/5 text-muted'
  }[s] ?? 'badge-pending')

  if (isLoading) return (
    <div className="px-6 md:px-24 py-12">
      <div className="space-y-3 animate-pulse">
        {[...Array(5)].map((_, i) => <div key={i} className="card h-20" />)}
      </div>
    </div>
  )

  return (
    <div className="px-6 md:px-24 py-12">
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="section-label">Gig Management</div>
          <h1 className="section-title">Your Gigs</h1>
        </div>
        <Link to="/venue/gigs/new" className="btn-gold">+ Post New Gig</Link>
      </div>

      {!data?.content.length ? (
        <div className="card p-16 text-center text-muted">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-lg font-display font-bold mb-2">No gigs yet</p>
          <p className="text-sm mb-6">Post your first gig and discover great talent.</p>
          <Link to="/venue/gigs/new" className="btn-gold">Post First Gig →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data.content.map(g => (
            <div key={g.id} className="card p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-display font-bold text-lg">{g.title}</span>
                    <span className={`badge ${sb(g.status)}`}>{g.status}</span>
                    <span className="badge badge-open text-[10px]">{GIG_TYPE_LABELS[g.gigType]}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-muted flex-wrap">
                    <span>📍 {g.venue ?? g.city}, {g.city}</span>
                    <span>📅 {new Date(g.eventDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <span>👥 {g.slotsFilled}/{g.slotsAvailable} slots filled</span>
                    <span>{g.payType === 'FREE' ? '🆓 Free' : g.payAmount ? `💰 ₹${g.payAmount.toLocaleString()}` : '🤝 Negotiable'}</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Link to={`/venue/gigs/${g.id}/applications`} className="btn-primary py-2 px-4 text-sm">
                    Applications ({g.slotsFilled})
                  </Link>
                  {g.status === 'OPEN' && (
                    <Link to={`/venue/gigs/${g.id}/edit`} className="btn-outline py-2 px-4 text-sm">
                      ✏️ Edit
                    </Link>
                  )}
                  {g.status === 'OPEN' && (
                    <button
                      onClick={() => { if (confirm('Cancel this gig?')) cancel.mutate(g.id) }}
                      className="btn-outline py-2 px-4 text-sm text-rust border-rust/30 hover:border-rust hover:text-rust"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}