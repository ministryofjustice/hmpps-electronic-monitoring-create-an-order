import { v4 as uuidv4 } from 'uuid'
import SentenceTypePage from './SentenceTypePage'
import Page from '../../../../../pages/page'
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
context('sentenceType', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    stubGetOrder()

    cy.signIn()
  })

  it('Page accessible', () => {
    Page.visit(OrderTypePage, { orderId: mockOrderId })
    // orderTypePage.form.fillInWith('Release from prison')
    // orderTypePage.form.continueButton.click()

    const page = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    page.checkIsAccessible()
  })

  it('Should display content', () => {
    Page.visit(OrderTypePage, { orderId: mockOrderId })
    // orderTypePage.form.fillInWith('Release from prison')
    // orderTypePage.form.continueButton.click()

    const page = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.sentenceTypeField.shouldExist()
    page.form.sentenceTypeField.shouldNotBeDisabled()
    page.form.continueButton.should('exist')
  })

  it('when order type is Post Release', () => {
    Page.visit(OrderTypePage, { orderId: mockOrderId })
    // orderTypePage.form.fillInWith('Release from prison')
    // orderTypePage.form.continueButton.click()

    const page = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })

    cy.get('h1').should('contain', 'What type of sentence has the device wearer been given?')
    page.form.sentenceTypeField.shouldHaveOption('Standard Determinate Sentence')
    page.form.sentenceTypeField.shouldHaveOption('Detention and Training Order')
    page.form.sentenceTypeField.shouldHaveOption('Section 250 / Section 91')
  })

  // Order type communities disabled ELM-4495 skipping test until the option is enabled again
  it.skip('when order type is Community', () => {
    Page.visit(OrderTypePage, { orderId: mockOrderId })
    // orderTypePage.form.fillInWith('Community')
    // orderTypePage.form.continueButton.click()

    const page = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })

    cy.get('h1').should('contain', 'What type of sentence has the device wearer been given?')
    page.form.sentenceTypeField.shouldHaveOption('Supervision Default Order')
    page.form.sentenceTypeField.shouldHaveOption('Suspended Sentence')
    page.form.sentenceTypeField.shouldHaveOption('Youth Rehabilitation Order (YRO)')
    page.form.sentenceTypeField.shouldHaveOption('The sentence they have been given is not in the list')
  })
})
