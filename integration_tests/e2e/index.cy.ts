import { v4 as uuidv4 } from 'uuid'
import IndexPage from '../pages/index'
import Page from '../pages/page'
import SearchPage from '../pages/search'
import NotifyingOrganisationPage from './order/interested-parties/notifying-organisation/notifyingOrganisationPage'
import paths from '../../server/constants/paths'

const mockOrderId = uuidv4()

context('Index', () => {
  context('Viewing the order list', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.signIn()
    })

    it('Should render the correct elements ', () => {
      const mockOrderId1 = uuidv4()
      const mockOrderId2 = uuidv4()
      const mockOrderId3 = uuidv4()
      cy.task('stubCemoListOrders', {
        httpStatus: 200,
        orders: [
          {
            id: mockOrderId1,
            versionId: uuidv4(),
            status: 'IN_PROGRESS',
            type: 'REQUEST',
            firstName: 'test',
            lastName: 'user1',
            notifyingOrganisation: 'PRISON',
            lastUpdatedBy: 'CEMO.USER',
            lastUpdatedDateTime: '2024-03-10T11:30:00.000Z',
          },
          {
            id: mockOrderId2,
            versionId: uuidv4(),
            status: 'ERROR',
            type: 'REQUEST',
            firstName: 'Failed',
            lastName: 'user2',
            notifyingOrganisation: null,
            lastUpdatedBy: 'CEMO.USER',
            lastUpdatedDateTime: '2024-03-10T11:30:00.000Z',
          },
          {
            id: mockOrderId3,
            versionId: uuidv4(),
            status: 'IN_PROGRESS',
            type: 'VARIATION',
            firstName: 'vari',
            lastName: 'user3',
            notifyingOrganisation: 'PRISON',
            lastUpdatedBy: 'CEMO.USER',
            lastUpdatedDateTime: '2024-03-10T11:30:00.000Z',
          },
        ],
      })
      // Visit the home page
      const page = Page.visit(IndexPage)

      // Header
      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      // Create buttons
      page.newOrderFormButton.should('exist')

      // Sub nav
      page.subNav.should('exist')
      page.subNav.contains('Draft forms').should('have.attr', 'href', `/`)
      page.subNav.contains('Draft forms').should('have.attr', 'aria-current', 'page')
      page.subNav.contains('Search for a form').should('have.attr', 'href', `/search`)
      page.subNav.contains('Search for a form').should('not.have.attr', 'aria-current', `page`)

      // Order list
      page.orders.should('exist').should('have.length', 3)
      page.TableContains('test user1', 'Draft')
      page.OrderFor('test user1').find('a').should('have.attr', 'href', `/order/${mockOrderId1}/summary`)
      page.IsAccesible('test user1', 0)
      page.TableContains('Failed user2', 'Failed')
      page
        .OrderFor('Failed user2')
        .find('a')
        .should('have.attr', 'href', paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION.replace(':orderId', mockOrderId2))
      page.IsAccesible('Failed user2', 1)
      page.TableContains('vari user3', 'Change to form')
      page.OrderFor('vari user3').find('a').should('have.attr', 'href', `/order/${mockOrderId3}/summary`)
      page.IsAccesible('vari user3', 2)

      // A11y
      page.checkIsAccessible()
    })

    it('navigates to the index page when we click the draft forms nav link', () => {
      cy.task('stubCemoListOrders')
      const page = Page.visit(IndexPage)

      page.subNav.contains('Draft forms').should('have.attr', 'href', `/`)

      Page.verifyOnPage(IndexPage)
    })

    it('Should render a row for every order returned by the list', () => {
      const orderIds = [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()]
      cy.task('stubCemoListOrders', {
        httpStatus: 200,
        orders: orderIds.map((id, index) => ({
          id,
          versionId: uuidv4(),
          status: 'IN_PROGRESS',
          type: 'REQUEST',
          firstName: 'Draft',
          lastName: `user${index}`,
          notifyingOrganisation: 'PRISON',
          lastUpdatedBy: 'CEMO.USER',
          lastUpdatedDateTime: '2024-03-10T11:30:00.000Z',
        })),
      })

      const page = Page.visit(IndexPage)

      page.orders.should('have.length', orderIds.length)
      orderIds.forEach((id, index) => {
        page.TableContains(`Draft user${index}`, 'Draft')
        page.OrderFor(`Draft user${index}`).find('a').should('have.attr', 'href', `/order/${id}/summary`)
      })
    })
  })

  context('Submitting a create order request', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', type: 'REQUEST' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.signIn()
    })

    it('should create a new order and go to your details page', () => {
      // Visit the home page
      const page = Page.visit(IndexPage)

      // Create a new order
      page.newOrderFormButton.click()

      // Verify the api was called correctly
      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders`,
        method: 'POST',
        body: {
          type: 'REQUEST',
        },
      }).should('be.true')

      Page.verifyOnPage(NotifyingOrganisationPage)
    })
  })

  context('Search for submitted form request', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', type: 'VARIATION' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.signIn()
    })

    it('should navigate to the search page', () => {
      const page = Page.visit(IndexPage)

      page.subNav.contains('Search for a form').click()

      Page.verifyOnPage(SearchPage)
    })
  })

  context('User cohorts', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubCemoListOrders')
      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
    })

    it('Should show prison name if user is in Prison cohort', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456780',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'PRISON', activeCaseLoadName: 'HMP ABC' },
      })
      cy.signIn()

      const page = Page.visit(IndexPage)
      page.header.cohort().should('contain.text', 'HMP ABC')
    })

    it('Should show probation as cohort if user is in probation cohort', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456781',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'PROBATION' },
      })

      cy.signIn()
      const page = Page.visit(IndexPage)
      page.header.cohort().should('contain.text', 'Probation')
    })

    it('Should show Home Office as cohort if user is in HOME_OFFICE cohort', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456782',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'HOME_OFFICE' },
      })

      cy.signIn()
      const page = Page.visit(IndexPage)
      page.header.cohort().should('contain.text', 'Home Office')
    })

    it('Should show Court as cohort if user is in COURT cohort', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456783',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'COURT' },
      })

      cy.signIn()
      const page = Page.visit(IndexPage)
      page.header.cohort().should('contain.text', 'Court')
    })

    it('Should show other as cohort if user is in other cohort', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456784',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'OTHER' },
      })

      cy.signIn()
      const page = Page.visit(IndexPage)
      page.header.cohort().should('contain.text', 'Other')
    })
  })

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

    it('Should show an empty list message when selected view has no orders', () => {
      cy.task('stubCemoListOrders', { httpStatus: 200, orders: [] })
      signInWithCohort(prisonCohort, '223456782')
      cy.visit('/?view=FAILED_ORDERS')
      Page.verifyOnPage(IndexPage)
      cy.contains('You have no failed to submit forms')
    })

    it('Should not show the view filter for probation users', () => {
      signInWithCohort({ cohort: 'PROBATION' }, '')

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

    it('Should show the last updated columns for prison users', () => {
      signInWithCohort(prisonCohort, '223456784')

      const page = Page.visit(IndexPage)

      page.orderListHeaders.should('have.length', 4)
      page.orderListHeaders.eq(0).should('contain.text', 'Name')
      page.orderListHeaders.eq(1).should('contain.text', 'Last updated')
      page.orderListHeaders.eq(2).should('contain.text', 'Updated by')
      page.orderListHeaders.eq(3).should('contain.text', 'Status')
    })

    it('Should not show the last updated columns for probation users', () => {
      signInWithCohort({ cohort: 'PROBATION' }, '223456785')

      const page = Page.visit(IndexPage)

      page.orderListHeaders.should('have.length', 2)
      page.orderListHeaders.eq(0).should('contain.text', 'Name')
      page.orderListHeaders.eq(1).should('contain.text', 'Status')
    })

    it('Should ignore a requested view for users who cannot filter', () => {
      signInWithCohort({ cohort: 'PROBATION' }, '223456786')

      cy.visit('/?view=PRISON_ORDERS')

      const page = Page.verifyOnPage(IndexPage)
      page.viewFilter.should('not.exist')
      page.ordersList.should('exist')
    })
  })

  context('Header', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubCemoListOrders')
      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      const testFlags = {
        TECHNOLOGY_PORTAL_PILOT_PRISONS: 'ABC',
      }

      cy.task('setFeatureFlags', testFlags)
    })
    afterEach(() => {
      cy.task('resetFeatureFlags')
    })

    it('Should have link to technology portal if user cohort is in pilot', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456785',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'PRISON', activeCaseLoadName: 'HMP ABC', activeCaseLoadId: 'ABC' },
      })
      cy.signIn()

      Page.visit(IndexPage)
      cy.get('.govuk-phase-banner__text')
        .contains('a', 'Report a problem (opens in a new tab)')
        .should('have.attr', 'href', 'https://mojprod.service-now.com/moj_sp')
    })

    it('Should have link to office form if user cohort is not in pilot', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456786',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'PRISON', activeCaseLoadName: 'HMP ABC', activeCaseLoadId: 'BCD' },
      })
      cy.signIn()

      Page.visit(IndexPage)
      cy.get('.govuk-phase-banner__text')
        .contains('a', 'Report a problem (opens in a new tab)')
        .should('have.attr', 'href', 'https://forms.office.com/e/czQvLP6DQq')
    })
  })

  context('Footer', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubCemoListOrders')
      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      const testFlags = {
        TECHNOLOGY_PORTAL_PILOT_PRISONS: 'ABC',
      }

      cy.task('setFeatureFlags', testFlags)
    })
    afterEach(() => {
      cy.task('resetFeatureFlags')
    })

    it('Should have link to technology portal if user cohort is in pilot', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456787',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'PRISON', activeCaseLoadName: 'HMP ABC', activeCaseLoadId: 'ABC' },
      })
      cy.signIn()

      Page.visit(IndexPage)
      cy.get('.govuk-footer__meta-item')
        .contains(
          'p',
          'If you are unable to fix the issue or there is something wrong with this page, contact the EMO support team by ',
        )
        .contains('a', 'reporting the problem (opens in new tab)')
        .should('have.attr', 'href', 'https://mojprod.service-now.com/moj_sp')
    })

    it('Should have link to office form if user cohort is not in pilot', () => {
      cy.task('stubSignIn', {
        name: 'john smith',
        roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
        stubCohort: false,
        userId: '123456788',
      })
      cy.task('stubCemoRequest', {
        httpStatus: 200,
        method: 'GET',
        subPath: 'user-cohort',
        response: { cohort: 'PRISON', activeCaseLoadName: 'HMP ABC', activeCaseLoadId: 'BCD' },
      })
      cy.signIn()

      Page.visit(IndexPage)
      cy.get('.govuk-footer__meta-item')
        .contains(
          'p',
          'If you are unable to fix the issue or there is something wrong with this page, contact the EMO support team by ',
        )
        .contains('a', 'reporting the problem (opens in new tab)')
        .should('have.attr', 'href', 'https://forms.office.com/e/czQvLP6DQq')
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders', 500)
    })

    it('Should indicate to the user that there were no results', () => {
      cy.signIn()

      const indexPage = Page.verifyOnPage(IndexPage)
      indexPage.ordersList.get('.govuk-table__body').should('not.exist')
      cy.contains('You have no draft forms').should('exist')
    })
  })
})
