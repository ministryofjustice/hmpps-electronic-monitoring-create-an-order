import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import SentenceTypePage from './SentenceTypePage'
import OrderTypePage from '../order-type/OrderTypePage'

const stubGetOrder = (notifyingOrg: string = 'PROBATION') => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    order: {
      interestedParties: {
        notifyingOrganisation: notifyingOrg,
        notifyingOrganisationName: '',
        notifyingOrganisationEmail: '',
        responsibleOfficerName: '',
        responsibleOfficerPhoneNumber: '',
        responsibleOrganisation: 'HOME_OFFICE',
        responsibleOrganisationRegion: '',
        responsibleOrganisationEmail: '',
      },
    },
  })
}

const mockOrderId = uuidv4()

context('sentence type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    stubGetOrder()
    cy.signIn()
  })

  it('Should show errors when I do not select a sentence type', () => {
    Page.visit(OrderTypePage, { orderId: mockOrderId })
    // orderTypePage.form.fillInWith('Release from prison')
    // orderTypePage.form.continueButton.click()

    const page = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.continueButton.click()

    page.errorSummary.shouldExist()
    page.form.sentenceTypeField.validationMessage.contains(
      'Select the type of sentence the device wearer has been given',
    )
  })
})
