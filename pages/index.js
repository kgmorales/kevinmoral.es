// pages/index.js
import { PageSEO } from '@/components/atoms/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getNowPlaying } from '@/lib/spotify/spotify'
import { Analytics } from '@vercel/analytics/react'
import Hero from '@/components/molecules/Hero'
import Skills from '@/components/molecules/Skills'
import RecentProjects from '@/components/molecules/RecentProjects'

export async function getServerSideProps() {
  try {
    const track = await getNowPlaying()

    return {
      props: {
        heroData: {
          spotify: track || null,
        },
      },
    }
  } catch (err) {
    console.error('SSR error in getServerSideProps:', err)
    return {
      props: {
        heroData: {
          spotify: null,
        },
        posts: [],
        error: err.message,
      },
    }
  }
}

export default function Home({ heroData, error }) {
  if (error) {
    return (
      <div>
        <h1>Error Loading Data</h1>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <Hero heroData={heroData} />
      <Skills />
      <RecentProjects MAX_PROJECTS="4" />
      <Analytics />
    </>
  )
}
