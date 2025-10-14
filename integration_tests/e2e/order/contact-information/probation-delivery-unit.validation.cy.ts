import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import ProbationDeliveryUnitPage from '../../../pages/order/contact-information/probation-delivery-unit'

const mockOrderId = uuidv4()

context('Contact information', () => {
  context('Interested parties', () => {
    context('Submitting invalid data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            dataDictionaryVersion: 'DDV5',
            interestedParties: {
              notifyingOrganisation: 'PRISON',
              notifyingOrganisationName: 'FELTHAM_YOUNG_OFFENDER_INSTITUTION',
              notifyingOrganisationEmail: 'test@test.com',
              responsibleOfficerName: 'John Smith',
              responsibleOfficerPhoneNumber: '01234567890',
              responsibleOrganisation: 'PROBATION',
              responsibleOrganisationRegion: 'NORTH_EAST',
              responsibleOrganisationEmail: 'test2@test.com',
            },
          },
        })

        cy.signIn()
      })

      it('Should display validation error messages', () => {
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(ProbationDeliveryUnitPage)

        page.form.unitField.shouldHaveValidationMessage("Select the Responsible Organisation's PDU")
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError("Select the Responsible Organisation's PDU")
      })
    })
  })
})
