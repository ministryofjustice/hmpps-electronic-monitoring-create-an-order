import paths from '../../../../server/constants/paths'
import SummaryListComponentWithoutHeading from '../../components/SummaryListComponentWithoutHeading'
import CheckYourAnswersPage from '../../checkYourAnswersPage'

export default class InstallationAndRiskCheckYourAnswersPage extends CheckYourAnswersPage {
  constructor(heading: string, isOldVersion?: boolean) {
    let path: string
    if (isOldVersion) {
      path = paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS_VERSION
    } else {
      path = paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS
    }

    super(heading, path, 'Risk information')
  }

  // SECTIONS get banner(): PageElement {
  get installationRiskSection(): SummaryListComponentWithoutHeading {
    return new SummaryListComponentWithoutHeading()
  }
}
