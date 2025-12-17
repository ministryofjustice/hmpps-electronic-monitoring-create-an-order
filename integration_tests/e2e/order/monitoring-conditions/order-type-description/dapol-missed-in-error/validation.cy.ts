import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import DapolMissedInErrorPage from './dapolMissedInErrorPage'

const mockOrderId = uuidv4()
context('order type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
    })
    cy.signIn()
  })

  it('Should show errors no answer selected', () => {
    const page = Page.visit(DapolMissedInErrorPage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.continueButton.click()

    page.errorSummary.shouldExist()
    page.form.dapolMissedInErrorField.validationMessage.contains(
      'Select Yes if DAPOL was missed in error at the point of release',
    )
  })
})
