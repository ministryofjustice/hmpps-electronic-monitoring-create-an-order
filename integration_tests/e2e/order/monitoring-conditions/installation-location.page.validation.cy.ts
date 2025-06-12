import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationLocationPage from '../../../pages/order/monitoring-conditions/installation-location'

const mockOrderId = uuidv4()
context('Monitoring conditions', () => {
  context('Installation location', () => {
    context('Validations', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS'
        })

        cy.signIn()
      })

      it('Should show error when no installation type is selected', () => {
        const page = Page.visit(InstallationLocationPage, { orderId: mockOrderId })
        page.form.saveAndContinueButton.click()

        page.form.locationField.shouldHaveValidationMessage('Select where will installation of the electronic monitoring device take place')
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Select where will installation of the electronic monitoring device take place')
      })
    })
  })
})
