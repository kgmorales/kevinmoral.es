import '@/css/tailwind.css'
import '@/css/prism.css'
import 'katex/dist/katex.css'

import Head from 'next/head'

import LayoutWrapper from '@/components/organisms/LayoutWrapper'
import Script from 'next/script'
import * as ga from '../lib/google-analytics'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-JK3YG6KYBM`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-JK3YG6KYBM');
        `}
      </Script>
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </>
  )
}
