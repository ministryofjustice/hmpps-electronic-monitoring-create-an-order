import paths from '../../../../server/constants/paths'
import { PageElement } from '../../page'
import CheckYourAnswersPage from '../../checkYourAnswersPage'

export default class MonitoringConditionsCheckYourAnswersPage extends CheckYourAnswersPage {
  constructor() {
    super('View answers', paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS)
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

  monitoringConditionsSection = (): PageElement => cy.contains('Monitoring details')

  installationAddressSection = (): PageElement => cy.contains('Installation address')

  curfewOnDayOfReleaseSection = (): PageElement => cy.contains('Curfew on day of release')

  curfewSection = (): PageElement => cy.contains('Curfew')

  curfewTimetableSection = (): PageElement => cy.contains('Curfew Timetable')

  trailMonitoringConditionsSection = (): PageElement => cy.contains('Trail monitoring')

  alcoholMonitoringConditionsSection = (): PageElement => cy.contains('Alcohol monitoring')
}
