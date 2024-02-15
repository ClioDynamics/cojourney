'use client'

import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import AboutCojourney from '@/sections/AboutCojourney'
import Header from '@/sections/Header'
import Pricing from '@/sections/Pricing'
import Image from 'next/image'

export default function Home () {
  return (
    <main>
      <div className="bg-[#0D121F] text-white relative">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: 'url(\'/images/NewBackground.jpg\')',
            // always cover the whole div
            backgroundSize: 'cover'
          }}
        />
        <Navbar />
        <Header />
      </div>
      <AboutCojourney />
      <Pricing />
      <Footer />
    </main>
  )
}
