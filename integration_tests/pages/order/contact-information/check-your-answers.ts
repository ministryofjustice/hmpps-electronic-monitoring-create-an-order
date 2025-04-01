import paths from '../../../../server/constants/paths'
import { PageElement } from '../../page'
import CheckYourAnswersPage from '../../checkYourAnswersPage'

export default class ContactInformationCheckYourAnswersPage extends CheckYourAnswersPage {
  constructor() {
    super('Check your answers', paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS)
  }

  contactDetailsSections = (): PageElement => cy.contains('Contact details')

  addressesSection = (): PageElement => cy.contains('Addresses')

  interestedPartiesSection = (): PageElement => cy.contains('Interested parties')
}
