import paths from '../../../../server/constants/paths'
import { PageElement } from '../../page'
import CheckYourAnswersPage from '../../checkYourAnswersPage'
import SummaryListComponent from '../../components/summaryListComponent'

export default class MonitoringConditionsCheckYourAnswersPage extends CheckYourAnswersPage {
  constructor(heading: string) {
    super(heading, paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS)
  }

  monitoringConditionsSection = (): PageElement => cy.contains('Monitoring details')

  installationAddressSection = (): PageElement => cy.contains('Installation address')

  get curfewOnDayOfReleaseSection(): SummaryListComponent {
    const label = 'Curfew on day of release'
    return new SummaryListComponent(label)
  }

  get curfewSection(): SummaryListComponent {
    const label = 'Curfew'
    return new SummaryListComponent(label)
  }

  curfewTimetableSection = (): PageElement => cy.contains('Curfew Timetable')

  trailMonitoringConditionsSection = (): PageElement => cy.contains('Trail monitoring')

  alcoholMonitoringConditionsSection = (): PageElement => cy.contains('Alcohol monitoring')

  installationLocationSection(): SummaryListComponent {
    const label = 'Installation location'
    return new SummaryListComponent(label)
  }

  installationAppointmentSection(): SummaryListComponent {
    const label = 'Installation appointment'
    return new SummaryListComponent(label)
  }
}
