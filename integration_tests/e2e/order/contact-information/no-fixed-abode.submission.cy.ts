import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import NoFixedAbodePage from '../../../pages/order/contact-information/no-fixed-abode'
import PrimaryAddressPage from '../../../pages/order/contact-information/primary-address'
import NotifyingOrganisationPage from '../../../pages/order/contact-information/notifyingOrganisation'
import OrderSummaryPage from '../../../pages/order/summary'

const mockOrderId = uuidv4()
const apiPath = '/device-wearer/no-fixed-abode'

context('Contact information', () => {
  context('No fixed abode', () => {
    context('Submitting a valid "yes" response', () => {
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
            firstName: null,
            lastName: null,
            alias: null,
            adultAtTimeOfInstallation: null,
            sex: null,
            gender: null,
            dateOfBirth: null,
            disabilities: null,
            noFixedAbode: false,
          },
        })

        cy.signIn()
      })

      it('should submit a correctly formatted no fixed abode submission', () => {
        const page = Page.visit(NoFixedAbodePage, { orderId: mockOrderId })

        const validFormData = {
          noFixedAbode: 'No',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            noFixedAbode: 'true',
          },
        }).should('be.true')
      })

      it('should continue to collect address details', () => {
        const page = Page.visit(NoFixedAbodePage, { orderId: mockOrderId })

        const validFormData = {
          noFixedAbode: 'Yes',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(PrimaryAddressPage)
      })

      it('should return to the summary page', () => {
        const page = Page.visit(NoFixedAbodePage, { orderId: mockOrderId })

        const validFormData = {
          noFixedAbode: 'Yes',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndReturnButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })

    context('Submitting a valid "no" response', () => {
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
            firstName: null,
            lastName: null,
            alias: null,
            adultAtTimeOfInstallation: null,
            sex: null,
            gender: null,
            dateOfBirth: null,
            disabilities: null,
            noFixedAbode: true,
          },
        })

        cy.signIn()
      })

      it('should continue to collect responsible officer', () => {
        const page = Page.visit(NoFixedAbodePage, { orderId: mockOrderId })

        const validFormData = {
          noFixedAbode: 'No',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(NotifyingOrganisationPage)
      })

      it('should return to the summary page', () => {
        const page = Page.visit(NoFixedAbodePage, { orderId: mockOrderId })

        const validFormData = {
          noFixedAbode: 'No',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndReturnButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })
  })
})