import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import FindAddressPage from './findAddressPage'
import paths from '../../../../../server/constants/paths'

context('find address page', () => {
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

  context('device wearer address', () => {
    it('has the correct elements', () => {
      const page = Page.visit(FindAddressPage, { orderId: mockOrderId, addressType: 'PRIMARY' })

      page.form.postcodeField.shouldExist()
      page.form.postcodeField.shouldHaveHint('For example, AA3 1AB')

      page.form.buildingIdField.shouldExist()
      page.form.buildingIdField.shouldHaveHint('For example, 15 or Prospect Cottage')

      page.form.manualAddressLink.and(
        'have.attr',
        'href',
        paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrderId).replace(':addressType', 'PRIMARY'),
      )

      page.form.findAddressButton.should('exist')
      page.form.saveAsDraftButton.should('exist')
    })
  })

  context('tag at source address', () => {
    it('has the correct elements', () => {
      const page = Page.visit(FindAddressPage, { orderId: mockOrderId, addressType: 'INSTALLATION' })

      page.form.manualAddressLink.and(
        'have.attr',
        'href',
        paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrderId).replace(':addressType', 'INSTALLATION'),
      )
    })
  })

  context('curfew address', () => {
    it('has the correct elements', () => {
      const page = Page.visit(FindAddressPage, { orderId: mockOrderId, addressType: 'SECONDARY' })

      page.form.manualAddressLink.and(
        'have.attr',
        'href',
        paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrderId).replace(':addressType', 'SECONDARY'),
      )
    })
  })

  // TODO: skipped until we can handle mandatory attendance monitoring addresses
  context.skip('appointment address', () => {
    it('has the correct elements', () => {
      // const page = Page.visit(FindAddressPage, { orderId: mockOrderId, addressType: 'appointment' })
      //
      // page.form.manualAddressLink.and(
      //   'have.attr',
      //   'href',
      //   paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrderId).replace(':addressType', 'appointment'),
      // )
    })
  })
})
