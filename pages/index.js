import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import Hero from '@/components/Hero'
import RecentProjects from '@/components/RecentProjects'
import Skills from '@/components/Skills'
import { Analytics } from '@vercel/analytics/react'

export async function getServerSideProps() {
  const resp = await fetch('http://localhost:3000/api/now-playing')
  const spotify = await resp.json()

  const posts = await getAllFilesFrontMatter('blog')
  return { props: { spotify, posts } }
}

export default function Home({ spotify }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      {/* <SpotifyMarquee /> */}
      <Hero spotify={spotify} />
      <Skills />
      <RecentProjects MAX_PROJECTS="4" />
      <Analytics />
    </>
  )
}
