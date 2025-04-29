import paths from '../../../../server/constants/paths'
import CheckYourAnswersPage from '../../checkYourAnswersPage'
import SummaryListComponent from '../../components/summaryListComponent'

export default class ContactInformationCheckYourAnswersPage extends CheckYourAnswersPage {
  constructor(heading: string) {
    super(heading, paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS, 'Contact information')
  }

  // SECTIONS

  get contactDetailsSection(): SummaryListComponent {
    const label = 'Telephone number'
    return new SummaryListComponent(label)
  }

  get deviceWearerAddressesSection(): SummaryListComponent {
    const label = "Device wearer's addresses"
    return new SummaryListComponent(label)
  }

  get organisationDetailsSection(): SummaryListComponent {
    const label = 'Organisations details'
    return new SummaryListComponent(label)
  }
}
