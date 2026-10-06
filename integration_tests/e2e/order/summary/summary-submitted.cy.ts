import { v4 as uuidv4 } from 'uuid'
import OrderTasksPage from '../../../pages/order/summary'
import Page from '../../../pages/page'
import AttachmentType from '../../../../server/models/AttachmentType'
import ConfirmVariationPage from '../../../pages/order/variation/confirmVariation'
import paths from '../../../../server/constants/paths'
import mockApiOrder from '../../../utils/data/ApiOrder'
import versionInformation from './summary-helpers'

const mockOrderId = uuidv4()

context('Order Summary', () => {
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
          submittedBy: 'John Smith',
          fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0),
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
          contactDetails: { contactNumber: '', phoneNumberAvailable: false },
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
          mappa: { isMappa: 'NO' },
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
          installationLocation: {
            location: 'PRIMARY',
          },
          installationAppointment: { placeName: 'blah', appointmentDate: new Date() },
          orderParameters: { havePhoto: false },
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

    context('Rejected order', () => {
      it('shows the returned form message and a link to the return reasons', () => {
        stubReturnedOrder()

        const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

        cy.contains(
          'p',
          'This form has been returned. You need to review the reason it has been returned, make any necessary changes, and resubmit it.',
        ).should('be.visible')
        page.viewReasonForReturnButton.should(
          'have.attr',
          'href',
          paths.ORDER.RETURN_REASONS.replace(':orderId', mockOrderId),
        )
      })

      it('shows the latest returned event in the timeline', () => {
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
        stubReturnedOrder([rejectedStatusUpdate('2026-01-02T12:00:00Z'), rejectedStatusUpdate('2026-01-03T12:00:00Z')])

        const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

        page.timeline.formReturnedComponent.element.should('exist')
        page.timeline.formReturnedComponent.bylineContains('The Electronic Monitoring Service (EMS)')
        page.timeline.formReturnedComponent.resultDateIs('3 January 2026 at 12pm')
        page.timeline.formSubmittedComponent.element.should('exist')
      })
    })
  })

  context('Partial complete order, not submitted', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.signIn()
    })

    it('should display monitoring condition task as Not Cannot start yet when device wearer not complete', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockApiOrder(),
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
    it('should display monitoring condition task as Not Cannot start yet when device wearer not complete', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockApiOrder(),
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
        order: mockApiOrder(),
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
          ...mockApiOrder(),
          id: mockOrderId,
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
            noFixedAbode: true,
            interpreterRequired: null,
          },
          deviceWearerResponsibleAdult: {
            contactNumber: null,
            fullName: null,
            otherRelationshipDetails: null,
            relationship: null,
          },
          contactDetails: { contactNumber: '', phoneNumberAvailable: false },
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
          ...mockApiOrder(),
          id: mockOrderId,
          status: 'IN_PROGRESS',
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
            noFixedAbode: true,
            interpreterRequired: null,
          },
          deviceWearerResponsibleAdult: {
            contactNumber: null,
            fullName: null,
            otherRelationshipDetails: null,
            relationship: null,
          },
          contactDetails: { contactNumber: '', phoneNumberAvailable: false },
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

    describe('viewing an unowned order', () => {
      beforeEach(() => {
        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId,
          status: 'SUBMITTED',
          order: {
            ...mockApiOrder(),
            id: mockOrderId,
            status: 'IN_PROGRESS',
            lastUpdatedBy: 'Test User',
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
              noFixedAbode: true,
              interpreterRequired: null,
            },
            deviceWearerResponsibleAdult: {
              contactNumber: null,
              fullName: null,
              otherRelationshipDetails: null,
              relationship: null,
            },
            contactDetails: { contactNumber: '', phoneNumberAvailable: false },
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
            isOwner: false,
          },
        })

        cy.task('stubCemoGetVersions', {
          httpStatus: 200,
          versions: [],
          orderId: mockOrderId,
        })
      })

      it('incomplete sections do not have links', () => {
        const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

        page.ownerBanner.should('exist')
        page.ownerBanner.should(
          'contain.text',
          'You cannot make changes to this form because it is assigned to Test User.',
        )

        page.interestedPartiesTask.shouldHaveStatus('Incomplete')
        page.interestedPartiesTask.link.should('not.exist')
        page.aboutTheDeviceWearerTask.shouldHaveStatus('Complete')
        page.aboutTheDeviceWearerTask.link.should('exist')
        page.riskInformationTask.shouldHaveStatus('Incomplete')
        page.riskInformationTask.link.should('not.exist')
        page.electronicMonitoringTask.shouldHaveStatus('Incomplete')
        page.electronicMonitoringTask.link.should('not.exist')
        page.additionalDocumentsTask.shouldHaveStatus('Incomplete')
        page.additionalDocumentsTask.link.should('not.exist')
        page.submitOrderButton.should('not.exist')
      })

      it('should show the timeline with past versions', () => {
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
          versions: [versionOne, versionTwo],
          orderId: mockOrderId,
        })

        const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

        page.timeline.element.should('exist')

        page.timeline.formVariationComponent.element.should('exist')
        page.timeline.formVariationComponent.bylineContains('Person Two')
        page.timeline.formVariationComponent.resultDateIs('3 January 2025 at 10:30am')
        page.timeline.formVariationComponent.variationTextIs('Change to an order')
        page.timeline.formVariationComponent.bylineContains('From Whitemoor Prison')
        page.timeline.formSubmittedComponent.description
          .contains('View submitted form')
          .should(
            'have.attr',
            'href',
            paths.ORDER.SUMMARY_VERSION.replace(':orderId', mockOrderId).replace(':versionId', versionTwo.versionId),
          )

        page.timeline.formSubmittedComponent.element.should('exist')
        page.timeline.formSubmittedComponent.bylineContains('Person One')
        page.timeline.formSubmittedComponent.resultDateIs('1 January 2025 at 10:30am')

        page.timeline.formSubmittedComponent.bylineContains('From Whitemoor Prison')
      })
    })
  })

  const rejectedStatusUpdate = (datetimeOfStatusChange: string) => ({
    id: uuidv4(),
    versionId: uuidv4(),
    status: 'REJECTED' as const,
    datetimeOfStatusChange,
    statusUpdateReasons: [],
  })

  const stubReturnedOrder = (statusUpdates = [rejectedStatusUpdate('2026-01-03T12:00:00Z')]) => {
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'SUBMITTED',
      order: { statusUpdates },
    })
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
          status: 'SUBMITTED',
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
        versions: [versionTwo, versionOne],
        orderId: mockOrderId,
      })

      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })

      page.timeline.element.should('exist')
      page.timeline.formSubmittedComponent.element.should('exist')
      page.timeline.formSubmittedComponent.bylineContains('Person One')
      page.timeline.formSubmittedComponent.resultDateIs('1 January 2025 at 10:30am')
      page.timeline.formSubmittedComponent.description
        .contains('View submitted form')
        .should(
          'have.attr',
          'href',
          paths.ORDER.SUMMARY_VERSION.replace(':orderId', mockOrderId).replace(':versionId', versionOne.versionId),
        )
      page.timeline.formSubmittedComponent.bylineContains('From Whitemoor Prison')
      page.timeline.formVariationComponent.element.should('exist')
      page.timeline.formVariationComponent.bylineContains('Person Two')
      page.timeline.formVariationComponent.resultDateIs('3 January 2025 at 10:30am')
      page.timeline.formVariationComponent.variationTextIs('Change to an order')
      page.timeline.formVariationComponent.description.contains('You are viewing this version of the form')
      page.timeline.formVariationComponent.bylineContains('From Whitemoor Prison')
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
      page.timeline.formSubmittedComponent.bylineContains('John Smith')
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
      page.timeline.formFailedComponent.bylineContains('John Smith')
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
      page.timeline.formRejectedComponent.bylineContains('John Smith')
      page.timeline.formRejectedComponent.resultDateIs('1 January 2025 at 10:30am')
    })

    it('Show download form button on failed to submit', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'ERROR',
      })

      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId })
      page.viewAndDownloadButton.should('be.visible')

      page.viewAndDownloadButton.should('have.attr', 'href', `/order/${mockOrderId}/receipt`)
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
        type: 'VARIATION',
        order: {
          id: mockOrderId,
          status: 'SUBMITTED',
          submittedBy: 'John Smith',
          fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0),
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
          contactDetails: { contactNumber: '', phoneNumberAvailable: false },
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
          mappa: { isMappa: 'NO' },
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
          installationLocation: {
            location: 'PRIMARY',
          },
          installationAppointment: { placeName: 'blah', appointmentDate: new Date() },
          orderParameters: { havePhoto: false },
        },
      })

      cy.signIn()
    })

    afterEach(() => {
      cy.task('resetFeatureFlags')
    })

    it('has correct sections', () => {
      const page = Page.visit(OrderTasksPage, { orderId: mockOrderId }, {}, true)

      page.interestedPartiesTask.element.should('exist')
      page.riskInformationTask.element.should('exist')
      page.electronicMonitoringTask.element.should('exist')
      page.additionalDocumentsTask.element.should('exist')
    })
  })
})
