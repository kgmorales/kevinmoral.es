import Script from 'next/script'

const GAScript = () => {
  return (
    <>
      <Script strategy="afterInteractive" id="ga-script">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GOOGLE_ANALYTICS_GID}');
        `}
      </Script>
    </>
  )
}

export default GAScript
