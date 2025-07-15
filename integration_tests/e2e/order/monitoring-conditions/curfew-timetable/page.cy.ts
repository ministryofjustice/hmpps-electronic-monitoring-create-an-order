import { v4 as uuidv4 } from 'uuid'
import { NotFoundErrorPage } from '../../../../pages/error'
import CurfewTimetablePage from '../../../../pages/order/monitoring-conditions/curfew-timetable'
import Page from '../../../../pages/page'

const mockOrderId = uuidv4()
const pagePath = '/monitoring-conditions/curfew/timetable'

context('Monitoring conditions - Curfew timetable', () => {
  context('Viewing a draft timetable', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')

      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    it('Should display contents', () => {
      const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')
      page.submittedBanner.should('not.exist')

      page.form.saveAndContinueButton.should('exist')
      page.form.saveAsDraftButton.should('exist')
      page.backButton.should('exist').should('have.attr', 'href', '#')

      page.form.shouldBeDisplayed()
      page.form.shouldBeEmpty()

      page.checkIsAccessible()
    })
  })

  context('Viewing a partially complete timetable', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          curfewTimeTable: [
            {
              orderId: '0',
              dayOfWeek: 'WEDNESDAY',
              startTime: '19:00:00',
              endTime: '23:59:00',
              curfewAddress: 'PRIMARY_ADDRESS,SECONDARY_ADDRESS',
            },
            {
              orderId: '0',
              dayOfWeek: 'FRIDAY',
              startTime: '00:00:00',
              endTime: '07:00:00',
              curfewAddress: 'TERTIARY_ADDRESS',
            },
          ],
        },
      })

      cy.signIn()
    })

    it('Should not indicate to the user that this is a submitted order', () => {
      const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })
      page.submittedBanner.should('not.exist')
    })

    it('Should allow the user to update the curfew timetable details', () => {
      const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

      page.form.saveAndContinueButton.should('exist')
      page.form.saveAsDraftButton.should('exist')
      page.backButton.should('exist').should('have.attr', 'href', '#')
    })

    it('Should display the timetable form', () => {
      const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

      page.form.shouldHaveEntries([
        {
          day: 'Wednesday',
          startTime: '19:00:00',
          endTime: '23:59:00',
          addresses: [/Main address/, /Second address/],
        },
        {
          day: 'Friday',
          startTime: '00:00:00',
          endTime: '07:00:00',
          addresses: [/Third address/],
        },
      ])

      page.form.shouldBeEmpty(['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
    })

    it('Should be accessible', () => {
      const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })
  })

  context('Viewing a previously submitted timetable', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          curfewTimeTable: [
            {
              orderId: '0',
              dayOfWeek: 'MONDAY',
              startTime: '19:00:00',
              endTime: '23:59:00',
              curfewAddress: 'TERTIARY_ADDRESS',
            },
            {
              orderId: '0',
              dayOfWeek: 'TUESDAY',
              startTime: '00:00:00',
              endTime: '07:00:00',
              curfewAddress: 'PRIMARY_ADDRESS,SECONDARY_ADDRESS',
            },
          ],
        },
      })

      cy.signIn()
    })

    it('Should indicate to the user that this is a submitted order', () => {
      const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

      page.submittedBanner.should('contain', 'You are viewing a submitted order.')
    })

    it('Should correctly display the submitted data in disabled fields', () => {
      const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

      page.form.shouldHaveEntries([
        {
          day: 'MONDAY',
          startTime: '19:00:00',
          endTime: '23:59:00',
          addresses: [/Third address/],
        },
        {
          day: 'TUESDAY',
          startTime: '00:00:00',
          endTime: '07:00:00',
          addresses: [/Main address/, /Second address/],
        },
      ])
    })

    it('Should not allow the user to update the curfew timetable details', () => {
      const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })

      // Verify the correct buttons are displayed
      page.form.saveAndContinueButton.should('not.exist')
      page.form.saveAsDraftButton.should('not.exist')
      page.backButton.should('exist').should('have.attr', 'href', '#')

      // Verify all form elements are disabled
      page.form.shouldBeDisabled()
    })

    it('Should be accessible', () => {
      const page = Page.visit(CurfewTimetablePage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })
  })

  context('When the service has an unhealthy backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}${pagePath}`, { failOnStatusCode: false })

      Page.verifyOnPage(NotFoundErrorPage)
    })
  })
})
