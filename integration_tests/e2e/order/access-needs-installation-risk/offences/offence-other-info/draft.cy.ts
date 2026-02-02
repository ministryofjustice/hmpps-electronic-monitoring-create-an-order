import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OffenceOtherInfoPage from './offenceOtherInfoPage'

const mockOrderId = uuidv4()

context('offence other info page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
    })

    cy.signIn()
  })

  it('should display page correctly', () => {
    const page = Page.visit(OffenceOtherInfoPage, { orderId: mockOrderId })
    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')
    page.form.saveAndContinueButton.should('exist')
    page.form.saveAsDraftButton.should('exist')
    page.form.shouldNotBeDisabled()
    page.errorSummary.shouldNotExist()
    page.backButton.should('exist')
    page.checkIsAccessible()
    page.form.hasOtherInformationField.shouldExist()
    page.form.shouldHaveAllOptions()
    page.form.hasOtherInformationField.shouldNotHaveValue()
  })

  it('Should show the text area when Yes is selected', () => {
    const page = Page.visit(OffenceOtherInfoPage, { orderId: mockOrderId })

    page.form.hasOtherInformationField.set('Yes')

    page.form.otherInformationDetailsField.shouldExist()
    page.form.otherInformationDetailsField.shouldNotBeDisabled()
  })

  it('Should show offence additional info for order with data', () => {
    const mockOffenceId = uuidv4()

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      order: {
        offenceAdditionalDetails: {
          id: mockOffenceId,
          additionalDetails: 'test',
        },
      },
      status: 'IN_PROGRESS',
    })

    const page = Page.visit(OffenceOtherInfoPage, { orderId: mockOrderId })

    page.form.hasOtherInformationField.shouldHaveValue('Yes')

    page.form.otherInformationDetailsField.shouldHaveValue('test')
  })
})
