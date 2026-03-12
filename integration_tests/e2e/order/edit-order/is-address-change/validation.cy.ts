import { v4 as uuidv4 } from 'uuid'

import Page from '../../../../pages/page'
import IsAddressChangePage from './isAddressChangePage'

const mockOrderId = uuidv4()
context('Edit Order', () => {
  context('Is Address Change', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })

      cy.signIn()
    })

    it('Show error message when no radio selected', () => {
      const page = Page.visit(IsAddressChangePage, { orderId: mockOrderId })
      page.form.saveAndContinueButton.click()

      Page.verifyOnPage(IsAddressChangePage)

      page.errorSummary.shouldExist()
      page.errorSummary.shouldHaveError('Select Yes if the device wearer’s primary address has changed')

      page.form.isAddressChangeField.shouldHaveValidationMessage(
        'Select Yes if the device wearer’s primary address has changed',
      )
    })
  })
})
