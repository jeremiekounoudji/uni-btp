'use client'

import { Feature } from '@/types'
import { motion } from 'framer-motion'

const features: Feature[] = [
  {
    title: 'Formation et développement',
    description: 'Ateliers spécialisés dispensés par des experts pour maîtriser les dernières techniques de construction et sessions de développement professionnel en gestion de projet et leadership.',
    icon: '📚'
  },
  {
    title: 'Promotion des bonnes pratiques',
    description: 'Guides détaillés et lignes directrices pour aider les entreprises à mettre en œuvre les meilleures pratiques du secteur et garantir la qualité du travail selon les normes.',
    icon: '✅'
  },
  {
    title: 'Lobbying et plaidoyer',
    description: "Actions de représentation auprès des autorités gouvernementales et organismes de réglementation pour défendre efficacement les intérêts de nos membres.",
    icon: '🏛️'
  },
  {
    title: 'Réseautage et échanges',
    description: "Organisation d'événements et rencontres professionnelles permettant aux entrepreneurs de développer leur réseau, partager leurs expériences et créer des opportunités commerciales.",
    icon: '🤝'
  },
  {
    title: 'Responsabilité sociale',
    description: "Promotion active des pratiques responsables et durables, avec des campagnes de sensibilisation sur la sécurité au travail, l'environnement et l'égalité des genres.",
    icon: '🌱'
  },
  {
    title: 'Accès aux financements',
    description: "Facilitation de l'accès aux financements avantageux via des partenariats bancaires et accompagnement complet dans l'accès aux marchés publics et appels d'offres.",
    icon: '💰'
  },
  {
    title: 'Représentation et droits',
    description: "Défense active des intérêts du secteur BTP auprès des instances décisionnelles, travail sur l'amélioration du cadre réglementaire et simplification des procédures administratives.",
    icon: '⚖️'
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-main text-white w-screen" id='features'>
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-2 text-4xl font-bold text-center mb-8"
        >
          Les valeurs que nous portons et soutenons.
        </motion.h2>
        
        <div className="grid md:p-8 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1
              }}
              className={`p-6 hover:bg-gray-800/50 transition-colors
                ${[0, 3].includes(index) ? 'md:mt-8 lg:mt-8' : ''}
                ${[1, 4].includes(index) ? 'md:mt-16 lg:mt-16' : ''}
                ${[2, 5].includes(index) ? 'lg:mt-32' : ''}`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-100 text-[16px]">{feature.description}</p>
              <div className="h-[1px] bg-white mt-4"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 