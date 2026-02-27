import paths from '../../../../../server/constants/paths'
import CheckYourAnswersPage from '../../../../pages/checkYourAnswersPage'
import SummaryListComponent from '../../../../pages/components/summaryListComponent'

export default class InterestedPartiesCheckYourAnswersPage extends CheckYourAnswersPage {
  constructor(heading: string = 'Check your answers', isOldVersion: boolean = false) {
    let path: string
    if (isOldVersion) {
      path = paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS_VERSION
    } else {
      path = paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS
    }

    super(heading, path)
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
