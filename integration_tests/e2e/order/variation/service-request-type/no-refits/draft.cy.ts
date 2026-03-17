import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import NoRefitsPage from './noRefitsPage'

const mockOrderId = uuidv4()

context('No Refits', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
    })

    cy.signIn()
  })

  it('Should display the page', () => {
    const page = Page.visit(NoRefitsPage, { orderId: mockOrderId })

    cy.get('p')
      .contains(
        'If you need a visit for an equipment refit (for example, if the battery is not working or there is a medical reason for a refit):',
      )
      .should('exist')
    cy.get('ul').children().get('li').contains('Use the service request portal if you have access.').should('exist')
    cy.get('ul')
      .children()
      .get('li')
      .contains('Email your request to EMSEnforcement@ems.co.uk if you do not have access')
      .should('exist')
    cy.get('a')
      .contains('EMSEnforcement@ems.co.uk')
      .should('exist')
      .should('have.attr', 'href', 'mailto:EMSEnforcement@ems.co.uk')

    page.returnToStartButton().should('exist')
    page.header.userName().should('contain.text', 'J. Smith')
  })
})
