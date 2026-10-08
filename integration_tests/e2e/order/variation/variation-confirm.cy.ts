import Page from '../../../pages/page'
import ConfirmVariationPage from '../../../pages/order/variation/confirmVariation'
import OrderTasksPage from '../../../pages/order/summary'
import IsAddressChangePage from '../edit-order/is-address-change/isAddressChangePage'
import ServiceRequestTypePage from './service-request-type/serviceRequestTypePage'
import NotifyingOrganisationPage from '../interested-parties/notifying-organisation/notifyingOrganisationPage'

const mockOriginalId = '00a00000-79cd-49f9-a498-b1f07c543b8a'
const mockVariationId = '11a11111-79cd-49f9-a498-b1f07c543b8a'

const stubOrder = (caseState: string, status = 'SUBMITTED', type = 'REQUEST', fmsResultId?: string | null) => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOriginalId,
    status,
    type,
    order: { caseState, ...(fmsResultId === undefined ? {} : { fmsResultId }) },
  })
}

const verifyReturnedOrderAmendmentFlow = (sourceType: string) => {
  stubOrder('CANCELLED', 'REJECTED', sourceType)
  cy.task('stubCemoSubmitOrder', {
    httpStatus: 200,
    method: 'POST',
    id: mockOriginalId,
    subPath: '/amend-rejected-order',
    response: {},
  })
  cy.visit(`/order/${mockOriginalId}/edit`)
  Page.verifyOnPage(ConfirmVariationPage).confirmButton().click()

  cy.task('stubCemoVerifyRequestReceived', {
    uri: `/orders/${mockOriginalId}/amend-rejected-order`,
    body: {},
  }).should('be.true')
  Page.verifyOnPage(NotifyingOrganisationPage)
  cy.contains('Are you making changes to this form because the original was rejected by email?').should('not.exist')
}

context('Variation', () => {
  context('Creating a version from an existing order', () => {
    beforeEach(() => {
      cy.task('resetFeatureFlags')
      cy.task('reset')
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
      })
      stubOrder('CLOSED')
      cy.task('stubCemoCreateVariation', {
        httpStatus: 200,
        originalId: mockOriginalId,
        variationId: mockVariationId,
      })
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        method: 'POST',
        id: mockOriginalId,
        subPath: '/copy-as-variation',
        response: [{}],
      })
      cy.signIn()
    })

    it('shows the confirmation page for an eligible submitted order', () => {
      cy.visit(`/order/${mockOriginalId}/edit`)

      const page = Page.verifyOnPage(ConfirmVariationPage)
      page.header.userName().should('contain.text', 'J. Smith')
    })

    it('returns to the summary when the user cancels', () => {
      cy.visit(`/order/${mockOriginalId}/edit`)
      const page = Page.verifyOnPage(ConfirmVariationPage)

      page.cancelButton().click()

      Page.verifyOnPage(OrderTasksPage)
    })

    it('creates a variation for an accepted order without showing the rejection question', () => {
      cy.visit(`/order/${mockOriginalId}/edit`)
      Page.verifyOnPage(ConfirmVariationPage).confirmButton().click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOriginalId}/copy-as-variation`,
        body: {},
      }).should('be.true')
      Page.verifyOnPage(OrderTasksPage)
    })

    it('allows a submitted order with unknown case state and no FMS result ID to start a new version', () => {
      stubOrder('UNKNOWN', 'SUBMITTED', 'REQUEST', null)
      const page = Page.visit(OrderTasksPage, { orderId: mockOriginalId })

      cy.contains("We can't check the status of this form right now. Try again later.").should('not.exist')
      page.makeChangesButton.should('have.attr', 'href', `/order/${mockOriginalId}/edit`).click()
      Page.verifyOnPage(ConfirmVariationPage)
    })

    it('skips the rejection question when changing a returned new order', () => {
      verifyReturnedOrderAmendmentFlow('REQUEST')
    })

    it('skips the rejection question when changing a returned change order', () => {
      verifyReturnedOrderAmendmentFlow('VARIATION')
    })

    it('loads the current status and blocks changes while the case is processing', () => {
      stubOrder('OPEN')
      const page = Page.visit(OrderTasksPage, { orderId: mockOriginalId })

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOriginalId}`,
        method: 'GET',
        body: '',
      }).should('be.true')
      page.makeChangesButton.should('be.disabled')
      page.makeChangesButton.should('not.have.attr', 'href')
      cy.contains(
        'This form is still being processed. You can make changes once it has been accepted or returned.',
      ).should('be.visible')
    })

    it('redirects a direct edit visit to the summary while the case is processing', () => {
      stubOrder('AWAITING_INFO')

      cy.visit(`/order/${mockOriginalId}/edit`)

      Page.verifyOnPage(OrderTasksPage)
      cy.get('#make-changes-button').should('be.disabled')
    })

    context('SERVICE_REQUEST_TYPE_ENABLED enabled', () => {
      beforeEach(() => {
        cy.task('setFeatureFlags', { SERVICE_REQUEST_TYPE_ENABLED: true })
      })
      afterEach(() => {
        cy.task('resetFeatureFlags')
      })

      it('keeps the accepted-order service-request journey', () => {
        cy.visit(`/order/${mockOriginalId}/edit`)
        Page.verifyOnPage(ConfirmVariationPage).confirmButton().click()

        Page.verifyOnPage(IsAddressChangePage)
      })

      it('allows an UNKNOWN status case order with an FMS result ID', () => {
        stubOrder('UNKNOWN', 'SUBMITTED', 'REQUEST', '22a22222-79cd-49f9-a498-b1f07c543b8a')
        const page = Page.visit(OrderTasksPage, { orderId: mockOriginalId })

        page.makeChangesButton.should('have.attr', 'href', `/order/${mockOriginalId}/edit`).click()
        Page.verifyOnPage(ConfirmVariationPage).confirmButton().click()

        const addressChangePage = Page.verifyOnPage(IsAddressChangePage)
        addressChangePage.form.fillInWith('No')
        addressChangePage.form.saveAndContinueButton.click()

        Page.verifyOnPage(ServiceRequestTypePage)
      })
    })
  })
})
