"use client"

import Image from 'next/image';
import { Avatar } from "@nextui-org/react";
import { motion } from 'framer-motion';

interface Testimonial {
  text: string;
  author: string;
  title: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    text: "Depuis que j'ai rejoint UNIE-BTP, j'ai eu accès à des formations qui m'ont permis d'innover sur mes chantiers. C'est une association incontournable pour rester à la pointe de notre secteur.",
    author: "Jeremy D.",
    title: "Un réseau d'ingénieurs et d'expérimentés",
    image: "/hero-img.png"
  },
  {
    text: "Depuis que j'ai rejoint UNIE-BTP, j'ai eu accès à des formations qui m'ont permis d'innover sur mes chantiers. C'est une association incontournable pour rester à la pointe de notre secteur.",
    author: "Alain Jonathan",
    title: "Un réseau d'ingénieurs et d'expérimentés",
    image: "/hero-img.png"
  }, {
    text: "Depuis que j'ai rejoint UNIE-BTP, j'ai eu accès à des formations qui m'ont permis d'innover sur mes chantiers. C'est une association incontournable pour rester à la pointe de notre secteur.",
    author: "Alain Jonathan",
    title: "Un réseau d'ingénieurs et d'expérimentés",
    image: "/hero-img.png"
  },
  {
    text: "Depuis que j'ai rejoint UNIE-BTP, j'ai eu accès à des formations qui m'ont permis d'innover sur mes chantiers. C'est une association incontournable pour rester à la pointe de notre secteur.",
    author: "Alain Jonathan",
    title: "Un réseau d'ingénieurs et d'expérimentés",
    image: "/hero-img.png"
  },
  {
    text: "Depuis que j'ai rejoint UNIE-BTP, j'ai eu accès à des formations qui m'ont permis d'innover sur mes chantiers. C'est une association incontournable pour rester à la pointe de notre secteur.",
    author: "Alain Jonathan",
    title: "Un réseau d'ingénieurs et d'expérimentés",
    image: "/hero-img.png"
  },
  // Ajoutez d'autres témoignages ici
];

export default function Testimonials() {
  return (
    <section className="relative dark:bg-gray-100 dark:text-gray-800">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-img.png"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/90" />
      </div>

      <div className="container px-6 py-12 mx-auto relative z-10">
        <div className="grid items-center gap-4 xl:grid-cols-5">
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto my-8 space-y-4 text-center xl:col-span-2 xl:text-left"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white"
            >
              Quelques Témoignages
              <span className="block text-yellow-400">positive sur UNIE-BTP</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-gray-300 max-w-[400px]"
            >
              Voici quelques témoignages positifs sur UNIE-BTP. Découvrez l'expérience de nos membres.
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white text-[#0A2A3B] px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              Intégrer UNIE-BTP
            </motion.button>
          </motion.div>

          {/* Right Column - Testimonials Grid */}
          <div className="p-6 xl:col-span-3">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid content-center gap-4">
                {testimonials.slice(0, 2).map((testimonial, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.3 + 0.4,
                      ease: "easeOut"
                    }}
                    viewport={{ once: true }}
                    className="p-6 rounded shadow-md bg-black/40"
                  >
                    <p className="text-gray-300">{testimonial.text}</p>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.3 + 0.8 }}
                      viewport={{ once: true }}
                      className="flex items-center mt-4 space-x-4"
                    >
                      <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src={testimonial.image || "/hero-img.png"}
                      />
                      <div>
                        <p className="text-lg font-semibold text-white">{testimonial.author}</p>
                        <p className="text-sm text-yellow-400">{testimonial.title}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              <div className="grid content-center gap-4">
                {testimonials.slice(2, 4).map((testimonial, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.3 + 0.6,
                      ease: "easeOut"
                    }}
                    viewport={{ once: true }}
                    className="p-6 rounded shadow-md bg-black/40"
                  >
                    <p className="text-white">{testimonial.text}</p>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.3 + 1 }}
                      viewport={{ once: true }}
                      className="flex items-center mt-4 space-x-4"
                    >
                      <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src={testimonial.image || "/hero-img.png"}
                      />
                      <div>
                        <p className="text-lg font-semibold text-gray-300">{testimonial.author}</p>
                        <p className="text-sm text-yellow-400">{testimonial.title}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 