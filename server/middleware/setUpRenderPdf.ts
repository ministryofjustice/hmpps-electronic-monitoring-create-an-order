import { Request, Response, NextFunction } from 'express'
import path from 'path'
import fs from 'fs/promises'
import GotenbergClient, { PdfMargins } from '../data/gotenbergClient'

export type PdfPageData = Record<string, unknown>

const readAssetCss = async () => {
  // Fetch the css path from asset manifest e.g. /assets/css/app.ESCUP4HF.css
  const assetMetadataPath = path.resolve(__dirname, '../../assets/manifest.json')
  const assetMetadata = await fs.readFile(assetMetadataPath, 'utf8')
  const assetManifest: Record<string, string> = JSON.parse(assetMetadata)
  const cssPath = '/assets/css/app.css'
  const realCssPath = assetManifest[cssPath] || cssPath

  // Read the file. This saves gotenberg then having to fetch the css file from the node instance
  return fs.readFile(path.resolve(__dirname, `../../${realCssPath}`), 'utf8')
}

export function setUpRenderPdf(client: GotenbergClient) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.renderPdf = async (pageView, pageData, options: { filename: string; pdfMargins: PdfMargins }) => {
      try {
        const pageHtml = await new Promise<string>((resolve, reject) => {
          res.render(pageView, pageData, (err, html) => (err ? reject(err) : resolve(html)))
        })
        const pageCss = await readAssetCss()

        const buffer = await client.renderPdfFromHtml(pageHtml, pageCss, options.pdfMargins)

        res.header('Content-Type', 'application/pdf')
        res.header('Content-Transfer-Encoding', 'binary')
        res.header('Content-Disposition', `attachment; filename=${options.filename}`)
        res.send(buffer)
      } catch (error) {
        next(error)
      }
    }
    next()
  }
}
