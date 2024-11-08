import { v4 as uuidv4 } from 'uuid'
import { mockApiOrder } from '../../../mockApis/cemo'
import { NotFoundErrorPage } from '../../../pages/error'
import CurfewConditionsPage from '../../../pages/order/monitoring-conditions/curfew-conditions'
import CurfewReleaseDatePage from '../../../pages/order/monitoring-conditions/curfew-release-date'
import Page from '../../../pages/page'

const mockOrderId = uuidv4()

const mockSubmittedCurfewReleaseDate = {
  ...mockApiOrder('SUBMITTED'),
  curfewReleaseDateConditions: {
    curfewAddress: 'SECONDARY',
    releaseDate: '2026-03-27T00:00:00.000Z',
    orderId: mockOrderId,
    startTime: '09:15:00',
    endTime: '17:30:00',
  },
  id: mockOrderId,
}

const mockInProgressCurfewReleaseDate = {
  ...mockSubmittedCurfewReleaseDate,
  status: 'IN_PROGRESS',
}

const mockEmptyCurfewReleaseDate = {
  ...mockApiOrder('SUBMITTED'),
  monitoringConditions: {
    orderType: null,
    acquisitiveCrime: null,
    dapol: null,
    curfew: true,
    exclusionZone: null,
    trail: null,
    mandatoryAttendance: null,
    alcohol: null,
    orderTypeDescription: null,
    conditionType: null,
    startDate: null,
    endDate: null,
  },
  curfewReleaseDateConditions: {
    curfewAddress: null,
    releaseDate: null,
    orderId: mockOrderId,
    startTime: null,
    endTime: null,
  },
  status: 'IN_PROGRESS',
  id: mockOrderId,
}

const checkFormFields = () => {
  cy.get('#releaseDateDay').should('have.value', '27')
  cy.get('#releaseDateMonth').should('have.value', '3')
  cy.get('#releaseDateYear').should('have.value', '2026')
  cy.get('#curfewTimes-start-hours').should('have.value', '09')
  cy.get('#curfewTimes-start-minutes').should('have.value', '15')
  cy.get('#curfewTimes-end-hours').should('have.value', '17')
  cy.get('#curfewTimes-end-minutes').should('have.value', '30')
  cy.get('input[type="radio"][value="SECONDARY"]').should('be.checked')
}

context('Curfew monitoring - release date', () => {
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
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/release-date`)
      const page = Page.verifyOnPage(CurfewReleaseDatePage)
      page.header.userName().should('contain.text', 'J. Smith')
    })
  })

  context('Submitted Order', () => {
    it('Should correctly display the submitted data in disabled fields', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: mockSubmittedCurfewReleaseDate,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/release-date`)
      const page = Page.verifyOnPage(CurfewReleaseDatePage)
      page.submittedBanner.should('contain', 'You are viewing a submitted order.')
      cy.get('input[type="radio"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      cy.get('input[type="text"]').each($el => {
        cy.wrap($el).should('be.disabled')
      })
      checkFormFields()
      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAndReturnButton.should('not.exist')
    })
  })

  context('Unsubmitted Order', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockInProgressCurfewReleaseDate,
      })
    })

    it('Should correctly display the unsubmitted data in enabled fields', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/release-date`)
      const page = Page.verifyOnPage(CurfewReleaseDatePage)
      cy.root().should('not.contain', 'You are viewing a submitted order.')
      cy.get('input[type="text"]').each($el => {
        cy.wrap($el).should('not.be.disabled')
      })
      cy.get('input[type="number"]').each($el => {
        cy.wrap($el).should('not.be.disabled')
      })
      checkFormFields()
      page.form.saveAndContinueButton.should('exist')
      page.form.saveAndReturnButton.should('exist')
    })
  })

  context('Submitting the form', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockEmptyCurfewReleaseDate,
      })
    })

    context('Submitting an invalid order', () => {
      it('should show errors with an empty form submission', () => {
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 400,
          id: mockOrderId,
          subPath: '/monitoring-conditions-curfew-release-date',
          response: [
            { field: 'releaseDate', error: 'You must enter a valid date' },
            { field: 'startTime', error: 'You must enter a valid start time' },
            { field: 'endTime', error: 'You must enter a valid end time' },
            { field: 'curfewAddress', error: 'You must enter a valid address' },
          ],
        })
        cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/release-date`)
        const page = Page.verifyOnPage(CurfewReleaseDatePage)
        page.form.saveAndContinueButton.click()
        cy.get('#releaseDate-error').should('contain', 'You must enter a valid date')
        cy.get('#curfewTimes-error').should(
          'contain',
          'You must enter a valid start time, You must enter a valid end time',
        )
        cy.get('#address-error').should('contain', 'You must enter a valid address')
      })

      it('should show an error when releaseDate is provided in the wrong format', () => {
        cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/release-date`)
        const page = Page.verifyOnPage(CurfewReleaseDatePage)
        cy.get('#releaseDateDay').type('text')
        page.form.saveAndContinueButton.click()
        cy.get('#releaseDate-error').should(
          'contain',
          'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2024.',
        )
      })
    })

    it('should correctly submit the data to the CEMO API and move to the next selected page', () => {
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/monitoring-conditions-curfew-release-date',
        response: mockEmptyCurfewReleaseDate.curfewReleaseDateConditions,
      })
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew/release-date`)
      const page = Page.verifyOnPage(CurfewReleaseDatePage)
      page.fillInForm()
      page.form.saveAndContinueButton.click()
      cy.task('getStubbedRequest', `/orders/${mockOrderId}/monitoring-conditions-curfew-release-date`).then(
        requests => {
          expect(requests).to.have.lengthOf(1)
          expect(requests[0]).to.deep.equal({
            releaseDate: '2024-03-27T00:00:00.000Z',
            startTime: '18:15:00',
            orderId: mockOrderId,
            endTime: '19:30:00',
            curfewAddress: 'SECONDARY',
          })
        },
      )
      Page.verifyOnPage(CurfewConditionsPage)
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/monitoring-conditions/curfew-day-of-release`, {
        failOnStatusCode: false,
      })

      Page.verifyOnPage(NotFoundErrorPage)
    })
  })
})
