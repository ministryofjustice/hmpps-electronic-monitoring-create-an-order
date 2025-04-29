import paths from '../../../../server/constants/paths'
import SummaryListComponentWithoutHeading from '../../components/SummaryListComponentWithoutHeading'
import CheckYourAnswersPage from '../../checkYourAnswersPage'

export default class InstallationAndRiskCheckYourAnswersPage extends CheckYourAnswersPage {
  constructor(heading: string) {
    super(heading, paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS, 'Risk information')
  }

  // SECTIONS get banner(): PageElement {
  get installationRiskSection(): SummaryListComponentWithoutHeading {
    return new SummaryListComponentWithoutHeading()
  }
}
