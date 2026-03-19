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

    cy.task('stubOSDataHub', {
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
            },
          },
          {
            DPA: {
              BUILDING_NUMBER: 11,
              THOROUGHFARE_NAME: 'DOWNING STREET',
              POST_TOWN: 'LONDON',
              POSTCODE: 'SW1A 2AA',
            },
          },
        ],
      },
    })

    cy.signIn()
  })

  it('has correct elements', () => {
    const page = Page.visit(
      AddressResultPage,
      { orderId: mockOrderId, addressType: 'PRIMARY' },
      { postcode: 'SW1A 2AA' },
    )
    page.form.addressResultsField.element.contains('2 addresses found for SW1A 2AA. Search again')
    page.form.addressResultsField.shouldHaveOption('10 Downing Street, London, SW1A 2AA')
    page.form.addressResultsField.shouldHaveOption('11 Downing Street, London, SW1A 2AA')
  })
})
