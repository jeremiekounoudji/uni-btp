'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function About() {
  const sections = [
    {
      title: "Qui Sommes-nous?",
      subtitle: "L'Union Solidaire des Entrepreneurs du BTP",
      description: "L'UNIE-BTP est une organisation dédiée à la protection, à l'accompagnement et à la défense des droits des entreprises du bâtiment en Côte d'Ivoire. Face aux défis actuels du secteur qui ne peuvent plus être relevés individuellement, nous nous positionnons comme porte-parole en rassemblant les forces vives du métier.",
      image: "/hero-img.png"
    },
    {
      title: "Notre Mission",
      subtitle: "Défendre et Soutenir",
      description: "Notre mission est de défendre les intérêts de nos membres, promouvoir la santé et le bien-être des travailleurs du BTP, et mettre en place des fonds de garantie pour soutenir les entreprises du secteur. Nous croyons en la force du collectif pour relever les défis de notre industrie.",
      image: "/hero-img.png"
    },
    {
      title: "Nos Services",
      subtitle: "Un Accompagnement Complet",
      description: "Nous proposons une gamme complète de services : mutuelle santé, gestion des retraites, formation et gestion RH, accompagnement au financement, gestion comptable et contentieux des impayés. Notre fonds de solidarité assure un soutien concret à nos membres.",
      image: "/hero-img.png"
    }
  ]

  
  return (
    <section className="py-20 bg-white" id='about'>
      <div className="container mx-auto px-4 md:px-16 lg:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl text-main md:text-5xl font-bold mb-6">À Propos de UNIE-BTP</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez comment notre association professionnelle transforme le secteur du BTP en créant un écosystème dynamique d'entrepreneurs et d'experts passionnés par l'innovation et l'excellence.
          </p>
        </motion.div>
        
        <div className="space-y-20 max-w-full md:max-w-6xl mx-auto">
          {sections.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {index % 2 === 0 ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h2 className="text-3xl font-bold text-main mb-4">{section.title}</h2>
                    {section.subtitle && (
                      <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        {section.subtitle}
                      </h3>
                    )}
                    <p className="text-gray-600 md:text-[17px] leading-relaxed max-w-xl">
                      {section.description}
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="relative h-[250px] md:h-[400px] w-[95vw] md:w-[400px] max-w-full rounded-lg overflow-hidden mx-auto"
                  >
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover object-center hover:scale-105 transition-transform duration-500"
                      priority={index === 0}
                    />
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="relative h-[250px] md:h-[400px] w-[95vw] md:w-[400px] max-w-full rounded-lg overflow-hidden mx-auto"
                  >
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover object-center hover:scale-105 transition-transform duration-500"
                      priority={index === 0}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <h2 className="text-3xl font-bold mb-4 text-main">{section.title}</h2>
                    {section.subtitle && (
                      <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        {section.subtitle}
                      </h3>
                    )}
                    <p className="text-gray-600 md:text-[17px] leading-relaxed max-w-xl">
                      {section.description}
                    </p>
                  </motion.div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 
