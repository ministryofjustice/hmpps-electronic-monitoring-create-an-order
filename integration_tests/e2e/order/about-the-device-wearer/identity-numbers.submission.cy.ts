import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import IdentityNumbersPage from '../../../pages/order/about-the-device-wearer/identity-numbers'
import DeviceWearerCheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'

const mockOrderId = uuidv4()
const apiPath = '/device-wearer/identity-numbers'

context('About the device wearer', () => {
  context('Identity numbers', () => {
    context('Submitting valid identity numbers', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            nomisId: null,
            pncId: null,
            deliusId: null,
            prisonNumber: null,
            homeOfficeReferenceNumber: null,
            firstName: null,
            lastName: null,
            alias: null,
            adultAtTimeOfInstallation: null,
            sex: null,
            gender: null,
            dateOfBirth: null,
            disabilities: null,
            noFixedAbode: false,
            interpreterRequired: null,
          },
        })

        cy.signIn()
      })

      it('should submit a correctly formatted identity numbers submission', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })

        const validFormData = {
          nomisId: 'nomis',
          pncId: 'pnc',
          deliusId: 'delius',
          prisonNumber: 'prison',
          homeOfficeReferenceNumber: 'homeoffice',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            nomisId: 'nomis',
            pncId: 'pnc',
            deliusId: 'delius',
            prisonNumber: 'prison',
            homeOfficeReferenceNumber: 'homeoffice',
          },
        }).should('be.true')
      })

      it('should continue to the check your answers page', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })

        const validFormData = {
          nomisId: 'nomis',
          pncId: 'pnc',
          deliusId: 'delius',
          prisonNumber: 'prison',
          homeOfficeReferenceNumber: 'homeoffice',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, 'Check your answers')
      })

      it('should return to the summary page', () => {
        const page = Page.visit(IdentityNumbersPage, { orderId: mockOrderId })

        const validFormData = {
          nomisId: 'nomis',
          pncId: 'pnc',
          deliusId: 'delius',
          prisonNumber: 'prison',
          homeOfficeReferenceNumber: 'homeoffice',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndReturnButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })
  })
})
