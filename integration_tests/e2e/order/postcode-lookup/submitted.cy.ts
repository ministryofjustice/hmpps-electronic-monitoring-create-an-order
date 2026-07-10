import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import FindAddressPage from './find-address/findAddressPage'
import EnterAddressPage from './enter-address/enterAddressPage'
import ConfirmAddressPage from './confirm-address/confirmAddressPage'
import AddressListPage from './address-list/addressListPage'

const mockOrderId = uuidv4()

context('Postcode lookup submitted', () => {
  context('Viewing a submitted order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          addresses: [
            {
              addressType: 'PRIMARY',
              addressLine1: '10 downing street',
              addressLine2: '',
              addressLine3: 'London',
              addressLine4: 'ENGLAND',
              postcode: 'SW1A 2AA',
            },
          ],
        },
      })

      cy.signIn()
    })

    context('Find address page', () => {
      it('Should display content as read only', () => {
        const page = Page.visit(FindAddressPage, { orderId: mockOrderId, addressType: 'PRIMARY' })

        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.submittedBanner.should('contain', 'You are viewing a submitted order.')
        page.form.findAddressButton.should('not.exist')
        page.form.saveAsDraftButton.should('not.exist')
        page.returnBackToFormSectionMenuButton
          .should('exist')
          .should('have.attr', 'href', `/order/${mockOrderId}/summary`)
        page.errorSummary.shouldNotExist()
      })
    })

    context('Enter address page', () => {
      it('Should display content as read only', () => {
        const page = Page.visit(EnterAddressPage, { orderId: mockOrderId, addressType: 'PRIMARY' })

        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.submittedBanner.should('contain', 'You are viewing a submitted order.')
        page.form.saveAsDraftButton.should('not.exist')
        page.form.shouldBeDisabled()
        page.errorSummary.shouldNotExist()
      })
    })

    context('Confirm address page', () => {
      it('Should display content as read only', () => {
        const page = Page.visit(
          ConfirmAddressPage,
          { orderId: mockOrderId, addressType: 'PRIMARY' },
          { postcode: 'SW1A 2AA', buildingId: '10' },
        )

        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.submittedBanner.should('contain', 'You are viewing a submitted order.')
        page.form.useAddressButton.should('not.exist')
        page.returnBackToFormSectionMenuButton
          .should('exist')
          .should('have.attr', 'href', `/order/${mockOrderId}/summary`)
        page.errorSummary.shouldNotExist()
      })
    })

    context('Address list page', () => {
      it('Should display content as read only', () => {
        const page = Page.visit(AddressListPage, { orderId: mockOrderId, addressType: 'PRIMARY' })

        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')
        page.submittedBanner.should('contain', 'You are viewing a submitted order.')
        page.form.saveAndContinueButton.should('not.exist')
        page.form.saveAsDraftButton.should('not.exist')
        page.returnBackToFormSectionMenuButton
          .should('exist')
          .should('have.attr', 'href', `/order/${mockOrderId}/summary`)
        page.form.shouldBeDisabled()
        page.errorSummary.shouldNotExist()
      })
    })
  })
})
