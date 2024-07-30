import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gold">Guelmaoui</span> Ferid
          </h1>
          <p className="text-xl text-gold">Photographe professionnel</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-gold">À propos de moi</h2>
            <p>
              Passionné par la photographie depuis plus de 10 ans, je capture des moments uniques et crée des souvenirs inoubliables pour mes clients.
            </p>
            <Link href="/about" className="inline-block bg-gold text-black px-6 py-2 rounded-full hover:bg-opacity-80 transition-colors">
              En savoir plus
            </Link>
          </div>
          <div className="relative h-64 md:h-auto">
            <Image
              src="/path-to-your-profile-image.jpg"
              alt="Guelmaoui Ferid"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gold mb-8">Mes services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Mariages', 'Portraits', 'Événements'].map((service, index) => (
              <div key={index} className="border border-gold p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">{service}</h3>
                <p className="mb-4">Description courte du service de {service.toLowerCase()}.</p>
                <Link href="/services" className="text-gold hover:underline">
                  Voir les détails
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold text-gold mb-8">Galerie</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="relative h-48">
                <Image
                  src={`/path-to-gallery-image-${index + 1}.jpg`}
                  alt={`Galerie image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
          <Link href="/galerie" className="inline-block bg-gold text-black px-6 py-2 rounded-full mt-8 hover:bg-opacity-80 transition-colors">
            Voir toute la galerie
          </Link>
        </section>
      </div>
    </main>
  )
}