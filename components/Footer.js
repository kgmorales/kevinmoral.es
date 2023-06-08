import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <SocialIcon kind="github" href={siteMetadata.github} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} />
          <SocialIcon kind="codepen" href={siteMetadata.codepen} />
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} />
        </div>
        <div className="mb-2 flex flex-col items-center space-x-2 text-sm text-gray-400 md:flex-row md:space-x-2">
          <div>{siteMetadata.author}</div>
          <div className="hidden md:inline">{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div className="hidden md:inline">{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
      </div>
    </footer>
  )
}
