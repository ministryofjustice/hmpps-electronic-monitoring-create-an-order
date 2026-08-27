import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import ContactDetailsPage from '../../../pages/order/contact-information/contact-details'
import NoFixedAbodePage from '../../../pages/order/contact-information/no-fixed-abode'
import mockApiOrder from '../../../utils/data/ApiOrder'
import ConfirmAddressPage from '../postcode-lookup/confirm-address/confirmAddressPage'

const mockOrderId = uuidv4()
const prisonNumber = 'A1234BC'
const contactNumber = '01234567890'

const corePersonDetails = (addresses: Record<string, unknown>[]) => ({
  firstName: 'Ada',
  lastName: 'Lovelace',
  dateOfBirth: '1980-01-01T00:00:00Z',
  organisationSearchId: prisonNumber,
  addresses,
})

const submitContactDetails = () => {
  const page = Page.visit(ContactDetailsPage, { orderId: mockOrderId })

  page.form.fillInWith({ contactNumber })
  page.form.saveAndContinueButton.click()
}

context('Core Person address retrieval', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    const order = mockApiOrder()
    order.id = mockOrderId
    order.deviceWearer.prisonNumber = prisonNumber
    order.interestedParties = {
      notifyingOrganisation: 'PRISON',
      responsibleOrganisation: null,
    }

    cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', order })
    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: '/contact-details',
      response: {
        contactNumber,
        phoneNumberAvailable: true,
      },
    })

    cy.signIn()
  })

  it('shows a retrieved primary address and links to the fixed address page', () => {
    cy.task('stubCemoGetDeviceWearerDetails', {
      httpStatus: 200,
      id: mockOrderId,
      organisationSearchId: prisonNumber,
      response: corePersonDetails([
        {
          addressType: 'PRIMARY',
          addressLine1: '1 Washington Street',
          addressLine2: '',
          addressLine3: 'Worcester',
          addressLine4: '',
          postcode: 'WR1 1NL',
        },
      ]),
    })

    submitContactDetails()

    const page = Page.verifyOnPage(
      ConfirmAddressPage,
      { orderId: mockOrderId, addressType: 'PRIMARY' },
      { organisationSearchId: prisonNumber },
    )
    page.form.corePersonAddressInset
      .should('contain.text', 'Check that this is the address where the person wearing the monitoring device will live')
      .and('contain.text', '1 Washington Street')
      .and('contain.text', 'WR1 1NL')
    page.form.searchForDifferentAddressLink.should('exist')
    page.form.noFixedAddressLink.click()

    Page.verifyOnPage(NoFixedAbodePage, { orderId: mockOrderId })
  })

  it('continues to the fixed address page when no primary address is found', () => {
    cy.task('stubCemoGetDeviceWearerDetails', {
      httpStatus: 200,
      id: mockOrderId,
      organisationSearchId: prisonNumber,
      response: corePersonDetails([]),
    })

    submitContactDetails()

    Page.verifyOnPage(NoFixedAbodePage, { orderId: mockOrderId })
  })
})
