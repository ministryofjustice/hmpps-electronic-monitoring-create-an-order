import Page from '../../../pages/page'
import ConfirmVariationPage from '../../../pages/order/variation/confirmVariation'
import OrderTasksPage from '../../../pages/order/summary'
import IsAddressChangePage from '../edit-order/is-address-change/isAddressChangePage'
import ServiceRequestTypePage from './service-request-type/serviceRequestTypePage'
import NotifyingOrganisationPage from '../interested-parties/notifying-organisation/notifyingOrganisationPage'
import mockApiOrder from '../../../utils/data/ApiOrder'

const mockOriginalId = '00a00000-79cd-49f9-a498-b1f07c543b8a'
const mockVersionId = '22a22222-79cd-49f9-a498-b1f07c543b8a'

const stubOrder = (outcome: 'ACCEPTED' | 'REJECTED' | 'PROCESSING', status = 'SUBMITTED', type = 'REQUEST') => {
  const statusUpdates =
    status === 'SUBMITTED' && outcome !== 'PROCESSING'
      ? [
          {
            id: '33a33333-79cd-49f9-a498-b1f07c543b8a',
            versionId: mockVersionId,
            status: outcome,
            datetimeOfStatusChange: '2025-01-01T12:00:00.000Z',
            statusUpdateReasons: [],
          },
        ]
      : []
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOriginalId,
    status,
    type,
    order: {
      versionId: mockVersionId,
      canAmend: status === 'REJECTED' || outcome !== 'PROCESSING',
      statusUpdates,
    },
  })
}

const verifyReturnedOrderAmendmentFlow = (sourceType: string) => {
  stubOrder('REJECTED', 'REJECTED', sourceType)
  cy.task('stubCemoSubmitOrder', {
    httpStatus: 200,
    method: 'POST',
    id: mockOriginalId,
    subPath: '/amend',
    response: { order: mockApiOrder(), outcome: 'REJECTED' },
  })
  const page = Page.visit(OrderTasksPage, { orderId: mockOriginalId })
  cy.contains('This form has been returned.').should('be.visible')
  page.makeChangesButton.should('have.attr', 'href', `/order/${mockOriginalId}/edit`).click()
  Page.verifyOnPage(ConfirmVariationPage).confirmButton().click()

  cy.task('stubCemoVerifyRequestReceived', {
    uri: `/orders/${mockOriginalId}/amend`,
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
      stubOrder('ACCEPTED')
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        method: 'POST',
        id: mockOriginalId,
        subPath: '/amend',
        response: { order: mockApiOrder(), outcome: 'ACCEPTED' },
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

    it('blocks changes to an open submitted order while it is processing', () => {
      stubOrder('PROCESSING')
      const page = Page.visit(OrderTasksPage, { orderId: mockOriginalId })

      page.makeChangesButton.should('be.disabled')
      page.makeChangesButton.should('not.have.attr', 'href')
      cy.contains("You can't make changes to this form because it is being processed by EMS. Try again later.").should(
        'be.visible',
      )
      cy.get('h1')
        .next()
        .should(
          'contain.text',
          "You can't make changes to this form because it is being processed by EMS. Try again later.",
        )
    })

    it('creates a variation for an accepted submitted order', () => {
      stubOrder('ACCEPTED')
      const page = Page.visit(OrderTasksPage, { orderId: mockOriginalId })

      page.makeChangesButton.should('have.attr', 'href', `/order/${mockOriginalId}/edit`).click()
      Page.verifyOnPage(ConfirmVariationPage).confirmButton().click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOriginalId}/amend`,
        body: {},
      }).should('be.true')
      Page.verifyOnPage(OrderTasksPage)
    })

    it('returns to the summary with a stale-status message when amendment is rejected', () => {
      stubOrder('ACCEPTED')
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 409,
        method: 'POST',
        id: mockOriginalId,
        subPath: '/amend',
        response: {},
      })

      const page = Page.visit(OrderTasksPage, { orderId: mockOriginalId })
      page.makeChangesButton.click()
      Page.verifyOnPage(ConfirmVariationPage).confirmButton().click()

      Page.verifyOnPage(OrderTasksPage)
      cy.contains('The status of this form has changed. Check its current status before making changes.').should(
        'be.visible',
      )
    })

    it('blocks a submitted order without an eligible status observation', () => {
      stubOrder('PROCESSING')
      const page = Page.visit(OrderTasksPage, { orderId: mockOriginalId })

      cy.contains("You can't make changes to this form because it is being processed by EMS. Try again later.").should(
        'be.visible',
      )
      page.makeChangesButton.should('be.disabled')
      page.makeChangesButton.should('not.have.attr', 'href')
    })
    ;(['REQUEST', 'VARIATION'] as const).forEach(sourceType => {
      it(`amends a returned ${sourceType.toLowerCase()} using the merged endpoint`, () => {
        verifyReturnedOrderAmendmentFlow(sourceType)
      })
    })

    it('loads the current status and blocks changes while the case is processing', () => {
      stubOrder('PROCESSING')
      const page = Page.visit(OrderTasksPage, { orderId: mockOriginalId })

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOriginalId}`,
        method: 'GET',
        body: '',
      }).should('be.true')
      page.makeChangesButton.should('be.disabled')
      page.makeChangesButton.should('not.have.attr', 'href')
      cy.contains("You can't make changes to this form because it is being processed by EMS. Try again later.").should(
        'be.visible',
      )
    })

    it('redirects a direct edit visit to the summary while the case is processing', () => {
      stubOrder('PROCESSING')

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

      it('uses the returned-order route for a cancelled returned order instead of the service-request journey', () => {
        verifyReturnedOrderAmendmentFlow('VARIATION')
      })

      it('allows an accepted submitted order through the service-request journey', () => {
        stubOrder('ACCEPTED')
        cy.visit(`/order/${mockOriginalId}/edit`)
        Page.verifyOnPage(ConfirmVariationPage).confirmButton().click()

        const addressChangePage = Page.verifyOnPage(IsAddressChangePage)
        addressChangePage.form.fillInWith('No')
        addressChangePage.form.saveAndContinueButton.click()

        Page.verifyOnPage(ServiceRequestTypePage)
      })

      it('blocks an order when the backend cannot confirm an accepted outcome', () => {
        stubOrder('PROCESSING')
        const page = Page.visit(OrderTasksPage, { orderId: mockOriginalId })

        page.makeChangesButton.should('be.disabled')
        page.makeChangesButton.should('not.have.attr', 'href')
      })
    })
  })
})
