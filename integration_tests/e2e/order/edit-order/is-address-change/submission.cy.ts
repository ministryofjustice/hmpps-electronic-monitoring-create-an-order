import { v4 as uuidv4 } from 'uuid'

import Page from '../../../../pages/page'
import OrderTasksPage from '../../../../pages/order/summary'
import IsAddressChangePage from './isAddressChangePage'
import ServiceRequestTypePage from '../../variation/service-request-type/serviceRequestTypePage'
import OrderNotifyingOrganisationPage from '../../../../pages/order/notifying-organisation'

const mockOrderId = uuidv4()
const amendPath = '/amend-order'

const completeNotifyingOrganisationPage = () => {
  const page = Page.verifyOnPage(OrderNotifyingOrganisationPage, { orderId: mockOrderId })
  page.form.fillInWith({
    notifyingOrganisation: 'Prison service',
    prison: 'Altcourse Prison',
    notifyingOrganisationEmailAddress: 'a@b.com',
  })
  page.form.continueButton.click()
  Page.verifyOnPage(OrderTasksPage, { orderId: mockOrderId })
}

context('Edit Order', () => {
  context('Is Address Change', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })
      cy.task('stubCemoGetVersions', { httpStatus: 200, orderId: mockOrderId, versions: [] })
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        method: 'POST',
        id: mockOrderId,
        subPath: amendPath,
        response: [{}],
      })

      cy.signIn()
    })

    it('Should return to order summary page when backButton is clicked', () => {
      const page = Page.visit(IsAddressChangePage, { orderId: mockOrderId })

      page.form.backButton.click()

      Page.verifyOnPage(OrderTasksPage)
    })

    it('Should continue to service request type page if no is selected', () => {
      const page = Page.visit(IsAddressChangePage, { orderId: mockOrderId })
      page.form.fillInWith('No')
      page.form.saveAndContinueButton.click()

      Page.verifyOnPage(ServiceRequestTypePage)
    })

    it('Should call amend-rejected-order endpoint and go to notifying organisation page if Yes is selected', () => {
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      const page = Page.visit(IsAddressChangePage, { orderId: mockOrderId })
      page.form.fillInWith('Yes')
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}/amend-order`,
        body: {
          type: 'REINSTALL_DEVICE',
        },
      }).should('be.true')
      completeNotifyingOrganisationPage()
    })
  })
})
