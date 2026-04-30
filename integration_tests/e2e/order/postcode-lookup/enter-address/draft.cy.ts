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
    it('Has the correct elements', () => {
      const page = Page.visit(EnterAddressPage, { orderId: mockOrderId, addressType: 'PRIMARY' })

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      cy.contains("What is the device wearer's address?")
      page.form.continueButton.should('exist')
      page.form.addressLine1Field.shouldHaveValue('')
      page.form.addressLine2Field.shouldHaveValue('')
      page.form.addressLine3Field.shouldHaveValue('')
      page.form.addressLine4Field.shouldHaveValue('')
      page.form.postcodeField.shouldHaveValue('')
      page.errorSummary.shouldNotExist()
      page.backToSummaryButton.should('not.exist')
    })
  })

  context('Enter tag at source address', () => {
    it('Has the correct elements', () => {
      const page = Page.visit(EnterAddressPage, { orderId: mockOrderId, addressType: 'INSTALLATION' })

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      cy.contains('What is the installation address?')
      cy.contains('For installation at source this is the address of the prison or probation office.')
    })
  })

  context('Enter curfew address', () => {
    it('Has the correct elements', () => {
      const page = Page.visit(EnterAddressPage, { orderId: mockOrderId, addressType: 'SECONDARY' })

      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')

      cy.contains('What is the curfew address?')
      page.form.continueButton.should('exist')
    })
  })

  // TODO: skipped until we can handle mandatory attendance monitoring addresses
  context.skip('Enter mandatory attendance monitoring address', () => {
    it('Has the correct elements', () => {
      //   const page = Page.visit(EnterAddressPage, { orderId: mockOrderId, addressType: 'APPOINTMENT' })
      //
      //   page.header.userName().should('contain.text', 'J. Smith')
      //   page.header.phaseBanner().should('contain.text', 'dev')
      //
      //   cy.contains('What is the appointment address?')
    })
  })
})
