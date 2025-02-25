import Script from 'next/script'

const GAScript = () => {
  return (
    <>
      <Script strategy="lazyOnload" id="ga-script">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JK3YG6KYBM');
        `}
      </Script>
    </>
  )
}

export default GAScript
