import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import ConfirmAddressPage from './confirmAddressPage'
import AddressListPage from '../address-list/addressListPage'
import OrderSummaryPage from '../../../../pages/order/summary'
import MonitoringConditionsCheckYourAnswersPage from '../../../../pages/order/monitoring-conditions/check-your-answers'

context('confirm address page submission', () => {
  context('device wearer and curfew addresses', () => {
    const mockOrderId = uuidv4()

    beforeEach(() => {
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          addresses: [
            {
              addressType: 'PRIMARY',
              addressLine1: '10 downing street',
              addressLine2: '',
              addressLine3: 'London',
              addressLine4: 'ENGLAND',
              postcode: 'SW1A 2AA',
            },
            {
              addressType: 'SECONDARY',
              addressLine1: '10 downing street',
              addressLine2: '',
              addressLine3: 'London',
              addressLine4: 'ENGLAND',
              postcode: 'SW1A 2AA',
            },
            {
              addressType: 'INSTALLATION',
              addressLine1: '10 downing street',
              addressLine2: '',
              addressLine3: 'London',
              addressLine4: 'ENGLAND',
              postcode: 'SW1A 2AA',
            },
          ],
        },
      })

      cy.signIn()
    })

    it('continues to address list for device wearer address', () => {
      const page = Page.visit(
        ConfirmAddressPage,
        { orderId: mockOrderId, addressType: 'PRIMARY' },
        { postcode: 'SW1A 2AA', buildingId: '10' },
      )

      page.form.useAddressButton.click()

      Page.verifyOnPage(AddressListPage, { orderId: mockOrderId })
    })

    it('continues to the address list for the curfew address', () => {
      const page = Page.visit(
        ConfirmAddressPage,
        { orderId: mockOrderId, addressType: 'SECONDARY' },
        { postcode: 'SW1A 2AA', buildingId: '10' },
      )

      page.form.useAddressButton.click()

      Page.verifyOnPage(AddressListPage, { orderId: mockOrderId })
    })

    it('return to summmary when save as draft', () => {
      const page = Page.visit(
        ConfirmAddressPage,
        { orderId: mockOrderId, addressType: 'INSTALLATION' },
        { postcode: 'SW1A 2AA', buildingId: '10' },
      )

      page.form.saveAsDraftButton.click()
      Page.verifyOnPage(OrderSummaryPage)
    })
  })
  context('installation address', () => {
    const mockOrderId = uuidv4()

    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          monitoringConditions: {
            orderType: null,
            curfew: false,
            exclusionZone: false,
            trail: false,
            mandatoryAttendance: false,
            alcohol: true,
            orderTypeDescription: null,
            conditionType: null,
            startDate: null,
            endDate: null,
            sentenceType: null,
            issp: null,
            hdc: null,
            offenceType: null,
            prarr: null,
            pilot: null,
            dapolMissedInError: null,
            isValid: false,
          },
          addresses: [
            {
              addressType: 'INSTALLATION',
              addressLine1: '10 downing street',
              addressLine2: '',
              addressLine3: 'London',
              addressLine4: 'ENGLAND',
              postcode: 'SW1A 2AA',
            },
          ],
        },
      })

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

      cy.signIn()
    })

    it('continues to next page using task list', () => {
      const page = Page.visit(
        ConfirmAddressPage,
        { orderId: mockOrderId, addressType: 'INSTALLATION' },
        { postcode: 'SW1A 2AA', buildingId: '10' },
      )

      page.form.useAddressButton.click()

      Page.verifyOnPage(MonitoringConditionsCheckYourAnswersPage, 'Check your answers')
    })
  })
})
