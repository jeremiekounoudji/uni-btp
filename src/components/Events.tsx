'use client';

import { Card, CardHeader, CardBody, Button, Image } from "@nextui-org/react";
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  slug: string;
  location: string;
  participants: number;
  organizers: string[];
  externalLink: string;
}

const events: Event[] = [
  {
    id: '1',
    title: 'Assemblée Générale Annuelle 2024',
    description: "Rejoignez-nous pour notre assemblée générale annuelle où nous discuterons des réalisations de l'année écoulée et de nos projets futurs.",
    image: '/blog-10.jpg',
    date: '2024-11-30',
    slug: 'assemblee-generale-2024',
    location: '',
    participants: 0,
    organizers: [],
    externalLink: 'https://www.facebook.com/profile.php?id=100095486700954'
  },
  {
    id: '2',
    title: 'Séminaire de Formation SIGOMAP',
    description: "L'Union Solidaire des Entrepreneurs du Bâtiment et des Travaux Publics (UNIE-BTP), en collaboration avec la Direction Générale des Marchés Publics (DGMP), a organisé un séminaire de formation au Palm-Club, à Abidjan-Cocody, le jeudi 20 juin 2024. Ce séminaire a rassemblé vingt-neuf (29) entrepreneurs du domaine du BTP autour du thème : « SIGOMAP : enjeux et défis pour les opérateurs économiques ».",
    image: '/blog-1.jpg',
    date: '2024-06-20',
    slug: 'seminaire-formation-sigomap-2024',
    location: 'Palm-Club, Abidjan-Cocody',
    participants: 29,
    organizers: ['UNIE-BTP', 'DGMP'],
    externalLink: 'https://www.marchespublics.ci/actualite/actualitedetail/sigomap-la-dgmp-sensibilise-les-entreprises-de-l-unie-btp822'
  },
  {
    id: '3',
    title: 'Petit Déjeuner-Débat de l\'UNIE-BTP sur les Marchés Publics',
    description: "L'Union Solidaire des Entrepreneurs du Bâtiment et des Travaux Publics (UNIE-BTP), en partenariat avec Saar-Assurances, a organisé un Petit Déjeuner-Débat au Palm-Club, à Abidjan-Cocody. Cette activité a rassemblé soixante-sept (67) entrepreneurs des BTP autour du thème : « comment gagner un marché public ? ».",
    image: '/blog-11.jpg',
    date: '2023-08-10',
    slug: 'petit-dejeuner-debat-unie-btp-2023',
    location: 'Palm-Club, Abidjan-Cocody',
    participants: 67,
    organizers: ['UNIE-BTP', 'Saar-Assurances', 'DGMP'],
    externalLink: 'https://www.marchespublics.ci/actualite/actualitedetail/petit-dejeuner-debat-de-l-unie-btp-la-dgmp-sensibilise-soixante-sept-67-entrepreneurs-sur-les-marches-publics673'
  },
  {
    id: '4',
    title: 'Lancement Officiel de l\'UNIE-BTP',
    description: "C'est effectif, les acteurs du BTP ont une nouvelle plateforme dédiée à prôner la solidarité entre les membres de ce secteur. Il s'agit de l'Union Solidaire des Entrepreneurs de BTP (UNIE-BTP). Au cours d'une une conférence de presse organisée le jeudi 8 juin 2023, à l'Hôtel Palm Club de Cocody, M. konan KAN président de UNIE-BTP a présenté cette union qui a pour but essentiel l'entraide et la solidarité.",
    image: '/blog-12.jpg',
    date: '2023-06-08',
    slug: 'lancement-unie-btp-2023',
    location: 'Hôtel Palm Club, Cocody',
    participants: 25,
    organizers: ['UNIE-BTP'],
    externalLink: 'https://www.youtube.com/watch?v=xOeZtWz-M0g'
  },
  {
    id: '5',
    title: 'Conférence de Presse de présentation de L\'UNIE-BTP',
    description: "Conférence de Presse de présentation de L'Union des Entreprises du Bâtiment et des Travaux Publics (UNIE-BTP), diffusée sur Sud24tv. Cette conférence marque le lancement officiel de l'union et présente ses objectifs et sa vision pour le secteur du BTP en Côte d'Ivoire.",
    image: '/blog-13.png',
    date: '2023-06-08',
    slug: 'conference-presse-presentation-unie-btp',
    location: 'Abidjan, Côte d\'Ivoire',
    participants: 0,
    organizers: ['UNIE-BTP', 'Sud24tv'],
    externalLink: 'https://www.youtube.com/watch?v=xOeZtWz-M0g'
  }
];

export default function Events() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto" id="events">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Nos Événements</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Restez informé des dernières actualités de UNIE-BTP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {events.map((event) => (
          <Card 
            key={event.id} 
            className="hover:shadow-lg transition-shadow"
            isPressable
            as={Link}
            href={event.externalLink || `/events/${event.slug}`}
            target={event.externalLink ? "_blank" : "_self"}
          >
            <CardHeader className="p-0">
            <div className="relative w-full  pt-[70%]"> 
                <Image
                  alt={event.title}
                  src={event.image}
                  radius="none"
                   width="100%"
                  height="100%"
                  classNames={{
                    wrapper: "absolute inset-0",
                    img: "object-cover w-full h-full"
                  }}
                />
              </div>
            </CardHeader>
            <CardBody className="p-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {event.description}
                </p>
                <Button 
                  color="primary" 
                  variant="light" 
                  href={event.externalLink}
                  size="sm"
                  className="mt-2"
                >
                  Voir plus
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button
          as={Link}
          href="https://www.facebook.com/profile.php?id=100095486700954"
          target="_blank"
          color="primary"
          size="lg"
        >
          Voir tous les événements
        </Button>
      </div>
    </section>
  );
} 