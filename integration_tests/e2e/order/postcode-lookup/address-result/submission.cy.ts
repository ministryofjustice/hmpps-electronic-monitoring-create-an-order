import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import AddressResultPage from './addressResultPage'
import ConfirmAddressPage from '../confirm-address/confirmAddressPage'

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

      cy.task('stubOSDataHubUPRN', {
        httpStatus: 200,
        uprn: '101',
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
          ],
        },
      })

      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        id: mockOrderId,
        subPath: '/address',
        response: {
          addressType: 'PRIMARY',
          addressLine1: '',
          addressLine2: '',
          addressLine3: '',
          addressLine4: '',
          postcode: '',
        },
      })
    })

    it('can select the correct address', () => {
      const page = Page.visit(
        AddressResultPage,
        { orderId: mockOrderId, addressType: 'PRIMARY' },
        { postcode: 'SW1A 2AA' },
      )

      page.form.addressResultsField.set('10')
      page.form.useAddressButton.click()

      Page.verifyOnPage(ConfirmAddressPage)

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}/address`,
        body: {
          addressType: 'PRIMARY',
          addressLine1: '10 Downing Street',
          addressLine2: '',
          addressLine3: 'London',
          addressLine4: '',
          postcode: 'SW1A 2AA',
          hasAnotherAddress: false,
        },
      }).should('be.true')
    })
  })
})
