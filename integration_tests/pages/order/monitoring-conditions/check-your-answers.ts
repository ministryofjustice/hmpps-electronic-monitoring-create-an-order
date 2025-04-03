import paths from '../../../../server/constants/paths'
import { PageElement } from '../../page'
import CheckYourAnswersPage from '../../checkYourAnswersPage'

export default class MonitoringConditionsCheckYourAnswersPage extends CheckYourAnswersPage {
  constructor() {
    super('Check your answers', paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS)
  }

  monitoringConditionsSection = (): PageElement => cy.contains('Monitoring conditions')

  installationAddressSection = (): PageElement => cy.contains('Installation address')

  curfewMonitoringConditionsSection = (): PageElement => cy.contains('Curfew monitoring conditions')

  exclusionZoneConditionsSection = (): PageElement => cy.contains('Exclusion zone conditions')

  trailMonitoringConditionsSection = (): PageElement => cy.contains('Trail monitoring conditions')

  attendanceMonitoringConditionsSection = (): PageElement => cy.contains('Attendance monitoring conditions')

  alcoholMonitoringConditionsSection = (): PageElement => cy.contains('Alcohol monitoring conditions')
}
