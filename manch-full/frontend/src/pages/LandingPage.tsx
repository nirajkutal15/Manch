import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GlobalModals from '@/components/common/GlobalModals'
import HeroSection from '@/components/sections/HeroSection'
import MarqueeBand from '@/components/sections/MarqueeBand'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import ArtFormsSection from '@/components/sections/ArtFormsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CtaSection from '@/components/sections/CtaSection'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function LandingPage() {
  useScrollReveal()
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <MarqueeBand />
      <HowItWorksSection />
      <FeaturesSection />
      <ArtFormsSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
      <GlobalModals />
    </div>
  )
}
