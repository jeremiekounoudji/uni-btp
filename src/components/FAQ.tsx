'use client'

import { motion } from 'framer-motion';

const faqs = [
  {
    title: "Comment devenir membre?",
    description: "Pour devenir membre d'UNIE-BTP, vous devez être une entreprise légalement constituée du secteur BTP. Contactez-nous pour initier le processus d'adhésion et bénéficier de nos services.",
    icon: "👥"
  },
  {
    title: "Quels sont les avantages?",
    description: "Les membres bénéficient d'une mutuelle santé, d'un accompagnement financier, d'une assistance juridique, de formations professionnelles et d'un accès privilégié aux appels d'offres.",
    icon: "✨"
  },
  {
    title: "Coût de l'adhésion",
    description: "Les frais d'adhésion sont calculés selon la taille de votre entreprise. Nous proposons des options flexibles et abordables pour permettre à toutes les entreprises de rejoindre notre réseau.",
    icon: "💰"
  },
  {
    title: "Services de formation",
    description: "Nous organisons régulièrement des formations en gestion d'entreprise, sécurité au travail, nouvelles technologies et réglementations du secteur BTP.",
    icon: "📚"
  },
  {
    title: "Support juridique",
    description: "Notre équipe juridique vous accompagne dans vos contentieux, la révision de contrats et vous conseille sur les aspects réglementaires du secteur BTP.",
    icon: "⚖️"
  },
  {
    title: "Networking",
    description: "Participez à nos événements réguliers pour rencontrer d'autres professionnels du secteur, partager des expériences et développer votre réseau d'affaires.",
    icon: "🤝"
  }
];

export default function FAQ() {
  return (
    <section className="bg-gray-900 text-white" id="faq">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-lg text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Questions Fréquentes</h2>
          <p className="mt-4 text-gray-300">
            Découvrez les réponses aux questions les plus courantes sur UNIE-BTP et nos services pour les professionnels du BTP.
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-yellow-500/10 hover:shadow-yellow-500/10"
            >
              <div className="text-4xl mb-4">{faq.icon}</div>
              <h2 className="mt-4 text-xl font-bold text-white">{faq.title}</h2>
              <p className="mt-1 text-sm text-gray-300">{faq.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <a
            href="#"
            className="inline-block rounded bg-yellow-400 px-12 py-3 text-sm font-medium text-gray-900 transition hover:bg-yellow-500 focus:outline-none focus:ring focus:ring-yellow-400"
          >
            Rejoignez UNIE-BTP
          </a>
        </motion.div>
      </div>
    </section>
  );
} 