import { Link } from 'react-router-dom'
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-center px-4">
      <span className="text-8xl mb-6">🎭</span>
      <h1 className="font-display text-5xl font-black mb-4">404</h1>
      <p className="text-muted mb-8 text-lg font-light">This stage is empty. The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Back to Manch</Link>
    </div>
  )
}
