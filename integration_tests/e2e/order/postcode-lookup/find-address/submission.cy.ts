import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import FindAddressPage from './findAddressPage'
import EnterAddressPage from '../enter-address/enterAddressPage'
import AddressResultPage from '../address-result/addressResultPage'

context('find address page', () => {
  context('device wearer address', () => {
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

    it('navigates to correct manual entry if user clicks link', () => {
      const page = Page.visit(FindAddressPage, { orderId: mockOrderId, addressType: 'PRIMARY' })

      page.form.manualAddressLink.click()

      Page.verifyOnPage(EnterAddressPage)
    })

    it('navigates to the results page after entering postcode', () => {
      const page = Page.visit(FindAddressPage, { orderId: mockOrderId, addressType: 'PRIMARY' })

      page.form.fillInWith({ postcode: 'sa11 1aa' })

      page.form.findAddressButton.click()

      Page.verifyOnPage(AddressResultPage)
    })
  })
})
