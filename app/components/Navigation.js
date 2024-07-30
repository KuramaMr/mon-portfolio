import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-black text-white p-4">
      <ul className="flex justify-center space-x-6">
        <li><Link href="/" className="hover:text-gold transition-colors">Accueil</Link></li>
        <li><Link href="/about" className="hover:text-gold transition-colors">À propos</Link></li>
        <li><Link href="/services" className="hover:text-gold transition-colors">Services</Link></li>
        <li><Link href="/galerie" className="hover:text-gold transition-colors">Galerie</Link></li>
        <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
      </ul>
    </nav>
  )
}