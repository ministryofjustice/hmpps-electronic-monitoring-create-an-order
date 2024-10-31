import puppeteer from 'puppeteer'
import config from './config'

export default class PdfService {
  static async generatePdf(uri: string) {
    try {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()

      console.log('going to the url')
      console.log(`${config.loginUrl}`)
      await page.goto(`${config.downloadBaseUrl}${uri}`, { waitUntil: 'networkidle0' })
      await page.waitForSelector('#username')
      console.log('writing username')
      await page.type('#username', `${config.username}`)
      console.log('writing password')
      await page.type('#password', `${config.password}`)
      console.log('clicking submit')
      await page.click('#submit')

      console.log('clicked submit, waiting for navigation')
      await page.waitForNavigation({ waitUntil: 'networkidle0' })

      console.log('waiting for url to load')
      await page.goto(`${config.downloadBaseUrl}${uri}`, { waitUntil: 'networkidle0' })

      // Create the PDF
      console.log('creating the pdf')
      await page.emulateMediaType('screen')
      const bufferArray = await page.pdf({
        format: 'A4',
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
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
