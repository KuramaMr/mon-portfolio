import Layout from '../components/Layout'
import Gallery from '../components/Gallery'
import { client } from '../lib/contentful'

export default function Galerie({ images }) {
  return (
    <Layout>
      <h1>Ma galerie</h1>
      <Gallery images={images} />
    </Layout>
  )
}

export async function getStaticProps() {
  const res = await client.getEntries({ content_type: 'galerie' })
  return {
    props: {
      images: res.items.map(item => ({
        original: item.fields.image.fields.file.url,
        thumbnail: item.fields.image.fields.file.url,
      })),
    },
  }
}
