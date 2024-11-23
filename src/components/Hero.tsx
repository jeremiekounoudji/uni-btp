'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64;
      const elementPosition = element.offsetTop - navbarHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    }
  };
  return (
    <section className="min-h-screen w-screen flex items-center bg-primary text-white" id='hero'>
      <div className="w-full mx-auto px-4 grid md:grid-cols-2 md:ml-16 gap-8">
        <div className="pt-24 pb-12 flex flex-col justify-center md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="text-lg">UNIE-BTP</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Union Solidaire des entrepreneurs de BTP
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-400 text-lg mb-8 md:max-w-[500px]"
          >
            Nous rassemblons les professionnels du secteur du bâtiment pour innover, collaborer et croître ensemble, en partageant des opportunités et des ressources.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex gap-4"
          >
            <button className="bg-white text-black px-6 py-3 rounded-full">
              Rejoignez-nous
            </button>
            <button onClick={() => scrollToSection('about')} className="border border-white text-white px-6 py-3 rounded-full">
              Découvrez-nous
            </button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block relative h-[100vh]"
        >
          <Image 
            src="/hero-img.png"
            alt="Construction worker"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </div>
    </section>
  )
}