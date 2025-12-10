import { v4 as uuidv4 } from 'uuid'
import OrderTasksPage from '../../pages/order/summary'
import ErrorPage from '../../pages/error'
import Page from '../../pages/page'
import AttachmentType from '../../../server/models/AttachmentType'
import CheckYourAnswersPage from '../../pages/order/about-the-device-wearer/check-your-answers'
import ContactInformationCheckYourAnswersPage from '../../pages/order/contact-information/check-your-answers'
import InstallationAndRiskCheckYourAnswersPage from '../../pages/order/installation-and-risk/check-your-answers'
import MonitoringConditionsCheckYourAnswersPage from '../../pages/order/monitoring-conditions/check-your-answers'
import AttachmentSummaryPage from '../../pages/order/attachments/summary'
import ConfirmVariationPage from '../../pages/order/variation/confirmVariation'
import { Order } from '../../../server/models/Order'
import paths from '../../../server/constants/paths'

let mockOrderId = uuidv4()

context('Order Summary', () => {
  context('New Order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      // Create an order with noFixedAbode set to null and all monitoringConditions set to null
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
      })

      cy.task('stubCemoGetVersions', {
        httpStatus: 200,
        versions: [],
        orderId: mockOrderId,
      })

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

      page.electronicMonitoringTask.shouldHaveStatus('Cannot start yet')
      page.electronicMonitoringTask.link.should('not.exist')

      page.additionalDocumentsTask.shouldHaveStatus('Incomplete')
      page.additionalDocumentsTask.link.should('have.attr', 'href', `/order/${mockOrderId}/attachments/licence`)

      cy.get('.govuk-task-list__item').should('not.contain', 'Variation details')

      page.submitOrderButton.should('be.disabled')
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

      cy.task('stubCemoGetVersions', {
        httpStatus: 200,
        versions: [],
        orderId: mockOrderId,
      })

      cy.signIn()
    })

    it('should display all tasks as incomplete or unable to start for a new variation', () => {
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

      page.electronicMonitoringTask.shouldHaveStatus('Cannot start yet')
      page.electronicMonitoringTask.link.should('not.exist')

      page.variationDetailsTask.shouldHaveStatus('Incomplete')
      page.variationDetailsTask.link.should('have.attr', 'href', `/order/${mockOrderId}/variation/details`)

      page.additionalDocumentsTask.shouldHaveStatus('Incomplete')
      page.additionalDocumentsTask.link.should('have.attr', 'href', `/order/${mockOrderId}/attachments/licence`)

      page.submitOrderButton.should('be.disabled')
    })

    it('should have hint text for Variation', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          type: 'VARIATION',
        },
      })

      Page.visit(OrderTasksPage, { orderId: mockOrderId })

      cy.get('.govuk-hint').contains('You are making changes to a submitted form.').should('exist')
    })

    it('should have hint text for REVOCATION', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          type: 'REVOCATION',
        },
      })

      Page.visit(OrderTasksPage, { orderId: mockOrderId })

      cy.get('.govuk-hint').contains('You are ending all monitoring for the device wearer.').should('exist')
    })

    it('should have hint text for REINSTALL_DEVICE', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          type: 'REINSTALL_DEVICE',
        },
      })

      Page.visit(OrderTasksPage, { orderId: mockOrderId })

      cy.get('.govuk-hint')
        .contains('You are requesting monitoring equipment to be reinstalled or checked.')
        .should('exist')
    })

    it('should have hint text for REINSTALL_AT_DIFFERENT_ADDRESS', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          type: 'REINSTALL_AT_DIFFERENT_ADDRESS',
        },
      })

      Page.visit(OrderTasksPage, { orderId: mockOrderId })

      cy.get('.govuk-hint')
        .contains('You are requesting monitoring equipment to be installed at a new address.')
        .should('exist')
    })

    it('Should be accessible', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })
  })

  context('Complete order, not submitted', () => {
    beforeEach(() => {
      mockOrderId = uuidv4()
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
            offenceAdditionalDetails: null,
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
          additionalDocuments: [{ id: uuidv4(), fileName: '', fileType: AttachmentType.LICENCE }],
          orderParameters: { havePhoto: false },
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
            pilot: null,
            isValid: true,
            offenceType: null,
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
            curfewAdditionalDetails: null,
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
          installationLocation: {
            location: 'PRIMARY',
          },
        },
      })

      cy.task('stubCemoGetVersions', {
        httpStatus: 200,
        versions: [],
        orderId: mockOrderId,
      })

      cy.signIn()
    })

    it('should display all tasks as To check', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.aboutTheDeviceWearerTask.shouldHaveStatus('To check')
      page.aboutTheDeviceWearerTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/about-the-device-wearer/check-your-answers`,
      )

      page.contactInformationTask.shouldHaveStatus('To check')
      page.contactInformationTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/contact-information/check-your-answers`,
      )

      page.riskInformationTask.shouldHaveStatus('To check')
      page.riskInformationTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/installation-and-risk/check-your-answers`,
      )

      page.electronicMonitoringTask.shouldHaveStatus('To check')
      page.electronicMonitoringTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/monitoring-conditions/check-your-answers`,
      )

      page.additionalDocumentsTask.shouldHaveStatus('To check')
      page.additionalDocumentsTask.link.should('have.attr', 'href', `/order/${mockOrderId}/attachments`)

      cy.get('.govuk-task-list__item').should('not.contain', 'Variation details')

      page.submitOrderButton.should('be.disabled')
    })

    it('should display status as Complete after view Device Wearer check your answer page', () => {
      let page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.aboutTheDeviceWearerTask.shouldHaveStatus('To check')
      page.aboutTheDeviceWearerTask.link.click()
      const dwCYApage = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, 'Check your answers')
      dwCYApage.continueButton().click()
      page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.aboutTheDeviceWearerTask.shouldHaveStatus('Complete')
    })

    it('should display status as Complete after view Contact Information check your answer page', () => {
      let page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.contactInformationTask.shouldHaveStatus('To check')
      page.contactInformationTask.link.click()
      const contactInformationCyaPage = Page.verifyOnPage(
        ContactInformationCheckYourAnswersPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      contactInformationCyaPage.continueButton().click()
      page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.contactInformationTask.shouldHaveStatus('Complete')
    })

    it('should display status as Complete after view Risk Information check your answer page', () => {
      let page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.riskInformationTask.shouldHaveStatus('To check')
      page.riskInformationTask.link.click()
      const riskInformationCyaPage = Page.verifyOnPage(
        InstallationAndRiskCheckYourAnswersPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      riskInformationCyaPage.continueButton().click()
      page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.riskInformationTask.shouldHaveStatus('Complete')
    })

    it('should display status as Complete after view Electonic Monitoring check your answer page', () => {
      let page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.electronicMonitoringTask.shouldHaveStatus('To check')
      page.electronicMonitoringTask.link.click()
      const monitoringConditionCyaPage = Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      monitoringConditionCyaPage.continueButton().click()
      page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.electronicMonitoringTask.shouldHaveStatus('Complete')
    })

    it('should display status as Complete after view attachement check your answer page', () => {
      let page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.additionalDocumentsTask.shouldHaveStatus('To check')
      page.additionalDocumentsTask.link.click()
      const attachmentSummaryPage = Page.verifyOnPage(
        AttachmentSummaryPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      attachmentSummaryPage.backToSummaryButton.click()
      page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.additionalDocumentsTask.shouldHaveStatus('Complete')
    })

    it('should enable submit button when all section completed and checked', () => {
      let page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.aboutTheDeviceWearerTask.link.click()
      const dwCYApage = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, 'Check your answers')
      dwCYApage.continueButton().click()

      const contactInformationCyaPage = Page.verifyOnPage(
        ContactInformationCheckYourAnswersPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      contactInformationCyaPage.continueButton().click()

      const riskInformationCyaPage = Page.verifyOnPage(
        InstallationAndRiskCheckYourAnswersPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      riskInformationCyaPage.continueButton().click()

      const monitoringConditionCyaPage = Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      monitoringConditionCyaPage.continueButton().click()

      const attachmentSummaryPage = Page.verifyOnPage(
        AttachmentSummaryPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      attachmentSummaryPage.backToSummaryButton.click()
      page = Page.verifyOnPage(OrderTasksPage, { orderId: mockOrderId })

      page.submitOrderButton.should('not.be.disabled')
    })

    it('does not show the timeline', () => {
      Page.visit(OrderTasksPage, { orderId: mockOrderId })

      cy.get('.moj-timeline').should('not.exist')
    })
  })

  context('Complete order, submitted', () => {
    const testFlags = { CREATE_NEW_ORDER_VERSION_ENABLED: true }

    beforeEach(() => {
      cy.task('reset')
      cy.task('setFeatureFlags', testFlags)
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      // Create an order with all fields present (even though they're not valid)
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          id: mockOrderId,
          status: 'SUBMITTED',
          submittedBy: 'John Smith',
          fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0),
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
            offenceAdditionalDetails: null,
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
            pilot: null,
            isValid: true,
            offenceType: null,
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
            curfewAdditionalDetails: null,
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

      cy.task('stubCemoGetVersions', {
        httpStatus: 200,
        versions: [],
        orderId: mockOrderId,
      })

      cy.signIn()
    })

    afterEach(() => {
      cy.task('resetFeatureFlags')
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

    it('should display the "View and download form" button when variations are enabled', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.viewAndDownloadButton.should('be.visible')

      page.viewAndDownloadButton.should('have.attr', 'href', `/order/${mockOrderId}/receipt`)
    })

    it('should display the "Make changes" button when variations are enabled', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.makeChangesButton.should('be.visible')

      page.makeChangesButton.should('have.attr', 'href', `/order/${mockOrderId}/edit`)
    })

    it('should navigate to the confirmation page when the "Make changes" button is clicked', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.makeChangesButton.click()

      Page.verifyOnPage(ConfirmVariationPage)
    })
  })

  context('Partial complete order, not submitted', () => {
    beforeEach(() => {
      mockOrderId = uuidv4()
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.signIn()
    })

    it('should display monitoring condition task as Not Cannot start yet when device wearer not complete', () => {
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
          additionalDocuments: [{ id: uuidv4(), fileName: '', fileType: AttachmentType.LICENCE }],
          orderParameters: { havePhoto: false },
          isValid: true,
        },
      })

      cy.task('stubCemoGetVersions', {
        httpStatus: 200,
        versions: [],
        orderId: mockOrderId,
      })

      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.electronicMonitoringTask.shouldHaveStatus('Cannot start yet')
      page.electronicMonitoringTask.link.should('not.exist')
      page.submitOrderButton.should('be.disabled')
    })

    it('should display monitoring condition task as Not Cannot start yet when contact information not complete', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          id: mockOrderId,
          status: 'IN_PROGRESS',
          deviceWearerResponsibleAdult: {
            contactNumber: null,
            fullName: null,
            otherRelationshipDetails: null,
            relationship: null,
          },
          addresses: [
            {
              addressType: 'PRIMARY',
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
            },
          ],
          installationAndRisk: {
            mappaCaseType: null,
            mappaLevel: null,
            riskCategory: null,
            riskDetails: null,
            offence: null,
            offenceAdditionalDetails: null,
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
          additionalDocuments: [{ id: uuidv4(), fileName: '', fileType: AttachmentType.LICENCE }],
          orderParameters: { havePhoto: false },
          isValid: true,
        },
      })
      cy.task('stubCemoGetVersions', {
        httpStatus: 200,
        versions: [],
        orderId: mockOrderId,
      })
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.electronicMonitoringTask.shouldHaveStatus('Cannot start yet')
      page.electronicMonitoringTask.link.should('not.exist')
      page.submitOrderButton.should('be.disabled')
    })

    it('should display monitoring condition task as Incomplete, link to order type description flow', () => {
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
            noFixedAbode: true,
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
            offenceAdditionalDetails: null,
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
          addresses: [],
          additionalDocuments: [{ id: uuidv4(), fileName: '', fileType: AttachmentType.LICENCE }],
          orderParameters: { havePhoto: false },
        },
      })
      cy.task('stubCemoGetVersions', {
        httpStatus: 200,
        versions: [],
        orderId: mockOrderId,
      })
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.electronicMonitoringTask.shouldHaveStatus('Incomplete')
      page.electronicMonitoringTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/monitoring-conditions/order-type-description/order-type`,
      )
      page.submitOrderButton.should('be.disabled')
      cy.task('resetFeatureFlags')
    })

    it('should display monitoring condition task as Incomplete when no monitoring condition chosen', () => {
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
            noFixedAbode: true,
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
            offenceAdditionalDetails: null,
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
          monitoringConditions: {
            orderType: null,
            exclusionZone: false,
            trail: false,
            mandatoryAttendance: false,
            alcohol: false,
            orderTypeDescription: null,
            conditionType: null,
            startDate: null,
            endDate: null,
            sentenceType: null,
            issp: null,
            hdc: null,
            prarr: null,
            pilot: null,
            isValid: true,
            offenceType: null,
          },
          addresses: [],
          additionalDocuments: [{ id: uuidv4(), fileName: '', fileType: AttachmentType.LICENCE }],
          orderParameters: { havePhoto: false },
        },
      })
      cy.task('stubCemoGetVersions', {
        httpStatus: 200,
        versions: [],
        orderId: mockOrderId,
      })
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.electronicMonitoringTask.shouldHaveStatus('Incomplete')
      page.electronicMonitoringTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/monitoring-conditions/order-type-description/order-type`,
      )
      page.submitOrderButton.should('be.disabled')
      cy.task('resetFeatureFlags')
    })
  })

  const versionInformation = (override: Order) => {
    return {
      orderId: uuidv4(),
      versionId: uuidv4(),
      versionNumber: 0,
      submittedBy: 'John Smith',
      fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0),
      type: 'REQUEST',
      status: 'SUBMITTED',
      ...override,
    }
  }
  context('Complete order, variation', () => {
    const versionOneId = uuidv4()
    const versionTwoId = uuidv4()
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        order: {
          id: mockOrderId,
          versionId: versionTwoId,
        },
      })

      cy.signIn()
    })

    it('timeline version list', () => {
      const versionOne = versionInformation({
        submittedBy: 'Person One',
        versionId: versionOneId,
        fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0).toISOString(),
      })
      const versionTwo = versionInformation({
        submittedBy: 'Person Two',
        versionId: versionTwoId,
        type: 'VARIATION',
        fmsResultDate: new Date(2025, 0, 3, 10, 30, 0, 0).toISOString(),
      })

      cy.task('stubCemoGetVersions', {
        httpStatus: 200,
        versions: [versionOne, versionTwo],
        orderId: mockOrderId,
      })

      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.timeline.element.should('exist')
      page.timeline.formSubmittedComponent.element.should('exist')
      page.timeline.formSubmittedComponent.usernameIs('Person One')
      page.timeline.formSubmittedComponent.resultDateIs('1 January 2025 at 10:30am')
      page.timeline.formSubmittedComponent.description
        .contains('View submitted form')
        .should(
          'have.attr',
          'href',
          paths.ORDER.SUMMARY_VERSION.replace(':orderId', mockOrderId).replace(':versionId', versionOne.versionId),
        )
      page.timeline.formVariationComponent.element.should('exist')
      page.timeline.formVariationComponent.usernameIs('Person Two')
      page.timeline.formVariationComponent.resultDateIs('3 January 2025 at 10:30am')
      page.timeline.formVariationComponent.variationTextIs('Change to an order')
    })

    it('Submitted request', () => {
      const versionOne = versionInformation({
        submittedBy: 'John Smith',
        fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0).toISOString(),
        status: 'SUBMITTED',
        type: 'REQUEST',
      })

      cy.task('stubCemoGetVersions', {
        httpStatus: 200,
        versions: [versionOne],
        orderId: mockOrderId,
      })
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.timeline.element.should('exist')
      page.timeline.formSubmittedComponent.element.should('exist')
      page.timeline.formSubmittedComponent.usernameIs('John Smith')
      page.timeline.formSubmittedComponent.resultDateIs('1 January 2025 at 10:30am')
    })

    it('Order failed to submit', () => {
      const versionOne = versionInformation({
        submittedBy: 'John Smith',
        fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0).toISOString(),
        status: 'ERROR',
        type: 'REQUEST',
      })

      cy.task('stubCemoGetVersions', {
        httpStatus: 200,
        versions: [versionOne],
        orderId: mockOrderId,
      })
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.timeline.element.should('exist')
      page.timeline.formFailedComponent.element.should('exist')
      page.timeline.formFailedComponent.usernameIs('John Smith')
      page.timeline.formFailedComponent.resultDateIs('1 January 2025 at 10:30am')
    })

    it('order rejected', () => {
      const versionOne = versionInformation({
        submittedBy: 'John Smith',
        fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0).toISOString(),
        status: 'SUBMITTED',
        type: 'REJECTED',
      })

      cy.task('stubCemoGetVersions', {
        httpStatus: 200,
        versions: [versionOne],
        orderId: mockOrderId,
      })
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.timeline.element.should('exist')
      page.timeline.formRejectedComponent.element.should('exist')
      page.timeline.formRejectedComponent.usernameIs('John Smith')
      page.timeline.formRejectedComponent.resultDateIs('1 January 2025 at 10:30am')
    })
  })

  context('viewing an old version of the order', () => {
    const mockVersionId = uuidv4()

    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetVersion', {
        httpStatus: 200,
        id: mockOrderId,
        versionId: mockVersionId,
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
            offenceAdditionalDetails: null,
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
          additionalDocuments: [{ id: uuidv4(), fileName: '', fileType: AttachmentType.LICENCE }],
          orderParameters: { havePhoto: false },
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
            pilot: null,
            isValid: true,
            offenceType: null,
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
            curfewAdditionalDetails: null,
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
          installationLocation: {
            location: 'PRIMARY',
          },
        },
      })

      cy.signIn()
    })

    const convertToExpectedPath = (path: string) => {
      return path.replace(':orderId', mockOrderId).replace(':versionId', mockVersionId)
    }

    it('has correct section links', () => {
      const page = Page.visit(
        OrderTasksPage,
        { orderId: mockOrderId, versionId: mockVersionId },
        {},
        paths.ORDER.SUMMARY_VERSION,
      )

      page.aboutTheDeviceWearerTask.link.should(
        'have.attr',
        'href',
        convertToExpectedPath(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS_VERSION),
      )
      page.contactInformationTask.link.should(
        'have.attr',
        'href',
        convertToExpectedPath(paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS_VERSION),
      )
      page.riskInformationTask.link.should(
        'have.attr',
        'href',
        convertToExpectedPath(paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS_VERSION),
      )
      page.electronicMonitoringTask.link.should(
        'have.attr',
        'href',
        convertToExpectedPath(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS_VERSION),
      )
      page.additionalDocumentsTask.link.should(
        'have.attr',
        'href',
        convertToExpectedPath(paths.ATTACHMENT.ATTACHMENTS_VERSION),
      )
    })

    it('buttons are correct', () => {
      const page = Page.visit(
        OrderTasksPage,
        { orderId: mockOrderId, versionId: mockVersionId },
        {},
        paths.ORDER.SUMMARY_VERSION,
      )

      page.makeChangesButton.should('not.exist')
      page.viewAndDownloadButton.should('have.attr', 'href', convertToExpectedPath(paths.ORDER.RECEIPT_VERSION))
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
