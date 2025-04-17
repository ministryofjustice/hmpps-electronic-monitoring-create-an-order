import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import InstallationAndRiskPage from '../../../pages/order/installationAndRisk'
import MonitoringConditionsPage from '../../../pages/order/monitoring-conditions'

const mockOrderId = uuidv4()
const apiPath = '/installation-and-risk'

context('Access needs and installation risk information', () => {
  context('Installation and Risk', () => {
    context('Submitting valid installation and risk information', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            offence: null,
            riskCategory: null,
            riskDetails: null,
            mappaLevel: null,
            mappaCaseType: null,
          },
        })

        cy.signIn()
      })

      it('should submit a correctly formatted identity numbers submission', () => {
        const page = Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })

        const validFormData = {
          offence: 'Robbery',
          riskCategory: 'Sex offender',
          riskDetails: '',
          mappaLevel: 'MAPPA 1',
          mappaCaseType: 'Serious Organised Crime',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            offence: 'ROBBERY',
            riskCategory: ['SEXUAL_OFFENCES'],
            riskDetails: '',
            mappaLevel: 'MAPPA 1',
            mappaCaseType: 'SOC (Serious Organised Crime)',
          },
        }).should('be.true')
      })

      it('should continue to the check your answers page', () => {
        const page = Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })

        const validFormData = {
          offence: 'Robbery',
          riskCategory: 'Sex offender',
          riskDetails: '',
          mappaLevel: 'MAPPA 1',
          mappaCaseType: 'Serious Organised Crime',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(MonitoringConditionsPage)
      })

      it('should return to the summary page', () => {
        const page = Page.visit(InstallationAndRiskPage, { orderId: mockOrderId })

        const validFormData = {
          offence: 'Robbery',
          riskCategory: 'Sex offender',
          riskDetails: '',
          mappaLevel: 'MAPPA 1',
          mappaCaseType: 'Serious Organised Crime',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndReturnButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })
  })
})
