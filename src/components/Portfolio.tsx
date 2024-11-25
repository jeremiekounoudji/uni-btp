import Image from 'next/image';

interface Project {
  title: string;
  image: string;
  category?: string;
}

// const projects: Project[] = [
//   {
//     title: 'Hopital de zone de Abobo',
//     image: '/hero-img.png',
//     category: 'Santé'
//   },
//   {
//     title: 'Immeuble de la banque NSIA',
//     image: '/hero-img.png',
//     category: 'Commercial'
//   },
//   {
//     title: 'Siège social CGECI',
//     image: '/hero-img.png',
//     category: 'Bureau'
//   },
//   {
//     title: 'Hopital de zone de Abobo',
//     image: '/hero-img.png',
//     category: 'Santé'
//   },
//   {
//     title: 'Immeuble de la banque NSIA',
//     image: '/hero-img.png',
//     category: 'Commercial'
//   },
//   {
//     title: 'Siège social CGECI',
//     image: '/hero-img.png',
//     category: 'Bureau'
//   },
//   {
//     title: 'Hopital de zone de Abobo',
//     image: '/hero-img.png',
//     category: 'Santé'
//   },
//   {
//     title: 'Immeuble de la banque NSIA',
//     image: '/hero-img.png',
//     category: 'Commercial'
//   },
//   {
//     title: 'Siège social CGECI',
//     image: '/hero-img.png',
//     category: 'Bureau'
//   }
// ];

export default function Portfolio() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto" id='portfolio'>
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Nos plus belle réalisations</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
         Parcourez quelques unes des réalisations des entreprises membre de UNIE-BTP .
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="grid gap-4">
            <div className='hover:shadow-yellow-500/10 relative h-[200px]'>
                <Image 
                  className="rounded-lg object-cover"
                  src="/unie-1.jpg"
                  alt="Portfolio image"
                  fill
                />
            </div>
            <div className="relative h-[200px]">
                <Image 
                  className="rounded-lg object-cover"
                  src="/unie-2.jpg"
                  alt="Portfolio image"
                  fill
                />
            </div>
            <div className="relative h-[200px]">
                <Image 
                  className="rounded-lg object-cover"
                  src="/unie-3.jpg"
                  alt="Portfolio image"
                  fill
                />
            </div>
        </div>
        <div className="grid gap-4">
            <div className="relative h-[200px]">
                <Image 
                  className="rounded-lg object-cover"
                  src="/unie-4.jpg"
                  alt="Portfolio image"
                  fill
                />
            </div>
            <div className="relative h-[200px]">
                <Image 
                  className="rounded-lg object-cover"
                  src="/unie-5.jpg"
                  alt="Portfolio image"
                  fill
                />
            </div>
            <div className="relative h-[200px]">
                <Image 
                  className="rounded-lg object-cover"
                  src="/unie-6.jpg"
                  alt="Portfolio image"
                  fill
                />
            </div>
        </div>
        <div className="grid gap-4">
            <div className="relative h-[200px]">
                <Image 
                  className="rounded-lg object-cover"
                  src="/unie-7.jpg"
                  alt="Portfolio image"
                  fill
                />
            </div>
            <div className="relative h-[200px]">
                <Image 
                  className="rounded-lg object-cover"
                  src="/unie-8.jpg"
                  alt="Portfolio image"
                  fill
                />
            </div>
            <div className="relative h-[200px]">
                <Image 
                  className="rounded-lg object-cover"
                  src="/unie-9.jpg"
                  alt="Portfolio image"
                  fill
                />
            </div>
        </div>
        <div className="grid gap-4">
            <div className="relative h-[200px]">
                <Image 
                  className="rounded-lg object-cover"
                  src="/unie-10.jpg"
                  alt="Portfolio image"
                  fill
                />
            </div>
            <div className="relative h-[200px]">
                <Image 
                  className="rounded-lg object-cover"
                  src="/unie-11.jpg"
                  alt="Portfolio image"
                  fill
                />
            </div>
            <div className="relative h-[200px]">
                <Image 
                  className="rounded-lg object-cover"
                  src="/unie-12.jpg"
                  alt="Portfolio image"
                  fill
                />
            </div>
        </div>
      </div>

    </section>
  );
}