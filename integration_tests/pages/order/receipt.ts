import AppPage from '../appPage'

import paths from '../../../server/constants/paths'
import { PageElement } from '../page'

export default class ReceiptPage extends AppPage {
  constructor() {
    super('Electronic Monitoring Order Form Summary', paths.ORDER.RECEIPT)
  }

  pdfDownloadBanner = (): PageElement => cy.get('#receipt-download-banner')

  pdfDownloadButton = (): PageElement => cy.get('#download-pdf')
}
