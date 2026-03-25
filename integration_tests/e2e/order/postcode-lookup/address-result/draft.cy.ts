import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import AddressResultPage from './addressResultPage'
import paths from '../../../../../server/constants/paths'

context('address results', () => {
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

  context('multiple results', () => {
    beforeEach(() => {
      cy.task('stubOSDataHubPostcode', {
        httpStatus: 200,
        postcode: 'SW1A2AA',
        body: {
          results: [
            {
              DPA: {
                BUILDING_NUMBER: 10,
                THOROUGHFARE_NAME: 'DOWNING STREET',
                POST_TOWN: 'LONDON',
                POSTCODE: 'SW1A 2AA',
                UPRN: '101',
              },
            },
            {
              DPA: {
                BUILDING_NUMBER: 11,
                THOROUGHFARE_NAME: 'DOWNING STREET',
                POST_TOWN: 'LONDON',
                POSTCODE: 'SW1A 2AA',
                UPRN: '102',
              },
            },
          ],
        },
      })
    })

    it('has correct elements when searching by postcode', () => {
      const page = Page.visit(
        AddressResultPage,
        { orderId: mockOrderId, addressType: 'PRIMARY' },
        { postcode: 'SW1A 2AA' },
      )
      page.form.addressResultsField.element.contains('2 addresses found for SW1A 2AA. Search again')
      page.form.addressResultsField.shouldHaveOption('10 Downing Street, London, SW1A 2AA')
      page.form.addressResultsField.shouldHaveOption('11 Downing Street, London, SW1A 2AA')

      page.form.addressResultsField.element
        .get('a')
        .contains('Search again')
        .should(
          'have.attr',
          'href',
          paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':orderId', mockOrderId).replace(':addressType', 'PRIMARY'),
        )
    })

    it('has correct elements when searching by postcode and building id', () => {
      const page = Page.visit(
        AddressResultPage,
        { orderId: mockOrderId, addressType: 'PRIMARY' },
        { postcode: 'SW1A 2AA', buildingId: 10 },
      )
      page.form.addressResultsField.element.contains('1 address found for SW1A 2AA and 10. Search again')
      page.form.addressResultsField.shouldHaveOption('10 Downing Street, London, SW1A 2AA')
      page.form.addressResultsField.shouldNotHaveOption('11 Downing Street, London, SW1A 2AA')
    })

    it('primary address', () => {
      Page.visit(
        AddressResultPage,
        { orderId: mockOrderId, addressType: 'PRIMARY' },
        { postcode: 'SW1A 2AA', buildingId: 10 },
      )
      cy.contains('About the device wearer')
      cy.contains("Select the device wearer's address")
    })

    it('curfew address', () => {
      Page.visit(
        AddressResultPage,
        { orderId: mockOrderId, addressType: 'SECONDARY' },
        { postcode: 'SW1A 2AA', buildingId: 10 },
      )
      cy.contains('About the device wearer')
      cy.contains('Select the curfew address')
    })

    it('installation address', () => {
      Page.visit(
        AddressResultPage,
        { orderId: mockOrderId, addressType: 'INSTALLATION' },
        { postcode: 'SW1A 2AA', buildingId: 10 },
      )
      cy.contains('Electronic monitoring required')
      cy.contains('Select the installation address')
    })
  })
})
