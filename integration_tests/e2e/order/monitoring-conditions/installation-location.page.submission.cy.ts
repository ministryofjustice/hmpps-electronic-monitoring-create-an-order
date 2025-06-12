import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationLocationPage from '../../../pages/order/monitoring-conditions/installation-location'

const mockOrderId = uuidv4()
const apiPath = '/installation-location'
context('Monitoring conditions', () => {
  context('Installation location', () => {
    context('Submission', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
        })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            location: 'INSTALLATION',
          },
        })
        cy.signIn()
      })

      it('Should submit a correctly formatted installation location', () => {
        const page = Page.visit(InstallationLocationPage, { orderId: mockOrderId })

        const validFormData = {
          location: 'At another address',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()
        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            location: 'INSTALLATION',
          },
        }).should('be.true')
      })
    })
  })
})
