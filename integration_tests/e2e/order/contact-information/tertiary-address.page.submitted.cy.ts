import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import TertiaryAddressPage from '../../../pages/order/contact-information/tertiary-adddress'

const mockOrderId = uuidv4()

context('Contact information', () => {
  context('Tertiary address', () => {
    context('Viewing a submitted order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'SUBMITTED' })

        cy.signIn()
      })

      it('Should display the user name visible in header', () => {
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
        })
        page.header.userName().should('contain.text', 'J. Smith')
      })

      it('Should display the phase banner in header', () => {
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
        })
        page.header.phaseBanner().should('contain.text', 'dev')
      })

      it('Should display the submitted order notification', () => {
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
        })
        page.submittedBanner().should('contain', 'You are viewing a submitted order.')
      })

      it('Should not allow the user to update the primary address details', () => {
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
        })

        page.form.saveAndContinueButton.should('not.exist')
        page.form.saveAndReturnButton.should('not.exist')
        page.backToSummaryButton.should('exist').should('have.attr', 'href', `/order/${mockOrderId}/summary`)
        page.form.shouldBeDisabled()
      })
    })
  })
})