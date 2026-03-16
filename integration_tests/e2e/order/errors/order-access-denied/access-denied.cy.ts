import { v4 as uuidv4 } from 'uuid'

const mockOrderId = uuidv4()
context('Order fetch forbidden', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoSubmitOrder', {
      httpStatus: 403,
      id: mockOrderId,
      subPath: '',
      response: { message: 'Order forbidden', errorCode: '40301' },
      method: 'GET',
    })

    cy.signIn()
  })

  it('should show the access denied page when api returns a 403 forbidden', () => {
    cy.visit(`/order/${mockOrderId}/summary`, { failOnStatusCode: false })

    cy.url().should('include', `/order/${mockOrderId}/summary`)

    cy.get('h1.govuk-heading-l').should('be.visible').and('contain.text', 'You do not have access to view this order')
    cy.get('.govuk-body').should('contain.text', 'Access is restricted to some orders.')
    cy.get('.govuk-button').should('have.attr', 'href', '/').and('contain.text', 'Go back to the start')
  })
})
