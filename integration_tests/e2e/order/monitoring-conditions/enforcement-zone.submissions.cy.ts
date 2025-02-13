import { v4 as uuidv4 } from 'uuid'

import Page from '../../../pages/page'
import EnforcementZonePage from '../../../pages/order/monitoring-conditions/enforcement-zone'
import AttendanceMonitoringPage from '../../../pages/order/monitoring-conditions/attendance-monitoring'
import OrderSummaryPage from '../../../pages/order/summary'
import { EnforcementZoneFormData } from '../../../pages/components/forms/monitoring-conditions/enforcementZoneFormComponent'

const mockOrderId = uuidv4()
const apiPath = '/enforcementZone'
const uploadApiPath = '/attachment'

context('Monitoring conditions - Enforcement Zone', () => {
  context('Submitting a valid Exclusion zone order', () => {
    const zoneType = 'Exclusion zone'
    const zoneTypeId = 'EXCLUSION'

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
          orderId: mockOrderId,
          zoneType: zoneTypeId,
          zoneId: 1,

          startDate: '2024-10-10',
          endDate: '2024-10-11',
          description: 'A test description: Lorum ipsum dolar sit amet...',
          duration: 'A test duration: Lorum ipsum dolar sit amet...',
        },
      })

      cy.signIn()
    })

    it('should submit a correctly formatted Exclusion zone submission', () => {
      const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId, zoneId: 1 })

      const validFormData = {
        zoneType,

        startDate: new Date('2024-10-10T00:00:00.000Z'),
        endDate: new Date('2024-10-11T00:00:00.000Z'),
        description: 'A test description: Lorum ipsum dolar sit amet...',
        duration: 'A test duration: Lorum ipsum dolar sit amet...',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${apiPath}`,
        body: {
          orderId: mockOrderId,
          zoneType: zoneTypeId,
          zoneId: 1,

          startDate: '2024-10-10T00:00:00.000Z',
          endDate: '2024-10-11T00:00:00.000Z',
          description: 'A test description: Lorum ipsum dolar sit amet...',
          duration: 'A test duration: Lorum ipsum dolar sit amet...',
        },
      }).should('be.true')
    })

    it('should continue to collect attendance monitoring data', () => {
      const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId, zoneId: 1 })

      const validFormData = {
        zoneType,

        startDate: new Date('2024-10-10T00:00:00.000Z'),
        endDate: new Date('2024-10-11T00:00:00.000Z'),
        description: 'A test description: Lorum ipsum dolar sit amet...',
        duration: 'A test duration: Lorum ipsum dolar sit amet...',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()

      Page.verifyOnPage(AttendanceMonitoringPage)
    })

    it('should return to the summary page', () => {
      const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId, zoneId: 1 })

      const validFormData = {
        zoneType,

        startDate: new Date('2024-10-10T00:00:00.000Z'),
        endDate: new Date('2024-10-11T00:00:00.000Z'),
        description: 'A test description: Lorum ipsum dolar sit amet...',
        duration: 'A test duration: Lorum ipsum dolar sit amet...',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndReturnButton.click()

      Page.verifyOnPage(OrderSummaryPage)
    })
  })

  context('Submitting a valid Inclusion zone order', () => {
    const zoneType = 'Inclusion zone'
    const zoneTypeId = 'INCLUSION'

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
          orderId: mockOrderId,
          zoneType: zoneTypeId,
          zoneId: 1,

          startDate: '2024-10-10',
          endDate: '2024-10-11',
          description: 'A test description: Lorum ipsum dolar sit amet...',
          duration: 'A test duration: Lorum ipsum dolar sit amet...',
        },
      })

      cy.signIn()
    })

    it('should submit a correctly formatted Exclusion zone submission', () => {
      const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId, zoneId: 1 }) //

      const validFormData = {
        zoneType,

        startDate: new Date('2024-10-10T00:00:00.000Z'),
        endDate: new Date('2024-10-11T00:00:00.000Z'),
        description: 'A test description: Lorum ipsum dolar sit amet...',
        duration: 'A test duration: Lorum ipsum dolar sit amet...',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${apiPath}`,
        body: {
          orderId: mockOrderId,
          zoneType: zoneTypeId,
          zoneId: 1,

          startDate: '2024-10-10T00:00:00.000Z',
          endDate: '2024-10-11T00:00:00.000Z',
          description: 'A test description: Lorum ipsum dolar sit amet...',
          duration: 'A test duration: Lorum ipsum dolar sit amet...',
        },
      }).should('be.true')
    })

    it('should continue to collect attendance monitoring data', () => {
      const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId, zoneId: 1 })

      const validFormData = {
        zoneType,

        startDate: new Date('2024-10-10T00:00:00.000Z'),
        endDate: new Date('2024-10-11T00:00:00.000Z'),
        description: 'A test description: Lorum ipsum dolar sit amet...',
        duration: 'A test duration: Lorum ipsum dolar sit amet...',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()

      Page.verifyOnPage(AttendanceMonitoringPage)
    })

    it('should continue to collect the next enforcement zones data', () => {
      const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId, zoneId: 1 })

      const validFormData: EnforcementZoneFormData = {
        zoneType,

        startDate: new Date('2024-10-10T00:00:00.000Z'),
        endDate: new Date('2024-10-11T00:00:00.000Z'),
        description: 'A test description: Lorum ipsum dolar sit amet...',
        duration: 'A test duration: Lorum ipsum dolar sit amet...',

        anotherZone: 'Yes',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()

      Page.verifyOnPage(EnforcementZonePage, { orderId: mockOrderId, zoneId: 2 })
    })

    it('should return to the summary page', () => {
      const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId, zoneId: 1 })

      const validFormData = {
        zoneType,

        startDate: new Date('2024-10-10T00:00:00.000Z'),
        endDate: new Date('2024-10-11T00:00:00.000Z'),
        description: 'A test description: Lorum ipsum dolar sit amet...',
        duration: 'A test duration: Lorum ipsum dolar sit amet...',
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndReturnButton.click()

      Page.verifyOnPage(OrderSummaryPage)
    })
  })

  context('submitting an enforcement zone order with a file', () => {
    const zoneId = 1
    const zoneType = 'Inclusion zone'
    const zoneTypeId = 'INCLUSION'
    const fileContents = 'Test image file'

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
          orderId: mockOrderId,
          zoneType: zoneTypeId,
          zoneId,

          startDate: '2024-10-10',
          endDate: '2024-10-11',
          description: 'A test description: Lorum ipsum dolar sit amet...',
          duration: 'A test duration: Lorum ipsum dolar sit amet...',
        },
      })
      cy.task('stubCemoSubmitOrder', {
        httpStatus: 200,
        method: 'POST',
        id: mockOrderId,
        subPath: `${apiPath}/${zoneId}${uploadApiPath}`,
        response: {},
      })

      cy.signIn()
    })

    it('should submit a correctly formatted file upload submission', () => {
      const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId, zoneId })

      const validFormData = {
        zoneType,

        startDate: new Date('2024-10-10T00:00:00.000Z'),
        endDate: new Date('2024-10-11T00:00:00.000Z'),
        description: 'A test description: Lorum ipsum dolar sit amet...',
        duration: 'A test duration: Lorum ipsum dolar sit amet...',

        uploadFile: {
          fileName: 'test-image.png',
          contents: fileContents,
        },
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()

      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders/${mockOrderId}${apiPath}/${zoneId}${uploadApiPath}`,
        fileContents: [
          {
            name: 'file',
            filename: 'test-image.png',
            contentType: 'image/png',
            contents: 'Test image file',
          },
        ],
      }).should('be.true')
    })

    it('should continue to collect the next enforcement zones data', () => {
      const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId, zoneId: 1 })

      const validFormData: EnforcementZoneFormData = {
        zoneType,

        startDate: new Date('2024-10-10T00:00:00.000Z'),
        endDate: new Date('2024-10-11T00:00:00.000Z'),
        description: 'A test description: Lorum ipsum dolar sit amet...',
        duration: 'A test duration: Lorum ipsum dolar sit amet...',

        uploadFile: {
          fileName: 'test-image.png',
          contents: fileContents,
        },
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndContinueButton.click()

      Page.verifyOnPage(AttendanceMonitoringPage, { orderId: mockOrderId, zoneId: 2 })
    })

    it('should return to the summary page', () => {
      const page = Page.visit(EnforcementZonePage, { orderId: mockOrderId, zoneId: 1 })

      const validFormData = {
        zoneType,

        startDate: new Date('2024-10-10T00:00:00.000Z'),
        endDate: new Date('2024-10-11T00:00:00.000Z'),
        description: 'A test description: Lorum ipsum dolar sit amet...',
        duration: 'A test duration: Lorum ipsum dolar sit amet...',

        uploadFile: {
          fileName: 'test-image.png',
          contents: fileContents,
        },
      }

      page.form.fillInWith(validFormData)
      page.form.saveAndReturnButton.click()

      Page.verifyOnPage(OrderSummaryPage)
    })
  })
})
