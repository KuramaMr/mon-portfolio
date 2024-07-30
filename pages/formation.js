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
  const res = await client.getEntries({ content_type: 'formation' })
  return {
    props: {
      formations: res.items,
    },
  }
}
