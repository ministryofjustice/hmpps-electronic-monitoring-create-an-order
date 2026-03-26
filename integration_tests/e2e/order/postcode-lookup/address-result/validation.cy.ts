import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import AddressResultPage from './addressResultPage'

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

    it('shows correct errors', () => {
      const page = Page.visit(
        AddressResultPage,
        { orderId: mockOrderId, addressType: 'PRIMARY' },
        { postcode: 'SW1A 2AA' },
      )

      page.form.useAddressButton.click()

      page.form.addressResultsField.shouldHaveValidationMessage('Select the address')
      page.errorSummary.shouldHaveError('Select the address')
    })
  })
})
