import paths from '../../../../server/constants/paths'
import SummaryListComponentWithoutHeading from '../../components/SummaryListComponentWithoutHeading'
import CheckYourAnswersPage from '../../checkYourAnswersPage'
import { PageElement } from '../../page'

export default class InstallationAndRiskCheckYourAnswersPage extends CheckYourAnswersPage {
  constructor() {
    super('Check your answers', paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS)
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

  get installationRiskSection(): SummaryListComponentWithoutHeading {
    return new SummaryListComponentWithoutHeading()
  }
}
