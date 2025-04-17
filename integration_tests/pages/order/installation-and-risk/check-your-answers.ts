import paths from '../../../../server/constants/paths'
import SummaryListComponent from '../../components/summaryListComponent'
import CheckYourAnswersPage from '../../checkYourAnswersPage'

export default class IntallationAndRiskCheckYourAnswersPage extends CheckYourAnswersPage {
  constructor() {
    super('Check your answers', paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS)
  }

  // SECTIONS
  get notifyOrganisationsDetailsSection(): SummaryListComponent {
    const label = "Notify Organisation's details"
    return new SummaryListComponent(label)
  }

  get responsibleOfficersDetailsSection(): SummaryListComponent {
    const label = "Responsible Officer's details"
    return new SummaryListComponent(label)
  }

  get responsibleOrganisationsDetails(): SummaryListComponent {
    const label = "Responsible Organisation's details"
    return new SummaryListComponent(label)
  }
}
