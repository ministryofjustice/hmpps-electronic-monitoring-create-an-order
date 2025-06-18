import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import ProbationDeliveryUnitPage from '../../../pages/order/contact-information/probation-delivery-unit'
import ContactInformationCheckYourAnswersPage from '../../../pages/order/contact-information/check-your-answers'

const mockOrderId = uuidv4()
const apiPath = '/probation-delivery-unit'
const sampleFormData = {
  unit: 'County Durham and Darlington',
}

context('Contact information', () => {
  context('Probation delivery unit', () => {
    context('Submitting valid data', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
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
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            unit: 'COUNTY_DURHAM_AND_DARLINGTON',
          },
        })

        cy.signIn()
      })

      it('should submit a correctly formatted probation delivery unit', () => {
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.form.fillInWith(sampleFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            unit: 'COUNTY_DURHAM_AND_DARLINGTON',
          },
        }).should('be.true')
      })

      it('should continue to collect installation and risk details', () => {
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.form.fillInWith(sampleFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(ContactInformationCheckYourAnswersPage, 'Check your answers')
      })

      it('should return to the summary page', () => {
        const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

        page.form.fillInWith(sampleFormData)
        page.form.saveAndReturnButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })
  })
})
