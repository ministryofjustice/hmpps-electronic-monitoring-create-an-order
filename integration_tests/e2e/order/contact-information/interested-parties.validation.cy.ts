import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InterestedPartiesPage from '../../../pages/order/contact-information/interested-parties'

const mockOrderId = uuidv4()
const apiPath = '/interested-parties'

const expectedValidationErrors = {
  notifyingOrganisationName: 'Select the organisation you are part of',
  responsibleOrganisation: "Select the responsible officer's organisation",
}

context('Contact information', () => {
  context('Interested parties', () => {
    context('Submitting invalid data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [
            {
              field: 'notifyingOrganisationName',
              error: expectedValidationErrors.notifyingOrganisationName,
            },
            {
              field: 'responsibleOrganisation',
              error: expectedValidationErrors.responsibleOrganisation,
            },
          ],
        })

        cy.signIn()
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

        page.form.fillInWith({
          notifyingOrganisation: 'Prison',
        })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(InterestedPartiesPage)

        page.form.prisonField.shouldHaveValidationMessage(expectedValidationErrors.notifyingOrganisationName)
        page.form.responsibleOrganisationField.shouldHaveValidationMessage(
          expectedValidationErrors.responsibleOrganisation,
        )
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError(expectedValidationErrors.responsibleOrganisation)
        page.errorSummary.shouldHaveError(expectedValidationErrors.notifyingOrganisationName)
      })
    })
  })
})
