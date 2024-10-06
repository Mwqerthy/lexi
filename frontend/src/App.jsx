import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import HowToPage from './Howto'
import CallToAction from './Callto'
import Footer from './Footer'
import ExperienceSection from './Exp'
import HomeScreen from './HomeScreen'
import Header from './Header'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])



  return (
    <div className="min-h-screen bg-[#f0f4f8] text-gray-800">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main className="pt-24" ref={ref}>
        <HomeScreen />

        <ExperienceSection />

        <HowToPage />
        <CallToAction />

      </main>

      <Footer />
    </div>
  )
}