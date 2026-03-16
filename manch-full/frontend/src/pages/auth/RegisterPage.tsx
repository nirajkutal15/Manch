import { Link, useNavigate } from 'react-router-dom'
export default function RegisterPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="font-display text-4xl font-black">मंच<span className="text-gold">.</span></Link>
        <p className="text-muted text-sm mt-3 mb-10">Join the stage.</p>
        <div className="card p-8">
          <h1 className="font-display text-2xl font-bold mb-2">Create account</h1>
          <p className="text-muted text-sm mb-8">Are you an artist or a venue?</p>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => navigate('/register/artist')} className="card p-6 text-center hover:border-gold hover:bg-[#FFF8ED] transition-all cursor-pointer border">
              <div className="text-4xl mb-3">🎤</div><div className="font-display font-bold">Artist</div><div className="text-xs text-muted mt-1">I perform</div>
            </button>
            <button onClick={() => navigate('/register/venue')} className="card p-6 text-center hover:border-gold hover:bg-[#FFF8ED] transition-all cursor-pointer border">
              <div className="text-4xl mb-3">🏛️</div><div className="font-display font-bold">Venue</div><div className="text-xs text-muted mt-1">I host events</div>
            </button>
          </div>
          <p className="text-center text-sm text-muted mt-6">Already have an account? <Link to="/login" className="underline hover:text-gold">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}
