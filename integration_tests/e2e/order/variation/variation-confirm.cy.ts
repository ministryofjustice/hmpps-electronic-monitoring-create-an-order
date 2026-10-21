import Page from '../../../pages/page'
import ConfirmVariationPage from '../../../pages/order/variation/confirmVariation'
import OrderTasksPage from '../../../pages/order/summary'
import IsAddressChangePage from '../edit-order/is-address-change/isAddressChangePage'
import ServiceRequestTypePage from './service-request-type/serviceRequestTypePage'
import NotifyingOrganisationPage from '../interested-parties/notifying-organisation/notifyingOrganisationPage'
import mockApiOrder from '../../../utils/data/ApiOrder'
import paths from '../../../../server/constants/paths'

const mockOriginalId = '00a00000-79cd-49f9-a498-b1f07c543b8a'
const mockVersionId = '22a22222-79cd-49f9-a498-b1f07c543b8a'

const stubOrder = (
  outcome: 'ACCEPTED' | 'REJECTED' | 'PROCESSING',
  status = 'SUBMITTED',
  type = 'REQUEST',
  startDate = '2000-01-01T00:00:00.000Z',
  canAmend = status === 'REJECTED' || outcome !== 'PROCESSING',
) => {
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
      canAmend,
      statusUpdates,
      monitoringConditions: { ...mockApiOrder().monitoringConditions, startDate },
    },
  })
}

