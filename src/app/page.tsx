import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Partners from '@/components/Partners'
import Features from '@/components/Features'
import About from '@/components/About'
import Statistics from '@/components/Statistics'
import Testimonials from '@/components/Testimonials'
import Portfolio from '@/components/Portfolio'
import Footer from '@/components/Footer'
import FAQ from '@/components/FAQ'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <Features />
        <About />
        <Statistics />
        <Testimonials />
        <FAQ />
        <Portfolio />
      </main>
      <Footer />
    </>
  )
} 