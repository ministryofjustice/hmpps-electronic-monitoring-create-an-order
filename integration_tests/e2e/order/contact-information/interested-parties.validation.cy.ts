import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InterestedPartiesPage from '../../../pages/order/contact-information/interested-parties'

const mockOrderId = uuidv4()
const apiPath = '/interested-parties'

const expectedValidationErrors = {
  notifyingOrganisationName: 'Select the organisation you are part of',
  responsibleOrganisation: "Select the responsible officer's organisation",
  responsibleOrganisationRegion: 'Select the responsible organisation region',
}

context('Contact information', () => {
  context('Interested parties', () => {
    context('Submitting invalid data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

        cy.signIn()
      })

      it('Should display validation error messages if only pass notifying organisation', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [
            {
              field: 'responsibleOrganisation',
              error: expectedValidationErrors.responsibleOrganisation,
            },
            {
              field: 'notifyingOrganisationName',
              error: expectedValidationErrors.notifyingOrganisationName,
            },
          ],
        })
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
        page.errorSummary.verifyErrorSummary([
          expectedValidationErrors.notifyingOrganisationName,
          expectedValidationErrors.responsibleOrganisation,
        ])
      })

      it('Should display validation error message if not passing responsible organisation region', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: apiPath,
          response: [
            { field: 'responsibleOrganisationRegion', error: expectedValidationErrors.responsibleOrganisationRegion },
          ],
        })

        const page = Page.visit(InterestedPartiesPage, { orderId: mockOrderId })

        page.form.fillInWith({
          notifyingOrganisation: 'Prison',
          prison: 'Ashfield Prison',
          responsibleOrganisation: 'Police',
        })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(InterestedPartiesPage)

        page.form.policeAreaField.shouldHaveValidationMessage(expectedValidationErrors.responsibleOrganisationRegion)
        page.errorSummary.shouldExist()
        page.errorSummary.verifyErrorSummary([expectedValidationErrors.responsibleOrganisationRegion])
      })
    })
  })
})
