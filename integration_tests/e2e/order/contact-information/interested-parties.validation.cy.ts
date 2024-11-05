import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InterestedPartiesPage from '../../../pages/order/contact-information/interested-parties'

const mockOrderId = uuidv4()
const apiPath = '/interested-parties'

const expectedValidationErrors = {
  reponsibleOrganisationAddressLine1: 'Address line 1 is required',
  reponsibleOrganisationAddressLine2: 'Address line 2 is required',
  reponsibleOrganisationPostcode: 'Postcode is required',
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
              field: 'responsibleOrganisationAddressLine1',
              error: expectedValidationErrors.reponsibleOrganisationAddressLine1,
            },
            {
              field: 'responsibleOrganisationAddressLine2',
              error: expectedValidationErrors.reponsibleOrganisationAddressLine2,
            },
            {
              field: 'responsibleOrganisationAddressPostcode',
              error: expectedValidationErrors.reponsibleOrganisationPostcode,
            },
          ],
        })

        cy.signIn()
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(InterestedPartiesPage)

        page.form.responsibleOrganisationAddressField.line1Field.shouldHaveValidationMessage(
          expectedValidationErrors.reponsibleOrganisationAddressLine1,
        )
        page.form.responsibleOrganisationAddressField.line2Field.shouldHaveValidationMessage(
          expectedValidationErrors.reponsibleOrganisationAddressLine2,
        )
        page.form.responsibleOrganisationAddressField.postcodeField.shouldHaveValidationMessage(
          expectedValidationErrors.reponsibleOrganisationPostcode,
        )
      })
    })
  })
})
