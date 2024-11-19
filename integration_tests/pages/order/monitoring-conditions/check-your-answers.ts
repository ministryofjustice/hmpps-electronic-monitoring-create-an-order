import AppPage from '../../appPage'
import paths from '../../../../server/constants/paths'
import { PageElement } from '../../page'

export default class MonitoringConditionsCheckYourAnswersPage extends AppPage {
  constructor() {
    super('Check your answers', paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS)
  }

  phaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')

  continueButton = (): PageElement => cy.contains('Continue')

  returnButton = (): PageElement => cy.contains('Return back to form section menu')

  monitoringConditionsSection = (): PageElement => cy.contains('Monitoring conditions')

  installationAddressSection = (): PageElement => cy.contains('Installation address')

  curfewMonitoringConditionsSection = (): PageElement => cy.contains('Curfew monitoring conditions')

  exclusionZoneConditionsSection = (): PageElement => cy.contains('Exclusion zone conditions')

  trailMonitoringConditionsSection = (): PageElement => cy.contains('Trail monitoring conditions')

  attendanceMonitoringConditionsSection = (): PageElement => cy.contains('Attendance monitoring conditions')

  alcoholMonitoringConditionsSection = (): PageElement => cy.contains('Alcohol monitoring conditions')
}
