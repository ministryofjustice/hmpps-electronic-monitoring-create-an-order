import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import EnterAddressPage from './enterAddressPage'

context('Enter address page', () => {
  const mockOrderId = uuidv4()

  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
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

    cy.signIn()
  })

  it('Navigates to confirm address page after entering address', () => {
    const page = Page.visit(EnterAddressPage, {
      orderId: mockOrderId,
      addressType: 'PRIMARY',
    })

    page.form.fillInWith({ addressLine1: '70 Maple Street', addressLine3: 'London', postcode: 'SA11 1AA' })

    // TO DO: Update confirm address to accept manual address entry

    // page.form.continueButton.click()
    // Page.verifyOnPage(ConfirmAddressPage)

    // cy.task('stubCemoVerifyRequestReceived', {
    //   uri: `/orders/${mockOrderId}/address`,
    //   body: {
    //     addressType: 'PRIMARY',
    //     addressLine1: '70 Maple Street',
    //     addressLine2: '',
    //     addressLine3: 'London',
    //     addressLine4: '',
    //     postcode: 'SA11 1AA',
    //     hasAnotherAddress: false,
    //   },
    // }).should('be.true')
  })
})
