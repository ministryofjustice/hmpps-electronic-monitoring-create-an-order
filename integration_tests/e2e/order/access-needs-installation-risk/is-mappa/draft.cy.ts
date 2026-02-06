import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import IsMappaPage from './IsMappaPage'

const mockOrderId = uuidv4()
context('is mappa page', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
    })

    cy.signIn()
  })

  it('has correct elements', () => {
    const page = Page.visit(IsMappaPage, { orderId: mockOrderId })

    page.form.isMappaField.shouldNotBeDisabled()
    page.form.isMappaField.shouldHaveAllOptions()

    page.form.saveAndContinueButton.should('exist')
    page.form.saveAsDraftButton.should('exist')
  })

  it('shows correctly for order with data', () => {
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      order: {
        mappa: {
          level: null,
          category: null,
          isMappa: 'YES',
        },
      },
      status: 'IN_PROGRESS',
    })

    const page = Page.visit(IsMappaPage, { orderId: mockOrderId })

    page.form.isMappaField.shouldHaveValue('Yes')
  })
})
