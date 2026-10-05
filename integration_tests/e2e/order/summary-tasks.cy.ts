import { v4 as uuidv4 } from 'uuid'
import OrderTasksPage from '../../pages/order/summary'
import Page from '../../pages/page'
import AttachmentType from '../../../server/models/AttachmentType'
import InstallationAndRiskCheckYourAnswersPage from '../../pages/order/installation-and-risk/check-your-answers'
import MonitoringConditionsCheckYourAnswersPage from '../../pages/order/monitoring-conditions/check-your-answers'
import AttachmentSummaryPage from '../../pages/order/attachments/summary'
import DetailsOfInstallationPage from './access-needs-installation-risk/details-of-installation/DetailsOfInstallationPage'
import ResponsibleOfficerPage from './interested-parties/responsible-officer/responsibleOfficerPage'
import InterestedPartiesCheckYourAnswersPage from './interested-parties/check-your-answers/interestedPartiesCheckYourAnswersPage'
import DeviceWearerCheckYourAnswersPage from '../../pages/order/about-the-device-wearer/check-your-answers'
import versionInformation from './summary-helpers'

const mockOrderId = uuidv4()

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
        order: {
          dataDictionaryVersion: 'DDV6',
          isSentencingAct: false,
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: 'ALTCOURSE_PRISON',
            notifyingOrganisationEmail: 'notifying@organisation',

            responsibleOfficerFirstName: null,
            responsibleOfficerLastName: '',
            responsibleOfficerEmail: '@email',

            responsibleOrganisation: null,
            responsibleOrganisationEmail: '',
            responsibleOrganisationRegion: '',
          },
          monitoringConditions: {
            endDate: null,
            orderType: null,
            curfew: null,
            exclusionZone: null,
            trail: null,
            mandatoryAttendance: null,
            alcohol: null,
            conditionType: null,
            orderTypeDescription: null,
            sentenceType: null,
            issp: null,
            hdc: null,
            prarr: null,
            pilot: null,
            offenceType: null,
            policeArea: null,
            startDate: new Date(2040, 0).toISOString(),
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

    afterEach(() => {
      cy.task('resetFeatureFlags')
    })

    it('Display the common page elements and the submit order button', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.header.userName().should('contain.text', 'J. Smith')
      page.header.phaseBanner().should('contain.text', 'dev')
      page.submitOrderButton.should('exist')
    })

    it('should display all tasks as incomplete or unable to start for a new order', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.interestedPartiesTask.shouldHaveStatus('Incomplete')
      page.interestedPartiesTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/interest-parties/responsible-officer`,
      )

      page.aboutTheDeviceWearerTask.shouldHaveStatus('Incomplete')
      page.aboutTheDeviceWearerTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/about-the-device-wearer/identity-numbers`,
      )

      page.riskInformationTask.shouldHaveStatus('Incomplete')
      page.riskInformationTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/installation-and-risk/details-of-installation`,
      )

      page.electronicMonitoringTask.shouldHaveStatus('Cannot start yet')
      page.electronicMonitoringTask.link.should('not.exist')

      page.additionalDocumentsTask.shouldHaveStatus('Incomplete')
      page.additionalDocumentsTask.link.should('have.attr', 'href', `/order/${mockOrderId}/attachments/licence`)

      cy.get('.govuk-task-list__item').should('not.contain', 'Variation details')

      page.submitOrderButton.should('be.disabled')
    })

    it('Should have interested parties section at top of section list', () => {
      Page.visit(OrderTasksPage, { orderId: mockOrderId })
      cy.get('.govuk-task-list__item')
        .first()
        .contains('.govuk-task-list__name-and-hint', 'About the Responsible Organisation')
        .should('exist')
    })

    it('Interested parties section link should go to notifying organisation page if not completed', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.interestedPartiesTask.shouldHaveStatus('Incomplete')
      page.interestedPartiesTask.click()

      Page.verifyOnPage(ResponsibleOfficerPage)
    })

    it('Should be accessible', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })

    it('Should not show contact information section', () => {
      Page.visit(OrderTasksPage, { orderId: mockOrderId })
      cy.get('.govuk-task-list__item')
        .contains('.govuk-task-list__name-and-hint', 'Contact information')
        .should('not.exist')
    })

    it('Home Office users go to risk at installation from the task list', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          dataDictionaryVersion: 'DDV6',
          interestedParties: {
            notifyingOrganisation: 'HOME_OFFICE',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: 'test@test.com',
            responsibleOfficerName: 'John Smith',
            responsibleOfficerPhoneNumber: '01234567890',
            responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
            responsibleOrganisationRegion: '',
            responsibleOrganisationEmail: '',
          },
        },
      })

      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.riskInformationTask.shouldHaveStatus('Incomplete')
      page.riskInformationTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/installation-and-risk/details-of-installation`,
      )
      page.riskInformationTask.click()

      Page.verifyOnPage(DetailsOfInstallationPage)
    })

    it('Disables submit when risk information is incomplete', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          dataDictionaryVersion: 'DDV6',
          isValid: true,
          isSentencingAct: false,
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: 'test@test.com',
            responsibleOfficerName: 'John Smith',
            responsibleOfficerPhoneNumber: '01234567890',
            responsibleOrganisation: 'PROBATION',
            responsibleOrganisationRegion: '',
            responsibleOrganisationEmail: '',
          },
          installationAndRisk: {
            offence: 'SEXUAL_OFFENCES',
            offenceAdditionalDetails: 'mock offence additional details',
            riskCategory: null,
            riskDetails: null,
            genderRiskDetails: null,
            mappaLevel: null,
            mappaCaseType: null,
          },
          offences: [],
          detailsOfInstallation: { riskCategory: ['some category'], riskDetails: '', genderRiskDetails: '' },
          offenceAdditionalDetails: { additionalDetails: 'details' },
        },
      })

      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.riskInformationTask.shouldHaveStatus('Incomplete')
      page.submitOrderButton.should('be.disabled')
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
        order: {
          type: 'VARIATION',
          isSentencingAct: false,
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: 'ALTCOURSE_PRISON',
            notifyingOrganisationEmail: 'notifying@organisation',

            responsibleOfficerFirstName: null,
            responsibleOfficerLastName: '',
            responsibleOfficerEmail: '@email',

            responsibleOrganisation: null,
            responsibleOrganisationEmail: '',
            responsibleOrganisationRegion: '',
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

    it('should display all tasks as incomplete or unable to start for a new variation', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.aboutTheDeviceWearerTask.shouldHaveStatus('Incomplete')
      page.aboutTheDeviceWearerTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/about-the-device-wearer/identity-numbers`,
      )

      page.riskInformationTask.shouldHaveStatus('Incomplete')
      page.riskInformationTask.link.should(
        'have.attr',
        'href',
        `/order/${mockOrderId}/installation-and-risk/details-of-installation`,
      )

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
          isSentencingAct: false,
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: 'ALTCOURSE_PRISON',
            notifyingOrganisationEmail: 'notifying@organisation',

            responsibleOfficerFirstName: null,
            responsibleOfficerLastName: '',
            responsibleOfficerEmail: '@email',

            responsibleOrganisation: null,
            responsibleOrganisationEmail: '',
            responsibleOrganisationRegion: '',
          },
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
          isSentencingAct: false,
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: 'ALTCOURSE_PRISON',
            notifyingOrganisationEmail: 'notifying@organisation',

            responsibleOfficerFirstName: null,
            responsibleOfficerLastName: '',
            responsibleOfficerEmail: '@email',

            responsibleOrganisation: null,
            responsibleOrganisationEmail: '',
            responsibleOrganisationRegion: '',
          },
        },
      })

      Page.visit(OrderTasksPage, { orderId: mockOrderId })

      cy.get('.govuk-hint').contains('You are revoking monitoring for the device wearer.').should('exist')
    })

    it('should have hint text for END_MONITORING', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          type: 'END_MONITORING',
          isSentencingAct: false,
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: 'ALTCOURSE_PRISON',
            notifyingOrganisationEmail: 'notifying@organisation',

            responsibleOfficerFirstName: null,
            responsibleOfficerLastName: '',
            responsibleOfficerEmail: '@email',

            responsibleOrganisation: null,
            responsibleOrganisationEmail: '',
            responsibleOrganisationRegion: '',
          },
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
          isSentencingAct: false,
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: 'ALTCOURSE_PRISON',
            notifyingOrganisationEmail: 'notifying@organisation',

            responsibleOfficerFirstName: null,
            responsibleOfficerLastName: '',
            responsibleOfficerEmail: '@email',

            responsibleOrganisation: null,
            responsibleOrganisationEmail: '',
            responsibleOrganisationRegion: '',
          },
        },
      })

      Page.visit(OrderTasksPage, { orderId: mockOrderId })

      cy.get('.govuk-hint').contains('You are requesting monitoring equipment to be reinstalled.').should('exist')
    })

    it('should have hint text for REINSTALL_AT_DIFFERENT_ADDRESS', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          type: 'REINSTALL_AT_DIFFERENT_ADDRESS',
          isSentencingAct: false,
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: 'ALTCOURSE_PRISON',
            notifyingOrganisationEmail: 'notifying@organisation',

            responsibleOfficerFirstName: null,
            responsibleOfficerLastName: '',
            responsibleOfficerEmail: '@email',

            responsibleOrganisation: null,
            responsibleOrganisationEmail: '',
            responsibleOrganisationRegion: '',
          },
        },
      })

      Page.visit(OrderTasksPage, { orderId: mockOrderId })

      cy.get('.govuk-hint')
        .contains('You are requesting monitoring equipment to be installed at an additional address.')
        .should('exist')
    })

    it('in progress order and can not see timeline', () => {
      const versionOneId = uuidv4()
      const versionTwoId = uuidv4()

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
        versions: [versionTwo, versionOne],
        orderId: mockOrderId,
      })

      Page.visit(OrderTasksPage, { orderId: mockOrderId })

      cy.get('.moj-timeline').should('not.exist')
    })

    it('Should be accessible', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.checkIsAccessible()
    })
  })

  context('Complete order, variation, not submitted', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      // Create an order with all fields present (even though they're not valid)
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          id: mockOrderId,
          status: 'IN_PROGRESS',
          isSentencingAct: false,
          deviceWearer: {
            nomisId: '',
            pncId: null,
            deliusId: null,
            prisonNumber: null,
            homeOfficeReferenceNumber: null,
            complianceAndEnforcementPersonReference: null,
            courtCaseReferenceNumber: null,
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
          contactDetails: {
            contactNumber: '',
            phoneNumberAvailable: false,
          },
          installationAndRisk: {
            mappaCaseType: null,
            mappaLevel: null,
            riskCategory: null,
            riskDetails: null,
            genderRiskDetails: null,
            offence: null,
            offenceAdditionalDetails: null,
          },
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: '',
            responsibleOfficerFirstName: 'test',
            responsibleOfficerLastName: '',
            responsibleOfficerEmail: '@email',
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
          offences: [
            {
              id: 'offence id',
              offenceType: 'SEXUAL_OFFENCES',
            },
          ],
          offenceAdditionalDetails: {
            additionalDetails: 'mock offence details',
          },
          detailsOfInstallation: {
            riskCategory: ['THREATS_OF_VIOLENCE', 'SAFEGUARDING_CHILD'],
            riskDetails: 'some risk details',
            genderRiskDetails: '',
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
          type: 'VARIATION',
        },
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

      page.interestedPartiesTask.shouldHaveStatus('Optional')

      page.aboutTheDeviceWearerTask.shouldHaveStatus('Optional')

      page.riskInformationTask.shouldHaveStatus('Optional')

      page.electronicMonitoringTask.shouldHaveStatus('Optional')

      page.additionalDocumentsTask.shouldHaveStatus('Optional')

      page.variationDetailsTask.shouldHaveStatus('Incomplete')

      page.submitOrderButton.should('be.disabled')
    })

    it('should display status as Complete after view interested parties check your answer page', () => {
      let page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.interestedPartiesTask.shouldHaveStatus('Optional')
      page.interestedPartiesTask.link.click()
      const ciCYApage = Page.verifyOnPage(
        InterestedPartiesCheckYourAnswersPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      ciCYApage.saveAndReturnButton.click()
      page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.interestedPartiesTask.shouldHaveStatus('Complete')
    })

    it('should display status as Complete after view Device Wearer check your answer page', () => {
      let page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.aboutTheDeviceWearerTask.shouldHaveStatus('Optional')
      page.aboutTheDeviceWearerTask.link.click()
      const dwCYApage = Page.verifyOnPage(
        DeviceWearerCheckYourAnswersPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      dwCYApage.saveAndReturnButton.click()
      page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.aboutTheDeviceWearerTask.shouldHaveStatus('Complete')
    })

    it('should display status as Complete after view Risk Information check your answer page', () => {
      let page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.riskInformationTask.shouldHaveStatus('Optional')
      page.riskInformationTask.link.click()
      const riskInformationCyaPage = Page.verifyOnPage(
        InstallationAndRiskCheckYourAnswersPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      riskInformationCyaPage.saveAndReturnButton.click()
      page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.riskInformationTask.shouldHaveStatus('Complete')
    })

    it('should display status as Complete after view Electonic Monitoring check your answer page', () => {
      let page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.electronicMonitoringTask.shouldHaveStatus('Optional')
      page.electronicMonitoringTask.link.click()
      const monitoringConditionCyaPage = Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      monitoringConditionCyaPage.saveAndReturnButton.click()
      page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.electronicMonitoringTask.shouldHaveStatus('Complete')
    })

    it('should display status as Complete after view attachement check your answer page', () => {
      let page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.additionalDocumentsTask.shouldHaveStatus('Optional')
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

    it('should enable submit button when variation details are entered', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          id: mockOrderId,
          status: 'IN_PROGRESS',
          isSentencingAct: false,
          deviceWearer: {
            nomisId: '',
            pncId: null,
            deliusId: null,
            prisonNumber: null,
            homeOfficeReferenceNumber: null,
            complianceAndEnforcementPersonReference: null,
            courtCaseReferenceNumber: null,
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
          contactDetails: {
            contactNumber: '',
            phoneNumberAvailable: false,
          },
          installationAndRisk: {
            mappaCaseType: null,
            mappaLevel: null,
            riskCategory: null,
            riskDetails: null,
            genderRiskDetails: null,
            offence: null,
            offenceAdditionalDetails: null,
          },
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: '',
            responsibleOfficerFirstName: 'test',
            responsibleOfficerLastName: '',
            responsibleOfficerEmail: '@email',
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
          offences: [
            {
              id: 'offence id',
              offenceType: 'SEXUAL_OFFENCES',
            },
          ],
          offenceAdditionalDetails: {
            additionalDetails: 'mock offence details',
          },
          detailsOfInstallation: {
            riskCategory: ['THREATS_OF_VIOLENCE', 'SAFEGUARDING_CHILD'],
            riskDetails: 'some risk details',
            genderRiskDetails: '',
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
          type: 'VARIATION',
          variationDetails: {
            variationType: 'CURFEW_HOURS',
            variationDate: '2024-01-01T00:00:00.000Z',
            variationDetails: 'Change to curfew hours',
          },
        },
      })

      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.submitOrderButton.should('not.be.disabled')
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
          isSentencingAct: false,
          deviceWearer: {
            nomisId: '',
            pncId: null,
            deliusId: null,
            prisonNumber: null,
            homeOfficeReferenceNumber: null,
            complianceAndEnforcementPersonReference: null,
            courtCaseReferenceNumber: null,
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
          contactDetails: {
            contactNumber: '',
            phoneNumberAvailable: false,
          },
          installationAndRisk: {
            mappaCaseType: null,
            mappaLevel: null,
            riskCategory: null,
            riskDetails: null,
            genderRiskDetails: null,
            offence: null,
            offenceAdditionalDetails: null,
          },
          interestedParties: {
            notifyingOrganisation: 'PRISON',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: '',
            responsibleOfficerFirstName: 'test',
            responsibleOfficerLastName: '',
            responsibleOfficerEmail: '@email',
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
          offences: [
            {
              id: 'offence id',
              offenceType: 'SEXUAL_OFFENCES',
            },
          ],
          offenceAdditionalDetails: {
            additionalDetails: 'mock offence details',
          },
          detailsOfInstallation: {
            riskCategory: ['THREATS_OF_VIOLENCE', 'SAFEGUARDING_CHILD'],
            riskDetails: 'some risk details',
            genderRiskDetails: '',
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
      const dwCYApage = Page.verifyOnPage(
        DeviceWearerCheckYourAnswersPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      dwCYApage.saveAndReturnButton.click()
      page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.aboutTheDeviceWearerTask.shouldHaveStatus('Complete')
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
      monitoringConditionCyaPage.saveAndReturnButton.click()
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

      page.interestedPartiesTask.link.click()
      const ipCYApage = Page.verifyOnPage(
        InterestedPartiesCheckYourAnswersPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      ipCYApage.saveAndReturnButton.click()

      const dwCYApage = Page.verifyOnPage(
        DeviceWearerCheckYourAnswersPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      dwCYApage.saveAndReturnButton.click()

      const riskInformationCyaPage = Page.verifyOnPage(
        InstallationAndRiskCheckYourAnswersPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      riskInformationCyaPage.saveAndReturnButton.click()

      const monitoringConditionCyaPage = Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        { orderId: mockOrderId },
        {},
        'Check your answers',
      )
      monitoringConditionCyaPage.saveAndReturnButton.click()

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
})
