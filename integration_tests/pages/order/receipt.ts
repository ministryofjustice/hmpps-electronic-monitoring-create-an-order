import AppPage from '../appPage'

import paths from '../../../server/constants/paths'
import { PageElement } from '../page'

export default class ReceiptPage extends AppPage {
  constructor() {
    super('Submitted electronic monitoring order details', paths.ORDER.RECEIPT)
  }

  pdfDownloadBanner = (): PageElement => cy.get('#receipt-download-banner')

  pdfDownloadButton = (): PageElement => cy.get('#download-pdf')
}