const verifyReturnedOrderAmendmentFlow = (sourceType: string, startDate = '2000-01-01T00:00:00.000Z') => {
  stubOrder('REJECTED', 'REJECTED', sourceType, startDate)
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
    ;(['REQUEST', 'AMEND_ORIGINAL_REQUEST', 'VARIATION'] as const).forEach(type => {
      it(`does not show a processing lock for an editable ${type.toLowerCase()} draft`, () => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOriginalId,
          status: 'IN_PROGRESS',
          type,
          order: {
            versionId: mockVersionId,
            canAmend: false,
            statusUpdates: [],
          },
        })

        const page = Page.visit(OrderTasksPage, { orderId: mockOriginalId })

        cy.contains('button', 'Submit form').should('be.visible')
        page.makeChangesButton.should('not.exist')
        cy.contains(
          "You can't make changes to this form because it is being processed by EMS. Try again later.",
        ).should('not.exist')
      })
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

    it('does not lock an amendable submitted order without status observations', () => {
      stubOrder('PROCESSING', 'SUBMITTED', 'REQUEST', '2000-01-01T00:00:00.000Z', true)
      const page = Page.visit(OrderTasksPage, { orderId: mockOriginalId })

      cy.contains("You can't make changes to this form because it is being processed by EMS. Try again later.").should(
        'not.exist',
      )
      page.makeChangesButton.should('have.attr', 'href', `/order/${mockOriginalId}/edit`).click()
      Page.verifyOnPage(ConfirmVariationPage).confirmButton().click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOriginalId}/amend`,
        body: {},
      }).should('be.true')
      Page.verifyOnPage(OrderTasksPage)
    })

    it('keeps a rejected order locked when the API marks it as not amendable', () => {
      stubOrder('REJECTED', 'REJECTED', 'REQUEST', '2000-01-01T00:00:00.000Z', false)
      const page = Page.visit(OrderTasksPage, { orderId: mockOriginalId })

      page.makeChangesButton.should('be.disabled')
      page.makeChangesButton.should('not.have.attr', 'href')
      cy.contains("You can't make changes to this form because it is being processed by EMS. Try again later.").should(
        'be.visible',
      )

      cy.visit(`/order/${mockOriginalId}/edit`)
      Page.verifyOnPage(OrderTasksPage)
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
    ;(['ACCEPTED', 'REJECTED'] as const).forEach(outcome => {
      it(`unlocks on the first summary visit after a processing order becomes ${outcome.toLowerCase()}`, () => {
        stubOrder('PROCESSING')
        Page.visit(OrderTasksPage, { orderId: mockOriginalId }).makeChangesButton.should('be.disabled')

        stubOrder('ACCEPTED')
        cy.visit(`/order/${mockOriginalId}/edit`)
        Page.verifyOnPage(ConfirmVariationPage)
        stubOrder('PROCESSING')
        cy.get('input[name="_csrf"]')
          .invoke('val')
          .then(csrfToken => {
            cy.request({
              method: 'POST',
              url: paths.ORDER.VARIATION.replace(':orderId', mockOriginalId),
              form: true,
              body: { action: 'continue', _csrf: csrfToken },
              followRedirect: false,
            }).then(response => {
              expect(response.status).to.eq(302)
              expect(response.headers.location).to.eq(`/order/${mockOriginalId}/summary`)
            })
          })

        stubOrder(outcome, outcome === 'REJECTED' ? 'REJECTED' : 'SUBMITTED')
        const page = Page.visit(OrderTasksPage, { orderId: mockOriginalId })

        cy.contains('The status of this form has changed. Check its current status before making changes.').should(
          'be.visible',
        )
        cy.contains(
          "You can't make changes to this form because it is being processed by EMS. Try again later.",
        ).should('not.exist')
        page.makeChangesButton.should('have.attr', 'href', `/order/${mockOriginalId}/edit`).click()
        Page.verifyOnPage(ConfirmVariationPage)
      })
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

      it('uses the correction route for a rejected original request instead of the SR journey', () => {
        verifyReturnedOrderAmendmentFlow('REQUEST')
      })
      ;(['VARIATION', 'REJECTED'] as const).forEach(type => {
        it(`shows both SR screens and submits the selected type for a past-dated rejected variation (${type})`, () => {
          stubOrder('REJECTED', 'REJECTED', type)
          cy.task('stubCemoGetVersions', {
            httpStatus: 200,
            orderId: mockOriginalId,
            versions: [
              {
                orderId: mockOriginalId,
                versionId: mockOriginalId,
                versionNumber: 1,
                type: 'VARIATION',
                status: 'REJECTED',
              },
              {
                orderId: mockOriginalId,
                versionId: mockVersionId,
                versionNumber: 2,
                type,
                status: 'REJECTED',
              },
            ],
          })
          cy.task('stubCemoSubmitOrder', {
            httpStatus: 200,
            method: 'POST',
            id: mockOriginalId,
            subPath: '/amend-order',
            response: {},
          })
          cy.visit(`/order/${mockOriginalId}/edit`)
          Page.verifyOnPage(ConfirmVariationPage).confirmButton().click()

          const addressChangePage = Page.verifyOnPage(IsAddressChangePage)
          addressChangePage.form.fillInWith('No')
          addressChangePage.form.saveAndContinueButton.click()

          const reasonPage = Page.verifyOnPage(ServiceRequestTypePage)
          reasonPage.form.fillInWith('I need to change something else in the form')
          reasonPage.form.continueButton.click()

          Page.verifyOnPage(NotifyingOrganisationPage)
          cy.task('stubCemoVerifyRequestReceived', {
            uri: `/orders/${mockOriginalId}/amend-order`,
            body: { type: 'VARIATION' },
          }).should('be.true')
        })
      })

      it('bypasses SR questions for a future-dated rejected variation', () => {
        verifyReturnedOrderAmendmentFlow('VARIATION', '2999-01-01T00:00:00.000Z')
      })

      it('returns to the summary if an accepted original request becomes rejected during the SR journey', () => {
        stubOrder('ACCEPTED')
        cy.visit(`/order/${mockOriginalId}/edit`)
        Page.verifyOnPage(ConfirmVariationPage).confirmButton().click()

        const addressChangePage = Page.verifyOnPage(IsAddressChangePage)
        addressChangePage.form.fillInWith('No')
        addressChangePage.form.saveAndContinueButton.click()

        Page.verifyOnPage(ServiceRequestTypePage)
        stubOrder('REJECTED', 'REJECTED')
        cy.get('form').submit()

        Page.verifyOnPage(OrderTasksPage)
        cy.contains('The status of this form has changed. Check its current status before making changes.').should(
          'be.visible',
        )
        cy.contains(
          "You can't make changes to this form because it is being processed by EMS. Try again later.",
        ).should('not.exist')
      })

      it('amends a future-dated accepted order without showing the service-request questions', () => {
        stubOrder('ACCEPTED', 'SUBMITTED', 'REQUEST', '2999-01-01T00:00:00.000Z')
        const page = Page.visit(OrderTasksPage, { orderId: mockOriginalId })

        page.makeChangesButton.click()
        Page.verifyOnPage(ConfirmVariationPage).confirmButton().click()

        Page.verifyOnPage(OrderTasksPage)
        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOriginalId}/amend`,
          body: {},
        }).should('be.true')
      })
      ;[paths.ORDER.IS_ADDRESS_CHANGE, paths.VARIATION.SERVICE_REQUEST_TYPE].forEach(path => {
        it(`redirects a future-dated accepted order away from ${path}`, () => {
          stubOrder('ACCEPTED', 'SUBMITTED', 'REQUEST', '2999-01-01T00:00:00.000Z')

          cy.visit(path.replace(':orderId', mockOriginalId))

          Page.verifyOnPage(OrderTasksPage)
          cy.contains('The status of this form has changed. Check its current status before making changes.').should(
            'be.visible',
          )
        })
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
