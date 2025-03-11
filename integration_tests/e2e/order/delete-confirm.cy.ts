import { v4 as uuidv4 } from 'uuid'
import DeleteConfirmPage from '../../pages/order/delete-confirm'
import DeleteFailedPage from '../../pages/order/delete-failed'
import Page from '../../pages/page'
import OrderTasksPage from '../../pages/order/summary'
import IndexPage from '../../pages'
import DeleteSuccessPage from '../../pages/order/delete-success'

const mockOrderId = uuidv4()

context('Confirm delete', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

    cy.signIn()
  })

  it('Should display the page', () => {
    cy.visit(`/order/${mockOrderId}/delete`)
    const page = Page.verifyOnPage(DeleteConfirmPage)
    page.header.userName().should('contain.text', 'J. Smith')
  })

  it('should have a button that links to request form summary page for download', () => {
    cy.visit(`/order/${mockOrderId}/delete`)
    const page = Page.verifyOnPage(DeleteConfirmPage)
    page.backButton().should('exist')
    page.backButton().click()
    Page.verifyOnPage(OrderTasksPage)
  })

  it('Should redirect to delete failed page when failed to delete form', () => {
    cy.visit(`/order/${mockOrderId}/delete`)
    cy.task('stubDeleteOrder', { httpStatus: 500, id: mockOrderId, error: 'Error delete order' })
    const page = Page.verifyOnPage(DeleteConfirmPage)
    page.confirmDeleteButton().should('exist')
    page.confirmDeleteButton().click()
    const deleteFailedPage = Page.verifyOnPage(DeleteFailedPage)
    deleteFailedPage.backButton().should('exist')
    deleteFailedPage.backButton().click()
    Page.verifyOnPage(IndexPage)
  })

  it('Should redirect to delete successful page when form deleted', () => {
    cy.visit(`/order/${mockOrderId}/delete`)
    cy.task('stubDeleteOrder', { httpStatus: 200, id: mockOrderId, error: '' })
    const page = Page.verifyOnPage(DeleteConfirmPage)
    page.confirmDeleteButton().should('exist')
    page.confirmDeleteButton().click()
    const deleteSuccessPage = Page.verifyOnPage(DeleteSuccessPage)
    deleteSuccessPage.backButton().should('exist')
    deleteSuccessPage.backButton().click()
    Page.verifyOnPage(IndexPage)
  })
})
