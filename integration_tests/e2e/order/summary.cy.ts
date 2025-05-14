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

    it('should display all tasks except Additional Documents as incomplete or unable to start for a new order', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.aboutTheDeviceWearerTask.shouldHaveStatus('Incomplete')
      page.aboutTheDeviceWearerTask.link.should('have.attr', 'href', `/order/${mockOrderId}/about-the-device-wearer`)

      page.contactInformationTask.shouldHaveStatus('Incomplete')
      page.contactInformationTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/contact-information/contact-details`,
      )

      page.riskInformationTask.shouldHaveStatus('Incomplete')
      page.riskInformationTask.link.should('have.attr', 'href', `/order/${mockOrderId}/installation-and-risk`)

      page.electronicMonitoringTask.shouldHaveStatus('Incomplete')
      page.electronicMonitoringTask.link.should('have.attr', 'href', `/order/${mockOrderId}/monitoring-conditions`)

      cy.get('.govuk-task-list__item').should('not.contain', 'Variation details')

      page.submitOrderButton.should('be.disabled')
    })

    it('should display the Additional Documents task as optional for a new order', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.additionalDocumentsTask.shouldHaveStatus('Optional')
      page.additionalDocumentsTask.link.should('have.attr', 'href', `/order/${mockOrderId}/attachments`)
    })

    it('Should be accessible', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })
  })

  context('Variation', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      // Create an order with noFixedAbode set to null and all monitoringConditions set to null
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: { type: 'VARIATION' },
      })

      cy.signIn()
    })

    it('should display all tasks except Additional Documents as incomplete or unable to start for a new variation', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.aboutTheDeviceWearerTask.shouldHaveStatus('Incomplete')
      page.aboutTheDeviceWearerTask.link.should('have.attr', 'href', `/order/${mockOrderId}/about-the-device-wearer`)

      page.contactInformationTask.shouldHaveStatus('Incomplete')
      page.contactInformationTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/contact-information/contact-details`,
      )

      page.riskInformationTask.shouldHaveStatus('Incomplete')
      page.riskInformationTask.link.should('have.attr', 'href', `/order/${mockOrderId}/installation-and-risk`)

      page.electronicMonitoringTask.shouldHaveStatus('Incomplete')
      page.electronicMonitoringTask.link.should('have.attr', 'href', `/order/${mockOrderId}/monitoring-conditions`)

      page.variationDetailsTask.shouldHaveStatus('Incomplete')
      page.variationDetailsTask.link.should('have.attr', 'href', `/order/${mockOrderId}/variation/details`)

      page.submitOrderButton.should('be.disabled')
    })

    it('should display the Additional Documents task as optional for a new variation', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.additionalDocumentsTask.shouldHaveStatus('Optional')
      page.additionalDocumentsTask.link.should('have.attr', 'href', `/order/${mockOrderId}/attachments`)
    })

    it('Should be accessible', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })
  })

  context('Complete order, not submitted', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      // Create an order with all fields present (even though they're not valid)
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          id: mockOrderId,
          status: 'IN_PROGRESS',
          deviceWearer: {
            nomisId: '',
            pncId: null,
            deliusId: null,
            prisonNumber: null,
            homeOfficeReferenceNumber: null,
            firstName: 'Joe',
            lastName: 'Bloggs',
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
            notifyingOrganisation: 'HOME_OFFICE',
            notifyingOrganisationName: '',
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
            sentenceType: null,
            issp: null,
            hdc: null,
            prarr: null,
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
          isValid: true,
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

    it('should display all tasks as complete', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.aboutTheDeviceWearerTask.shouldHaveStatus('Complete')
      page.aboutTheDeviceWearerTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/about-the-device-wearer/check-your-answers`,
      )

      page.contactInformationTask.shouldHaveStatus('Complete')
      page.contactInformationTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/contact-information/check-your-answers`,
      )

      page.riskInformationTask.shouldHaveStatus('Complete')
      page.riskInformationTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/installation-and-risk/check-your-answers`,
      )

      page.electronicMonitoringTask.shouldHaveStatus('Complete')
      page.electronicMonitoringTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/monitoring-conditions/check-your-answers`,
      )

      // page.additionalDocuments.shouldHaveStatus('Complete')
      page.additionalDocumentsTask.link.should('have.attr', 'href', `/order/${mockOrderId}/attachments`)

      cy.get('.govuk-task-list__item').should('not.contain', 'Variation details')

      page.submitOrderButton.should('not.be.disabled')
    })
  })

  context('Complete order, submitted', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      // Create an order with all fields present (even though they're not valid)
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          id: mockOrderId,
          status: 'SUBMITTED',
          deviceWearer: {
            nomisId: '',
            pncId: null,
            deliusId: null,
            prisonNumber: null,
            homeOfficeReferenceNumber: null,
            firstName: 'Joe',
            lastName: 'Bloggs',
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
            notifyingOrganisation: 'HOME_OFFICE',
            notifyingOrganisationName: '',
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
            sentenceType: null,
            issp: null,
            hdc: null,
            prarr: null,
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

      cy.get('h1', { log: false }).contains(`${page.title} for Joe Bloggs`)

      page.aboutTheDeviceWearerTask.shouldNotHaveStatus()
      page.aboutTheDeviceWearerTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/about-the-device-wearer/check-your-answers`,
      )

      page.contactInformationTask.shouldNotHaveStatus()
      page.contactInformationTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/contact-information/check-your-answers`,
      )

      page.riskInformationTask.shouldNotHaveStatus()
      page.riskInformationTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/installation-and-risk/check-your-answers`,
      )

      page.electronicMonitoringTask.shouldNotHaveStatus()
      page.electronicMonitoringTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/monitoring-conditions/check-your-answers`,
      )

      page.additionalDocumentsTask.shouldNotHaveStatus()
      page.additionalDocumentsTask.link.should('have.attr', 'href', `/order/${mockOrderId}/attachments`)

      cy.get('.govuk-task-list__item').should('not.contain', 'Variation details')

      page.submitOrderButton.should('not.exist')
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

      Page.verifyOnPage(ErrorPage, 'Page not found')
    })
  })
})
