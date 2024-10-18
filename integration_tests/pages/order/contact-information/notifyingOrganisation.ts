import AppPage from '../../appPage'
import { PageElement } from '../../page'

import paths from '../../../../server/constants/paths'

import NotifyingOrganisationFormComponent from '../../components/forms/contact-information/notifyingOrganisationForm'

export default class NotifyingOrganisationPage extends AppPage {
  public form = new NotifyingOrganisationFormComponent()

  constructor() {
    super('Contact information', paths.CONTACT_INFORMATION.NOTIFYING_ORGANISATION)
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }

  get backToSummaryButton(): PageElement {
    return cy.get('a#backToSummary')
  }

  fillInForm = (): void => {
    cy.get('input[name="notifyingOrganisationEmail"]').type('first@last.gov.uk')
    cy.get('input[name="officerName"]').type('Bob Smith')
    cy.get('input[name="officerPhoneNumber"]').type('07723456432')
    cy.get('input[name="organisationType"][value="PROBATION"]').click()
    cy.get('input[name="organisationRegion"]').type('The Midlands')
    cy.get('input[name="organisationAddressLine1"]').type('Line 1')
    cy.get('input[name="organisationAddressLine2"]').type('Line 2')
    cy.get('input[name="organisationAddressLine3"]').type('Line 3')
    cy.get('input[name="organisationAddressLine4"]').type('Line 4')
    cy.get('input[name="organisationAddressPostcode"]').type('NC4 5LB')
    cy.get('input[name="organisationPhoneNumber"]').type('07723456789')
    cy.get('input[name="organisationEmail"]').type('test@prison.gov.uk')
  }
}
