import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import Hero from '@/components/Hero'
import RecentProjects from '@/components/RecentProjects'
import Skills from '@/components/Skills'
import { Analytics } from '@vercel/analytics/react'
import { getNowPlaying } from '@/lib/spotify/spotify'

export async function getServerSideProps() {
  const track = await getNowPlaying()

  const posts = await getAllFilesFrontMatter('blog')
  return { props: { spotify: track, posts } }
}

export default function Home({ spotify }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <Hero spotify={spotify} />
      <Skills />
      <RecentProjects MAX_PROJECTS="4" />
      <Analytics />
    </>
  )
}
