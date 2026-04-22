import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import ConfirmAddressPage from './confirmAddressPage'
import paths from '../../../../../server/constants/paths'

context('confirm address page', () => {
  const mockOrderId = uuidv4()

  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
        addresses: [
          {
            addressType: 'PRIMARY',
            addressLine1: '10 Downing Street',
            addressLine2: '',
            addressLine3: 'London',
            addressLine4: 'ENGLAND',
            postcode: 'SW1A 2AA',
          },
          {
            addressType: 'SECONDARY',
            addressLine1: '11 Downing Street',
            addressLine2: '',
            addressLine3: 'London',
            addressLine4: 'ENGLAND',
            postcode: 'SW1A 2AA',
          },
          {
            addressType: 'INSTALLATION',
            addressLine1: '12 Downing Street',
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

  it('has correct elements for device wearer address confirmation', () => {
    const page = Page.visit(
      ConfirmAddressPage,
      { orderId: mockOrderId, addressType: 'PRIMARY' },
      { postcode: 'SW1A 2AA', buildingId: '10' },
    )

    cy.contains('About the device wearer')
    cy.contains("Confirm the device wearer's address")
    cy.contains('10 Downing Street')
    cy.contains('London')
    cy.contains('SW1A 2AA')

    page.form.useDifferentAddressLink.should(
      'have.attr',
      'href',
      `${paths.POSTCODE_LOOKUP.ADDRESS_RESULT.replace(':orderId', mockOrderId).replace(':addressType', 'PRIMARY')}?postcode=SW1A+2AA&buildingId=10`,
    )

    page.form.enterAddressManuallyLink.should(
      'have.attr',
      'href',
      paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrderId).replace(':addressType', 'PRIMARY'),
    )
  })

  it('has correct elements for curfew address confirmation', () => {
    const page = Page.visit(
      ConfirmAddressPage,
      { orderId: mockOrderId, addressType: 'SECONDARY' },
      { postcode: 'SW1A 2AA', buildingId: '10' },
    )

    cy.contains('About the device wearer')
    cy.contains('Confirm the curfew address')
    cy.contains('11 Downing Street')
    cy.contains('London')
    cy.contains('SW1A 2AA')

    page.form.useDifferentAddressLink.should(
      'have.attr',
      'href',
      `${paths.POSTCODE_LOOKUP.ADDRESS_RESULT.replace(':orderId', mockOrderId).replace(':addressType', 'SECONDARY')}?postcode=SW1A+2AA&buildingId=10`,
    )

    page.form.enterAddressManuallyLink.should(
      'have.attr',
      'href',
      paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrderId).replace(':addressType', 'SECONDARY'),
    )
  })

  it('has correct elements for installation address confirmation', () => {
    const page = Page.visit(
      ConfirmAddressPage,
      { orderId: mockOrderId, addressType: 'INSTALLATION' },
      { postcode: 'SW1A 2AA', buildingId: '10' },
    )

    cy.contains('Electronic monitoring required')
    cy.contains('Confirm the installation address')
    cy.contains('12 Downing Street')
    cy.contains('London')
    cy.contains('SW1A 2AA')

    page.form.useDifferentAddressLink.should(
      'have.attr',
      'href',
      `${paths.POSTCODE_LOOKUP.ADDRESS_RESULT.replace(':orderId', mockOrderId).replace(':addressType', 'INSTALLATION')}?postcode=SW1A+2AA&buildingId=10`,
    )

    page.form.enterAddressManuallyLink.should(
      'have.attr',
      'href',
      paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', mockOrderId).replace(':addressType', 'INSTALLATION'),
    )
  })
})
