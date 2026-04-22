import Document, { Html, Head, Main, NextScript } from 'next/document'
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="dark scroll-smooth">
        <Head>
          <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
          <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="" />
          <link rel="preconnect" href="https://i.scdn.co" crossOrigin="" />
          <link rel="preconnect" href="https://a.espncdn.com" crossOrigin="" />
          <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicons/favicon-16x16.png"
          />
          <link rel="manifest" href="/static/favicons/site.webmanifest" />
          <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#171717" />
          <meta name="theme-color" content="#171717" />
          <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
          <meta
            name="google-site-verification"
            content="e3uXjJg-dvdU4RVQ82DydrMDRGkWi6RM_FY2ZEcAHjU"
          />
        </Head>
        <body className=" bg-gray-900 text-white antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
