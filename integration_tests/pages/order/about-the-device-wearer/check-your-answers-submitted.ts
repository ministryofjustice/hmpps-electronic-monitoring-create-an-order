import paths from '../../../../server/constants/paths'
import SummaryListComponent from '../../components/summaryListComponent'
import CheckYourAnswersPage from '../../checkYourAnswersPage'
import { PageElement } from '../../page'

export default class DeviceWearerCheckYourAnswersPageSubmitted extends CheckYourAnswersPage {
  constructor() {
    super('View answers', paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS)
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

  get personDetailsSection(): SummaryListComponent {
    const label = 'Personal details'
    return new SummaryListComponent(label)
  }

  get identityNumbersSection(): SummaryListComponent {
    const label = 'Identity numbers'
    return new SummaryListComponent(label)
  }

  get responsibleAdultSection(): SummaryListComponent {
    const label = 'Responsible adult details'
    return new SummaryListComponent(label)
  }
}
