import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import GlobalModals from '@/components/common/GlobalModals'

export default function PageLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
      <GlobalModals />
    </div>
  )
}
