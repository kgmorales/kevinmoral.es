import { IoLogoCodepen, IoLogoGithub, IoLogoLinkedin, IoLogoTwitter, IoMail } from 'react-icons/io5'
import siteMetadata from '@/data/siteMetadata'
import Link from 'next/link'

const socialLinksData = [
  {
    href: siteMetadata.github,
    ariaLabel: 'Check out my Github',
    icon: IoLogoGithub,
    key: 1,
  },
  {
    href: siteMetadata.linkedin,
    ariaLabel: 'Connect with me on LinkedIn',
    icon: IoLogoLinkedin,
    key: 2,
  },
  {
    href: siteMetadata.twitter,
    ariaLabel: 'Check out my Twitter',
    icon: IoLogoTwitter,
    key: 3,
  },
  {
    href: siteMetadata.codepen,
    ariaLabel: 'Check out my codepen',
    icon: IoLogoCodepen,
    key: 4,
  },
  {
    href: `mailto:${siteMetadata.email}`,
    ariaLabel: 'Email Me',
    icon: IoMail,
    key: 5,
  },
]

function SocialLink({ icon: Icon, href, ariaLabel }) {
  return (
    <Link href={href} legacyBehavior>
      <a className="-m-1 p-1" aria-label={ariaLabel}>
        <Icon
          alt={ariaLabel}
          className="h-10 w-10 cursor-pointer fill-gray-500 transition hover:fill-gray-200"
        />
      </a>
    </Link>
  )
}

const SocialLinks = () => {
  return (
    <>
      {socialLinksData.map((link) => (
        <SocialLink key={link.key} href={link.href} aria-label={link.ariaLabel} icon={link.icon} />
      ))}
    </>
  )
}

export default SocialLinks
