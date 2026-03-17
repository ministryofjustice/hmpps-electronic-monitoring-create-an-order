import { v4 as uuidv4 } from 'uuid'
import ServiceRequestTypePage from './serviceRequestTypePage'
import Page from '../../../../pages/page'

const mockOrderId = uuidv4()
context('orderType', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
    })

    cy.signIn()
  })

  it('Page accessisble', () => {
    const page = Page.visit(ServiceRequestTypePage, { orderId: mockOrderId })
    page.checkIsAccessible()
  })

  it('Should display content', () => {
    const page = Page.visit(ServiceRequestTypePage, { orderId: mockOrderId })

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.form.serviceRequestTypeField.shouldExist()
    page.form.serviceRequestTypeField.shouldNotBeDisabled()

    page.form.serviceRequestTypeField.shouldHaveOption('The device wearer has been recalled to prison.')
    page.form.serviceRequestTypeField.shouldHaveOption(
      "The device wearer's circumstances have changed and all monitoring needs to end.",
    )
    page.form.serviceRequestTypeField.shouldHaveOption(
      'The device wearer needs to remain at a second or third address during curfew hours.',
    )
    page.form.serviceRequestTypeField.shouldHaveOption(
      'There is an issue with the equipment and it needs checking or refitted',
    )
    page.form.serviceRequestTypeField.shouldHaveOption('The Responsible Officer has changed')
    page.form.serviceRequestTypeField.shouldHaveOption('I need to change something else in the form')

    page.form.continueButton.should('exist')
  })
})
