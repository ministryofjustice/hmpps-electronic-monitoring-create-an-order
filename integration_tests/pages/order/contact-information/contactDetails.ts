import AppPage from '../../appPage'
import { PageElement } from '../../page'

export default class ContactDetailsPage extends AppPage {
  constructor() {
    super('Contact information')
  }

  subHeading = (): PageElement => cy.get('legend')

  form = (): PageElement => cy.get('form')

  inputs = (): PageElement => cy.get('form input')

  contactNumber = (): PageElement => cy.get('form input[name=contactNumber]')

  saveAndContinueButton = (): PageElement => cy.get('form button[type=submit][value="continue"]')

  saveAndReturnButton = (): PageElement => cy.get('form button[type=submit][value="back"]')

  backToSummaryButton = (): PageElement => cy.get('a#backToSummary')
}
