export type PuppeteerConfig = {
  username: string
  password: string
  loginUrl: string
  downloadBaseUrl: string
}

if (!process.env.PUPPETEER_USERNAME) {
  throw new Error('PUPPETEER_USERNAME environment variable is not set')
}

if (!process.env.PUPPETEER_PASSWORD) {
  throw new Error('PUPPETEER_PASSWORD environment variable is not set')
}

if (!process.env.HMPPS_AUTH_URL) {
  throw new Error('HMPPS_AUTH_URL environment variable is not set')
}

if (!process.env.PUPPETEER_DOWNLOAD_BASEURL) {
  throw new Error('PUPPETEER_DOWNLOAD_URL environment variable is not set')
}

const config: PuppeteerConfig = {
  username: process.env.PUPPETEER_USERNAME,
  password: process.env.PUPPETEER_PASSWORD,
  loginUrl: process.env.HMPPS_AUTH_URL,
  downloadBaseUrl: process.env.PUPPETEER_DOWNLOAD_BASEURL,
}

export default config
