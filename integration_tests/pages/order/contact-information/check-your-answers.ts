import AppPage from '../../appPage'
import paths from '../../../../server/constants/paths'
import { PageElement } from '../../page'

export default class ContactInformationCheckYourAnswersPage extends AppPage {
  constructor() {
    super('Check your answers', paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS)
  }

  phaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')

  continueButton = (): PageElement => cy.contains('Continue')

  returnButton = (): PageElement => cy.contains('Return back to form section menu')

  contactDetailsSections = (): PageElement => cy.contains('Contact details')

  addressesSection = (): PageElement => cy.contains('Addresses')

  interestedPartiesSection = (): PageElement => cy.contains('Interested parties')
}
