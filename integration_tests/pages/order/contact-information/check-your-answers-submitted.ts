import paths from '../../../../server/constants/paths'
import CheckYourAnswersPage from '../../checkYourAnswersPage'
import SummaryListComponent from '../../components/summaryListComponent'
import { PageElement } from '../../page'

export default class ContactInformationCheckYourAnswersPage extends CheckYourAnswersPage {
  constructor() {
    super('View answers', paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS)
  }

  // SECTIONS
  get banner(): PageElement {
    return cy.get('.govuk-notification-banner')
  }

  get caption(): PageElement {
    return cy.get('.govuk-caption-l')
  }

  get heading(): PageElement {
    return cy.get('.govuk-heading-l')
  }

  get contactDetailsSection(): SummaryListComponent {
    const label = 'Telephone number'
    return new SummaryListComponent(label)
  }

  get deviceWearerAddressesSection(): SummaryListComponent {
    const label = "Device wearer's addresses"
    return new SummaryListComponent(label)
  }

  get organisationDetailsSection(): SummaryListComponent {
    const label = 'Organisations details'
    return new SummaryListComponent(label)
  }
}
