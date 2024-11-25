"use client"

import Image from 'next/image';
import { Avatar } from "@nextui-org/react";
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Testimonial {
  text: string;
  author: string;
  title: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    text: "L'UNIE-BTP est une organisation dédiée à la protection, à l'accompagnement et à la défense des entreprises du secteur du bâtiment et des travaux publics. Leur soutien est inestimable pour notre développement.",
    author: "M. Konan KAN",
    title: "Président de UNIE-BTP",
    image: "/testimonials/president.jpg"
  },
  {
    text: "L'objectif de l'UNIE-BTP est de défendre les intérêts de ses membres, de promouvoir la santé et le bien-être des travailleurs du BTP. C'est une plateforme qui prône réellement la solidarité entre les acteurs du secteur.",
    author: "Entrepreneur membre",
    title: "Directeur d'entreprise BTP",
    image: "/testimonials/member1.jpg"
  },
  {
    text: "Grâce aux formations de la DGMP via UNIE-BTP, nous avons pu mieux comprendre les opportunités d'affaires dans les marchés publics. C'est un véritable accompagnement pour les entrepreneurs.",
    author: "Participant",
    title: "Séminaire SIGOMAP",
    image: "/testimonials/member2.jpg"
  },
  {
    text: "En tant que membre de l'UNIE-BTP, j'apprécie particulièrement l'entraide et la solidarité qui règnent au sein de l'organisation. C'est une union qui comprend vraiment les besoins du secteur.",
    author: "Entrepreneur BTP",
    title: "Membre UNIE-BTP",
    image: "/testimonials/member3.jpg"
  }
];

export default function Testimonials() {
  const router = useRouter();
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
              onClick={() => router.push("/register")}
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
                      {/* <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src={testimonial.image || "/hero-img.png"}
                      /> */}
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
                      {/* <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src={testimonial.image || "/hero-img.png"}
                      /> */}
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