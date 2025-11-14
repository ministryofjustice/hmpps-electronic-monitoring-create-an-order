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
          additionalDocuments: [{ id: uuidv4(), fileName: '', fileType: AttachmentType.LICENCE }],
          orderParameters: { havePhoto: false },
          isValid: true,
        },
      })
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.electronicMonitoringTask.shouldHaveStatus('Cannot start yet')
      page.electronicMonitoringTask.link.should('not.exist')
      page.submitOrderButton.should('be.disabled')
    })

    it('should display monitoring condition task as Incomplete, link to order type description flow', () => {
      const testFlags = { ORDER_TYPE_DESCRIPTION_FLOW_ENABLED: true }
      cy.task('setFeatureFlags', testFlags)
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
      const testFlags = { ORDER_TYPE_DESCRIPTION_FLOW_ENABLED: false }
      cy.task('setFeatureFlags', testFlags)
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
            curfew: false,
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
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.electronicMonitoringTask.shouldHaveStatus('Incomplete')
      page.electronicMonitoringTask.link.should('have.attr', 'href', `/order/${mockOrderId}/monitoring-conditions`)
      page.submitOrderButton.should('be.disabled')
      cy.task('resetFeatureFlags')
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
