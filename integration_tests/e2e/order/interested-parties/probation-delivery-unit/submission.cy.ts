import { v4 as uuidv4 } from 'uuid'
import ProbationDeliveryUnitPage from './probationDeliveryUnitPage'
import Page from '../../../../pages/page'
import InterestedPartiesCheckYourAnswersPage from '../check-your-answers/interestedPartiesCheckYourAnswersPage'

const mockOrderId = uuidv4()
context('probation delivery unit submission', () => {
  const submitPath = '/interested-parties'
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      order: {
        dataDictionaryVersion: 'DDV6',
        interestedParties: {
          responsibleOrganisation: 'PROBATION',
        },
      },
    })

    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: submitPath,
      method: 'PUT',
      response: {
        probationDeliveryUnit: 'NORTH_WEST',
      },
    })
    cy.signIn()
  })

  it('routes to CYA page after successfully submitting a probation delivery unit', () => {
    const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

    page.form.fillInWith({
      unit: 'North West',
    })
    page.form.continueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${submitPath}`,
      body: {
        unit: 'NORTH_WEST',
      },
    }).should('be.true')

    Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
  })

  it('should submit if user selects "not able to provide info"', () => {
    const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

    page.form.fillInWith({
      unit: 'Not able to provide this information',
    })
    page.form.continueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${submitPath}`,
      body: {
        unit: null,
      },
    }).should('be.true')
  })

  it('navigating back to the page after submission shows the previously saved pdu', () => {
    const page = Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

    page.form.fillInWith({
      unit: 'Wales',
    })
    page.form.continueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${submitPath}`,
      body: {
        unit: 'WALES',
      },
    }).should('be.true')

    Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)

    Page.visit(ProbationDeliveryUnitPage, { orderId: mockOrderId })

    page.form.unitField.shouldHaveValue('Wales')
  })
})
