import puppeteer from 'puppeteer'
import config from './config'

export default class PdfService {
  static async generatePdf(uri: string) {
    try {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()

      console.log('going to auth login page')
      console.log(`${config.loginUrl}`)
      await page.goto(`${config.downloadBaseUrl}${uri}`, { waitUntil: 'networkidle0' })
      await page.waitForSelector('#username')

      console.log('writing username')
      await page.type('#username', `${config.username}`)
      console.log('writing password')
      await page.type('#password', `${config.password}`)
      console.log('logging in')
      await page.click('#submit')
      await page.waitForNavigation({ waitUntil: 'networkidle0' })

      console.log('going to receipt page')
      await page.goto(`${config.downloadBaseUrl}${uri}`, { waitUntil: 'networkidle0' })

      // Create the PDF
      console.log('creating the pdf from the page')
      await page.emulateMediaType('screen')
      const bufferArray = await page.pdf({
        format: 'A4',
        printBackground: true,
      })

      const buffer = Buffer.from(bufferArray)

      await browser.close()
      return buffer
    } catch (err) {
      console.error('Error generating PDF:', err)
      throw err
    }
  }
}
