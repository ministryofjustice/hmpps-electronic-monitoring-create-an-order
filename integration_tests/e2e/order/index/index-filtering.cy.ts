import { v4 as uuidv4 } from 'uuid'
import IndexPage from '../../../pages/index'
import Page from '../../../pages/page'

const mockOrderId = uuidv4()

context('Index', () => {
  context('Filtering the order list', () => {
    const signInWithCohort = (cohort: Record<string, string>, userId: string) => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId,
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: cohort,
      })
      cy.signIn()
    }

    const prisonCohort = { cohort: 'PRISON', activeCaseLoadName: 'HMP ABC' }
    const crownCourt = { cohort: 'COURT', activeCaseLoadName: 'HMP Court' }

    beforeEach(() => {
      cy.task('reset')
      cy.task('stubCemoListOrders')
    })

    it('Should show the view filter with all options for prison users', () => {
      signInWithCohort(prisonCohort, '223456780')

      const page = Page.visit(IndexPage)

      page.viewFilter.should('exist')
      page.viewFilter.find('option').should('have.length', 3)
      page.viewFilter.find('option:selected').should('have.text', 'My drafts')
      page.viewFilter.find('option').eq(1).should('have.text', 'My failed to submit')
      page.viewFilter.find('option').eq(2).should('have.text', 'My prison drafts')
      page.viewFilterButton.should('exist')
      page.checkIsAccessible()
    })

    it('Should not show the view filter for probation users', () => {
      signInWithCohort({ cohort: 'PROBATION' }, '223456782')

      const page = Page.visit(IndexPage)

      page.viewFilter.should('not.exist')
      page.viewFilterButton.should('not.exist')
    })

    it('Should reload the order list with the selected view', () => {
      signInWithCohort(prisonCohort, '223456783')

      const page = Page.visit(IndexPage)

      page.viewFilter.select('My failed to submit')
      page.viewFilterButton.click()

      cy.url().should('include', 'view=FAILED_ORDERS')
      Page.verifyOnPage(IndexPage)
      page.viewFilter.find('option:selected').should('have.text', 'My failed to submit')
    })

    it('Should show the start date column for prison users', () => {
      signInWithCohort(prisonCohort, '223456784')

      const page = Page.visit(IndexPage)

      page.orderListHeaders.eq(1).should('contain.text', 'Start date')
      page.orders.eq(0).should('contain.text', '29/9/2026')
      page.orders.eq(1).should('contain.text', '29/9/2026')
      page.orders.eq(2).should('contain.text', '30/9/2026')
    })

    it('Should show the start date column for other users such as court', () => {
      signInWithCohort(crownCourt, '223456785')

      const page = Page.visit(IndexPage)

      page.orderListHeaders.eq(1).should('contain.text', 'Start date')
      page.orders.eq(0).should('contain.text', '29/9/2026')
      page.orders.eq(1).should('contain.text', '29/9/2026')
      page.orders.eq(2).should('contain.text', '30/9/2026')
    })

    it('Orders with no start dates shown last', () => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.signIn()

      const mockOrderId1 = uuidv4()
      const mockOrderId2 = uuidv4()
      const mockOrderId3 = uuidv4()

      cy.task('stubCemoListOrders', {
        httpStatus: 200,
        orders: [
          {
            id: mockOrderId2,
            versionId: uuidv4(),
            status: 'ERROR',
            type: 'REQUEST',
            firstName: 'John',
            lastName: 'Black',
            notifyingOrganisation: null,
            monitoringConditions: {
              startDate: '',
            },
            lastUpdatedBy: 'CEMO.USER',
            lastUpdatedDateTime: '2024-03-10T11:30:00.000Z',
          },
          {
            id: mockOrderId1,
            versionId: uuidv4(),
            status: 'IN_PROGRESS',
            type: 'REQUEST',
            firstName: 'Adam',
            lastName: 'Doe',
            notifyingOrganisation: 'PRISON',
            monitoringConditions: {
              startDate: '2027-03-01T11:30:00.000Z',
            },
            lastUpdatedBy: 'CEMO.USER',
            lastUpdatedDateTime: '2024-03-10T11:30:00.000Z',
          },
          {
            id: mockOrderId3,
            versionId: uuidv4(),
            status: 'IN_PROGRESS',
            type: 'VARIATION',
            firstName: 'Luke',
            lastName: 'Doe',
            notifyingOrganisation: 'PRISON',
            lastUpdatedBy: 'CEMO.USER',
            lastUpdatedDateTime: '2024-03-10T11:30:00.000Z',
          },
        ],
      })

      const page = Page.visit(IndexPage)

      page.orderListHeaders.eq(1).should('contain.text', 'Start date')
      page.orders.eq(0).contains('Adam Doe')
      page.orders.eq(1).contains('John Black')
      page.orders.eq(2).contains('Luke Doe')
    })

    it('Should show the last updated columns for prison users', () => {
      signInWithCohort(prisonCohort, '223456786')

      const page = Page.visit(IndexPage)

      page.orderListHeaders.should('have.length', 5)
      page.orderListHeaders.eq(0).should('contain.text', 'Name')
      page.orderListHeaders.eq(2).should('contain.text', 'Last updated')
      page.orderListHeaders.eq(3).should('contain.text', 'Updated by')
      page.orderListHeaders.eq(4).should('contain.text', 'Status')
    })

    it('Should not show the last updated columns for probation users', () => {
      signInWithCohort({ cohort: 'PROBATION' }, '223456787')

      const page = Page.visit(IndexPage)

      page.orderListHeaders.should('have.length', 3)
      page.orderListHeaders.eq(0).should('contain.text', 'Name')
      page.orderListHeaders.eq(1).should('contain.text', 'Start date')
      page.orderListHeaders.eq(2).should('contain.text', 'Status')
    })

    it('Should ignore a requested view for users who cannot filter', () => {
      signInWithCohort({ cohort: 'PROBATION' }, '223456788')

      cy.visit('/?view=PRISON_ORDERS')

      const page = Page.verifyOnPage(IndexPage)
      page.viewFilter.should('not.exist')
      page.ordersList.should('exist')
    })
  })
})
