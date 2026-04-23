import { v4 as uuidv4 } from 'uuid'
import AddressListPage from './addressListPage'
import Page from '../../../../pages/page'

context('address list', () => {
  const mockOrderId = uuidv4()
  beforeEach(() => {
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
        ],
      },
    })

    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.signIn()
  })

  it('has the correct elements', () => {
    const page = Page.visit(AddressListPage, { orderId: mockOrderId })

    page.form.summaryList.shouldExist()
    page.form.summaryList.shouldHaveItem('Main address', '10 Downing Street, London, ENGLAND, SW1A 2AA')
    page.form.summaryList.shouldHaveItem('Second curfew address', '11 Downing Street, London, ENGLAND, SW1A 2AA')

    page.form.additionalAddresses.shouldExist()
    page.form.additionalAddresses.shouldHaveAllOptions()
  })
})
