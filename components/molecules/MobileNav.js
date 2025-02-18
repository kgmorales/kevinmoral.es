import { useState, useEffect } from 'react'
import Link from '@/components/atoms/Link'
import headerNavLinks from '@/data/headerNavLinks'
import Footer from '../Footer'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)

  const onToggleNav = () => {
    setNavShow((prev) => !prev)
  }

  return (
    <div className="sm:hidden">
      <button
        type="button"
        className="ml-1 mr-1 h-8 w-8 rounded py-1"
        aria-label="Toggle Menu"
        onClick={onToggleNav}
      >
        {navShow ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 transform cursor-pointer select-none rounded-md duration-300 active:scale-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 transform cursor-pointer select-none rounded-md duration-300 active:scale-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      <div
        className={`fixed right-0 top-[5rem] z-10 flex h-[100vh] w-full transform flex-col bg-themeColor duration-300 ease-in-out ${
          navShow ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col items-center justify-start gap-4 pt-20">
          {headerNavLinks.map((link, i) => {
            if (link.type !== 'dropdown') {
              return (
                <div key={`${link}-${i}`} className="flex items-center justify-center px-12 py-4">
                  <Link
                    href={link.href}
                    className="mono-type text-4xl font-bold tracking-widest text-gray-100"
                    onClick={onToggleNav}
                  >
                    {link.title}
                  </Link>
                </div>
              )
            }
            return (
              <div key={`${link}-${i}`}>
                {link.links.map((item, j) => (
                  <div
                    key={`${item.href}-${j}`}
                    className="flex items-center justify-center px-12 py-4"
                  >
                    <Link
                      href={item.href}
                      className="mono-type text-2xl font-bold tracking-widest text-gray-100"
                      onClick={onToggleNav}
                    >
                      {item.title}
                    </Link>
                  </div>
                ))}
              </div>
            )
          })}
        </nav>
        <div className="mt-[2rem]">
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default MobileNav
