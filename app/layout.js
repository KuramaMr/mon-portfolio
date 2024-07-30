import './globals.css'

export const metadata = {
  title: 'Mon Portfolio',
  description: 'Portfolio professionnel',
}

import Navigation from './components/Navigation'

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <header>
          <Navigation />
        </header>
        {children}
        <footer>
          {/* Nous ajouterons le pied de page ici plus tard */}
        </footer>
      </body>
    </html>
  )
}