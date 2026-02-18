import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import DetailsOfInstallationPage from './DetailsOfInstallationPage'

const mockOrderId = uuidv4()

context('details of installation page', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    const testFlags = { OFFENCE_FLOW_ENABLED: 'true' }
    cy.task('setFeatureFlags', testFlags)

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        status: 'SUBMITTED',
        detailsOfInstallation: {
          riskCategory: ['THREATS_OF_VIOLENCE', 'SAFEGUARDING_CHILD'],
          riskDetails: 'some details',
        },
        dataDictionaryVersion: 'DDV6',
      },
    })

    cy.signIn()
  })

  it('submitted order', () => {
    const page = Page.visit(DetailsOfInstallationPage, { orderId: mockOrderId })

    page.form.possibleRiskField.shouldBeDisabled()
    page.form.possibleRiskField.shouldHaveValue('Violent behaviour or threats of violence')
    page.form.riskCategoryField.shouldBeDisabled()
    page.form.riskCategoryField.shouldHaveValue('Safeguarding child')
    page.form.riskDetailsField.shouldBeDisabled()
    page.form.riskDetailsField.shouldHaveValue('some details')
  })
})
