import Link from './atoms/Link'
import siteMetadata from '@/data/siteMetadata'
import SocialLinks from './atoms/SocialLinks'

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <SocialLinks />
        </div>
        <div className="mb-2 flex flex-col items-center space-x-2 text-sm text-gray-400 md:flex-row md:space-x-2">
          <div>{`© ${new Date().getFullYear()}`}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
      </div>
    </footer>
  )
}
