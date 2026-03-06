import { v4 as uuidv4 } from 'uuid'
import SpecialOrderPage from './specialOrderPage'
import Page from '../../../pages/page'

const mockOrderId = uuidv4()

context('Sepcial-order', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

    cy.signIn()
  })

  it('Should display the page', () => {
    const page = Page.visit(SpecialOrderPage, { orderId: mockOrderId })

    cy.get('p')
      .contains('Special orders require higher security clearance must not be sent through the EMO service.')
      .should('exist')
    cy.get('p').contains("You can't continue and must:").should('exist')
    cy.get('ul').children().get('li').contains('complete the EMS NSD CPPC SOC order from').should('exist')
    cy.get('ul')
      .children()
      .get('li')
      .contains('send the completed fomr by email to emCCSpecialCase@ems.co.uk')
      .should('exist')
    cy.get('a')
      .contains('emCCSpecialCase@ems.co.uk')
      .should('exist')
      .should('have.attr', 'href', 'mailto:emCCSpecialCase@ems.co.uk')

    page.returnToFormButton().should('exist')
    page.header.userName().should('contain.text', 'J. Smith')
  })
})
