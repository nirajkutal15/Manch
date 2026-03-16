import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { artistService } from '@/services'
import { ART_FORM_LABELS, CITIES, type ArtForm, type UserDto } from '@/types'
import StarRating from '@/components/ui/StarRating'

function ArtistCard({ artist }: { artist: UserDto }) {
  return (
    <div className="card p-6 hover:-translate-y-1 hover:border-gold hover:shadow-lg transition-all duration-200">
      <div className="flex items-start gap-4 mb-4">
        {artist.profileImageUrl ? (
          <img
            src={artist.profileImageUrl}
            alt={artist.fullName}
            className="w-14 h-14 rounded-full object-cover border-2 border-gold/20 flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center text-2xl flex-shrink-0">
            🎤
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-lg leading-tight">{artist.fullName}</h3>
          <p className="text-muted text-sm mt-0.5">
            {artist.artForm ? ART_FORM_LABELS[artist.artForm as ArtForm] : 'Performer'} · {artist.city}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <StarRating value={Math.round(artist.rating ?? 0)} readonly size="sm" />
            <span className="text-xs text-muted">
              {artist.rating?.toFixed(1) ?? '—'} · {artist.totalShows ?? 0} shows
            </span>
          </div>
        </div>
      </div>

      {artist.bio && (
        <p className="text-sm text-muted font-light leading-relaxed mb-4 line-clamp-2">
          {artist.bio}
        </p>
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-2 flex-wrap">
          {artist.yearsExperience ? (
            <span className="text-xs bg-gold/10 text-yellow-700 px-2 py-0.5 rounded-sm">
              {artist.yearsExperience} yr{artist.yearsExperience !== 1 ? 's' : ''} exp
            </span>
          ) : null}
          {artist.artForm && (
            <span className="text-xs bg-black/5 text-muted px-2 py-0.5 rounded-sm">
              {artist.artForm.replace(/_/g, ' ')}
            </span>
          )}
        </div>
        <Link
          to={`/artists/${artist.id}`}
          className="text-gold text-xs font-medium hover:underline flex-shrink-0"
        >
          View Profile →
        </Link>
      </div>
    </div>
  )
}

export default function BrowseArtists() {
  const [city, setCity] = useState('')
  const [artForm, setArtForm] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['artists', city, artForm, page],
    queryFn: () => artistService.list({
      city: city || undefined,
      artForm: artForm || undefined,
      page,
      size: 12,
    }),
  })

  const filtered = data?.content.filter(a =>
    !search ||
    a.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (a.bio ?? '').toLowerCase().includes(search.toLowerCase())
  ) ?? []

  return (
    <div className="px-6 md:px-24 py-12">
      <div className="mb-10">
        <div className="section-label">Discover Artists</div>
        <h1 className="section-title mb-2">Find the Right Talent</h1>
        <p className="text-muted font-light">
          Browse verified artists with real performance histories.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-10">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or bio..."
          className="form-input flex-1 min-w-[200px]"
        />
        <select
          value={city}
          onChange={e => { setCity(e.target.value); setPage(0) }}
          className="form-input min-w-[130px]"
        >
          <option value="">All Cities</option>
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          value={artForm}
          onChange={e => { setArtForm(e.target.value); setPage(0) }}
          className="form-input min-w-[180px]"
        >
          <option value="">All Art Forms</option>
          {Object.entries(ART_FORM_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        {(search || city || artForm) && (
          <button
            onClick={() => { setSearch(''); setCity(''); setArtForm(''); setPage(0) }}
            className="btn-outline py-2.5"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-5">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse h-48" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center text-muted">
          <p className="text-4xl mb-4">🎤</p>
          <p className="text-lg font-display font-bold mb-2">No artists found</p>
          <p className="text-sm">Try different filters or check back soon.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted mb-4">
            Showing {filtered.length} of {data?.totalElements ?? 0} artists
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {filtered.map(artist => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-10">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="btn-outline py-2 px-5 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="flex items-center text-sm text-muted">
            Page {page + 1} of {data.totalPages}
          </span>
          <button
            disabled={data.last}
            onClick={() => setPage(p => p + 1)}
            className="btn-primary py-2 px-5"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}