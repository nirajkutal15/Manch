import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { openModal } from '@/store/slices/uiSlice'
import type { AppDispatch } from '@/store'

export default function Footer() {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <footer className="bg-ink border-t border-gold/20 px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <Link to="/" className="font-display text-xl font-black text-cream">
        मंच<span className="text-gold">.</span>
      </Link>
      <span className="text-cream/35 text-xs">© 2024 Manch. Built with ❤️ in Pune, India 🇮🇳</span>
      <ul className="flex gap-6 list-none">
        <li><button onClick={() => dispatch(openModal({ id: 'about' }))} className="text-cream/45 text-xs hover:text-gold transition-colors cursor-pointer">About</button></li>
        <li><button onClick={() => dispatch(openModal({ id: 'contact' }))} className="text-cream/45 text-xs hover:text-gold transition-colors cursor-pointer">Contact</button></li>
        <li><button onClick={() => dispatch(openModal({ id: 'privacy' }))} className="text-cream/45 text-xs hover:text-gold transition-colors cursor-pointer">Privacy</button></li>
      </ul>
    </footer>
  )
}
