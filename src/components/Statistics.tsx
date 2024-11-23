'use client'

import Image from "next/image";
import { motion } from "framer-motion";

interface Stat {
  number: string;
  label: string;
}

const stats: Stat[] = [
  {
    number: "15",
    label: "Années d'expérience",
  },
  {
    number: "59",
    label: "Constructions publiques et privées",
  },
  {
    number: "59",
    label: "Ingénieurs",
  },
  {
    number: "15",
    label: "Domaines d'intervention",
  },
];

export default function Statistics() {
  return (
    <section className="bg-[#0A2A3B]">
      <div className="w-screen">
        <div className="flex flex-col-reverse md:flex-row items-center relative h-auto">
          {/* Stats Column */}
          <div className="w-[200px] md:w-[300px] p-6 space-y-12 text-white lg:w-[50%]">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-b border-gray-100 pb-8 last:border-0"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="text-5xl font-bold mb-2"
                >
                  {stat.number}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  className="text-gray-100"
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Content Column */}
          <div className="bg-white min-h-screen flex items-center md:mr-2 md:justify-center lg:justify-start w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full md:max-w-[400px] lg:max-w-[500px] md:ml-32 px-8 py-12"
            >
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold mb-4 text-[#0A2A3B]"
              >
                UNIE - BTP en chiffre
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-gray-600 mb-8 text-justify"
              >
                Découvrez l'impact de notre association à travers des chiffres clés : plus de 500 entrepreneurs membres, 100 projets collaboratifs réussis et 50 événements annuels dédiés à l'innovation et au développement du secteur. Ces chiffres reflètent notre engagement à faire croître l’industrie du bâtiment et à créer des opportunités pour tous nos membres.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-row gap-4"
              >
                <button className="bg-[#0A2A3B] text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
                  Intégrer UNIE-BTP
                </button>
                <button className="border border-[#0A2A3B] text-[#0A2A3B] px-6 py-3 rounded-full hover:bg-[#0A2A3B] hover:text-white transition-colors">
                  Nous contacter
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Centered Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block absolute left-[350px] top-[100px] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] z-10"
          >
            <div className="relative rounded-lg overflow-hidden h-full w-full shadow-xl transition-transform duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-black/10 z-10"></div>
              <Image
                src="/hero-img.png"
                alt="Construction worker"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
