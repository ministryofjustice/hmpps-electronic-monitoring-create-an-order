import { v4 as uuidv4 } from 'uuid'
import { mockApiOrder } from '../../../mockApis/cemo'
import ErrorPage from '../../../pages/error'
import CurfewConditionsPage from '../../../pages/order/monitoring-conditions/curfew-conditions'
import Page from '../../../pages/page'
import CurfewReleaseDatePage from '../../../pages/order/monitoring-conditions/curfew-release-date'

const mockOrderId = uuidv4()

const mockSubmittedCurfewConditions = {
  ...mockApiOrder('SUBMITTED'),

  curfewConditions: {
    startDate: '2025-03-27T00:00:00.000Z',
    orderId: mockOrderId,
    endDate: '2026-04-28T00:00:00.000Z',
    curfewAdditionalDetails: '',
  },
  id: mockOrderId,
}

const mockInProgressCurfewConditions = {
  ...mockSubmittedCurfewConditions,
  status: 'IN_PROGRESS',
}

const mockEmptyCurfewConditions = {
  ...mockApiOrder('SUBMITTED'),
  curfewConditions: {
    orderId: mockOrderId,
    startDate: null,
    endDate: null,
    curfewAdditionalDetails: null,
  },
  id: mockOrderId,
  status: 'IN_PROGRESS',
}

const checkFormFields = () => {
  cy.get('#startDate-day').should('have.value', '27')
  cy.get('#startDate-month').should('have.value', '03')
  cy.get('#startDate-year').should('have.value', '2025')
  cy.get('#endDate-day').should('have.value', '28')
  cy.get('#endDate-month').should('have.value', '04')
  cy.get('#endDate-year').should('have.value', '2026')
}

context('Curfew conditions', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoListOrders')
  })
  context('Draft order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
    })

    it('Should display the form', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/conditions`)
      const page = Page.verifyOnPage(CurfewConditionsPage)
      page.header.userName().should('contain.text', 'J. Smith')
      page.form.startDateField.shouldExist()
      page.form.endDateField.shouldExist()
      page.errorSummary.shouldNotExist()
    })
  })

  context('Submitted Order', () => {
    it('Should correctly display the submitted data in disabled fields', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: mockSubmittedCurfewConditions,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/conditions`)
      const page = Page.verifyOnPage(CurfewConditionsPage)
      page.submittedBanner.should('contain', 'You are viewing a submitted order.')
      cy.get('input[type="text"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      checkFormFields()
      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAsDraftButton.should('not.exist')
      page.errorSummary.shouldNotExist()
    })
  })

  context('Unsubmitted Order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockInProgressCurfewConditions,
      })
    })

    it('Should correctly display the unsubmitted data in enabled fields', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/conditions`)
      const page = Page.verifyOnPage(CurfewConditionsPage)
      cy.root().should('not.contain', 'You are viewing a submitted order.')
      cy.get('input[type="text"]').each($el => {
        cy.wrap($el).should('not.be.disabled')
      })
      checkFormFields()
      page.form.saveAndContinueButton.should('exist')
      page.form.saveAsDraftButton.should('exist')
      page.errorSummary.shouldNotExist()
    })
  })

  context('Submitting the form', () => {
    mockEmptyCurfewConditions.monitoringConditions.curfew = true
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockEmptyCurfewConditions,
      })
    })

    context('Submitting an invalid order', () => {
      it('should show errors with an empty form submission', () => {
        cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/conditions`)
        const page = Page.verifyOnPage(CurfewConditionsPage)
        page.form.saveAndContinueButton.click()
        cy.get('#startDate-error').should('contain', 'Enter start date for curfew monitoring')
        cy.get('#endDate-error').should('contain', 'Enter end date for curfew monitoring')
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Enter start date for curfew monitoring')
        page.errorSummary.shouldHaveError('Enter end date for curfew monitoring')
        page.errorSummary.verifyErrorSummary([
          'Enter start date for curfew monitoring',
          'Enter end date for curfew monitoring',
        ])
      })

      it('should show an error when startDate is provided in the wrong format', () => {
        cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/conditions`)
        const page = Page.verifyOnPage(CurfewConditionsPage)
        cy.get('#startDate-year').type('text')
        page.form.saveAndContinueButton.click()
        cy.get('#startDate-error').should('contain', 'Year must include 4 numbers')
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Year must include 4 numbers')
      })

      it('should show an error when endDate is provided in the wrong format', () => {
        cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/conditions`)
        const page = Page.verifyOnPage(CurfewConditionsPage)
        cy.get('#endDate-year').type('text')
        page.form.saveAndContinueButton.click()
        cy.get('#endDate-error').should('contain', 'Year must include 4 numbers')
        page.errorSummary.shouldExist()
        page.errorSummary.shouldHaveError('Year must include 4 numbers')
      })
    })

    it('should correctly submit the data to the CEMO API and move to the next selected page', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/monitoring-conditions-curfew-conditions',
        response: mockEmptyCurfewConditions.curfewConditions,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/conditions`)
      const page = Page.verifyOnPage(CurfewConditionsPage)
      page.fillInForm()
      page.form.saveAndContinueButton.click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions-curfew-conditions`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          startDate: '2025-03-27T00:00:00.000Z',
          endDate: '2026-04-28T22:59:00.000Z',
        })
      })
      Page.verifyOnPage(CurfewReleaseDatePage)
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/conditions`, {
        failOnStatusCode: false,
      })

      Page.verifyOnPage(ErrorPage, 'Page not found')
    })
  })
})
