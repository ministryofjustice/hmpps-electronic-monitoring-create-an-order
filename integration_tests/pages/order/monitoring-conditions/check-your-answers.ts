import paths from '../../../../server/constants/paths'
import CheckYourAnswersPage from '../../checkYourAnswersPage'
import SummaryListComponent from '../../components/summaryListComponent'

export default class MonitoringConditionsCheckYourAnswersPage extends CheckYourAnswersPage {
  constructor(heading: string) {
    super(heading, paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS)
  }

  get monitoringConditionsSection(): SummaryListComponent {
    const label = 'Monitoring details'
    return new SummaryListComponent(label)
  }

  get curfewOnDayOfReleaseSection(): SummaryListComponent {
    const label = 'Curfew on day of release'
    return new SummaryListComponent(label)
  }

  get curfewSection(): SummaryListComponent {
    const label = 'Curfew'
    return new SummaryListComponent(label)
  }

  curfewTimetableSection(): SummaryListComponent {
    const label = 'Curfew Timetable'
    return new SummaryListComponent(label)
  }

  trailMonitoringConditionsSection(): SummaryListComponent {
    const label = 'Trail monitoring'
    return new SummaryListComponent(label)
  }

  alcoholMonitoringConditionsSection(): SummaryListComponent {
    const label = 'Alcohol monitoring'
    return new SummaryListComponent(label)
  }

  installationLocationSection(): SummaryListComponent {
    const label = 'Installation location'
    return new SummaryListComponent(label)
  }

  installationAppointmentSection(): SummaryListComponent {
    const label = 'Installation appointment'
    return new SummaryListComponent(label)
  }

  installationAddressSection(): SummaryListComponent {
    const label = 'Installation address'
    return new SummaryListComponent(label)
  }
}
