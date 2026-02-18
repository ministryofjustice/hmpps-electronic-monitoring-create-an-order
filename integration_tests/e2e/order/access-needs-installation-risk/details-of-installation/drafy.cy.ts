import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import DetailsOfInstallationPage from './DetailsOfInstallationPage'

const mockOrderId = uuidv4()
context('mappa page', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        dataDictionaryVersion: 'DDV6',
      },
    })

    cy.signIn()
  })

  it('has correct elements', () => {
    const page = Page.visit(DetailsOfInstallationPage, { orderId: mockOrderId })

    page.form.possibleRiskField.shouldNotBeDisabled()
    page.form.possibleRiskField.shouldHaveAllOptions()

    page.form.riskCategoryField.shouldNotBeDisabled()
    page.form.riskCategoryField.shouldHaveAllOptions()

    page.form.riskDetailsField.shouldNotBeDisabled()

    page.form.saveAndContinueButton.should('exist')
    page.form.saveAsDraftButton.should('exist')
  })

  it('shows correctly for order with data', () => {
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      order: {
        detailsOfInstallation: {
          riskCategory: ['THREATS_OF_VIOLENCE', 'SAFEGUARDING_CHILD'],
          riskDetails: 'some risky details',
        },
        dataDictionaryVersion: 'DDV6',
      },
      status: 'IN_PROGRESS',
    })

    const page = Page.visit(DetailsOfInstallationPage, { orderId: mockOrderId })

    page.form.possibleRiskField.shouldHaveValue('Violent behaviour or threats of violence')
    page.form.riskCategoryField.shouldHaveValue('Safeguarding child')
    page.form.riskDetailsField.shouldHaveValue('some risky details')
  })
})
