import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import PrimaryAddressPage from '../../../pages/order/contact-information/primary-address'
import NotifyingOrganisationPage from '../../../pages/order/contact-information/notifyingOrganisation'
import OrderSummaryPage from '../../../pages/order/summary'
import SecondaryAddressPage from '../../../pages/order/contact-information/secondary-address'

const mockOrderId = uuidv4()
const apiPath = '/address'

context('Contact information', () => {
  context('Primary address', () => {
    context('Submitting a valid response', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
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

      it('should submit a correctly formatted address submission', () => {
        const page = Page.visit(PrimaryAddressPage, { orderId: mockOrderId, addressType: 'primary' })

        const validFormData = {
          addressLine1: 'line 1',
          addressLine2: 'line 2',
          addressLine3: 'line 3',
          addressLine4: 'line 3',
          postcode: 'postcode',
          hasAnotherAddress: 'No',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            addressType: 'PRIMARY',
            addressLine1: 'line 1',
            addressLine2: 'line 2',
            addressLine3: 'line 3',
            addressLine4: 'line 3',
            postcode: 'postcode',
          },
        }).should('be.true')
      })

      it('should continue to collect secondary address details', () => {
        const page = Page.visit(PrimaryAddressPage, { orderId: mockOrderId, addressType: 'primary' })

        const validFormData = {
          addressLine1: 'line 1',
          addressLine2: 'line 2',
          addressLine3: 'line 3',
          addressLine4: 'line 3',
          postcode: 'postcode',
          hasAnotherAddress: 'Yes',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(SecondaryAddressPage)
      })

      it('should continue to collect responsible officer', () => {
        const page = Page.visit(PrimaryAddressPage, { orderId: mockOrderId, addressType: 'primary' })

        const validFormData = {
          addressLine1: 'line 1',
          addressLine2: 'line 2',
          addressLine3: 'line 3',
          addressLine4: 'line 3',
          postcode: 'postcode',
          hasAnotherAddress: 'No',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(NotifyingOrganisationPage)
      })

      it('should return to the summary page', () => {
        const page = Page.visit(PrimaryAddressPage, { orderId: mockOrderId, addressType: 'primary' })

        const validFormData = {
          addressLine1: 'line 1',
          addressLine2: 'line 2',
          addressLine3: 'line 3',
          addressLine4: 'line 3',
          postcode: 'postcode',
          hasAnotherAddress: 'No',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndReturnButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })
  })
})