// pages/index.js
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import { getNowPlaying } from '@/lib/spotify/spotify'
import Hero from '@/components/Hero'
import Skills from '@/components/Skills'
import RecentProjects from '@/components/RecentProjects'
import { Analytics } from '@vercel/analytics/react'

export async function getServerSideProps() {
  try {
    // 1) Get Spotify track data
    const track = await getNowPlaying()

    // 2) Also fetch blog posts
    const posts = await getAllFilesFrontMatter('blog')

    return {
      props: {
        spotify: track || null, // might be null if no last track found
        posts,
      },
    }
  } catch (err) {
    console.error('SSR error in getServerSideProps:', err)
    // Return something safe to render
    return {
      props: {
        spotify: null,
        posts: [],
        error: err.message,
      },
    }
  }
}

export default function Home({ spotify, posts, error }) {
  if (error) {
    return (
      <div>
        <h1>Error Loading Spotify Data</h1>
        <p>{error}</p>
      </div>
    )
  }

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
