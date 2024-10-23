import { v4 as uuidv4 } from 'uuid'
import { mockApiOrder } from '../../../mockApis/cemo'
import ErrorPage from '../../../pages/error'
import CurfewConditionsPage from '../../../pages/order/curfewConditions'
import CurfewTimetablePage from '../../../pages/order/curfewTimetable'
import Page from '../../../pages/page'

const mockOrderId = uuidv4()

const mockSubmittedCurfewConditions = {
  ...mockApiOrder('SUBMITTED'),
  curfewConditions: {
    curfewAddress: 'SECONDARY,TERTIARY',
    startDate: '2025-03-27T00:00:00.000Z',
    orderId: mockOrderId,
    endDate: '2026-04-28T00:00:00.000Z',
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
    curfewAddress: null,
    orderId: mockOrderId,
    startDate: null,
    endDate: null,
  },
  status: 'IN_PROGRESS',
}

const checkFormFields = () => {
  cy.get('#startDate-day').should('have.value', '27')
  cy.get('#startDate-month').should('have.value', '3')
  cy.get('#startDate-year').should('have.value', '2025')
  cy.get('#endDate-day').should('have.value', '28')
  cy.get('#endDate-month').should('have.value', '4')
  cy.get('#endDate-year').should('have.value', '2026')
  cy.get('input[type="checkbox"][value="SECONDARY"]').should('be.checked')
  cy.get('input[type="checkbox"][value="TERTIARY"]').should('be.checked')
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
      page.subHeader().should('contain.text', 'Curfew with electronic monitoring')
      page.header.userName().should('contain.text', 'J. Smith')
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
      page.submittedBanner().should('contain', 'You are viewing a submitted order.')
      cy.get('input[type="checkbox"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      cy.get('input[type="text"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      checkFormFields()
      page.saveAndContinueButton().should('not.exist')
      page.saveAndReturnButton().should('not.exist')
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
      cy.get('input[type="checkbox"]').each($el => {
        cy.wrap($el).should('not.be.disabled')
      })
      checkFormFields()
      page.saveAndContinueButton().should('exist')
      page.saveAndReturnButton().should('exist')
    })
  })

  context.skip('Submitting the form', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockEmptyCurfewConditions,
      })
    })

    it('should show errors with an empty form submission', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 400,
        id: mockOrderId,
        subPath: '/monitoring-conditions-curfew-conditions',
        response: [
          { field: 'startDate', error: 'You must enter a valid date' },
          { field: 'endDate', error: 'You must enter a valid date' },
          { field: 'curfewAddress', error: 'You must select a valid address' },
        ],
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/conditions`)
      const page = Page.verifyOnPage(CurfewConditionsPage)
      page.saveAndContinueButton().click()
      cy.get('#startDate-error').should('contain', 'You must enter a valid date')
      cy.get('#endDate-error').should('contain', 'You must enter a valid date')
      cy.get('#addresses-error').should('contain', 'You must select a valid address')
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
      page.saveAndContinueButton().click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions-curfew-conditions`).then(requests => {
        expect(requests).to.have.lengthOf(1)
        expect(requests[0]).to.deep.equal({
          curfewAddress: 'SECONDARY,TERTIARY',
          orderId: mockOrderId,
          startDate: '2025-03-27T00:00:00.000Z',
          endDate: '2026-04-28T00:00:00.000Z',
        })
      })
      const nextPage = Page.verifyOnPage(CurfewTimetablePage)
      nextPage.subHeader().should('contain.text', 'Timetable for curfew with electronic monitoring')
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

      Page.verifyOnPage(ErrorPage, 'Not Found')
    })
  })
})
