import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import DapoPage from './DapoPage'
import OffenceListPage from '../offence-list/offenceListPage'
import OrderTasksPage from '../../../../../pages/order/summary'

const mockOrderId = uuidv4()
const apiPath = '/dapo'

context('dapo page', () => {
  context('Submitting valid installation and risk information', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: { dataDictionaryVersion: 'DDV5' },
      })
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: apiPath,
        response: {
          clause: 'some clause',
          date: 'some date',
        },
      })

      cy.signIn()
    })

    it('should submit the correct data and continue to the next page', () => {
      const page = Page.visit(DapoPage, { orderId: mockOrderId })

      const dapoDate = new Date(2025, 1, 1)
      const validFormData = {
        dapoClauseNumber: 'some clause',
        dapoDate,
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${apiPath}`,
        body: {
          clause: 'some clause',
          date: dapoDate.toISOString(),
        },
      }).should('be.true')

      Page.verifyOnPage(OffenceListPage)
    })

    it('should return to summary page when save as draft', () => {
      const page = Page.visit(DapoPage, { orderId: mockOrderId })

      const dapoDate = new Date(2025, 1, 1)
      const validFormData = {
        dapoClauseNumber: 'some clause',
        dapoDate,
      }

      page.form.fillInWith(validFormData)
      page.form.saveAsDraftButton.click()

      Page.verifyOnPage(OrderTasksPage)
    })
  })
})
