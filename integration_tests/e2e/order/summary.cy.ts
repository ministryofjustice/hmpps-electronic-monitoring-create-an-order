import { v4 as uuidv4 } from 'uuid'
import OrderTasksPage from '../../pages/order/summary'
import ErrorPage from '../../pages/error'
import Page from '../../pages/page'

const mockOrderId = uuidv4()

context('Order Summary', () => {
  context('New Order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      // Create an order with noFixedAbode set to null and all monitoringConditions set to null
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })

      cy.signIn()
    })

    it('Display the common page elements and the submit order button', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')
      page.submitOrderButton.should('exist')
    })

    it('should display all tasks as incomplete or unable to start for a new order', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.deviceWearerTask.shouldHaveStatus('Incomplete')
      page.deviceWearerTask.shouldBeEnabled()

      page.responsibleAdultTask.shouldHaveStatus('Cannot start yet')
      page.responsibleAdultTask.shouldBeDisabled()

      page.contactDetailsTask.shouldHaveStatus('Incomplete')
      page.contactDetailsTask.shouldHaveStatus('Optional')
      page.contactDetailsTask.shouldBeEnabled()

      page.noFixedAbodeTask.shouldHaveStatus('Incomplete')
      page.noFixedAbodeTask.shouldBeEnabled()

      page.primaryAddressTask.shouldHaveStatus('Cannot start yet')
      page.primaryAddressTask.shouldBeDisabled()

      page.secondaryAddressTask.shouldHaveStatus('Cannot start yet')
      page.secondaryAddressTask.shouldBeDisabled()

      page.tertiaryAddressTask.shouldHaveStatus('Cannot start yet')
      page.tertiaryAddressTask.shouldBeDisabled()

      page.interestedPartiesTask.shouldHaveStatus('Incomplete')
      page.interestedPartiesTask.shouldBeEnabled()

      page.installationAndRiskTask.shouldHaveStatus('Incomplete')
      page.installationAndRiskTask.shouldBeEnabled()

      page.monitoringConditionsTask.shouldHaveStatus('Incomplete')
      page.monitoringConditionsTask.shouldBeEnabled()

      page.curfewReleaseDateTask.shouldHaveStatus('Cannot start yet')
      page.curfewReleaseDateTask.shouldBeDisabled()

      page.curfewConditionsTask.shouldHaveStatus('Cannot start yet')
      page.curfewConditionsTask.shouldBeDisabled()

      page.curfewTimetableTask.shouldHaveStatus('Cannot start yet')
      page.curfewTimetableTask.shouldBeDisabled()

      page.zoneTask.shouldHaveStatus('Cannot start yet')
      page.zoneTask.shouldBeDisabled()

      page.trailTask.shouldHaveStatus('Cannot start yet')
      page.trailTask.shouldBeDisabled()

      page.attendanceTask.shouldHaveStatus('Cannot start yet')
      page.attendanceTask.shouldBeDisabled()

      page.alcoholTask.shouldHaveStatus('Cannot start yet')
      page.alcoholTask.shouldBeDisabled()

      page.attachmentsTask.shouldHaveStatus('Incomplete')
      page.attachmentsTask.shouldHaveStatus('Optional')
      page.attachmentsTask.shouldBeEnabled()
    })

    it('Should be accessible', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })
  })

  context('Order with all tasks enabled', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      // Create an order with noFixedAbode set to false and all monitoring conditions selected
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          id: '35682f41-da04-4d60-977d-614355293434',
          status: 'IN_PROGRESS',
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
          deviceWearerResponsibleAdult: null,
          contactDetails: null,
          installationAndRisk: null,
          interestedParties: null,
          enforcementZoneConditions: [],
          addresses: [],
          additionalDocuments: [],
          monitoringConditions: {
            orderType: null,
            curfew: true,
            exclusionZone: true,
            trail: true,
            mandatoryAttendance: true,
            alcohol: true,
            orderTypeDescription: null,
            conditionType: null,
            startDate: null,
            endDate: null,
            isValid: false,
          },
          monitoringConditionsTrail: null,
          monitoringConditionsAlcohol: null,
          isValid: false,
        },
      })

      cy.signIn()
    })

    it('should display all tasks as incomplete', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.deviceWearerTask.shouldHaveStatus('Incomplete')
      page.deviceWearerTask.shouldBeEnabled()

      page.responsibleAdultTask.shouldHaveStatus('Incomplete')
      page.responsibleAdultTask.shouldBeEnabled()

      page.contactDetailsTask.shouldHaveStatus('Incomplete')
      page.contactDetailsTask.shouldHaveStatus('Optional')
      page.contactDetailsTask.shouldBeEnabled()

      page.noFixedAbodeTask.shouldHaveStatus('Complete')
      page.noFixedAbodeTask.shouldBeEnabled()

      page.primaryAddressTask.shouldHaveStatus('Incomplete')
      page.primaryAddressTask.shouldBeEnabled()

      page.secondaryAddressTask.shouldHaveStatus('Incomplete')
      page.secondaryAddressTask.shouldBeEnabled()

      page.tertiaryAddressTask.shouldHaveStatus('Incomplete')
      page.tertiaryAddressTask.shouldBeEnabled()

      page.interestedPartiesTask.shouldHaveStatus('Incomplete')
      page.interestedPartiesTask.shouldBeEnabled()

      page.installationAndRiskTask.shouldHaveStatus('Incomplete')
      page.installationAndRiskTask.shouldBeEnabled()

      page.monitoringConditionsTask.shouldHaveStatus('Incomplete')
      page.monitoringConditionsTask.shouldBeEnabled()

      page.curfewReleaseDateTask.shouldHaveStatus('Incomplete')
      page.curfewReleaseDateTask.shouldBeEnabled()

      page.curfewConditionsTask.shouldHaveStatus('Incomplete')
      page.curfewConditionsTask.shouldBeEnabled()

      page.curfewTimetableTask.shouldHaveStatus('Incomplete')
      page.curfewTimetableTask.shouldBeEnabled()

      page.zoneTask.shouldHaveStatus('Incomplete')
      page.zoneTask.shouldBeEnabled()

      page.trailTask.shouldHaveStatus('Incomplete')
      page.trailTask.shouldBeEnabled()

      page.attendanceTask.shouldHaveStatus('Incomplete')
      page.attendanceTask.shouldBeEnabled()

      page.alcoholTask.shouldHaveStatus('Incomplete')
      page.alcoholTask.shouldBeEnabled()

      page.attachmentsTask.shouldHaveStatus('Incomplete')
      page.attachmentsTask.shouldHaveStatus('Optional')
      page.attachmentsTask.shouldBeEnabled()
    })
  })

  context('Submitted Order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      // Create an order with all fields present (even though they're not valid)
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          id: 'bddf3cdf-1cf7-42df-a08a-9b03fe53cd29',
          status: 'IN_PROGRESS',
          deviceWearer: {
            nomisId: null,
            pncId: null,
            deliusId: null,
            prisonNumber: null,
            homeOfficeReferenceNumber: null,
            firstName: '',
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
          deviceWearerResponsibleAdult: {
            contactNumber: null,
            fullName: null,
            otherRelationshipDetails: null,
            relationship: null,
          },
          contactDetails: { contactNumber: '' },
          installationAndRisk: {
            mappaCaseType: null,
            mappaLevel: null,
            riskCategory: null,
            riskDetails: null,
            offence: null,
          },
          interestedParties: {
            notifyingOrganisationEmail: '',
            responsibleOfficerName: '',
            responsibleOfficerPhoneNumber: '',
            responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
            responsibleOrganisationAddress: {
              addressType: 'RESPONSIBLE_ORGANISATION',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
            responsibleOrganisationEmail: '',
            responsibleOrganisationPhoneNumber: '',
            responsibleOrganisationRegion: '',
          },
          enforcementZoneConditions: [
            {
              description: null,
              duration: null,
              endDate: null,
              fileId: null,
              fileName: null,
              startDate: null,
              zoneId: null,
              zoneType: null,
            },
          ],
          addresses: [
            {
              addressType: 'PRIMARY',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
            {
              addressType: 'SECONDARY',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
            {
              addressType: 'TERTIARY',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
            {
              addressType: 'INSTALLATION',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
          ],
          additionalDocuments: [],
          monitoringConditions: {
            orderType: null,
            curfew: true,
            exclusionZone: true,
            trail: true,
            mandatoryAttendance: true,
            alcohol: true,
            orderTypeDescription: null,
            conditionType: null,
            startDate: null,
            endDate: null,
            isValid: true,
          },
          monitoringConditionsTrail: { startDate: null, endDate: null },
          monitoringConditionsAlcohol: {
            endDate: null,
            installationLocation: null,
            monitoringType: null,
            prisonName: null,
            probationOfficeName: null,
            startDate: null,
          },
          isValid: false,
          mandatoryAttendanceConditions: [
            {
              addressLine1: null,
              addressLine2: null,
              addressLine3: null,
              addressLine4: null,
              appointmentDay: null,
              endDate: null,
              endTime: null,
              postcode: null,
              purpose: null,
              startDate: null,
              startTime: null,
            },
          ],
          curfewReleaseDateConditions: {
            curfewAddress: null,
            endTime: null,
            orderId: null,
            releaseDate: null,
            startTime: null,
          },
          curfewConditions: {
            curfewAddress: null,
            endDate: null,
            orderId: null,
            startDate: null,
          },
          curfewTimeTable: [
            {
              curfewAddress: '',
              dayOfWeek: '',
              endTime: '',
              orderId: '',
              startTime: '',
            },
          ],
        },
      })

      cy.signIn()
    })

    it('Submit order form should exist', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.backToSearchButton.should('exist')
    })

    it('should display all tasks as complete', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.deviceWearerTask.shouldHaveStatus('Complete')
      page.deviceWearerTask.shouldBeEnabled()

      page.responsibleAdultTask.shouldHaveStatus('Complete')
      page.responsibleAdultTask.shouldBeEnabled()

      page.contactDetailsTask.shouldHaveStatus('Complete')
      page.contactDetailsTask.shouldHaveStatus('Optional')
      page.contactDetailsTask.shouldBeEnabled()

      page.noFixedAbodeTask.shouldHaveStatus('Complete')
      page.noFixedAbodeTask.shouldBeEnabled()

      page.primaryAddressTask.shouldHaveStatus('Complete')
      page.primaryAddressTask.shouldBeEnabled()

      page.secondaryAddressTask.shouldHaveStatus('Complete')
      page.secondaryAddressTask.shouldBeEnabled()

      page.tertiaryAddressTask.shouldHaveStatus('Complete')
      page.tertiaryAddressTask.shouldBeEnabled()

      page.interestedPartiesTask.shouldHaveStatus('Complete')
      page.interestedPartiesTask.shouldBeEnabled()

      page.installationAndRiskTask.shouldHaveStatus('Complete')
      page.installationAndRiskTask.shouldBeEnabled()

      page.monitoringConditionsTask.shouldHaveStatus('Complete')
      page.monitoringConditionsTask.shouldBeEnabled()

      page.curfewReleaseDateTask.shouldHaveStatus('Complete')
      page.curfewReleaseDateTask.shouldBeEnabled()

      page.curfewConditionsTask.shouldHaveStatus('Complete')
      page.curfewConditionsTask.shouldBeEnabled()

      page.curfewTimetableTask.shouldHaveStatus('Complete')
      page.curfewTimetableTask.shouldBeEnabled()

      page.zoneTask.shouldHaveStatus('Complete')
      page.zoneTask.shouldBeEnabled()

      page.trailTask.shouldHaveStatus('Complete')
      page.trailTask.shouldBeEnabled()

      page.attendanceTask.shouldHaveStatus('Complete')
      page.attendanceTask.shouldBeEnabled()

      page.alcoholTask.shouldHaveStatus('Complete')
      page.alcoholTask.shouldBeEnabled()

      // N.B. Attachments can never be complete (atm)
      page.attachmentsTask.shouldHaveStatus('Incomplete')
      page.attachmentsTask.shouldHaveStatus('Optional')
      page.attachmentsTask.shouldBeEnabled()
    })
  })

  context('Unhealthy backend', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoGetOrder', { httpStatus: 404 })
    })

    it('Should indicate to the user that there was an error', () => {
      cy.signIn().visit(`/order/${mockOrderId}/summary`, { failOnStatusCode: false })

      Page.verifyOnPage(ErrorPage, 'Not Found')
    })
  })
})
