import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import DetailsOfInstallationPage from './DetailsOfInstallationPage'
import InstallationAndRiskCheckYourAnswersPage from '../../../../pages/order/installation-and-risk/check-your-answers'

const mockOrderId = uuidv4()
const apiPath = '/details-of-installation'

context('details of installation page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    const testFlags = { OFFENCE_FLOW_ENABLED: 'true' }
    cy.task('setFeatureFlags', testFlags)

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        dataDictionaryVersion: 'DDV6',
      },
    })
  })

  it('can submit an order', () => {
    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: apiPath,
      response: {
        riskCategory: ['THREATS_OF_VIOLENCE', 'SAFEGUARDING_CHILD'],
        riskDetails: 'some details',
        genderRiskDetails: '',
      },
    })

    cy.signIn()

    const page = Page.visit(DetailsOfInstallationPage, { orderId: mockOrderId })

    page.form.fillInWith({
      possibleRisks: ['Violent behaviour or threats of violence'],
      riskCategories: ['Safeguarding child'],
      riskDetails: 'some details',
    })

    page.form.saveAndContinueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${apiPath}`,
      body: {
        riskCategory: ['THREATS_OF_VIOLENCE', 'SAFEGUARDING_CHILD'],
        riskDetails: 'some details',
        genderRiskDetails: '',
      },
    }).should('be.true')

    Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers')
  })

  it('can submit an order when risk to gender', () => {
    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: apiPath,
      response: {
        riskCategory: ['RISK_TO_GENDER', 'DANGEROUS_ANIMALS'],
        genderRiskDetails: 'women',
        riskDetails: 'some details',
      },
    })

    cy.signIn()

    const page = Page.visit(DetailsOfInstallationPage, { orderId: mockOrderId })

    page.form.fillInWith({
      possibleRisks: ['Offensive towards someone because of their sex or gender'],
      genderRiskDetails: 'women',
      riskCategories: ['Animals at the property, for example dogs'],
      riskDetails: 'some details',
    })

    page.form.saveAndContinueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${apiPath}`,
      body: {
        riskCategory: ['RISK_TO_GENDER', 'DANGEROUS_ANIMALS'],
        riskDetails: 'some details',
        genderRiskDetails: 'women',
      },
    }).should('be.true')

    Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers')

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        dataDictionaryVersion: 'DDV6',
        detailsOfInstallation: {
          riskCategory: ['RISK_TO_GENDER', 'DANGEROUS_ANIMALS'],
          riskDetails: 'some details',
          genderRiskDetails: 'women',
        },
      },
    })

    const editPage = Page.visit(DetailsOfInstallationPage, { orderId: mockOrderId })

    Page.verifyOnPage(DetailsOfInstallationPage)
    editPage.form.riskDetailsField.shouldHaveValue('some details')
    editPage.form.genderRiskDetailsField.shouldHaveValue('women')
  })
})
