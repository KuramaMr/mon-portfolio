import Layout from '../components/Layout'
import { client } from '../lib/contentful'

export default function Formation({ formations }) {
  return (
    <Layout>
      <h1>Mes formations</h1>
      {formations.map((formation) => (
        <div key={formation.sys.id}>
          <h2>{formation.fields.titre}</h2>
          <p>{formation.fields.description}</p>
        </div>
      ))}
    </Layout>
  )
}

export async function getStaticProps() {
  try {
    const res = await client.getEntries({ content_type: 'formation' }) // Assurez-vous que 'formation' est le nom exact du type de contenu dans Contentful
    console.log('Contentful response:', res) // Ajoutez ce log pour le débogage
    return {
      props: {
        formations: res.items,
      },
    }
  } catch (error) {
    console.error('Error fetching Contentful data:', error)
    return {
      props: {
        formations: [],
      },
    }
  }
}