import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { logout } from '@/store/slices/authSlice'
import { openModal, setNavScrolled } from '@/store/slices/uiSlice'
import type { AppDispatch } from '@/store'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isLoggedIn, isArtist, isVenue, user } = useAuth()
  const { navScrolled } = useSelector((s: RootState) => s.ui)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => dispatch(setNavScrolled(window.scrollY > 60))
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [dispatch])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  const dashboardPath = isArtist ? '/artist/dashboard' : isVenue ? '/venue/dashboard' : '/'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[500] flex justify-between items-center px-12 transition-all duration-300 border-b border-gold/20 bg-cream/92 backdrop-blur-md ${navScrolled ? 'py-3 shadow-sm' : 'py-5'}`}>
      <Link to="/" className="font-display text-2xl font-black tracking-tight">
        मंच<span className="text-gold">.</span>
      </Link>

      {/* Desktop */}
      <ul className="hidden md:flex gap-8 items-center list-none">
        <li><button onClick={() => scrollTo('how')} className="text-muted text-sm font-medium uppercase tracking-wider hover:text-ink transition-colors">How it works</button></li>
        <li><button onClick={() => scrollTo('features')} className="text-muted text-sm font-medium uppercase tracking-wider hover:text-ink transition-colors">Features</button></li>
        <li><Link to="/gigs" className="text-muted text-sm font-medium uppercase tracking-wider hover:text-ink transition-colors">Browse Gigs</Link></li>
        {isLoggedIn ? (
          <>
            <li><Link to={dashboardPath} className="text-muted text-sm font-medium uppercase tracking-wider hover:text-ink transition-colors">Dashboard</Link></li>
            <li>
              <button
                onClick={() => { dispatch(logout()); navigate('/') }}
                className="bg-ink text-cream text-sm font-medium px-5 py-2 rounded-sm hover:bg-gold hover:text-ink transition-all"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="text-muted text-sm font-medium uppercase tracking-wider hover:text-ink transition-colors">Login</Link></li>
            <li>
              <button
                onClick={() => dispatch(openModal({ id: 'artist-waitlist' }))}
                className="bg-ink text-cream text-sm font-medium px-5 py-2 rounded-sm hover:bg-gold hover:text-ink transition-all"
              >
                Join Waitlist
              </button>
            </li>
          </>
        )}
      </ul>

      {/* Mobile */}
      <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-cream border-b border-gold/20 p-6 flex flex-col gap-4 md:hidden">
          <button onClick={() => scrollTo('how')} className="text-left text-sm font-medium uppercase tracking-wider text-muted">How it works</button>
          <button onClick={() => scrollTo('features')} className="text-left text-sm font-medium uppercase tracking-wider text-muted">Features</button>
          <Link to="/gigs" onClick={() => setMobileOpen(false)} className="text-sm font-medium uppercase tracking-wider text-muted">Browse Gigs</Link>
          {isLoggedIn ? (
            <>
              <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="text-sm font-medium uppercase tracking-wider text-muted">Dashboard</Link>
              <button onClick={() => { dispatch(logout()); navigate('/'); setMobileOpen(false) }} className="btn-primary text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium uppercase tracking-wider text-muted">Login</Link>
              <button onClick={() => { dispatch(openModal({ id: 'artist-waitlist' })); setMobileOpen(false) }} className="btn-primary text-left">Join Waitlist</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
