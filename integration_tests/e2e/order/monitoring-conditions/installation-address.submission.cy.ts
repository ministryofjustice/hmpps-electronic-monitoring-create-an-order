import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import InstallationAddressPage from '../../../pages/order/monitoring-conditions/installation-address'
import CurfewReleaseDatePage from '../../../pages/order/monitoring-conditions/curfew-release-date'
import TrailMonitoringPage from '../../../pages/order/monitoring-conditions/trail-monitoring'
import AlcoholMonitoringPage from '../../../pages/order/monitoring-conditions/alcohol-monitoring'
import EnforcementZonePage from '../../../pages/order/monitoring-conditions/enforcement-zone'
import AttendanceMonitoringPage from '../../../pages/order/monitoring-conditions/attendance-monitoring'

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
              orderType: 'immigration',
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
            addressType: 'INSTALLATION',
            addressLine1: 'line 1',
            addressLine2: 'line 2',
            addressLine3: 'line 3',
            addressLine4: 'line 4',
            postcode: 'postcode',
          },
        }).should('be.true')
      })

      it('should continue to collect curfew conditions', () => {
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
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

        Page.verifyOnPage(CurfewReleaseDatePage)
      })

      it('should return to the summary page', () => {
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
        })

        const validFormData = {
          line1: 'line 1',
          line2: 'line 2',
          line3: 'line 3',
          line4: 'line 4',
          postcode: 'postcode',
        }

        page.form.fillInWith(validFormData)
        page.form.saveAndReturnButton.click()

        Page.verifyOnPage(OrderSummaryPage)
      })
    })

    context('Submittig a valid response with only trail monitoring selected', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            monitoringConditions: {
              orderType: 'immigration',
              orderTypeDescription: null,
              conditionType: null,
              acquisitiveCrime: false,
              dapol: false,
              curfew: false,
              exclusionZone: false,
              trail: true,
              mandatoryAttendance: false,
              alcohol: false,
              startDate: null,
              endDate: null,
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

      it('should continue to collect trail monitoring conditions', () => {
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
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

        Page.verifyOnPage(TrailMonitoringPage)
      })
    })

    context('Submittig a valid response with only alcohol monitoring selected', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            monitoringConditions: {
              orderType: 'immigration',
              orderTypeDescription: null,
              conditionType: null,
              acquisitiveCrime: false,
              dapol: false,
              curfew: false,
              exclusionZone: false,
              trail: false,
              mandatoryAttendance: false,
              alcohol: true,
              startDate: null,
              endDate: null,
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

      it('should continue to collect alcohol monitoring conditions', () => {
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
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

        Page.verifyOnPage(AlcoholMonitoringPage)
      })
    })

    context('Submittig a valid response with only exclusion zone monitoring selected', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            monitoringConditions: {
              orderType: 'immigration',
              orderTypeDescription: null,
              conditionType: null,
              acquisitiveCrime: false,
              dapol: false,
              curfew: false,
              exclusionZone: true,
              trail: false,
              mandatoryAttendance: false,
              alcohol: false,
              startDate: null,
              endDate: null,
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

      it('should continue to collect exclusion zone monitoring conditions', () => {
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
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

        Page.verifyOnPage(EnforcementZonePage)
      })
    })

    context('Submittig a valid response with only attendance monitoring selected', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'IN_PROGRESS',
          order: {
            monitoringConditions: {
              orderType: 'immigration',
              orderTypeDescription: null,
              conditionType: null,
              acquisitiveCrime: false,
              dapol: false,
              curfew: false,
              exclusionZone: false,
              trail: false,
              mandatoryAttendance: true,
              alcohol: false,
              startDate: null,
              endDate: null,
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

      it('should continue to collect attendance monitoring conditions', () => {
        const page = Page.visit(InstallationAddressPage, {
          orderId: mockOrderId,
          'addressType(installation)': 'installation',
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

        Page.verifyOnPage(AttendanceMonitoringPage)
      })
    })
  })
})
