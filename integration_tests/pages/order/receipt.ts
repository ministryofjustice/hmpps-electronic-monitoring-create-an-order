import AppPage from '../appPage'

import paths from '../../../server/constants/paths'
import { PageElement } from '../page'
import SummaryListComponent from '../components/summaryListComponent'

export default class ReceiptPage extends AppPage {
  constructor() {
    super('Electronic Monitoring Order Form Summary', paths.ORDER.RECEIPT)
  }

  pdfDownloadBanner = (): PageElement => cy.get('#receipt-download-banner')

  pdfDownloadButton = (): PageElement => cy.get('#download-pdf')

  get orderStatusSection(): SummaryListComponent {
    const label = 'Form details'
    return new SummaryListComponent(label)
  }

  get riskInformationSection(): SummaryListComponent {
    const label = 'Risk information'
    return new SummaryListComponent(label)
  }

  get additionalDocumentsSection(): SummaryListComponent {
    const label = 'Additional documents'
    return new SummaryListComponent(label)
  }

  get deviceWearerSection(): SummaryListComponent {
    const label = 'About the device wearer'
    return new SummaryListComponent(label)
  }

  get contactInformationSection(): SummaryListComponent {
    const label = 'Contact information'
    return new SummaryListComponent(label)
  }

  get monitoringConditionsSection(): SummaryListComponent {
    const label = 'Monitoring conditions'
    return new SummaryListComponent(label)
  }
}
