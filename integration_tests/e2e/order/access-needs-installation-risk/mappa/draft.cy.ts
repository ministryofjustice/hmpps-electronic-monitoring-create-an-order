import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import MappaPage from './MappaPage'

const mockOrderId = uuidv4()
context('mappa page', () => {
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
    const page = Page.visit(MappaPage, { orderId: mockOrderId })

    page.form.categoryField.shouldNotBeDisabled()
    page.form.categoryField.shouldHaveAllOptions()

    page.form.levelField.shouldNotBeDisabled()
    page.form.levelField.shouldHaveAllOptions()

    page.form.saveAndContinueButton.should('exist')
    page.form.saveAsDraftButton.should('exist')
  })

  it('shows correctly for order with data', () => {
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      order: {
        installationAndRisk: {
          mappaLevel: 'MAPPA 1',
          mappaCaseType: 'Category 1',
          offence: null,
          offenceAdditionalDetails: null,
          riskCategory: [],
          riskDetails: null,
        },
      },
      status: 'IN_PROGRESS',
    })

    const page = Page.visit(MappaPage, { orderId: mockOrderId })

    page.form.levelField.shouldHaveValue('MAPPA 1')

    page.form.categoryField.shouldHaveValue('Category 1')
  })
})
