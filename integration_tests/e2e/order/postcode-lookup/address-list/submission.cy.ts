import { v4 as uuidv4 } from 'uuid'
import AddressListPage from './addressListPage'
import Page from '../../../../pages/page'
import FindAddressPage from '../find-address/findAddressPage'
import InterestedPartiesPage from '../../../../pages/order/contact-information/interested-parties'
import OrderTasksPage from '../../../../pages/order/summary'
import DeviceWearerCheckYourAnswersPage from '../../../../pages/order/about-the-device-wearer/check-your-answers'

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

  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  it('can select yes to additional addresses', () => {
    const page = Page.visit(AddressListPage, { orderId: mockOrderId })

    page.form.fillInWith('Yes')
    page.form.saveAndContinueButton.click()

    const findAddressPage = Page.verifyOnPage(FindAddressPage, { orderId: mockOrderId })
    findAddressPage.checkUrl({ orderId: mockOrderId, addressType: 'TERTIARY' })
  })

  it('can select no to additional addresses', () => {
    const page = Page.visit(AddressListPage, { orderId: mockOrderId })

    page.form.fillInWith('No')
    page.form.saveAndContinueButton.click()

    Page.verifyOnPage(InterestedPartiesPage, { orderId: mockOrderId })
  })

  it('can select no to additional addresses when interested parties flow is enabled', () => {
    cy.task('setFeatureFlags', { INTERESTED_PARTIES_FLOW_ENABLED: true })
    const page = Page.visit(AddressListPage, { orderId: mockOrderId })

    page.form.fillInWith('No')
    page.form.saveAndContinueButton.click()

    Page.verifyOnPage(DeviceWearerCheckYourAnswersPage, { orderId: mockOrderId }, {}, 'Check your answer')
  })

  it('can save as draft', () => {
    const page = Page.visit(AddressListPage, { orderId: mockOrderId })

    page.form.fillInWith('No')
    page.form.saveAsDraftButton.click()

    Page.verifyOnPage(OrderTasksPage, { orderId: mockOrderId })
  })

  context('when the user enters two additional addresses', () => {
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
            {
              addressType: 'TERTIARY',
              addressLine1: '12 Downing Street',
              addressLine2: '',
              addressLine3: 'London',
              addressLine4: 'ENGLAND',
              postcode: 'SW1A 2AA',
            },
          ],
        },
      })
    })
    it('allows the user to progress without saying no to add another', () => {
      const page = Page.visit(AddressListPage, { orderId: mockOrderId })

      page.form.saveAndContinueButton.click()

      Page.verifyOnPage(InterestedPartiesPage, { orderId: mockOrderId })
    })
  })
})
