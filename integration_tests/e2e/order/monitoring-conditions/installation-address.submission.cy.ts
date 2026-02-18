import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'

const mockOrderId = uuidv4()
const apiPath = '/address'

context('Monitoring conditions', () => {
  context('Installation address', () => {
    context('Submitting a valid response with all monitoring conditions selected', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            monitoringConditions: {
              orderType: 'IMMIGRATION',
              orderTypeDescription: null,
              conditionType: null,
              acquisitiveCrime: false,
              dapol: false,
              curfew: true,
              exclusionZone: true,
              trail: true,
              mandatoryAttendance: true,
              alcohol: true,
              startDate: null,
              endDate: null,
              sentenceType: null,
              issp: null,
              hdc: null,
              prarr: null,
              pilot: null,
              offenceType: null,
            },
          },
        })
        cy.task('stubCemoSubmitOrder', {
          httpStatus: 200,
          id: mockOrderId,
          subPath: apiPath,
          response: {
            addressType: 'INSTALLATION',
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
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })

        const validFormData = {
          addressLine1: 'line 1',
          addressLine2: 'line 2',
          addressLine3: 'line 3',
          addressLine4: 'line 4',
          postcode: 'postcode',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndContinueButton.click()

        cy.task('stubCemoVerifyRequestReceived', {
          uri: `/orders/${mockOrderId}${apiPath}`,
          body: {
            addressType: 'INSTALLATION',
            addressLine1: 'line 1',
            addressLine2: 'line 2',
            addressLine3: 'line 3',
            addressLine4: 'line 4',
            postcode: 'postcode',
            hasAnotherAddress: false,
          },
        }).should('be.true')
      })

      it('should return to the summary page', () => {
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })

        const validFormData = {
          addressLine1: 'line 1',
          addressLine2: 'line 2',
          addressLine3: 'line 3',
          addressLine4: 'line 4',
          postcode: 'postcode',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAsDraftButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })
  })
})
