import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <div>
      <nav>
        <Link href="/">Accueil</Link>
        <Link href="/formation">Formation</Link>
        <Link href="/galerie">Galerie</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <main>{children}</main>
      <footer>© {new Date().getFullYear()} Mon Portfolio</footer>
    </div>
  )
}