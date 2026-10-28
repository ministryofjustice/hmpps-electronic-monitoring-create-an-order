import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import RiskBehaviourPage from '../risk-behaviour/RiskBehaviourPage'
import OtherRisksPage from './OtherRisksPage'

const mockOrderId = uuidv4()
const apiPath = '/details-of-installation'

context('other risks page with incomplete risk information', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: { dataDictionaryVersion: 'DDV6', detailsOfInstallation: null },
    })
    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: apiPath,
      response: { riskCategory: [], riskDetails: '', genderRiskDetails: '' },
    })
    cy.signIn()
  })

  it('sends the user to the first unanswered risk question without saving', () => {
    const page = Page.visit(OtherRisksPage, { orderId: mockOrderId })

    page.form.fillInWith('No')
    page.form.continueButton.click()

    const riskBehaviourPage = Page.verifyOnPage(RiskBehaviourPage)
    riskBehaviourPage.errorSummary.shouldNotExist()
    cy.task('getStubbedRequest', `/orders/${mockOrderId}${apiPath}`).should('have.length', 0)
  })
})
