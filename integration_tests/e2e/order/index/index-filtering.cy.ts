import { v4 as uuidv4 } from 'uuid'
import IndexPage from '../../../pages/index'
import Page from '../../../pages/page'

const mockOrderId = uuidv4()

context('Index', () => {
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
  context('Filtering the order list', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubCemoListOrders')
    })

    it('Should show the view filter with all options for prison users', () => {
      signInWithCohort(prisonCohort, '223456780')

      const page = Page.visit(IndexPage)

      page.viewFilter.should('exist')
      const options = page.viewFilter.find('option')
      options.should('have.length', 3)
      options.then($options => {
        const optionElements = $options.toArray() as HTMLOptionElement[]
        expect(optionElements.map(option => option.value)).to.deep.equal([
          'MY_ORDERS',
          'FAILED_ORDERS',
          'PRISON_ORDERS',
        ])
        expect(optionElements.map(option => option.textContent?.trim())).to.deep.equal([
          'My drafts',
          'My failed to submit',
          `My prison's forms`,
        ])
      })
      page.viewFilter.should('have.value', 'MY_ORDERS')
      page.viewFilterButton.should('exist')
      page.checkIsAccessible()
    })

    it('Should show only Home Office views for Home Office users', () => {
      signInWithCohort({ cohort: 'HOME_OFFICE' }, '223456786')

      const page = Page.visit(IndexPage)

      const options = page.viewFilter.find('option')
      options.should('have.length', 3)
      options.then($options => {
        const optionElements = $options.toArray() as HTMLOptionElement[]
        expect(optionElements.map(option => option.value)).to.deep.equal([
          'MY_ORDERS',
          'FAILED_ORDERS',
          'HOME_OFFICE_ORDERS',
        ])
        expect(optionElements.map(option => option.textContent?.trim())).to.deep.equal([
          'My drafts',
          'My failed to submit',
          'Home Office forms',
        ])
      })

      page.viewFilter.select('HOME_OFFICE_ORDERS')
      page.viewFilterButton.click()

      cy.url().should('include', 'view=HOME_OFFICE_ORDERS')
      page.viewFilter.should('have.value', 'HOME_OFFICE_ORDERS')
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
  })

  context('No orders found', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubCemoListOrders', { httpStatus: 200, orders: [] })
    })

    it('It should show the empty list message for my orders when no my draft forms exist', () => {
      signInWithCohort(prisonCohort, '223456784')
      Page.visit(IndexPage)
      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.ordersList.get('.govuk-table__body').should('not.exist')
      cy.contains('You have no draft forms').should('exist')
    })

    it('It should show the empty list message for failed orders when no my failed forms exist', () => {
      signInWithCohort(prisonCohort, '223456784')
      const page = Page.visit(IndexPage)

      page.viewFilter.select('My failed to submit')
      page.viewFilterButton.click()
      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.ordersList.get('.govuk-table__body').should('not.exist')
      cy.contains('You have no failed to submit forms').should('exist')
    })

    it('It should show the empty list message for prison orders when no draft forms exist', () => {
      signInWithCohort(prisonCohort, '223456784')
      const page = Page.visit(IndexPage)

      page.viewFilter.select('My prison drafts')
      page.viewFilterButton.click()
      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.ordersList.get('.govuk-table__body').should('not.exist')
      cy.contains('Your prison has no draft forms').should('exist')
    })

    it('It should show the empty list message for home office orders when no draft forms exist', () => {
      signInWithCohort({ cohort: 'HOME_OFFICE', activeCaseLoadName: 'HMP Court' }, '223456784')
      const page = Page.visit(IndexPage)

      page.viewFilter.select('Home Office forms')
      page.viewFilterButton.click()
      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.ordersList.get('.govuk-table__body').should('not.exist')
      cy.contains('Your team has no draft forms').should('exist')
    })
  })
})
