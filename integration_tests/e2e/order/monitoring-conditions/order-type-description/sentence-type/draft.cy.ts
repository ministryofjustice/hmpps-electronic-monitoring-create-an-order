import { v4 as uuidv4 } from 'uuid'
import SentenceTypePage from './SentenceTypePage'
import Page from '../../../../../pages/page'

const stubGetOrder = (orderType: string = 'POST_RELEASE') => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    order: {
      monitoringConditions: {
        orderType,
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

  it('Page is accessible', () => {
    const page = Page.visit(SentenceTypePage, { orderId: mockOrderId })
    page.checkIsAccessible()
  })

  it('Should display  content', () => {
    const page = Page.visit(SentenceTypePage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.sentenceTypeField.shouldExist()
    page.form.sentenceTypeField.shouldNotBeDisabled()

    page.form.continueButton.should('exist')
  })

  it('when order type is Post Release', () => {
    stubGetOrder('POST_RELEASE')
    const page = Page.visit(SentenceTypePage, { orderId: mockOrderId })

    page.form.sentenceTypeField.shouldHaveOption('Standard Determinate Sentence')
    page.form.sentenceTypeField.shouldHaveOption('Detention and Training Order')
    page.form.sentenceTypeField.shouldHaveOption('Section 250 / Section 91')
  })

  it('when order type is Community', () => {
    stubGetOrder('POST_RELEASE')

    const page = Page.visit(SentenceTypePage, { orderId: mockOrderId })

    page.form.sentenceTypeField.shouldHaveOption('Supervision Default Order')
  })
})
