import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import EnterAddressPage from './enterAddressPage'

context('enter address page', () => {
  const mockOrderId = uuidv4()

  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
    })

    cy.signIn()
  })

  context('Enter device wearer address page', () => {
    it('Should display contents', () => {
      const page = Page.visit(EnterAddressPage, { orderId: mockOrderId })

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      page.form.saveAndContinueButton.should('exist')
      page.form.saveAsDraftButton.should('exist')
      page.form.addressLine1Field.shouldHaveValue('')
      page.form.addressLine2Field.shouldHaveValue('')
      page.form.addressLine3Field.shouldHaveValue('')
      page.form.addressLine4Field.shouldHaveValue('')
      page.form.postcodeField.shouldHaveValue('')
      page.errorSummary.shouldNotExist()
      page.backToSummaryButton.should('not.exist')
    })
  })
})
