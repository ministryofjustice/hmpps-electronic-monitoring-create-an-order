import { v4 as uuidv4 } from 'uuid'
import IndexPage from '../pages/index'
import Page from '../pages/page'
import SearchPage from '../pages/search'
import NotifyingOrganisationPage from './order/interested-parties/notifying-organisation/notifyingOrganisationPage'
import mockApiOrder from '../utils/data/ApiOrder'
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
            ...mockApiOrder(),
            id: mockOrderId1,
            deviceWearer: {
              nomisId: null,
              pncId: null,
              deliusId: null,
              prisonNumber: null,
              homeOfficeReferenceNumber: null,
              complianceAndEnforcementPersonReference: null,
              courtCaseReferenceNumber: null,
              firstName: 'test',
              lastName: 'user1',
              alias: null,
              dateOfBirth: null,
              adultAtTimeOfInstallation: null,
              sex: null,
              gender: null,
              disabilities: null,
              noFixedAbode: null,
              interpreterRequired: null,
            },
            interestedParties: {
              notifyingOrganisation: 'PRISON',
              notifyingOrganisationName: 'ALTCOURSE_PRISON',
              notifyingOrganisationEmail: 'notifying@organisation',

              responsibleOfficerFirstName: null,
              responsibleOfficerLastName: '',
              responsibleOfficerEmail: '@email',

              responsibleOrganisation: null,
              responsibleOrganisationEmail: '',
              responsibleOrganisationRegion: '',
            },
          },
          {
            ...mockApiOrder(),
            id: mockOrderId2,
            deviceWearer: {
              nomisId: null,
              pncId: null,
              deliusId: null,
              prisonNumber: null,
              homeOfficeReferenceNumber: null,
              complianceAndEnforcementPersonReference: null,
              courtCaseReferenceNumber: null,
              firstName: 'Failed',
              lastName: 'user2',
              alias: null,
              dateOfBirth: null,
              adultAtTimeOfInstallation: null,
              sex: null,
              gender: null,
              disabilities: null,
              noFixedAbode: null,
              interpreterRequired: null,
            },
            status: 'ERROR',
          },
          {
            ...mockApiOrder(),
            id: mockOrderId3,
            deviceWearer: {
              nomisId: null,
              pncId: null,
              deliusId: null,
              prisonNumber: null,
              homeOfficeReferenceNumber: null,
              complianceAndEnforcementPersonReference: null,
              courtCaseReferenceNumber: null,
              firstName: 'vari',
              lastName: 'user3',
              alias: null,
              dateOfBirth: null,
              adultAtTimeOfInstallation: null,
              sex: null,
              gender: null,
              disabilities: null,
              noFixedAbode: null,
              interpreterRequired: null,
            },
            interestedParties: {
              notifyingOrganisation: 'PRISON',
              notifyingOrganisationName: 'ALTCOURSE_PRISON',
              notifyingOrganisationEmail: 'notifying@organisation',

              responsibleOfficerFirstName: null,
              responsibleOfficerLastName: '',
              responsibleOfficerEmail: '',

              responsibleOrganisation: null,
              responsibleOrganisationEmail: '',
              responsibleOrganisationRegion: '',
            },
            type: 'VARIATION',
            status: 'IN_PROGRESS',
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
      page.subNav.contains('Submitted forms').should('have.attr', 'href', `/search`)
      page.subNav.contains('Submitted forms').should('not.have.attr', 'aria-current', `page`)

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
      page.TableContains('vari user3', 'Change to form Draft')
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

      page.subNav.contains('Submitted forms').click()

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
