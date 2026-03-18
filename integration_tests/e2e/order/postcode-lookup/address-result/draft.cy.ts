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
      postcode: 'SA111AA',
      body: {
        results: [
          {
            DPA: { BUILDING_NUMBER: 10, THROUGHFARE_NAME: 'DOWNING STREET', POST_TOWN: 'LONDON', POSTCODE: 'SA11 1AA' },
          },
        ],
      },
    })

    cy.signIn()
  })

  it('has correct elements', () => {
    Page.visit(AddressResultPage, { orderId: mockOrderId, addressType: 'primary' })

    // TODO: next time
    // page.form.addressResultsField.shouldHaveOption('10 Downing Street, London, SW11 A11')
  })
})
