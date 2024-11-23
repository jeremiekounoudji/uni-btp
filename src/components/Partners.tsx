'use client'

import { Partner } from '@/types'
import { motion } from 'framer-motion'
import Image from 'next/image';

const partners: Partner[] = [
  { 
    name: 'CNPS', 
    logo: '/partner-1.jpg',
    alt: 'MTN Logo'
  },
  { 
    name: 'GNA Assurance', 
    logo: '/partner-4.png',
    alt: 'Money Africa Logo'
  },
  { 
    name: 'LAFARGEHOLCIM', 
    logo: '/partner-2.png',
    alt: 'UBA Logo'
  },
  
];

export default function Partners() {
  return (
    <section className="py-20 bg-gray-200 " id='partners'>
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl text-center text-main font-bold mb-12"
        >
          Nos Partenaires
        </motion.h2>
       
        <div className="flex flex-wrap justify-center gap-8">
          {partners.map((partner, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1 // Staggered delay based on index
              }}
              className="flex items-center justify-center relative w-24 h-24"
            >
              <Image 
                src={partner.logo} 
                alt={partner.alt || partner.name}
                fill
                className="object-cover rounded-full hover:scale-110 transition-transform"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 