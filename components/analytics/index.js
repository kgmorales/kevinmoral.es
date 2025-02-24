import GAScript from './GoogleAnalytics'
import siteMetadata from '@/data/siteMetadata'

const isProduction = process.env.NODE_ENV === 'production'

const Analytics = () => {
  return <>{isProduction && siteMetadata.analytics.googleAnalyticsId && <GAScript />}</>
}

export default Analytics
