import paths from '../../../../../../server/constants/paths'
import CheckYourAnswersPage from '../../../../../pages/checkYourAnswersPage'
import SummaryListComponent from '../../../../../pages/components/summaryListComponent'

export default class OrderTypeDescriptionCheckYourAnswersPage extends CheckYourAnswersPage {
  constructor(heading: string) {
    super(heading, paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS)
  }

  get orderInformationSection(): SummaryListComponent {
    const label = 'Order information'
    return new SummaryListComponent(label)
  }
}
