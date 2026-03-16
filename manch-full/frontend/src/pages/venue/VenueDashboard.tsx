import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { gigService } from '@/services'
import { GIG_TYPE_LABELS } from '@/types'

export default function VenueDashboard() {
  const { user } = useAuth()

  const { data: gigs } = useQuery({
    queryKey: ['venue-gigs'],
    queryFn: () => gigService.mine({ size: 10 }),
  })

  const openGigs = gigs?.content.filter(g => g.status === 'OPEN').length ?? 0
  const totalApps = gigs?.content.reduce((sum, g) => sum + g.slotsFilled, 0) ?? 0

  const stats = [
    { icon: '📋', label: 'Total Gigs Posted', value: gigs?.totalElements ?? 0 },
    { icon: '🟢', label: 'Open Gigs', value: openGigs },
    { icon: '👥', label: 'Slots Filled', value: totalApps },
    { icon: '🏙️', label: 'City', value: user?.city ?? '—' },
  ]

  const statusBadge = (s: string) => ({
    OPEN: 'badge-accepted',
    CLOSED: 'badge-pending',
    CANCELLED: 'badge-rejected',
    COMPLETED: 'bg-black/5 text-muted'
  }[s] ?? 'badge-pending')

  return (
    <div className="px-6 md:px-24 py-12">
      <div className="mb-10">
        <div className="section-label">Venue Dashboard</div>
        <div className="flex items-center gap-4 mb-2">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.venueName ?? user.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-gold/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center text-3xl">
              🏛️
            </div>
          )}
          <div>
            <h1 className="section-title mb-1">
              Welcome, {user?.venueName ?? user?.fullName} 🏛️
            </h1>
            <p className="text-muted font-light">
              {user?.venueType?.replace(/_/g, ' ')} · {user?.city}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map(s => (
          <div key={s.label} className="card p-6">
            <span className="text-2xl block mb-3">{s.icon}</span>
            <div className="font-display text-3xl font-bold">{s.value}</div>
            <div className="text-xs text-muted uppercase tracking-wider mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-4 gap-4 mb-12">
        <Link to="/venue/gigs/new" className="btn-gold justify-center py-4 text-base font-medium">
          + Post a New Gig
        </Link>
        <Link to="/venue/gigs" className="btn-primary justify-center py-4 text-base font-medium">
          Manage Gigs
        </Link>
        <Link to="/venue/artists" className="btn-outline justify-center py-4 text-base font-medium">
          🎤 Browse Artists
        </Link>
        <Link to="/venue/profile" className="btn-outline justify-center py-4 text-base font-medium">
          Edit Profile
        </Link>
      </div>

      {/* Recent gigs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl font-bold">Your Gigs</h2>
          <Link to="/venue/gigs" className="text-gold text-sm hover:underline">Manage all →</Link>
        </div>
        {!gigs?.content.length ? (
          <div className="card p-12 text-center text-muted">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-lg font-display font-bold mb-2">No gigs posted yet</p>
            <p className="text-sm mb-4">Post your first gig and start finding talent!</p>
            <Link to="/venue/gigs/new" className="btn-gold">Post Your First Gig →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {gigs.content.slice(0, 5).map(g => (
              <div key={g.id} className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-display font-bold">{g.title}</span>
                    <span className={`badge ${statusBadge(g.status)}`}>{g.status}</span>
                  </div>
                  <p className="text-xs text-muted">
                    {GIG_TYPE_LABELS[g.gigType]} · {g.city} · {new Date(g.eventDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {g.slotsFilled}/{g.slotsAvailable} slots filled
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/venue/gigs/${g.id}/applications`} className="btn-outline py-2 px-4 text-sm self-start">
                    View Applications
                  </Link>
                  {g.status === 'OPEN' && (
                    <Link to={`/venue/gigs/${g.id}/edit`} className="btn-outline py-2 px-4 text-sm self-start">
                      ✏️ Edit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}