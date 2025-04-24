import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import CheckYourAnswers from '../../../pages/order/monitoring-conditions/check-your-answers'
import CheckYourAnswersSubmitted from '../../../pages/order/monitoring-conditions/check-your-answers-submitted'

const mockOrderId = uuidv4()

context('Check your answers', () => {
  context('Application in progress', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          monitoringConditions: {
            startDate: '2025-01-01T00:00:00Z',
            endDate: '2025-02-01T00:00:00Z',
            orderType: 'CIVIL',
            curfew: true,
            exclusionZone: true,
            trail: true,
            mandatoryAttendance: true,
            alcohol: true,
            conditionType: 'BAIL_ORDER',
            orderTypeDescription: 'DAPO',
            sentenceType: 'IPP',
            issp: 'YES',
            hdc: 'NO',
            prarr: 'UNKNOWN',
          },
        },
      })

      cy.signIn()
    })

    it('shows answers for checking', () => {
      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId })

      page.monitoringConditionsSection().should('exist')
      page.installationAddressSection().should('exist')
      page.curfewOnDayOfReleaseSection().should('exist')
      page.curfewSection().should('exist')
      page.curfewTimetableSection().should('exist')
      page.trailMonitoringConditionsSection().should('exist')
      page.alcoholMonitoringConditionsSection().should('exist')
    })

    it('shows correct buttons', () => {
      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId })

      page.continueButton().should('exist')
      page.returnButton().should('exist')
    })
  })

  context('Application status is submitted', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.signIn()

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          monitoringConditions: {
            startDate: '2025-01-01T00:00:00Z',
            endDate: '2025-02-01T00:00:00Z',
            orderType: 'CIVIL',
            curfew: true,
            exclusionZone: true,
            trail: true,
            mandatoryAttendance: true,
            alcohol: true,
            conditionType: 'BAIL_ORDER',
            orderTypeDescription: 'DAPO',
            sentenceType: 'IPP',
            issp: 'YES',
            hdc: 'NO',
            prarr: 'UNKNOWN',
          },
        },
      })
    })

    it('shows correct banner', () => {
      const page = Page.visit(CheckYourAnswersSubmitted, { orderId: mockOrderId })

      page.banner.contains('You are viewing a submitted form. This form was submitted on the 14 December 2024.')
    })

    it('shows electronic monitoring caption', () => {
      const page = Page.visit(CheckYourAnswersSubmitted, { orderId: mockOrderId })

      page.caption.contains('Electronic monitoring required')
    })

    it('shows view answers heading', () => {
      const page = Page.visit(CheckYourAnswersSubmitted, { orderId: mockOrderId })

      page.heading.contains('View answers')
    })

    it('shows answers for checking', () => {
      const page = Page.visit(CheckYourAnswersSubmitted, { orderId: mockOrderId })

      page.monitoringConditionsSection().should('exist')
      page.installationAddressSection().should('exist')
      page.curfewOnDayOfReleaseSection().should('exist')
      page.curfewSection().should('exist')
      page.curfewTimetableSection().should('exist')
      page.trailMonitoringConditionsSection().should('exist')
      page.alcoholMonitoringConditionsSection().should('exist')
    })

    it('does not show "change" links', () => {
      const page = Page.visit(CheckYourAnswersSubmitted, { orderId: mockOrderId })

      page.changeLinks.should('not.exist')
    })

    it('shows correct buttons', () => {
      const page = Page.visit(CheckYourAnswersSubmitted, { orderId: mockOrderId })

      page.continueButton().should('exist')
      page.continueButton().contains('Go to next section')
      page.returnButton().should('exist')
      page.returnButton().contains('Return to main form menu')
    })
  })
})
