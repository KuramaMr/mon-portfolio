import Link from 'next/link'

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Accueil</Link>
      <Link href="/formations">Formations</Link>
      <Link href="/galerie">Galerie</Link>
    </nav>
  )
}