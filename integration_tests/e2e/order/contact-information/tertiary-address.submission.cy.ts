import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import TertiaryAddressPage from '../../../pages/order/contact-information/tertiary-adddress'
import InterestedPartiesPage from '../../../pages/order/contact-information/interested-parties'
import OrderSummaryPage from '../../../pages/order/summary'

const mockOrderId = uuidv4()
const apiPath = '/address'

context('Contact information', () => {
  context('Tertiary address', () => {
    context('Submitting a valid response', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            deviceWearer: {
              nomisId: null,
              pncId: null,
              deliusId: null,
              prisonNumber: null,
              homeOfficeReferenceNumber: null,
              firstName: null,
              lastName: null,
              alias: null,
              dateOfBirth: null,
              adultAtTimeOfInstallation: false,
              sex: null,
              gender: null,
              disabilities: '',
              noFixedAbode: false,
              interpreterRequired: null,
            },
          },
        })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            addressType: 'TERTIARY',
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
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
        })

        const validFormData = {
          line1: 'line 1',
          line2: 'line 2',
          line3: 'line 3',
          line4: 'line 4',
          postcode: 'postcode',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            addressType: 'TERTIARY',
            addressLine1: 'line 1',
            addressLine2: 'line 2',
            addressLine3: 'line 3',
            addressLine4: 'line 4',
            postcode: 'postcode',
          },
        }).should('be.true')
      })

      it('should continue to collect responsible officer', () => {
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
        })

        const validFormData = {
          line1: 'line 1',
          line2: 'line 2',
          line3: 'line 3',
          line4: 'line 4',
          postcode: 'postcode',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        Page.verifyOnPage(InterestedPartiesPage)
      })

      it('should return to the summary page', () => {
        const page = Page.visit(TertiaryAddressPage, {
          orderId: mockOrderId,
          'addressType(primary|secondary|tertiary)': 'tertiary',
        })

        const validFormData = {
          line1: 'line 1',
          line2: 'line 2',
          line3: 'line 3',
          line4: 'line 4',
          postcode: 'postcode',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAsDraftButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })
  })
})
