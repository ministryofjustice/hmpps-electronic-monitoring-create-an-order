import paths from '../../../../server/constants/paths'
import CheckYourAnswersPage from '../../checkYourAnswersPage'
import SummaryListComponent from '../../components/summaryListComponent'

export default class ContactInformationCheckYourAnswersPage extends CheckYourAnswersPage {
  constructor(heading: string, isOldVersion?: boolean) {
    let path: string
    if (isOldVersion) {
      path = paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS_VERSION
    } else {
      path = paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS
    }

    super(heading, path, 'Contact information')
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

  get probationDeliveryUnitSection(): SummaryListComponent {
    const lable = 'Probation delivery unit'
    return new SummaryListComponent(lable)
  }
}
