import paths from '../../../../../server/constants/paths'
import CheckYourAnswersPage from '../../../../pages/checkYourAnswersPage'
import SummaryListComponent from '../../../../pages/components/summaryListComponent'

export default class InterestedPartiesCheckYourAnswersPage extends CheckYourAnswersPage {
  constructor(heading?: string) {
    let text = 'Check your answers'
    if (heading) {
      text = heading
    }
    super(text, paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS)
  }

  get organisationDetailsSection(): SummaryListComponent {
    const label = 'Organisation details'
    return new SummaryListComponent(label)
  }

  get probationDeliveryUnitSection(): SummaryListComponent {
    const label = 'Probation delivery unit'
    return new SummaryListComponent(label)
  }
}
