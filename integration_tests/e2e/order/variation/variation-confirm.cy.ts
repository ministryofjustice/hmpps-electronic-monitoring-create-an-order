import Page from '../../../pages/page'
import ConfirmVariationPage from '../../../pages/order/variation/confirmVariation'
import OrderTasksPage from '../../../pages/order/summary'
import IsRejectionPage from '../edit-order/is-rejection/isRejectionPage'

const mockOriginalId = '00a00000-79cd-49f9-a498-b1f07c543b8a'
const mockVariationId = '11a11111-79cd-49f9-a498-b1f07c543b8a'
const variationPath = '/copy-as-variation'

const stubVariationOrder = (fmsResultDate: Date, startDate: Date) => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOriginalId,
    status: 'IN_PROGRESS',
    type: 'VARIATION',
    order: {
      monitoringConditions: {
        startDate,
        endDate: '2025-02-01T00:00:00Z',
        orderType: 'CIVIL',
        curfew: true,
        exclusionZone: true,
        trail: true,
        mandatoryAttendance: true,
        alcohol: true,
        conditionType: 'BAIL_ORDER',
        orderTypeDescription: '',
        sentenceType: 'IPP',
        issp: 'YES',
        hdc: 'NO',
        prarr: 'UNKNOWN',
        pilot: 'GPS_ACQUISITIVE_CRIME_PAROLE',
        offenceType: '',
      },
      fmsResultDate,
    },
  })
}
context('Variation', () => {
  context('Creating a variation from an existing order', () => {
    context('Confirm Variation page', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', {
          name: 'john smith',
          roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        })
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOriginalId,
          status: 'SUBMITTED',
        })
        cy.task('stubCemoCreateVariation', {
          httpStatus: 200,
          originalId: mockOriginalId,
          variationId: mockVariationId,
        })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          method: 'POST',
          id: mockOriginalId,
          subPath: variationPath,
          response: [{}],
        })
        cy.signIn()
      })

      it('Should display the page', () => {
        cy.visit(`/order/${mockOriginalId}/edit`)

        const page = Page.verifyOnPage(ConfirmVariationPage)
        page.header.userName().should('contain.text', 'J. Smith')
      })

      it('should have a button to cancel and return to the form task list', () => {
        cy.visit(`/order/${mockOriginalId}/edit`)
        const page = Page.verifyOnPage(ConfirmVariationPage)

        page.cancelButton().should('exist')

        page.cancelButton().click()

        Page.verifyOnPage(OrderTasksPage)
      })

      it('should have a button to confirm and proceed to the is rejection page', () => {
        cy.visit(`/order/${mockOriginalId}/edit`)
        const page = Page.verifyOnPage(ConfirmVariationPage)
        const fmsResultDate = new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)) // 32 days before today
        const startDate = new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)) // 33 days before today
        stubVariationOrder(fmsResultDate, startDate)

        page.confirmButton().should('exist')

        page.confirmButton().click()

        Page.verifyOnPage(IsRejectionPage)
      })

      it('should proceed to the order tasks page when fms result date after start date and current date is after one month of fms result date', () => {
        cy.visit(`/order/${mockOriginalId}/edit`)
        const page = Page.verifyOnPage(ConfirmVariationPage)

        const fmsResultDate = new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 32).setHours(0, 0, 0, 0)) // 32 days before today
        const startDate = new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).setHours(0, 0, 0, 0)) // 33 days before today
        stubVariationOrder(fmsResultDate, startDate)

        page.confirmButton().should('exist')

        page.confirmButton().click()

        Page.verifyOnPage(OrderTasksPage)
      })

      it('should proceed to the is rejection page when fms result date after start date and current date is within one month of fms result date', () => {
        cy.visit(`/order/${mockOriginalId}/edit`)
        const page = Page.verifyOnPage(ConfirmVariationPage)

        const fmsResultDate = new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).setHours(0, 0, 0, 0)) // 14 days before today
        const startDate = new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)) // 15 days before today
        stubVariationOrder(fmsResultDate, startDate)
        page.confirmButton().should('exist')

        page.confirmButton().click()

        Page.verifyOnPage(IsRejectionPage)
      })

      it('should proceed to the order tasks page when fms result date before start date and current date is after one month of fms result date', () => {
        cy.visit(`/order/${mockOriginalId}/edit`)
        const page = Page.verifyOnPage(ConfirmVariationPage)

        const fmsResultDate = new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 33).setHours(0, 0, 0, 0)) // 33 days before today
        const startDate = new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 32).setHours(0, 0, 0, 0)) // 32 days before today
        stubVariationOrder(fmsResultDate, startDate)
        page.confirmButton().should('exist')

        page.confirmButton().click()

        Page.verifyOnPage(OrderTasksPage)
      })

      it('should proceed to the is rejection page when fms result date after start date and current date is within one month of fms result date', () => {
        cy.visit(`/order/${mockOriginalId}/edit`)
        const page = Page.verifyOnPage(ConfirmVariationPage)
        const fmsResultDate = new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).setHours(0, 0, 0, 0)) // 16 days before today
        const startDate = new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)) // 15 days before today
        stubVariationOrder(fmsResultDate, startDate)
        page.confirmButton().should('exist')

        page.confirmButton().click()

        Page.verifyOnPage(IsRejectionPage)
      })
    })
  })
})
