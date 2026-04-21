import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import FindAddressPage from './findAddressPage'

context('find address page', () => {
  context('device wearer address', () => {
    const mockOrderId = uuidv4()

    beforeEach(() => {
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
      })

      cy.signIn()
    })

    it('shows errors when no postcode is entered', () => {
      const page = Page.visit(FindAddressPage, { orderId: mockOrderId, addressType: 'PRIMARY' })

      page.form.findAddressButton.click()

      page.form.postcodeField.shouldHaveValidationMessage('Enter the postcode')
      page.errorSummary.shouldHaveError('Enter the postcode')
    })

    it('still shows the building id if entered', () => {
      const page = Page.visit(FindAddressPage, { orderId: mockOrderId, addressType: 'PRIMARY' })

      page.form.fillInWith({ id: 'some id' })

      page.form.findAddressButton.click()

      page.form.buildingIdField.shouldHaveValue('some id')
    })
  })
})
