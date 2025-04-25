import paths from '../../../../server/constants/paths'
import SummaryListComponent from '../../components/summaryListComponent'
import CheckYourAnswersPage from '../../checkYourAnswersPage'

export default class DeviceWearerCheckYourAnswersPage extends CheckYourAnswersPage {
  constructor(heading: string) {
    super(heading, paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS, 'About the device wearer')
  }

  // SECTIONS

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
