import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import FindAddressPage from './findAddressPage'
import paths from '../../../../../server/constants/paths'

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

    it('has the correct elements', () => {
      const page = Page.visit(FindAddressPage, { orderId: mockOrderId, addressType: 'device-wearer' })

      page.form.postcodeField.shouldExist()
      page.form.postcodeField.shouldHaveHint('For example, AA3 1AB')

      page.form.buildingIdField.shouldExist()
      page.form.buildingIdField.shouldHaveHint('For example, 15 or Prospect Cottage')

      cy.contains('a', 'Enter address manually').and(
        'have.attr',
        'href',
        paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrderId).replace(':addressType', 'device-wearer'),
      )

      page.form.findAddressButton.should('exist')
      page.form.saveAsDraftButton.should('exist')
    })
  })
})
