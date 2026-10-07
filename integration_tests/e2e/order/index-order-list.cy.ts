import { v4 as uuidv4 } from 'uuid'
import IndexPage from '../../pages/index'
import Page from '../../pages/page'
import paths from '../../../server/constants/paths'

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
})
